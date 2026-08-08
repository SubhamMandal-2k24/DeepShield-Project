import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="footer-content">
        <h3 className="logo">DeepShield</h3>
        <p>AI-powered deepfake detection, built for trust.</p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/detect">Detect</Link>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} DeepShield. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;