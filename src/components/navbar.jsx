import React, { useState } from "react";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import "../styles/navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the menu state
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="logo">
          <img src="https://bcassetcdn.com/public/blog/wp-content/uploads/2022/10/05203628/blue-window-house-app-by-royallogo-brandcrowd.png" alt="Logo" />
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><a href="#">Get Started</a></li>
          <li><a href="#">Menu</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Contact</a></li>
        </ul>

        {/* Login Icon */}
        <div className="login-icon">
          <FaUser />
        </div>

        {/* Hamburger Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
