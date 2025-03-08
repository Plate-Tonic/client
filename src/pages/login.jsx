import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useUserAuthContext } from "../contexts/UserAuthContext";
import axios from "axios";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
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
  }, []); // ✅ Empty dependency array prevents infinite loop

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_AUTH_API_URL}/login`, {
        email,
        password,
      });

      const userToken = response.data.token;
      setToken(userToken); // ✅ Update context state
      localStorage.setItem("authToken", userToken); // ✅ Store token
      navigate("/dashboard"); // ✅ Redirect after login
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-banner">Welcome Back</div>

      <div className="login-container">
        <h2>Login to Your Account</h2>
        {error && <p className="error-message">{error}</p>}
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
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
