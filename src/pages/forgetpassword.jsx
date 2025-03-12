import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/forgetpassword.css";

// Forgot Password Component
const ForgetPassword = () => {

  // State to manage the step of the password reset process
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Function to handle email submission
  const handleEmailSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post(`http://localhost:8008/question`, {
        email
      });

      // If the response status is 200, set the security question and move to the next step
      if (response.status === 200) {
        setSecurityQuestion(response.data.securityQuestion);
        setStep(2);
      } else {
        throw new Error(response.data.message || "Email not found.");
      }
    } catch (error) {
      alert("An error occurred while verifying the email.", error.message);
      console.error(error);
    }
  };

  // Function to handle security answer submission
  const handleSecurityAnswerSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8008/answer`, {
        email,
        securityAnswer,
      });

      // If the response status is 200, move to the next step
      if (response.status === 200) {
        setStep(3);
      } else {
        throw new Error(response.data.message || "Incorrect security answer.");
      }
    } catch (error) {
      alert("An error occurred while verifying the security answer", error.message);
      console.error(error);
    }
  };

  // Function to handle password reset
  const handlePasswordReset = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) { // Check if passwords match
      alert("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) { // Check password length
      alert("Password must be at least 8 characters long.");
      return;
    }

    // Send a POST request to reset the password
    try {
      const response = await axios.post(`http://localhost:8008/reset-password`, {
        email,
        newPassword,
      });

      if (response.status === 200) {
        alert("Password reset successful! Redirecting to login...");
        navigate("/login");
      } else {
        throw new Error(response.data.message || "Error resetting password.");
      }
    } catch (error) {
      alert(error.message || "An error occurred while resetting the password.");
      console.error(error);
    }
  };

  // Render the forget password form
  return (
    <div className="forget-password-page">
      <div className="forget-password-banner">Reset Your Password</div>

      <div className="forget-password-container">

        {/* Step One */}
        {step === 1 && (
          <>
            <h2>Enter Your Email</h2>
            <p>We will verify your email and security question.</p>

            <form onSubmit={handleEmailSubmit}>
              <div className="input-group">
                <label htmlFor="email">
                  Email:
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit">
                Next
              </button>
            </form>
          </>
        )}

        {/* Step Two */}
        {step === 2 && (
          <>
            <h2>Security Question</h2>
            <p>{securityQuestion}</p>
            <form onSubmit={handleSecurityAnswerSubmit}>
              <div className="input-group">
                <label htmlFor="securityAnswer">
                  Answer:
                </label>
                <input
                  id="securityAnswer"
                  type="text"
                  value={securityAnswer}
                  onChange={(e) =>
                    setSecurityAnswer(e.target.value)}
                  required
                />
              </div>
              <button type="submit">
                Next
              </button>
            </form>
          </>
        )}

        {/* Step Three */}
        {step === 3 && (
          <>
            <h2>Reset Your Password</h2>
            <form onSubmit={handlePasswordReset}>

              <div className="input-group">
                <label htmlFor="password">New Password:</label>
                <input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirm-password">Confirm New Password:</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit">Reset Password
              </button>
            </form>
          </>
        )}

        {/* Navigate to Login if Remembered Password */}
        {step !== 3 && (
          <p>
            Remembered your password?
            <Link to="/login">Back to Login</Link>
          </p>
        )}

      </div>
    </div>
  );
};

export default ForgetPassword;
