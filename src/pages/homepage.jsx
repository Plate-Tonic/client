import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/homepage.css";

// Import images locally
import bannerImage from "../assets/01_banner.jpg";
import icon1 from "../assets/01_homepage_icon.png";
import icon2 from "../assets/02_homepage_icon.png";
import icon3 from "../assets/03_homepage_icon.png";
import icon4 from "../assets/04_homepage_icon.png";
import testimonial1 from "../assets/istockphoto-636082286-612x612.jpg";
import testimonial2 from "../assets/before-after-inline-2-cz-240705-4ec0d5.jpg";
import testimonial3 from "../assets/katie-bolden-weight-loss-success-story-d90c538dd489423d94c6455dafd0db05.jpg";

// Homepage Component
const Homepage = () => {
  
  // State variables for random meal recommendations
  const [randomMeals, setRandomMeals] = useState([]);

  // Navigation hook for redirecting to other pages
    const navigate = useNavigate();

  // Fetch random meal recommendations
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_AUTH_API_URL}/meal-plan`);
        const data = await response.json();

        if (data && data.data && Array.isArray(data.data)) {
          // Shuffle meals and select first three meals
          const shuffled = data.data.sort(() => 0.5 - Math.random());
          setRandomMeals(shuffled.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching meals:", err);
      }
    };

    fetchMeals();
  }, []);

  return (
    // Homepage Content
    <div className="homepage">
      {/* HERO BANNER */}
      <header className="homepage-header">
        <img src={bannerImage} alt="Hero Banner" className="banner-image" />

        <div className="banner-content">
          <h3>Plate Tonic</h3>
          <p>
            "makes healthy eating effortless with personalized meal plans, delicious recipes, and smart tracking—helping you reach your goals without the guesswork."
          </p>

          {/* Link to GetStarted Page */}
          <Link to="/getstarted" data-testid="get-started-button">
            <button type="button" className="get-started-button">
              Get Started
            </button>
          </Link>
        </div>
      </header>

      {/* MARKET SECTION */}
      <section className="homepage-market">
        <h2>Eating smart has never been easier</h2>
        <div className="market-grid">

          <div className="market-item">
            <img src={icon1} alt="eating" className="market-icon" />
            <div>
              <h3>Follow any eating style or create your own</h3>
              <p>You can tailor your meals to fit popular diets like vegan and keto, aligning with your unique preferences and goals.</p>
            </div>
          </div>

          <div className="market-item">
            <img src={icon2} alt="reduce food waste" className="market-icon" />
            <div>
              <h3>Reduce food waste</h3>
              <p>Minimize food waste by planning ahead. Our system suggests recipes that incorporate ingredients you may already have, ensuring nothing goes to waste.</p>
            </div>
          </div>

          <div className="market-item">
            <img src={icon3} alt="meal planning" className="market-icon" />
            <div>
              <h3>Take the anxiety out of picking what to eat</h3>
              <p>Plan your meals in advance on your own terms, so when it’s time to eat, the decision is already made.
              </p>
            </div>
          </div>

          <div className="market-item">
            <img src={icon4} alt="grocery" className="market-icon" />
            <div>
              <h3>Grocery shopping made easier</h3>
              <p>Never miss a meal due to missing ingredients with our recipes that include all the ingredients you need.</p>
            </div>
          </div>

        </div>
      </section>


      {/* MEAL RECOMMENDATIONS */}
      <section className="homepage-meals">
        <h2>Meal Recommendations</h2>
        <p>"Discover delicious and nutritious meal options"</p>

        <div className="meal-container">
          {randomMeals.length > 0 ? (
            randomMeals.map((meal) => (
              <div key={meal._id} className="homepage-meal-item">
                <img className="meal-image"
                  src={`${import.meta.env.VITE_AUTH_API_URL}${meal.mealImage || "/uploads/placeholder-image.jpg"}`}
                  alt={meal.name}
                  onClick={() => navigate(`/meal/${meal._id}`, { state: { meal } })}
                  crossOrigin="anonymous"
                />
                <p className="meal-name"
                  onClick={() => navigate(`/meal/${meal._id}`, { state: { meal } })}
                > {meal.name}
                </p>
              </div>
            ))
          ) : (
            <p>Loading meals...</p>
          )}
        </div>

      </section>

      {/* MEAL BUTTON */}
      <Link to="/menu">
        <button type="button" className="choose-meal-button">Choose your Meal</button>
      </Link>

      {/* TESTIMONIALS SECTION */}
      <section className="homepage-testimonials">
        <h2>The Journey</h2>
        <p>"Hear what our users are saying"</p>
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
