import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/menu.css";

const Menu = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [chosenMeals, setChosenMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]); // Updated variable name
  const [calorieData, setTdeeData] = useState({
    calorie: 2000,
    protein: 150,
    carbs: 250,
    fat: 50
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch meals and user data (including login status)
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:8008/meal-plan");
        const data = await response.json();

        if (data && data.length > 0) {
          setMeals(data);
          setFilteredMeals(data);
        }
      } catch (err) {
        console.error("Error fetching meals:", err);
      }
    };

    fetchMeals();

    const storedChosenMeals = JSON.parse(localStorage.getItem("chosenMeals")) || [];
    setChosenMeals(storedChosenMeals);
    setSelectedMeals(storedChosenMeals); // Updated to reflect selected meals

    const storedTDEE = JSON.parse(localStorage.getItem("calorieTrackerData"));
    if (storedTDEE) {
      setTdeeData({
        calorie: storedTDEE.tdee || 0,
        protein: storedTDEE.proteinGrams || 0,
        carbs: storedTDEE.carbsGrams || 0,
        fat: storedTDEE.fatsGrams || 0,
      });
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      setIsLoggedIn(false);
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8008/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = response.data;
        setTdeeData(userData.macroTracker);
        setLoading(false);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Filter meals based on selected filters
  useEffect(() => {
    if (selectedFilters.length > 0) {
      setFilteredMeals(
        meals.filter((meal) =>
          selectedFilters.every((filter) => meal.preference.includes(filter))
        )
      );
    } else {
      setFilteredMeals(meals);
    }
  }, [selectedFilters, meals]);

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prevFilters) =>
      checked ? [...prevFilters, value] : prevFilters.filter((f) => f !== value)
    );
  };

  const handleChooseMeal = async (meal) => {
    if (!chosenMeals.find((m) => m._id === meal._id)) {
      const updatedMeals = [...chosenMeals, meal];
      setChosenMeals(updatedMeals);
      localStorage.setItem("chosenMeals", JSON.stringify(updatedMeals));
      setSelectedMeals(updatedMeals);

      const token = localStorage.getItem("authToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        try {
          await axios.post(
            `http://localhost:8008/user/${userId}/meal-plan`,
            { selectedMealPlan: meal._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error("Error saving meal to user profile:", err);
        }
      }
    }
  };

  const handleRemoveMeal = async (meal) => {
    if (!isLoggedIn) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found, user not authenticated.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      await axios.delete(`http://localhost:8008/user/${userId}/meal-plan/${meal._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedMeals = chosenMeals.filter((m) => m._id !== meal._id);
      setChosenMeals(updatedMeals);
      localStorage.setItem("chosenMeals", JSON.stringify(updatedMeals));

      // Also remove from Dashboard state
      setSelectedMeals(updatedMeals);

    } catch (err) {
      console.error("Error removing meal:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="menu-page">
      <div className="menu-banner">Meal Selection</div>

      <div className="calorie-tracker">
        <p>
          Calories: {calorieData.calorie} kcal |
          Protein: {calorieData.protein}g |
          Carbs: {calorieData.carbs}g |
          Fat: {calorieData.fat}g
        </p>

        {isLoggedIn && (
          <p className="selected-macros">
            Selected Meals: {selectedMeals.reduce((acc, meal) => acc + meal.calories, 0)} kcal |
            Protein: {selectedMeals.reduce((acc, meal) => acc + meal.protein, 0)}g |
            Carbs: {selectedMeals.reduce((acc, meal) => acc + meal.carbs, 0)}g |
            Fat: {selectedMeals.reduce((acc, meal) => acc + meal.fat, 0)}g
          </p>
        )}
      </div>

      <div className="meal-section">
        <h3>Selected Meals</h3>
        <div className="meal-list">
          {isLoggedIn && selectedMeals.length > 0 ? (
            selectedMeals.map((meal) => (
              <div key={meal._id} className="meal-item">
                <img
                  src={meal.imageUrl || "path/to/placeholder-image.jpg"}
                  alt={meal.name}
                  className="meal-image"
                  onClick={() => navigate(`/meal/${meal._id}`)}
                />
                {/* Meal Name click to navigate to Meal Details */}
                <p className="meal-name" onClick={() => navigate(`/mealdetails/${meal._id}`)}>
                  {meal.name}
                </p>
                <button onClick={() => handleRemoveMeal(meal)}>Remove</button>
              </div>
            ))
          ) : (
            <p>No meals selected yet. Choose from below.</p>
          )}
        </div>
      </div>

      <div className="meal-section">
        <h3>Choose Your Meals</h3>
        <div className="meal-list">
          {filteredMeals.length > 0 ? (
            filteredMeals.map((meal) => (
              <div key={meal._id} className="meal-item">
                <img
                  src={meal.imageUrl || "path/to/placeholder-image.jpg"}
                  alt={meal.name}
                  className="meal-image"
                  onClick={() => navigate(`/meal/${meal._id}`, { state: { meal } })} // Corrected this line
                />
                <p className="meal-name" onClick={() => navigate(`/meal/${meal._id}`, { state: { meal } })}> {/* Corrected this line too */}
                  {meal.name}
                </p>
                {isLoggedIn ? (
                  <button onClick={() => handleChooseMeal(meal)}>Choose</button>
                ) : (
                  <button className="disabled-btn" onClick={() => navigate("/login")}>
                    Login to Choose
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No meals match your filters.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Menu;
