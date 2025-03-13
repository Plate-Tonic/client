import React from "react";
import "../styles/contact.css";

// Import images
import ContactImage from "..//assets/banner-favorites.jpg";

// Contact Page Component
const Contact = () => {

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    alert("Thank you for your message! We will get back to you soon.");
    e.target.reset(); // Reset the form
  };

  return (

    // Contact Page Form
    <div className="contact-page">
      <div className="contact-banner">Contact Us</div>
      <p>Have a question or feedback? Send us a message!</p>

      {/* Top Section: Contact Form + Image */}
      <div className="contact-container">

        <div className="contact-form">
          <h2>Send Us a Message</h2>

          {/* Form for Contact Information */}
          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                required />
            </div>

            <div className="input-group">
              <label htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                required />
            </div>

            <div className="input-group">
              <label htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Enter your message"
                required>
              </textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit">
              Send Message
            </button>

          </form>
        </div>

        {/* Contact Image */}
        {/* <div className="contact-image">
          <img src=
            {ContactImage}
            alt="Contact" />
        </div> */}

      </div>

      {/* Bottom Section: Address & Phone Information */}
      <div className="contact-info">
        <h2>or send us an email at ... </h2>
        <p>support@platetonic.com</p>
      </div>
    </div>
  );
};

export default Contact;
