import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">DeepShield</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/detect">Detect</Link>
      </div>
    </nav>
  );
}

export default Navbar;