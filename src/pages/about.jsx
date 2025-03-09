import React from "react";
import "../styles/about.css";

// Import images
import about1 from "../assets/Foober-bg-banner2-1080x675.webp"
import about2 from "../assets/Website_meal-plans_hands-holding_500px_LC_Low-Carb-Lamb-Vegetable-Curry-1.jpg"
import about3 from "../assets/meal-prep-ideas-storing-recipes-1296x728.webp"
import about4 from "../assets/istockphoto-1225778251-612x612.jpg"


const About = () => {
  return (
    <div className="about-page">
      <div className="about-banner">What are we about</div>

      {/* Our Purpose */}
      <section className="about-section">
        <div className="about-image">
          <img src={about1} alt="Our Purpose" />
        </div>
        <div className="about-text">
          <h2>Our Purpose</h2>
          <p>We are dedicated to providing high-quality, nutritious meals to support a healthier lifestyle for everyone.</p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="about-section">
        <div className="about-text">
          <h2>Our Mission</h2>
          <p>To make healthy eating effortless by delivering fresh, chef-prepared meals designed to fuel your performance.</p>
        </div>
        <div className="about-image">
          <img src={about2} alt="Our Mission" />
        </div>
      </section>

      {/* Our Values */}
      <section className="about-section">
        <div className="about-image">
          <img src={about3} alt="Our Values" />
        </div>
        <div className="about-text">
          <h2>Our Values</h2>
          <p>We believe in quality, sustainability, and empowering our customers to achieve their goals with great-tasting, nutritious meals.</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-section">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>Founded with a passion for health and convenience, our journey began with a simple goal: to make premium nutrition accessible to everyone.</p>
        </div>
        <div className="about-image">
          <img src={about4} alt="Our Story" />
        </div>
      </section>
      
    </div>
  );
};

export default About;
