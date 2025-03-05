import React, { useState } from "react";
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
  const [tdeeResult, setTdeeResult] = useState(null);
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

    const decodedToken = jwtDecode(token); // Decode the token to get user ID
    const userId = decodedToken.userId;

    const fetchCalorieTracker = async () => {
      const url = `http://localhost:8008/${userId}/calorie-tracker`;
      console.log('Requesting URL:', url);
      try {
        const response = await axios.get(url);
        // const response = await axios.get(`http://localhost:8008/${userId}/calorie-tracker`, {
        // headers: { Authorization: `Bearer ${token}`, },
        // });
        const userData = response.data;
        setTdeeData(userData.macroTracker);
        setSelectedMeals(userData.selectedMealPlan || []);
        setLoading(false);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setLoading(false);
      }
    };

    fetchCalorieTracker();
  }, []);

  const fetchCalorieCalculator = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("authToken");

    const userData = {
      age,
      weight,
      height,
      gender,
      activityLevel,
      goal,
    };

    try {
      if (token) {
        // If the user is logged in, send the data to the backend to store it
        const decodedToken = jwtDecode(token); // Decode token to get user ID
        const userId = decodedToken.userId;

        const response = await axios.put(
          `http://localhost:8008/${userId}/calorie-tracker`,
          userData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTdeeResult(response.data); // Assuming backend returns TDEE & macros
        setShowModal(true);
      } else {
        // If the user is not logged in, store the data locally
        localStorage.setItem("calorieTrackerData", JSON.stringify(userData));

        // Optionally, you can still show the results in the modal
        setTdeeResult(userData);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching TDEE from backend:", error);
    }
  };

  return (
    <div className="get-started-page">
      <div className="getstarted-banner">Get Started</div>

      <h1>Find Your Daily Calorie & Macro Needs</h1>
      <p>Use our TDEE calculator to determine your daily intake.</p>

      <form className="tdee-form" onSubmit={calculateTDEE}>
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
            <h2>Your TDEE & Macros</h2>
            <p><strong>Calories:</strong> {tdeeResult.tdee} kcal/day</p>
            <p><strong>Protein:</strong> {tdeeResult.proteinGrams}g</p>
            <p><strong>Carbs:</strong> {tdeeResult.carbsGrams}g</p>
            <p><strong>Fats:</strong> {tdeeResult.fatsGrams}g</p>
            <button onClick={() => navigate("/menu")}>Choose Your Meals</button>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetStarted;
