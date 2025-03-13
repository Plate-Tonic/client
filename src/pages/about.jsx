import React from "react";
import "../styles/about.css";

// Import images
import about1 from "../assets/about-us-image.jpg"; // Ensure correct file extension

// About Component
const About = () => {
  return (
    <div className="about-page">
      <div className="about-banner">What we are about</div>

      <div className="about-section">
        <h2>Our Purpose</h2>
        <p>We are dedicated to providing high-quality, nutritious meals to support a healthier lifestyle for everyone.</p>
      </div>
      
      <div className="about-section">
        <h2>Our Mission</h2>
        <p>Our mission is to help you reach your health and fitness goals by providing you with the tools and resources you need to succeed.</p>
      </div>

      <div className="about-section">
        <h2>Our Vision</h2>
        <p>Our vision is to create a healthier world by empowering people to make healthier choices.</p>
      </div>

      <div className="about-section">
        <h2>Our Values</h2>
        <p>Our core values include integrity, quality, and user satisfaction.</p>
      </div>

      <div className="contact-image">
        <img src={about1} alt="About Us" />
      </div>
    </div>
  );
};

export default About;
