import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/menu.css";

const placeholderMeals = [
  {
    id: 1,
    name: "Egg & Cheese Wrap",
    image: "/images/egg-wrap.jpg",
    category: ["vegetarian"],
    ingredients: [
      { name: "Eggs", amount: "2" },
      { name: "Cheese", amount: "1 slice" },
      { name: "Tortilla", amount: "1" },
      { name: "Butter", amount: "1 tsp" },
    ],
    instructions: [
      "Scramble eggs in a pan.",
      "Melt cheese on top.",
      "Wrap in a tortilla and serve.",
    ],
  },
  {
    id: 2,
    name: "Grilled Chicken Salad",
    image: "/images/chicken-salad.jpg",
    category: ["high-protein"],
    ingredients: [
      { name: "Chicken Breast", amount: "150g" },
      { name: "Lettuce", amount: "1 cup" },
      { name: "Cherry Tomatoes", amount: "6" },
      { name: "Dressing", amount: "2 tbsp" },
    ],
    instructions: [
      "Grill the chicken breast.",
      "Chop lettuce and tomatoes.",
      "Mix with dressing and serve.",
    ],
  },
];

const Menu = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const filteredMeals = selectedFilters.length
    ? placeholderMeals.filter((meal) =>
        selectedFilters.every((filter) => meal.category.includes(filter))
      )
    : placeholderMeals;

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prevFilters) =>
      checked ? [...prevFilters, value] : prevFilters.filter((f) => f !== value)
    );
  };

  return (
    <div className="menu-page">
      <div className="menu-banner">Meal Selection</div>
      <div className="calorie-tracker">
        Calories: 2000 kcal | Protein: 150g | Carbs: 250g | Fats: 50g
      </div>

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

      <div className="meal-section">
        <h3>Choose Your Meals</h3>
        <div className="meal-list">
          {filteredMeals.map((meal) => (
            <div key={meal.id} className="meal-item">
              {/* Clickable Image and Name */}
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
                <button>Choose</button>
              ) : (
                <button className="disabled-btn" onClick={() => navigate("/login")}>
                  Login to Choose
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
