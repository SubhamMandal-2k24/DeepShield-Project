import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublicRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return null; // or a spinner, to match ProtectedRoute

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;