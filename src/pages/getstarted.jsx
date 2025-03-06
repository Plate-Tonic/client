import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/getstarted.css";

const GetStarted = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("1.2");
  const [goal, setGoal] = useState("maintenance");
  const [trackerResult, setTrackerResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Token from local storage:", token);
    if (!token) {
      setLoading(false);
      setIsLoggedIn(false);
      return;
    }
    setLoading(false);
    setIsLoggedIn(true);
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('activityLevel:', activityLevel);
    console.log('goal:', goal);
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

    const token = localStorage.getItem("authToken");

    if (isLoggedIn && token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      try {
        if (localStorage.getItem("userData")) {
          // Scenario 1: User is logged in and has existing data in localStorage
          const savedData = JSON.parse(localStorage.getItem("userData"));

          await axios.put(`http://localhost:8008/user/${decodedToken.userId}/calorie-tracker`, {
            id: decodedToken.userId,
            ...userData,
          });

          const response = await axios.get(`http://localhost:8008/user/${decodedToken.userId}/calorie-tracker`);
          const trackerData = response.data;

          setTrackerResult({
            calories: trackerData.calories,
            protein: trackerData.protein,
            fat: trackerData.fat,
            carbs: trackerData.carbs,
          });

          setShowModal(true);
        } else {
          // Scenario 2: User is logged in but has no existing data in localStorage
          localStorage.setItem("userData", JSON.stringify(userData));

          const response = await axios.post(`http://localhost:8008/user/${userId}/calorie-tracker`, {
            ...userData,
          });

          localStorage.setItem("userData", JSON.stringify(response.data));

          const trackerData = response.data;

          setTrackerResult({
            calories: trackerData.calories,
            protein: trackerData.protein,
            fat: trackerData.fat,
            carbs: trackerData.carbs,
          });

          setShowModal(true);
        }
      } catch (error) {
        console.error("Error saving/updating user data:", error);
      }
    } else {
      // Scenario 3: User is not logged in
      try {
        localStorage.setItem("userData", JSON.stringify(userData));

        const response = await axios.post(`http://localhost:8008/user/calorie-tracker`, {
          ...userData,
        });

        const trackerData = response.data;

        setTrackerResult({
          calories: trackerData.calories,
          protein: trackerData.protein,
          fat: trackerData.fat,
          carbs: trackerData.carbs,
        });

        setShowModal(true);
      } catch (error) {
        console.error("Error saving data for non-logged-in user:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state while checking token
  }

  return (
    <div className="get-started-page">
      <div className="getstarted-banner">Get Started</div>

      <h1>Find Your Daily Calorie & Macro Needs</h1>
      <p>Use our TDEE calculator to determine your daily intake.</p>

      <form className="tdee-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Age:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Weight (kg):</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Height (cm):</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} required />
        </div>

        <div className="input-group">
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="input-group">
          <label>Activity Level:</label>
          <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
            <option value="1.2">Sedentary (little or no exercise)</option>
            <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
            <option value="1.55">Moderately active (moderate exercise 3-5 days/week)</option>
            <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
            <option value="1.9">Super active (very intense exercise, physical job, etc.)</option>
          </select>
        </div>

        <div className="input-group">
          <label>Goal:</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
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
            <button onClick={() => navigate("/menu")}>Choose Your Meals</button>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetStarted;