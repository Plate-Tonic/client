import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");

  useEffect(() => {
    const fetchSecurityQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:8008/questions");
        console.log("Response data:", response.data);

        setSecurityQuestions(response.data.securityQuestions);
        if (response.data.securityQuestions.length > 0) {
          setSelectedQuestion(response.data.securityQuestions[0]); // Set the first question as default
        }
      } catch (error) {
        console.error("Error fetching security questions:", error);
        alert("Error loading security questions. Please try again.");
      }
    };
    fetchSecurityQuestions();
  }, []);

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (!agreeTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!securityAnswer.trim()) {
      alert("Please provide an answer to your security question.");
      return;
    }

    // Retrieve stored TDEE data from localStorage (if available)
    const storedTdeeData = JSON.parse(localStorage.getItem("macroTracker")) || {};
    console.log("Retrieved macroTracker:", storedTdeeData);
    const storedUserData = JSON.parse(localStorage.getItem("userData")) || {};
    console.log("Retrieved userData:", storedUserData);

    // Store the basic information in localStorage (or state)
    const userData = {
      name,
      email,
      password,
      securityQuestion: selectedQuestion,
      securityAnswer,
      macroTracker: {
        ...storedTdeeData,
        ...storedUserData
      }
    };

    try {
      const response = await axios.post("http://localhost:8008/register", userData);

      // Clear TDEE data from localStorage after registration
      localStorage.removeItem("macroTracker");
      console.log("After clearing, macroTracker in localStorage:", localStorage.getItem("macroTracker"));

      window.location.href = "/login";

      // Show success message
      alert("Successfully registered user!");
      navigate("/login");
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("Error registering user. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-banner">Create Your Account</div>

      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="input-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Security Question:</label>
            <select
              value={selectedQuestion}
              onChange={(e) => setSelectedQuestion(e.target.value)}
              required
            >
              {securityQuestions.map((question, index) => (
                <option key={index} value={question}>
                  {question}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Security Answer:</label>
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
          </div>

          <div className="terms-conditions">
            <label>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              I agree to the <a href="/terms-and-conditions">Terms & Conditions</a>
            </label>
          </div>

          <button type="submit">Sign Up</button>
        </form>

        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;