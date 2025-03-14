import React, { useState } from "react";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

import logo from "../assets/03_logo_platetonic.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Hamburger Menu */}
        <button 
          className="nav-menu-icon" 
          onClick={toggleMenu} 
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Logo */}
        <div className="logo">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img 
              src={logo}
              alt="Plate Tonic Logo" 
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/getstarted" onClick={() => setMenuOpen(false)} data-testid="get-started-link">Get Started</Link></li>
          <li><Link to="/menu" onClick={() => setMenuOpen(false)}>Menu</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
          <li><Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
        </ul>

        {/* Login Icon */}
        <div className="login-icon">
          <Link to="/login" aria-label="User Login">
            <FaUser />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
