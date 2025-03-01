import React from "react";
import "../styles/homepage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Banner */}
      <section className="hero">
        <h1>Welcome to Plate Tonic</h1>
        <p>Delicious, nutritious meals tailored for you.</p>
        <button className="cta-button">Get Started</button>
      </section>

      {/* Market Statistics Placeholder */}
      <section className="market-statistics">
        <h2>Market Statistics</h2>
        <div className="statistics-placeholder">[Image Placeholder]</div>
      </section>

      {/* Meal Recommendations Section */}
      <section className="meal-recommendations">
        <h2>Meal Recommendations</h2>
        <div className="meal-container">
          <div className="meal-card">
            <img src="" alt="Meal Placeholder" />
            <p>Meal Option 1</p>
          </div>
          <div className="meal-card">
            <img src="" alt="Meal Placeholder" />
            <p>Meal Option 2</p>
          </div>
          <div className="meal-card">
            <img src="" alt="Meal Placeholder" />
            <p>Meal Option 3</p>
          </div>
        </div>
        <button className="meal-get-started">Choose your Meal</button>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-container">
          <div className="testimonial">[Testimonial 1 Placeholder]</div>
          <div className="testimonial">[Testimonial 2 Placeholder]</div>
          <div className="testimonial">[Testimonial 3 Placeholder]</div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;