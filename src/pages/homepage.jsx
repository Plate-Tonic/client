import React from "react";
import { Link } from "react-router-dom";
import "../styles/homepage.css";
import { FaUtensils, FaSmile, FaBoxOpen } from "react-icons/fa"; // Import icons

// Import images locally
import bannerImage from "../assets/01_banner.jpg";
import testimonial1 from "../assets/istockphoto-636082286-612x612.jpg";
import testimonial2 from "../assets/before-after-inline-2-cz-240705-4ec0d5.jpg";
import testimonial3 from "../assets/katie-bolden-weight-loss-success-story-d90c538dd489423d94c6455dafd0db05.jpg";
import marketstatistics from "../assets/Untitled-4.jpg";
import meal1 from "../assets/marry-me-chicken2-65b3f9451efb6.avif";
import meal2 from "../assets/lemon-shrimp-and-shaved-asparagus-66a174bf43c51.avif";
import meal3 from "../assets/creole-shrimp-caesar-salad-with-cheesy-croutons-1677186680.avif";

// Homepage Component
const Homepage = () => {

  return (
    // Homepage Content
    <div className="homepage">
      {/* HERO BANNER */}
      <header className="homepage-header">
        <img src={bannerImage} alt="Hero Banner" className="banner-image" />
        <div className="banner-content">
          <h1>Welcome to PLATE TONIC</h1>
          <p>Delicious, nutritious meals tailored for you.</p>
          {/* Link to GetStarted Page */}
          <Link to="/getstarted" data-testid="get-started-button">
            <button type="button" className="get-started-button">
              Get Started
            </button>
          </Link>
        </div>
      </header>

      {/* MARKET STATISTICS */}
      <section className="homepage-market">
        <img src={marketstatistics} alt="Market statistics graph" className="market-image" />
      </section>

      {/* MARKET STATS SECTION */}
      <section className="homepage-stats">

        {/* <div className="stats-item">
          <FaUtensils className="stats-icon" />
          <h3>Updating Recipes</h3>
          <p>Has never been easier</p>
        </div>

        <div className="stats-item">
          <FaSmile className="stats-icon" />
          <h3>100K+</h3>
          <p>Satisfied Users</p>
        </div>

        <div className="stats-item">
          <FaBoxOpen className="stats-icon" />
          <h3>Deliveries</h3>
          <p>COMING SOON</p>
        </div> */}

      </section>

      {/* MEAL RECOMMENDATIONS */}
      <section className="homepage-meals">
        <h2>Meal Recommendations</h2>

        <div className="meal-container">

          <div className="meal-item">
            <img src={meal1} alt="Meal Option 1" className="meal-image" />
            <p>Grilled Chicken with Brown Rice</p>
            <strong>500 Calories</strong>
          </div>

          <div className="meal-item">
            <img src={meal2} alt="Meal Option 2" className="meal-image" />
            <p>Salmon & Roasted Vegetables</p>
            <strong>450 Calories</strong>
          </div>

          <div className="meal-item">
            <img src={meal3} alt="Meal Option 3" className="meal-image" />
            <p>Quinoa & Chickpea Bowl</p>
            <strong>400 Calories</strong>
          </div>
        </div>

      </section>

      {/* MEAL BUTTON */}
      <Link to="/menu">
        <button type="button" className="choose-meal-button">Choose your Meal</button>
      </Link>

      {/* TESTIMONIALS SECTION */}
      <section className="homepage-testimonials">
        <h2>The Journey</h2>

        <div className="testimonial-container">
          <div className="testimonial-item">
            <img src={testimonial1} alt="Happy customer 1" className="testimonial-image" />
            <p>"Plate Tonic has changed my meal planning forever!"</p>
            <strong>- Alexa R.</strong>
          </div>

          <div className="testimonial-item">
            <img src={testimonial2} alt="Happy customer 2" className="testimonial-image" />
            <p>"Great taste and amazing variety!"</p>
            <strong>- Michael D.</strong>
          </div>

          <div className="testimonial-item">
            <img src={testimonial3} alt="Happy customer 3" className="testimonial-image" />
            <p>"Exactly what I needed!"</p>
            <strong>- Sarah.W.</strong>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Homepage;
