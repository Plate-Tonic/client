import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forgetpassword.css";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleReset = (event) => {
    event.preventDefault();
    if (email) {
      alert("Password reset link has been sent to your email!");
      navigate("/login"); // Redirect back to login page
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div className="forget-password-page">
      <div className="forget-password-banner">Reset Your Password</div>

      <div className="forget-password-container">
        <h2>Enter Your Email</h2>
        <p>We will send you a link to reset your password.</p>

        <form onSubmit={handleReset}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit">Send Reset Link</button>
        </form>

        <p>
          Remembered your password? <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
