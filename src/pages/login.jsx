import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useUserAuthContext } from "../contexts/UserAuthContext";
import axios from "axios";
import "../styles/login.css";

// Login component
const Login = () => {

  // Initialize state variables
  const navigate = useNavigate();

  // Destructure context state and functions
  const { token, setToken } = useUserAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // Redirect if user is already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      navigate("/dashboard");
    }
  }, []); // Empty dependency array prevents infinite loop

  const handleLogin = async (event) => {
    event.preventDefault();

    // Send login request to server POST /login
    try {
      const response = await axios.post(`http://localhost:8008/login`, {
        email,
        password,
      });

      const userToken = response.data.token; // Extract token from response

      // Update context state and store token
      setToken(userToken);
      localStorage.setItem("authToken", userToken);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
    }
  };

  return (

    // Render Login Page
    <div className="login-page">
      <div className="login-banner">Welcome Back</div>

      {/* Login Form */}
      <div className="login-container">
        <h2>Login to Your Account</h2>
        {error && <p className="error-message">{error}</p>}

        {/* Login form with email and password fields */}
        <form onSubmit={handleLogin}>

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

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button
            type="submit">Login
          </button>

        </form>

        {/* Link to sign up page */}
        <p>
          Don't have an account?
          <Link to="/signup">Sign up here</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
