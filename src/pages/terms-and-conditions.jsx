import React from "react";
import "../styles/terms-and-conditions.css";

const Terms = () => {
  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1>Terms & Conditions</h1>

        <h2>1. Service Description</h2>
        <p>
          PlateTonic is an informational website offering calorie and macronutrient tracking, meal recommendations, and educational resources to help users manage their weight and nutritional goals.
        </p>
        <h2>2. User Data & Privacy</h2>
        <p>
          Your personal data is handled according to our <a href="/privacy">Privacy Policy</a>. We do not share your data without your consent, except as required by law.
        </p>

        <h2>3. User Responsibilities</h2>
        <p>
          You agree to use PlateTonic responsibly and acknowledge that the provided information is for educational purposes only and does not constitute medical advice.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          All content on PlateTonic is protected by intellectual property rights and should not be used without prior authorization.
        </p>

        <h2>5. Medical Disclaimer</h2>
        <p>
          PlateTonic does not offer medical or dietary advice. Always consult healthcare professionals before changing your diet.
        </p>

        <h2>5. Termination</h2>
        <p>
          PlateTonic reserves the right to terminate access to the service for any violation of these terms.
        </p>

        <h2>6. Governing Law</h2>
        <p>
          These Terms shall be governed by the applicable laws of your jurisdiction.
        </p>

        <h2>Contact</h2>
        <p>
          For questions regarding these terms, contact us at: <strong>support@example.com</strong>
        </p>
      </div>
    </div>
  );
};

export default Terms;
