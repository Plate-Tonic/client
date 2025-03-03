import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
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

  const [selectedMeals, setSelectedMeals] = useState([
    { id: 1, name: "Chicken Salad", calories: 350, protein: 30, carbs: 10, fats: 15 },
    { id: 2, name: "Vegetable Stir-Fry", calories: 220, protein: 8, carbs: 40, fats: 8 },
  ]); // Sample meal data for testing
  const navigate = useNavigate(); // Initialize the navigation hook

  const fetchCalorieData = () => {
    // Simulating fetching calorie data
    setCalorieRequirement(2000); // Example calorie requirement
    setProteinRequirement(150); // Example protein requirement in grams
    setCarbRequirement(250); // Example carb requirement in grams
    setFatRequirement(70); // Example fat requirement in grams

    // Calculate current intake for calories, protein, carbs, and fats
    setCurrentCalories(
      selectedMeals.reduce((sum, meal) => sum + meal.calories, 0)
    );
    setCurrentProtein(
      selectedMeals.reduce((sum, meal) => sum + meal.protein, 0)
    );
    setCurrentCarbs(
      selectedMeals.reduce((sum, meal) => sum + meal.carbs, 0)
    );
    setCurrentFats(
      selectedMeals.reduce((sum, meal) => sum + meal.fats, 0)
    );
  };

  useEffect(() => {
    fetchCalorieData(); // Update calorie data when meals change
  }, [selectedMeals]);

  const removeMeal = (mealId) => {
    const updatedMeals = selectedMeals.filter((meal) => meal.id !== mealId);
    setSelectedMeals(updatedMeals);
  };

  const handleAddMealClick = () => {
    // Redirect to the menu page to select a new meal
    navigate("/menu"); 
  };

  const renderContent = () => {
    switch (activeSection) {
      case "calorie-tracker":
        return (
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

            <p><strong>Difference (Calories):</strong> {calorieRequirement - currentCalories} kcal</p>
            <p><strong>Difference (Protein):</strong> {proteinRequirement - currentProtein} g</p>
            <p><strong>Difference (Carbs):</strong> {carbRequirement - currentCarbs} g</p>
            <p><strong>Difference (Fats):</strong> {fatRequirement - currentFats} g</p>
          </div>
        );
      case "current-meals":
        return (
          <div className="content-box">
            <h3>Current Meals</h3>
            {selectedMeals.length === 0 ? (
              <p>No meals selected yet.</p>
            ) : (
              <div className="current-meals-list">
                <ul>
                  {selectedMeals.map((meal) => (
                    <li key={meal.id}>
                      <span className="meal-name">{meal.name}</span>
                      <span className="meal-calories">{meal.calories} kcal</span>
                      <span className="meal-protein">{meal.protein} g Protein</span>
                      <span className="meal-carbs">{meal.carbs} g Carbs</span>
                      <span className="meal-fats">{meal.fats} g Fats</span>
                      <button className="remove-meal" onClick={() => removeMeal(meal.id)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button className="add-meal-btn" onClick={handleAddMealClick}>Add Meal</button>
          </div>
        );
      default:
        return <div className="content-box">Welcome to Your Dashboard</div>;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="sidebar">
          <button onClick={() => setActiveSection("calorie-tracker")}>Calorie Tracker</button>
          <button onClick={() => setActiveSection("current-meals")}>Current Meals</button>
        </div>
        <div className="main-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
