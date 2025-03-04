import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/mealdetails.css";

const MealDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const meal = location.state?.meal;

  if (!meal) {
    return <p>Meal not found.</p>;
  }

  return (
    <div className="meal-details">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2>{meal.name}</h2>
      <img src={meal.image} alt={meal.name} className="meal-details-image" />

      <h3>Ingredients</h3>
      <ul>
        {meal.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.amount} {ingredient.name}
          </li>
        ))}
      </ul>

      <h3>Instructions</h3>
      <ol>
        {meal.instructions.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default MealDetails;
