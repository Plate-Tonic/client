import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/getstarted.css";

// GetStarted component
const GetStarted = () => {

  // Initialize navigation hook
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
    console.log(import.meta.env.VITE_AUTH_API_URL);  // This will print the API URL to the console.
    const token = localStorage.getItem("authToken");
    console.log("Token from local storage:", token);
    if (!token) { // If no token is found
      setLoading(false);
      setIsLoggedIn(false);
      return;
    }
    setLoading(false);
    setIsLoggedIn(true); // If token is found, set isLoggedIn to true
  }, []);

  // Maps for activity levels and goals
  const activityLevelMap = {
    "1.2": "Sedentary (little or no exercise)",
    "1.375": "Lightly active (light exercise 1-3 days/week)",
    "1.55": "Moderately active (moderate exercise 3-5 days/week)",
    "1.725": "Very active (hard exercise 6-7 days/week)",
    "1.9": "Super active (very intense exercise, physical job, etc.)"
  };

  const goalMap = {
    "weight-loss": "Lose Weight",
    "maintenance": "Maintain Weight",
    "muscle-gain": "Gain Muscle"
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Map activity level and goal to human-readable strings
    const activityLevelMapped = activityLevelMap[activityLevel];
    const goalMapped = goalMap[goal];
    const userData = {
      age: age,
      weight: weight,
      height: height,
      gender: gender,
      activity: activityLevelMapped,
      goal: goalMapped,
    };

    console.log('Request body:', userData);

    const token = localStorage.getItem("authToken"); // Retrieve token from local storage
    console.log("Token from local storage:", token);

    // Prepare headers with token if logged in
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    console.log("Sending request with headers: ", headers);
    console.log("Request URL:", `${import.meta.env.VITE_AUTH_API_URL}/user/calorie-tracker`);

    // Check if user is logged in and has a token
    if (isLoggedIn && token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      // Check if user has existing data in localStorage
      try {
        if (localStorage.getItem("userData")) {
          // Scenario 1: User is logged in and has existing data in localStorage
          const savedData = JSON.parse(localStorage.getItem("userData"));

          // Update localStorage with new data
          await axios.put(`${import.meta.env.VITE_AUTH_API_URL}/user/${decodedToken.userId}/calorie-tracker`, {

            id: decodedToken.userId,
            ...userData,
          }, { headers });

          // Retrieve updated data from the API GET request
          const response = await axios.get(`${import.meta.env.VITE_AUTH_API_URL}/user/${decodedToken.userId}/calorie-tracker`);
          const trackerData = response.data.data;

          // Update state with new data
          setTrackerResult({
            calories: trackerData.calories,
            protein: trackerData.protein,
            fat: trackerData.fat,
            carbs: trackerData.carbs,
          });

          // Show modal with results
          setShowModal(true);
        } else {
          // Scenario 2: User is logged in but has no existing data in localStorage
          localStorage.setItem("userData", JSON.stringify(userData));

          // Send POST request to save user data
          const response = await axios.post(`${import.meta.env.VITE_AUTH_API_URL}/user/${userId}/calorie-tracker`, {
            ...userData,
          }, { headers });

          // Update state with new data
          localStorage.setItem("userData", JSON.stringify(response.data));

          const trackerData = response.data.data;

          // Update state with new data
          setTrackerResult({
            calories: trackerData.calories,
            protein: trackerData.protein,
            fat: trackerData.fat,
            carbs: trackerData.carbs,
          });

          // Show modal with results
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error saving/updating user data:", error);
      }

    } else {
      // Scenario 3: User is not logged in
      try {
        // Save user data to localStorage
        localStorage.setItem("userData", JSON.stringify(userData));

        // Send POST request to save user data
        const response = await axios.post(`${import.meta.env.VITE_AUTH_API_URL}/user/calorie-tracker`, userData, { headers });

        console.log("Response from server:", response.data);

        console.log("Non-user API Response:", response.data); // Debugging

        const trackerData = response.data.data;  

        // Update state with new data
        setTrackerResult({
          calories: trackerData.calories,
          protein: trackerData.protein,
          fat: trackerData.fat,
          carbs: trackerData.carbs,
        });

        // Update localStorage with new data
        localStorage.setItem("macroTracker", JSON.stringify(trackerData));
        console.log("TDEE saved to localstorage:', trackerData");

        // Show modal with results
        setShowModal(true);
      } catch (error) {
        console.error("Error saving data for non-logged-in user:", error.response?.data || error.message);
      }
    }
  };

  // Return loading state if token is being checked
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
            <option
              value="male">Male
            </option>
            <option
              value="female">Female
            </option>
          </select>
        </div>

        {/* Activity Level */}
        <div className="input-group">
          <label>Activity Level:</label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
          >
            <option
              value="1.2">Sedentary (little or no exercise)
            </option>
            <option
              value="1.375">Lightly active (light exercise 1-3 days/week)
            </option>
            <option
              value="1.55">Moderately active (moderate exercise 3-5 days/week)
            </option>
            <option
              value="1.725">Very active (hard exercise 6-7 days/week)
            </option>
            <option
              value="1.9">Super active (very intense exercise, physical job, etc.)
            </option>
          </select>
        </div>

        {/* Goal */}
        <div className="input-group">
          <label>Goal:</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option
              value="weight-loss">Weight Loss
            </option>
            <option
              value="maintenance">Maintenance
            </option>
            <option
              value="muscle-gain">Muscle Gain
            </option>
          </select>
        </div>

        <button
          type="submit">Calculate TDEE & Macros
        </button>

      </form>

      {/* Modal for Results */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Your Calories & Macros Intake</h2>

            <p><strong>
              Calories:
            </strong>
              {trackerResult.calories} kcal/day
            </p>

            <p>
              <strong>Protein:</strong>{trackerResult.protein}g
            </p>

            <p>
              <strong>Fats:</strong>{trackerResult.fat}g
            </p>

            <p>
              <strong>Carbs:</strong>{trackerResult.carbs}g
            </p>

            {/* Navigate to Menu Button */}
            <button
              onClick={() => navigate("/menu")}>Choose Your Meals
            </button>

            {/* Close Modal Button */}
            <button
              onClick={() => setShowModal(false)}>Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default GetStarted;