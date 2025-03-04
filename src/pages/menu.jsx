import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/menu.css";

const defaultMeals = [
  { id: 1, name: "Egg & Cheese Wrap", image: "/images/egg-wrap.jpg", category: ["vegetarian"] },
  { id: 2, name: "Grilled Chicken Salad", image: "/images/chicken-salad.jpg", category: ["high-protein"] },
  { id: 3, name: "Vegan Buddha Bowl", image: "/images/vegan-bowl.jpg", category: ["vegan", "gluten-free"] },
  { id: 4, name: "Salmon with Asparagus", image: "/images/salmon.jpg", category: ["pescatarian", "high-protein"] },
  { id: 5, name: "Tofu Stir Fry", image: "/images/tofu.jpg", category: ["vegan"] },
  { id: 6, name: "Quinoa & Avocado Bowl", image: "/images/quinoa-bowl.jpg", category: ["vegetarian", "gluten-free"] },
  { id: 7, name: "Beef Stir Fry", image: "/images/beef-stirfry.jpg", category: ["high-protein"] },
];

const Menu = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [chosenMeals, setChosenMeals] = useState([]);
  const [recommendedMeals, setRecommendedMeals] = useState([]);
  const [tdeeData, setTdeeData] = useState({ tdee: 2000, protein: 150, carbs: 250, fats: 50 });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);

    const storedMeals = JSON.parse(localStorage.getItem("meals")) || defaultMeals;
    setMeals(storedMeals);
    setFilteredMeals(storedMeals);

    const storedChosenMeals = JSON.parse(localStorage.getItem("chosenMeals")) || [];
    setChosenMeals(storedChosenMeals);

    const storedTDEE = JSON.parse(localStorage.getItem("tdee"));
    if (storedTDEE) {
      setTdeeData(storedTDEE);
    }

    // 🔹 Set Recommended Meals Based on Login Status
    if (!token) {
      const shuffledMeals = [...defaultMeals].sort(() => 0.5 - Math.random());
      setRecommendedMeals(shuffledMeals.slice(0, 5)); // Non-user gets 5 random meals
    } else {
      setRecommendedMeals(storedChosenMeals); // User sees their chosen meals
    }
  }, []);

  useEffect(() => {
    if (selectedFilters.length > 0) {
      setFilteredMeals(
        meals.filter((meal) =>
          selectedFilters.every((filter) => meal.category.includes(filter))
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

  const handleChooseMeal = (meal) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!chosenMeals.find((m) => m.id === meal.id)) {
      const updatedMeals = [...chosenMeals, meal];
      setChosenMeals(updatedMeals);
      localStorage.setItem("chosenMeals", JSON.stringify(updatedMeals));
      setRecommendedMeals(updatedMeals);
    }
  };

  const handleRemoveMeal = (meal) => {
    if (!isLoggedIn) return;

    const updatedMeals = chosenMeals.filter((m) => m.id !== meal.id);
    setChosenMeals(updatedMeals);
    localStorage.setItem("chosenMeals", JSON.stringify(updatedMeals));
    setRecommendedMeals(updatedMeals);
  };

  return (
    <div className="menu-page">
      <div className="menu-banner">Meal Selection</div>

      <div className="calorie-tracker">
        Calories: {tdeeData.tdee} kcal | Protein: {tdeeData.protein}g | Carbs: {tdeeData.carbs}g | Fats: {tdeeData.fats}g
      </div>

      {/* FILTER SECTION */}
      <div className="filter-section">
        <h3>Filter by Preferences</h3>
        <div className="filter-options">
          {["vegetarian", "vegan", "gluten-free", "high-protein", "pescatarian"].map((filter) => (
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
              <div key={meal.id} className="meal-item">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="meal-image"
                  onClick={() => navigate(`/meal/${meal.id}`, { state: { meal } })}
                />
                <p className="meal-name" onClick={() => navigate(`/meal/${meal.id}`, { state: { meal } })}>
                  {meal.name}
                </p>
                <button onClick={() => handleRemoveMeal(meal)}>Remove</button>
              </div>
            ))
          ) : !isLoggedIn ? (
            recommendedMeals.map((meal) => (
              <div key={meal.id} className="meal-item">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="meal-image"
                  onClick={() => navigate(`/meal/${meal.id}`, { state: { meal } })}
                />
                <p className="meal-name" onClick={() => navigate(`/meal/${meal.id}`, { state: { meal } })}>
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
              <div key={meal.id} className="meal-item">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="meal-image"
                  onClick={() => navigate(`/meal/${meal.id}`, { state: { meal } })}
                />
                <p className="meal-name" onClick={() => navigate(`/meal/${meal.id}`, { state: { meal } })}>
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
