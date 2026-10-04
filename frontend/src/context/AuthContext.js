import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";
// FastAPI sends "detail" as a plain string for errors we raise ourselves
// (e.g. "Email already registered") but as a list of objects for validation
// errors (e.g. password too short). Turn either into one readable sentence.
function readableDetail(detail) {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0];
    if (first.loc && first.loc.includes("password")) {
      return "Password must be between 8 and 72 characters.";
    }
    if (first.loc && first.loc.includes("email")) {
      return "Please enter a valid email address.";
    }
    return first.msg || "Please check the details you entered.";
  }
  return "";
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async (accessToken) => {
    const meResponse = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!meResponse.ok) {
      // Keep the HTTP status so the caller can tell "token is invalid" (401)
      // apart from "server is asleep or restarting" (502/503/network error).
      const err = new Error("Could not verify session");
      err.status = meResponse.status;
      throw err;
    }
    return meResponse.json();
  };

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      fetchMe(stored)
        .then((meData) => {
          setToken(stored);
          setUser(meData);
        })
        .catch((err) => {
          // Only log the user out when the server says the token is bad.
          // A cold start, a restart or a network error should not erase a
          // perfectly valid login.
          if (err.status === 401) {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Invalid email or password");
    }

    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);

    const meData = await fetchMe(data.access_token);
    setUser(meData);

    return meData;
  };

  const signup = async (name, email, password) => {
    const response = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(readableDetail(err.detail) || "Signup failed");
    }

    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { API_BASE };