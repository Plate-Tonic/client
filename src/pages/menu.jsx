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
  const [recommendedMeals, setRecommendedMeals] = useState([]);
  const [tdeeData, setTdeeData] = useState({
    tdee: 2000,
    protein: 150,
    carbs: 250,
    fats: 50
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch meals from the backend API
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

    // Fetch stored TDEE data from localStorage (for non-logged-in users)
    const storedTDEE = JSON.parse(localStorage.getItem("calorieTrackerData"));
    console.log("Stored TDEE:", storedTDEE); // Debugging step: Check the stored data

    if (storedTDEE) {
      setTdeeData({
        tdee: storedTDEE.tdee || 0,
        protein: storedTDEE.proteinGrams || 0, // Ensure proteinGrams is mapped correctly
        carbs: storedTDEE.carbsGrams || 0, // Ensure carbsGrams is mapped correctly
        fats: storedTDEE.fatsGrams || 0, // Ensure fatsGrams is mapped correctly
      });
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      console.log("No token found, redirecting to login...");
      navigate("/login");
      return;
    }

    const decodedToken = jwtDecode(token); // Decode the token to get user ID
    const userId = decodedToken.userId;

    // Fetch user data using userId from the decoded token
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

    // Log tdeeData to check if it's being updated correctly
    console.log("TDEE Data in Menu:", tdeeData);
  }, [selectedFilters, meals, tdeeData]);

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prevFilters) =>
      checked ? [...prevFilters, value] : prevFilters.filter((f) => f !== value)
    );
  };

  const handleChooseMeal = (meal) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!chosenMeals.find((m) => m._id === meal._id)) {
      const updatedMeals = [...chosenMeals, meal];
      setChosenMeals(updatedMeals);
      localStorage.setItem("chosenMeals", JSON.stringify(updatedMeals));
      setRecommendedMeals(updatedMeals);
    }
  };

  const handleRemoveMeal = (meal) => {
    if (!isLoggedIn) return;

    const updatedMeals = chosenMeals.filter((m) => m._id !== meal._id);
    setChosenMeals(updatedMeals);
    localStorage.setItem("chosenMeals", JSON.stringify(updatedMeals));
    setRecommendedMeals(updatedMeals);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="menu-page">
      <div className="menu-banner">Meal Selection</div>

      {/* Calorie Tracker */}
      <div className="calorie-tracker">
        {/* Ensure values are updated here */}
        Calories: {tdeeData.tdee} kcal | 
        Protein: {tdeeData.protein}g | 
        Carbs: {tdeeData.carbs}g | 
        Fats: {tdeeData.fats}g
      </div>

      {/* FILTER SECTION */}
      <div className="filter-section">
        <h3>Filter by Preferences</h3>
        <div className="filter-options">
          {["vegetarian", "vegan", "gluten-free", "nut-free", "none"].map((filter) => (
            <label key={filter}>
              <input type="checkbox" value={filter} onChange={handleFilterChange} /> {filter}
            </label>
          ))}
        </div>
      </div>

      {/* RECOMMENDED MEALS */}
      <div className="meal-section">
        <h3>Recommended Meals</h3>
        <div className="meal-list">
          {isLoggedIn && recommendedMeals.length > 0 ? (
            recommendedMeals.map((meal) => (
              <div key={meal._id} className="meal-item">
                <img
                  src={meal.imageUrl || "path/to/placeholder-image.jpg"}  // Default image if empty
                  alt={meal.name}
                  className="meal-image"
                  onClick={() => navigate(`/meal/${meal._id}`, { state: { meal } })}
                />
                <p className="meal-name" onClick={() => navigate(`/meal/${meal._id}`, { state: { meal } })}>
                  {meal.name}
                </p>
                <button onClick={() => handleRemoveMeal(meal)}>Remove</button>
              </div>
            ))
          ) : !isLoggedIn ? (
            recommendedMeals.map((meal) => (
              <div key={meal._id} className="meal-item">
                <img
                  src={meal.imageUrl || "path/to/placeholder-image.jpg"}
                  alt={meal.name}
                  className="meal-image"
                  onClick={() => navigate(`/meal/${meal._id}`, { state: { meal } })}
                />
                <p className="meal-name" onClick={() => navigate(`/meal/${meal._id}`, { state: { meal } })}>
                  {meal.name}
                </p>
                <button className="disabled-btn" onClick={() => navigate("/login")}>
                  Login to Choose
                </button>
              </div>
            ))
          ) : (
            <p>No meals chosen yet. Select meals below.</p>
          )}
        </div>
      </div>

      {/* MEAL SELECTION */}
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
                  onClick={() => navigate(`/meal/${meal._id}`, { state: { meal } })}
                />
                <p className="meal-name" onClick={() => navigate(`/meal/${meal._id}`, { state: { meal } })}>
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
