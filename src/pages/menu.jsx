import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/menu.css";

const Menu = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]); // Updated variable name
  const [calorieData, setTdeeData] = useState({
    calories: 2000,
    protein: 150,
    fat: 50,
    carbs: 250
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch meals and user data (including login status)
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_AUTH_API_URL}/meal-plan`);
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

    const token = localStorage.getItem("authToken");

    if (!token) {
    const storedMacros = localStorage.getItem("macroTracker");
    console.log("Retrieved TDEE from localStorage:", storedMacros); // Debugging log
    if (storedMacros) {
      setTdeeData(JSON.parse(storedMacros));
    }
    setLoading(false);
    return;
  }
    // if (!token) {
    //   setLoading(false);
    //   setIsLoggedIn(false);
    //   return;
    // }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    setIsAdmin(decodedToken.isAdmin); // checks if user is admin

    
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_AUTH_API_URL}/user/${userId}`, {
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

        setSelectedMeals(userData.selectedMealPlan);
        console.log("User data:", userData);
        console.log("Selected meals:", userData.selectedMealPlan);
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

  // Add meal to selected meals
  const handleSelectMeal = async (meal) => {
    if (!selectedMeals.find((m) => m._id === meal._id)) {
      const updatedMeals = [...selectedMeals, meal];
      setSelectedMeals(updatedMeals);
      localStorage.setItem("selectedMeals", JSON.stringify(updatedMeals));
      setSelectedMeals(updatedMeals);

      const token = localStorage.getItem("authToken");
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        try {
          await axios.post(
            `${import.meta.env.VITE_AUTH_API_URL}/user/${userId}/meal-plan`,
            { selectedMealPlan: meal._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error("Error saving meal to user profile:", err);
        }
      }
    }
  };

  // Remove meal
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
      console.log("User ID:", userId);
      console.log("Meal ID:", meal._id);
      await axios.delete(`${import.meta.env.VITE_AUTH_API_URL}/user/${userId}/meal-plan/${meal._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedMeals = selectedMeals.filter((m) => m._id !== meal._id);
      setSelectedMeals(updatedMeals);
      localStorage.setItem("selectedMeals", JSON.stringify(updatedMeals));

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
        {calorieData ? (
          <p>
            Calories: {calorieData.calories} kcal |
            Protein: {calorieData.protein}g |
            Fat: {calorieData.fat}g |
            Carbs: {calorieData.carbs}g
          </p>
        ) : (
          <button className="macro-btn" onClick={() => navigate("/getstarted")}>
            Calculate Your Macros
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
          {["vegetarian", "vegan", "gluten-free", "nut-free", "none"].map((filter) => (
            <label key={filter}>
              <input type="checkbox" value={filter} onChange={handleFilterChange} /> {filter}
            </label>
          ))}
        </div>
      </div>

      {isAdmin && (
            <div className="new-meal-button">
              <button onClick={() => navigate("/addnewmeal")}>+ Add New Meal</button>
            </div>
          )}

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
                  onClick={() => navigate(`/meal/${meal._id}`, { state: { meal } })}
                />
                <p className="meal-name" onClick={() => navigate(`/meal/${meal._id}`)}>
                  {meal.name}
                </p>
                {isLoggedIn ? (
                  <button onClick={() => handleSelectMeal(meal)}>Choose</button>
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

          {/* {isAdmin && (
            <div className="new-meal-button">
              <button onClick={() => navigate("/addnewmeal")}>+ Add New Meal</button>
            </div>
          )} */}

        </div>
      </div>
    </div>
  );
};

export default Menu;