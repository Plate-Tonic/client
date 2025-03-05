import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/mealdetails.css"; // Ensure this is imported

const MealDetail = () => {
  const { mealId } = useParams(); // Get the meal ID from the URL
  const [meal, setMeal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8008/meal-plan/${mealId}`);
        setMeal(response.data);
      } catch (err) {
        console.error("Error fetching meal details:", err);
      }
    };

    fetchMealDetails();
  }, [mealId]);

  if (!meal) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Custom Meal Selection Banner for Meal Detail Page */}
      <div className="meal-detail-banner">Meal Selection</div>

      {/* Meal Details */}
      <div className="meal-detail-page">
        <h2>{meal.name}</h2>
        <img src={meal.imageUrl || "path/to/placeholder-image.jpg"} alt={meal.name} className="meal-image" />
        <p><strong>Description:</strong> {meal.description}</p>
        <div className="ingredients">
          <strong>Ingredients:</strong>
          <ul>
            {meal.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="meal-info">
          <div className="calories">
            <strong>Calories:</strong> {meal.calories}
          </div>
          <div className="macros">
            <span><strong>Protein:</strong> {meal.protein}g</span>
            <span><strong>Carbs:</strong> {meal.carbs}g</span>
            <span><strong>Fats:</strong> {meal.fat}g</span>
          </div>
        </div>
        <button className="back-btn" onClick={() => navigate("/menu")}>Back to Menu</button>
      </div>
    </div>
  );
};

export default MealDetail;
