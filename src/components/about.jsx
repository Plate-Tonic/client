import "../styles/about.css";

const About = () => {
  return (
    <div className="about-page">
      {/* Our Purpose */}
      <section className="about-section">
        <div className="about-image">
          <img src="../assets/purpose.jpg" alt="Our Purpose" />
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
          <img src="../assets/mission.jpg" alt="Our Mission" />
        </div>
      </section>

      {/* Our Values */}
      <section className="about-section">
        <div className="about-image">
          <img src="../assets/values.jpg" alt="Our Values" />
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
          <img src="../assets/story.jpg" alt="Our Story" />
        </div>
      </section>
    </div>
  );
};

export default About;
