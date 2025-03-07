import React from "react";
import "../styles/contact.css";

// Import images
import ContactImage from "..//assets/banner-favorites.jpg";

const Contact = () => {

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    e.target.reset();
  };

  return (
    <div className="contact-page">
      {/* Top Section: Contact Form + Image */}
      <div className="contact-container">
        <div className="contact-form">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Name</label>
              <input type="text" placeholder="Enter your name" required />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" required />
            </div>
            <div className="input-group">
              <label>Message</label>
              <textarea placeholder="Enter your message" required></textarea>
            </div>
            <button type="submit">Send Message</button>
          </form>
        </div>
        <div className="contact-image">
          <img src={ContactImage} alt="Contact" />
        </div>
      </div>

      

      {/* Bottom Section: Address & Phone Information */}
      <div className="contact-info">
        <h2>Our Information</h2>
        <p><strong>Address:</strong> 123 Example Street, City, Country</p>
        <p><strong>Phone:</strong> (123) 456-7890</p>
        <p><strong>Email:</strong> support@example.com</p>
      </div>
    </div>
  );
};

export default Contact;
