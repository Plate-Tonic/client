import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/menu.css";

// Menu Components
const Menu = () => {

  // State variables for managing filters, login status, admin status, meals, and selected meals
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [meals, setMeals] = useState([]);

  // State variables for filtered meals, selected meals, and calorie data
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [calorieData, setTdeeData] = useState({
    calories: 2000,
    protein: 150,
    fat: 50,
    carbs: 250
  });

  // State variable for loading status
  const [loading, setLoading] = useState(true);

  // Navigation hook for redirecting to other pages
  const navigate = useNavigate();

  // Fetch meals and user data (including login status) 
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(`http://localhost:8008/meal-plan`);
        const data = await response.json();

        if (data && data.length > 0) { // Check if data is available
          setMeals(data);
          setFilteredMeals(data);
        }
      } catch (err) {
        console.error("Error fetching meals:", err);
      }
    };

    fetchMeals(); // Call the function to fetch meals

    const token = localStorage.getItem("authToken"); // Retrieve auth token from local storage

    // Check if the user is logged in
    if (!token) {
      const storedMacros = localStorage.getItem("macroTracker");

      // If no token is found, check if there are stored macros
      if (storedMacros) {
        setTdeeData(JSON.parse(storedMacros));
      }
      setLoading(false);
      return;
    }

    // Decode the token to get the user ID
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    setIsAdmin(decodedToken.isAdmin); // checks if user is admin

    // Function to fetch user data from the backend GET request
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8008/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = response.data;

        // Set the TDEE and selected meals from the backend
        if (userData.macroTracker) {
          setTdeeData(userData.macroTracker);
          localStorage.setItem("macroTracker", JSON.stringify(userData.macroTracker));
        } else {
          setTdeeData(null); // Set to null if no data is found
        }

        // Set the selected meals from the backend
        setSelectedMeals(userData.selectedMealPlan);
        setLoading(false);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setLoading(false);
      }
    };

    fetchUserData(); // Call the function to fetch user data

  }, [navigate]); // Refetch when the `navigate` function changes

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

  }, [selectedFilters, meals]); // Refetch when the `selectedFilters` or `meals` change

  // Handle changes to the filter checkboxes
  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prevFilters) =>
      checked ? [...prevFilters, value] : prevFilters.filter((f) => f !== value)
    );
  };

  // Add meal to selected meals
  const handleSelectMeal = async (meal) => {
    if (!selectedMeals.find((m) => m._id === meal._id)) { // Check if meal is already selected

      // Add the meal to the selected meals list
      const updatedMeals = [...selectedMeals, meal];
      setSelectedMeals(updatedMeals);
      localStorage.setItem("selectedMeals", JSON.stringify(updatedMeals));
      setSelectedMeals(updatedMeals);

      // Save the selected meal to the user profile
      const token = localStorage.getItem("authToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        // Send a POST request to save the meal to the user profile
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

  // Remove meal from selected meals
  const handleRemoveMeal = async (meal) => {
    if (!isLoggedIn) return;

    // Retrieve the auth token from local storage
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found, user not authenticated.");
      return;
    }

    // Remove the meal from the user profile
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      // Send a DELETE request to remove the meal from the user profile
      await axios.delete(`http://localhost:8008/user/${userId}/meal-plan/${meal._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the meal from the selected meals list
      const updatedMeals = selectedMeals.filter((m) => m._id !== meal._id);
      setSelectedMeals(updatedMeals);
      localStorage.setItem("selectedMeals", JSON.stringify(updatedMeals));

      // Also remove from Dashboard state
      setSelectedMeals(updatedMeals);
    } catch (err) {
      console.error("Error removing meal:", err);
    }
  };

  // Show loading message while the data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the menu page
  return (
    <div className="menu-page">
      <div className="menu-banner">Meal Selection</div>

      <div className="calorie-tracker">
        {calorieData ? (
          <p>
            Calories: {calorieData.calories} kcal |
            Protein: {calorieData.protein}g |
            Fat: {calorieData.fat}g |
            Carbs: {calorieData.carbs}g
          </p>
        ) : (
          <button className="macro-btn"
            onClick={() => navigate("/getstarted")}> Calculate Your Macros
          </button>
        )}

        {isLoggedIn && (
          <p className="selected-macros">
            Selected Meal Calories: {selectedMeals.reduce((acc, meal) => acc + meal.calories, 0)} kcal |
            Protein: {selectedMeals.reduce((acc, meal) => acc + meal.protein, 0)}g |
            Fat: {selectedMeals.reduce((acc, meal) => acc + meal.fat, 0)}g |
            Carbs: {selectedMeals.reduce((acc, meal) => acc + meal.carbs, 0)}g
          </p>
        )}
      </div>

      <div className="filter-section">
        <h3>Filter by Preferences</h3>
        <div className="filter-options">
          {["vegetarian",
            "vegan",
            "gluten-free",
            "nut-free",
            "none"].map((filter) => (
              <label key=
                {filter}>
                <input
                  type="checkbox"
                  value={filter}
                  onChange={handleFilterChange}
                />
                {filter}
              </label>
            ))}
        </div>
      </div>

      {/* Add New Meal Button Admin ONLY */}
      {isAdmin && (
        <div className="new-meal-button">
          <button
            onClick={() => navigate("/addnewmeal")}>+ Add New Meal
          </button>
        </div>
      )}

      {/* Selected Meals Section */}
      <div className="meal-section">
        <h3>Selected Meals</h3>

        {/* Display Selected Meals */}
        <div className="meal-list">
          
          {isLoggedIn && selectedMeals.length > 0 ? ( // Check if user is logged in and meals are selected
            selectedMeals.map((meal) => (
              <div key={meal._id} className="meal-item">

                <img
                  src={meal.mealImage || "path/to/placeholder-image.jpg"}
                  alt={meal.name}
                  className="meal-image"
                  onClick={() => navigate(`/meal/${meal._id}`)}
                />

                {/* Meal Name click to navigate to Meal Details */}
                <p className="meal-name"
                  onClick={() => navigate(`/mealdetails/${meal._id}`)}>{meal.name}
                </p>

                <button
                  onClick={() => handleRemoveMeal(meal)}>Remove
                </button>

              </div>
            ))
          ) : (
            <p>No meals selected yet. Choose from below.</p> // Message if no meals are selected
          )}
        </div>
      </div>

      {/* Meal Selection Section */}
      <div className="meal-section">
        <h3>Choose Your Meals</h3>

        <div className="meal-list">
          {filteredMeals.length > 0 ? (
            filteredMeals.map((meal) => (
              <div key={meal._id} className="meal-item">

                {/* Meal Name & Image click to navigate to Meal Details */}
                <img
                  src={meal.mealImage || "path/to/placeholder-image.jpg"}
                  alt={meal.name}
                  className="meal-image"
                  onClick={() => navigate(`/meal/${meal._id}`, { state: { meal } })} 
                />

                <p className="meal-name"
                  onClick={() => navigate(`/meal/${meal._id}`)}>{meal.name} 
                </p>

                {/* Button for Non-Users to Log in */}
                {isLoggedIn ? (
                  <button
                    onClick={() => handleSelectMeal(meal)}>Choose</button>
                ) : (
                  <button className="disabled-btn"
                    onClick={() => navigate("/login")}>Login to Choose
                  </button>
                )}

              </div>
            ))
          ) : (
            <p>No meals match your filters.</p> // Message if no meals match filters
          )}

        </div>
      </div>
    </div>
  );
};

export default Menu;