import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuthContext } from "../contexts/UserAuthContext";
import axios from "axios"; // Import axios
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useUserAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Add error state

  const handleLogin = (event) => {
    event.preventDefault();
    axios.post("http://localhost:8008/login", {
      email,
      password
    })
      .then((response) => {
        const token = response.data.token;
        setToken(token); // Set token in context
        navigate("/dashboard"); // Redirect to dashboard
      })
      .catch((error) => {
        console.error("Login error:", error);
        setError("Invalid email or password"); // Set error message
      });
  };

  return (
    <div className="login-page">
      <div className="login-banner">Welcome Back</div>

      <div className="login-container">
        <h2>Login to Your Account</h2>
        <form onSubmit={handleLogin}>
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

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
