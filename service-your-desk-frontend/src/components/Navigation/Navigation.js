import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import "./Navigation.css";

function Navigation() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">logo</div>
        <div className="nav-links">
          <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/bookings" className="nav-link">Bookings</Link>
          <Link to="/auth">
            <button className="button-primary">Sign In</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
