import React, { useState } from "react";
import "../styles/menu.css";

const Menu = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prevFilters) =>
      checked ? [...prevFilters, value] : prevFilters.filter((f) => f !== value)
    );
  };

  const placeholderMeals = [
    { name: "Egg & Cheese Wrap" },
    { name: "Grilled Chicken Salad" },
    { name: "Vegan Buddha Bowl" },
    { name: "Salmon with Asparagus" },
    { name: "Tofu Stir Fry" },
    { name: "Quinoa & Avocado Bowl" },
    { name: "Beef Stir Fry" },
  ];

  return (
    <div className="menu-page">
      <div className="menu-banner">Meal Selection</div>
      <div className="calorie-tracker">
        Calories: 2000 kcal | Protein: 150g | Carbs: 250g | Fats: 50g
      </div>

      <div className="filter-section">
        <h3>Filter by Preferences</h3>
        <div className="filter-options">
          <label>
            <input type="checkbox" value="vegetarian" onChange={handleFilterChange} /> Vegetarian
          </label>
          <label>
            <input type="checkbox" value="vegan" onChange={handleFilterChange} /> Vegan
          </label>
          <label>
            <input type="checkbox" value="gluten-free" onChange={handleFilterChange} /> Gluten-Free
          </label>
          <label>
            <input type="checkbox" value="high-protein" onChange={handleFilterChange} /> High-Protein
          </label>
          <label>
            <input type="checkbox" value="pescatarian" onChange={handleFilterChange} /> Pescatarian
          </label>
        </div>
      </div>


      <div className="meal-section">
        <h3>Recommended Meals</h3>
        <div className="meal-list">
          {placeholderMeals.slice(0, 5).map((meal, index) => (
            <div key={index} className="meal-item">
              <p>{meal.name}</p>
              <button>Remove</button>
            </div>
          ))}
        </div>
      </div>

      <div className="meal-section">
        <h3>Choose Your Meals</h3>
        <div className="meal-list">
          {placeholderMeals.map((meal, index) => (
            <div key={index} className="meal-item">
              <p>{meal.name}</p>
              <button>Choose</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
