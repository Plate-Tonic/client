import "../styles/homepage.css";

const Homepage = () => {
  return (
    <div className="homepage">
      {/* HERO BANNER */}
      <header className="homepage-header">
        <h1>Welcome to Plate Tonic</h1>
        <p>Delicious, nutritious meals tailored for you.</p>
        <button>Get Started</button>
      </header>

      {/* MARKET STATISTICS */}
      <section className="market-statistics">
        <h2>Market Statistics</h2>
        <div className="placeholder-box">[Image Placeholder]</div>
      </section>

      {/* MEAL RECOMMENDATIONS */}
      <section className="meal-recommendations">
        <h2>Meal Recommendations</h2>
        <div className="meals">
          <div className="placeholder-box">Meal Option 1</div>
          <div className="placeholder-box">Meal Option 2</div>
          <div className="placeholder-box">Meal Option 3</div>
        </div>
        <button>Choose your Meal</button>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-container">
          <div className="testimonial-item">Testimonial 1</div>
          <div className="testimonial-item">Testimonial 2</div>
          <div className="testimonial-item">Testimonial 3</div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
