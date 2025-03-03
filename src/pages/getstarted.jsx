import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/getstarted.css";

const GetStarted = () => {
  const navigate = useNavigate();

  // State variables
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("1.2");
  const [goal, setGoal] = useState("maintenance");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [tdeeResult, setTdeeResult] = useState(null);

  // Function to calculate TDEE and macros
  const calculateTDEE = (event) => {
    event.preventDefault();

    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);
    const ageNum = parseInt(age);

    if (isNaN(weightKg) || isNaN(heightCm) || isNaN(ageNum)) {
      alert("Please enter valid numeric values.");
      return;
    }

    let bmr;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    const tdee = Math.round(bmr * parseFloat(activityLevel));

    // Macronutrient Ratios Based on Goal
    let proteinRatio, carbsRatio, fatsRatio;

    switch (goal) {
      case "weight-loss":
        proteinRatio = 0.40;
        carbsRatio = 0.40;
        fatsRatio = 0.20;
        break;
      case "muscle-gain":
        proteinRatio = 0.40;
        carbsRatio = 0.45;
        fatsRatio = 0.15;
        break;
      default:
        proteinRatio = 0.30;
        carbsRatio = 0.50;
        fatsRatio = 0.20;
    }

    // Macronutrient Breakdown
    const proteinGrams = Math.round((tdee * proteinRatio) / 4);
    const carbsGrams = Math.round((tdee * carbsRatio) / 4);
    const fatsGrams = Math.round((tdee * fatsRatio) / 9);

    // Store results in state and show modal
    setTdeeResult({
      tdee,
      proteinGrams,
      carbsGrams,
      fatsGrams
    });
    setShowModal(true);
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
