import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import "../styles/footer.css"; // Import footer styles

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="#">Terms of Service</a>
          <a href="/contact">Contact</a>
        </div>
        
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
        </div>

        <p>&copy; {new Date().getFullYear()} Plate Tonic. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
