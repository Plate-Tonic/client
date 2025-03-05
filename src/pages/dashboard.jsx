import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("calorie-tracker");

  const [calorieRequirement, setCalorieRequirement] = useState(0);
  const [proteinRequirement, setProteinRequirement] = useState(0);
  const [carbRequirement, setCarbRequirement] = useState(0);
  const [fatRequirement, setFatRequirement] = useState(0);

  const [currentCalories, setCurrentCalories] = useState(0);
  const [currentProtein, setCurrentProtein] = useState(0);
  const [currentCarbs, setCurrentCarbs] = useState(0);
  const [currentFats, setCurrentFats] = useState(0);

  const [selectedMeals, setSelectedMeals] = useState([]);
  const navigate = useNavigate();

  // Fetch user data once on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.log("No token found, redirecting to login...");
        navigate("/login");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      try {
        const response = await axios.get(`http://localhost:8008/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        console.log("Fetched userData:", userData);

        // Set user macros if available
        if (userData.macroTracker) {
          setCalorieRequirement(userData.macroTracker.calorie || 0);
          setProteinRequirement(userData.macroTracker.protein || 0);
          setCarbRequirement(userData.macroTracker.carbs || 0);
          setFatRequirement(userData.macroTracker.fat || 0);
        }

        // Fetch user's meals
        setSelectedMeals(Array.isArray(userData.selectedMealPlan) ? userData.selectedMealPlan : []);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []); // ✅ Runs only once on mount

  // Update intake when selectedMeals changes
  useEffect(() => {
    setCurrentCalories(selectedMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0));
    setCurrentProtein(selectedMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0));
    setCurrentCarbs(selectedMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0));
    setCurrentFats(selectedMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0));
  }, [selectedMeals]);

  const removeMeal = async (mealId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found, user not authenticated.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      await axios.delete(`http://localhost:8008/user/${userId}/meal-plan/${mealId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update frontend state after successful removal
      const updatedMeals = selectedMeals.filter((meal) => meal._id !== mealId);
      setSelectedMeals(updatedMeals);

      // Sync with localStorage for Menu.jsx
      localStorage.setItem("chosenMeals", JSON.stringify(updatedMeals));
    } catch (err) {
      console.error("Error removing meal:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="sidebar">
          <button onClick={() => setActiveSection("calorie-tracker")}>Calorie Tracker</button>
          <button onClick={() => setActiveSection("current-meals")}>Current Meals</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
        <div className="main-content">
          {activeSection === "calorie-tracker" ? (
            <div className="content-box">
              <h3>Calorie Tracker</h3>
              <p><strong>Calorie Requirement:</strong> {calorieRequirement} kcal</p>
              <p><strong>Protein Requirement:</strong> {proteinRequirement} g</p>
              <p><strong>Carb Requirement:</strong> {carbRequirement} g</p>
              <p><strong>Fat Requirement:</strong> {fatRequirement} g</p>
              <p><strong>Current Intake:</strong> {currentCalories} kcal</p>
              <p><strong>Protein Intake:</strong> {currentProtein} g</p>
              <p><strong>Carb Intake:</strong> {currentCarbs} g</p>
              <p><strong>Fat Intake:</strong> {currentFats} g</p>
            </div>
          ) : (
            <div className="content-box">
              <h3>Current Meals</h3>
              {selectedMeals.length === 0 ? (
                <p>No meals selected yet.</p>
              ) : (
                <ul className="current-meals-list">
                  {selectedMeals.map((meal) => (
                    <li key={meal._id}>
                      <span className="meal-name">{meal.name}</span> -
                      <span className="meal-calories">{meal.calories} kcal</span> |
                      <span className="meal-protein">{meal.protein} g Protein</span> |
                      <span className="meal-carbs">{meal.carbs} g Carbs</span> |
                      <span className="meal-fats">{meal.fat} g Fats</span>
                      <button className="remove-meal" onClick={() => removeMeal(meal._id)}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}
              {/* Add Meal Button */}
              <button className="add-meal-btn" onClick={() => navigate("/menu")}>
                Add Meal
              </button>
            </div>

          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
