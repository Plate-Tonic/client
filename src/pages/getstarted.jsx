import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/getstarted.css";

// GetStarted component
const GetStarted = () => {
  const navigate = useNavigate();

  // State variables for form data and results
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("1.2");
  const [goal, setGoal] = useState("maintenance");

  // State variables for modal and loading states
  const [trackerResult, setTrackerResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // State variables for login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // UseEffect hook to check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  // Maps for activity levels and goals
  const activityLevelMap = {
    "1.2": "Sedentary (little or no exercise)",
    "1.375": "Lightly active (light exercise 1-3 days/week)",
    "1.55": "Moderately active (moderate exercise 3-5 days/week)",
    "1.725": "Very active (hard exercise 6-7 days/week)",
    "1.9": "Super active (very intense exercise, physical job, etc.)",
  };

  const goalMap = {
    "weight-loss": "Lose Weight",
    "maintenance": "Maintain Weight",
    "muscle-gain": "Gain Muscle",
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare user data for API request
    const activityLevelMapped = activityLevelMap[activityLevel];
    const goalMapped = goalMap[goal];
    const userData = {
      age,
      weight,
      height,
      gender,
      activity: activityLevelMapped,
      goal: goalMapped,
    };

    const token = localStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      let response;

      if (isLoggedIn && token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        // Check if user has existing data in localStorage
        if (localStorage.getItem("userData")) {
          
          // Scenario 1: User is logged in and has existing data in localStorage
          const savedData = JSON.parse(localStorage.getItem("userData"));

          // Update user data in backend
          response = await axios.put(
            `${import.meta.env.VITE_AUTH_API_URL}/user/${userId}/calorie-tracker`,
            { id: userId, ...userData },
            { headers }
          );
        } else {

          // Scenario 2: User is logged in but has no existing data
          response = await axios.post(
            `${import.meta.env.VITE_AUTH_API_URL}/user/${userId}/calorie-tracker`,
            userData,
            { headers }
          );
        }
      } else {

        // Scenario 3: User is not logged in (non-user)
        response = await axios.post(
          `${import.meta.env.VITE_AUTH_API_URL}/user/calorie-tracker`,
          userData,
          { headers }
        );
      }

      // Extract tracker data from response
      const trackerData = response.data.data;

      // Save data in localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("macroTracker", JSON.stringify(trackerData));

      // Update state with the new tracker data
      setTrackerResult({
        calories: trackerData.calories,
        protein: trackerData.protein,
        fat: trackerData.fat,
        carbs: trackerData.carbs,
      });

      // Show modal with results
      setShowModal(true);

    } catch (error) {
      console.error("Error during API request:", error.response ? error.response.data : error.message);
    }
  };

  // Return loading state while token is being checked
  if (loading) {
    return <div>Loading...</div>; // Loading state while checking token
  }

  // Render the GetStarted component
  return (
    <div className="get-started-page">
      <div className="getstarted-banner">Get Started</div>

      <h1>Find Your Daily Calorie & Macro Needs</h1>
      <p>Use our TDEE calculator to determine your daily intake.</p>

      <form className="tdee-form" onSubmit={handleSubmit}>
        {/* Enter Information */}
        <div className="input-group">
          <label>Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Weight (kg):</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Height (cm):</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Activity Level */}
        <div className="input-group">
          <label>Activity Level:</label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}>
            <option value="1.2">Sedentary (little or no exercise)</option>
            <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
            <option value="1.55">Moderately active (moderate exercise 3-5 days/week)</option>
            <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
            <option value="1.9">Super active (very intense exercise, physical job, etc.)</option>
          </select>
        </div>

        {/* Goal */}
        <div className="input-group">
          <label>Goal:</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}>
            <option value="weight-loss">Weight Loss</option>
            <option value="maintenance">Maintenance</option>
            <option value="muscle-gain">Muscle Gain</option>
          </select>
        </div>

        <button type="submit">Calculate TDEE & Macros</button>
      </form>

      {/* Modal for Results */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Your Calories & Macros Intake</h2>

            <p><strong>Calories:</strong> {trackerResult.calories} kcal/day</p>
            <p><strong>Protein:</strong> {trackerResult.protein}g</p>
            <p><strong>Fats:</strong> {trackerResult.fat}g</p>
            <p><strong>Carbs:</strong> {trackerResult.carbs}g</p>

            {/* Navigate to Menu Button */}
            <button onClick={() => navigate("/menu")}>Choose Your Meals</button>

            {/* Close Modal Button */}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetStarted;
