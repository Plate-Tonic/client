import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";

// Sign Up component
const SignUp = () => {

  // Initialize navigation
  const navigate = useNavigate();

  // State to manage user sign-up data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State to manage terms and conditions agreement
  const [agreeTerms, setAgreeTerms] = useState(false);


  // State to manage security questions and answers
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState("");

  // Fetch security questions from the server GET request
  useEffect(() => {
    const fetchSecurityQuestions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_AUTH_API_URL}/questions`);

        console.log(" Fetched security questions:", response.data);

        // Set the security questions in state
        setSecurityQuestions(response.data.securityQuestions);
        if (response.data.securityQuestions.length > 0) {
          setSelectedQuestion(response.data.securityQuestions[0]); // Set the first question as default
        }
      } catch (error) {
        alert("Error loading security questions. Please try again.");
      }
    };

    fetchSecurityQuestions(); // Call the function to fetch security questions
  }, []); // Empty dependency array to run only once

  // Function to handle sign-up form submission
  const handleSignUp = async (event) => {
    event.preventDefault();

    // Validate form data
    if (!agreeTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (confirmPassword.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    if (!securityAnswer.trim()) {
      alert("Please provide an answer to your security question.");
      return;
    }

    // Retrieve stored TDEE data from localStorage (if available)
    const storedTdeeData = JSON.parse(localStorage.getItem("macroTracker")) || {};
    const storedUserData = JSON.parse(localStorage.getItem("userData")) || {};

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

    console.log(" Sending user data:", JSON.stringify(userData, null, 2));

    // Send POST request to register user
    try {
      const response = await axios.post(`${import.meta.env.VITE_AUTH_API_URL}/register`, userData);

      console.log("Signup successful! Response:", response.data);

      // Clear TDEE data from localStorage after registration
      localStorage.removeItem("macroTracker");
      localStorage.setItem("userData", JSON.stringify({})); // Reset instead of removing
      console.log("After clearing, macroTracker in localStorage:", localStorage.getItem("macroTracker"));

      window.location.href = "/login"; // Redirect to login page

      // Show success message
      alert("Successfully registered user!");
      navigate("/login");
    } catch (error) {
      console.error("Error during sign-up:", error.response?.data || error.message);
      alert(`Error registering user: ${JSON.stringify(error.response?.data, null, 2) || "Please try again."}`);
    }
  };

  // Render the sign-up form
  return (
    <div className="signup-page">
      <div className="signup-banner">Create Your Account</div>

      {/* Sign Up Form */}
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp} data-testid="signup-form">

          {/* Input fields for user sign-up */}
          <div className="input-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="securityQuestion">Security Question:</label>
            <select
              id="securityQuestion"
              value={selectedQuestion}
              onChange={(e) => setSelectedQuestion(e.target.value)}
              required
            >
              {securityQuestions.map((question, index) => (
                <option
                  key={index} value={question}>{question}
                </option>
              ))}
            </select>

          </div>

          <div className="input-group">
            <label htmlFor="securityAnswer">Security Answer:</label>
            <input
              id="securityAnswer"
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
          </div>

          <div className="terms-conditions">
            <label htmlFor="agreeTerms">
              <input
                id="agreeTerms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              I agree to the <Link to="/terms-and-conditions">Terms & Conditions</Link>
            </label>
          </div>

          {/* Sign Up button */}
          <button
            type="submit">Sign Up
          </button>

        </form>

        {/* Link to login page */}
        <p>
          Already have an account?
          <Link to="/login">Login here</Link>
        </p>

      </div>
    </div>
  );
};

export default SignUp;