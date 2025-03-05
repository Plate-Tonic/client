import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forgetpassword.css";

const userData = {
  email: "test@example.com", // Mock user email
  securityQuestion: "What was the name of your first pet?", // Mock stored security question
  securityAnswer: "Fluffy", // Mock stored answer
};

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    if (email === userData.email) {
      setSecurityQuestion(userData.securityQuestion);
      setStep(2);
    } else {
      alert("Email not found.");
    }
  };

  const handleSecurityAnswerSubmit = (event) => {
    event.preventDefault();
    if (securityAnswer.trim().toLowerCase() === userData.securityAnswer.toLowerCase()) {
      setStep(3);
    } else {
      alert("Incorrect security answer.");
    }
  };

  const handlePasswordReset = (event) => {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match.");
      return;
    }
    alert("Password reset successful! Redirecting to login...");
    navigate("/login");
  };

  return (
    <div className="forget-password-page">
      <div className="forget-password-banner">Reset Your Password</div>

      <div className="forget-password-container">
        {step === 1 && (
          <>
            <h2>Enter Your Email</h2>
            <p>We will verify your email and security question.</p>
            <form onSubmit={handleEmailSubmit}>
              <div className="input-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Next</button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Security Question</h2>
            <p>{securityQuestion}</p>
            <form onSubmit={handleSecurityAnswerSubmit}>
              <div className="input-group">
                <label>Answer:</label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Next</button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Reset Your Password</h2>
            <form onSubmit={handlePasswordReset}>
              <div className="input-group">
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirm New Password:</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit">Reset Password</button>
            </form>
          </>
        )}

        {step !== 3 && (
          <p>
            Remembered your password? <a href="/login">Back to Login</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
