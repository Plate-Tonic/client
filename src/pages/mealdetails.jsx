import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/mealdetails.css"; // Ensure this is imported

const MealDetail = () => {

  // Navigation hook for redirecting other pages
  const navigate = useNavigate();

  // Get the meal ID from the URL
  const { mealId } = useParams();

  // State variables for storing meal details and admin status
  const [meal, setMeal] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // State variable for showing the confirmation popup
  const [showConfirm, setShowConfirm] = useState(false);


  // Fetch the meal details from the backend GET request
  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_AUTH_API_URL}/meal-plan/${mealId}`);
        setMeal(response.data);
      } catch (err) {
        console.error("Error fetching meal details:", err);
      }
    };

    fetchMealDetails(); // Call the function to fetch meal details

    // Check if user is an admin
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
      setIsAdmin(decodedToken.isAdmin);
    }

  }, [mealId]); // Refetch when the `mealId` changes

  // Function to remove the meal from the database DELETE request
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

  if (!meal) { // Show loading message while the data is being fetched

    return <div>Loading...</div>; // Show loading message while the data is being fetched
  }

  return (
    <div>
      {/* Meal Selection Banner */}
      <div className="meal-detail-banner">Meal Selection</div>

      {/* Meal Details */}
      <div className="meal-detail-page">
        <h2>{meal.name}</h2>

        {/* Image Section */}
        <img
          src={`${import.meta.env.VITE_AUTH_API_URL}${meal.mealImage || "/uploads/placeholder-image.jpg"}`}
          alt={meal.name}
          className="meal-image"
          crossOrigin="anonymous"
        />

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
            <span>
              <strong>Protein:</strong> {meal.protein}g
            </span>
            <span>
              <strong>Carbs:</strong> {meal.carbs}g
            </span>
            <span>
              <strong>Fats:</strong> {meal.fat}g
            </span>
          </div>
        </div>

        {/* Show Remove Button if Admin */}
        {isAdmin && (
          <>
            <button className="remove-meal-btn" onClick={() => setShowConfirm(true)}>Remove Meal</button>

            {showConfirm && (
              <div className="confirm-popup">
                <p>Are you sure you want to remove this meal?</p>

                <button className="confirm-remove-btn"
                  onClick={handleRemoveMeal}>Confirm Remove
                </button>

                <button className="cancel-btn"
                  onClick={() => setShowConfirm(false)}>Cancel
                </button>
              </div>
            )}
          </>
        )}

        <button className="back-btn"
          onClick={() => navigate("/menu")}>Back to Menu
        </button>
      </div>
    </div>
  );
};

export default MealDetail;
