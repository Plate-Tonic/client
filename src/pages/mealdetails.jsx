import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/mealdetails.css"; // Ensure this is imported

const MealDetail = () => {
  const { mealId } = useParams();
  const [meal, setMeal] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_AUTH_API_URL}/meal-plan/${mealId}`);
        setMeal(response.data);
      } catch (err) {
        console.error("Error fetching meal details:", err);
      }
    };

    fetchMealDetails();

    // Check if user is an admin
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
      setIsAdmin(decodedToken.isAdmin);
    }

  }, [mealId]);

  const handleRemoveMeal = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_AUTH_API_URL}/meal-plan/${mealId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });
      alert("Meal removed successfully.");
      navigate("/menu"); // Redirect to menu after deletion
    } catch (err) {
      console.error("Error removing meal:", err);
      alert("Failed to remove meal.");
    }
  };
  console.log("isAdmin state:", isAdmin);
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

        {/* Show Remove Button if Admin */}
        {isAdmin && (
          <>
            <button className="remove-meal-btn" onClick={() => setShowConfirm(true)}>Remove Meal</button>

            {showConfirm && (
              <div className="confirm-popup">
                <p>Are you sure you want to remove this meal?</p>
                <button className="confirm-remove-btn" onClick={handleRemoveMeal}>Confirm Remove</button>
                <button className="cancel-btn" onClick={() => setShowConfirm(false)}>Cancel</button>
              </div>
            )}
          </>
        )}

        <button className="back-btn" onClick={() => navigate("/menu")}>Back to Menu</button>
      </div>
    </div>
  );
};

export default MealDetail;
