import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/addnewmeal.css";

const AddMeal = () => {
    const [mealData, setMealData] = useState({
        name: "",
        description: "",
        imageUrl: "",
        calories: "",
        protein: "",
        fat: "",
        carbs: "",
        preference: []
    });

    const handlePreferenceChange = (e) => {
        const { value, checked } = e.target;
        setMealData((prevState) => {
            if (checked) {
                return { ...prevState, preference: [...prevState.preference, value] };
            } else {
                return { ...prevState, preference: prevState.preference.filter((item) => item !== value) };
            }
        });
    };

    const navigate = useNavigate();

    const handleChange = (e) => {
        setMealData({ ...mealData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Unauthorized. Please log in.");
            navigate("/login");
            return;
        }

        // ✅ Validate Input Before Sending Request
        if (!mealData.name || !mealData.description || !mealData.ingredients || !mealData.preference ||
            !mealData.calories || !mealData.protein || !mealData.fat || !mealData.carbs) {
            alert("Please fill in all fields.");
            return;
        }

        // Convert ingredients to an array (if it's a string)
        const formattedMealData = {
            ...mealData,
            ingredients: mealData.ingredients.split(",").map((item) => item.trim()), // Ensure it's an array
            calories: Number(mealData.calories),
            protein: Number(mealData.protein),
            fat: Number(mealData.fat),
            carbs: Number(mealData.carbs)
        };

        try {
            await axios.post(`${import.meta.env.VITE_AUTH_API_URL}/meal-plan`, formattedMealData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Meal added successfully!");
            navigate("/menu"); // ✅ Redirect to menu
        } catch (err) {
            console.error("Error adding meal:", err);
            alert("Error adding meal. Please check your input.");
        }

    };

    return (
        <div className="add-meal-page">
            <h2>Add New Meal</h2>
            <form className="add-meal-form" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Meal Name" value={mealData.name} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={mealData.description} onChange={handleChange} required />
                <input type="text" name="ingredients" placeholder="Ingredients (comma separated)" value={mealData.ingredients} onChange={handleChange} required />
                <input type="text" name="imageUrl" placeholder="Image URL" value={mealData.imageUrl} onChange={handleChange} />
                <input type="number" name="calories" placeholder="Calories" value={mealData.calories} onChange={handleChange} required />
                <input type="number" name="protein" placeholder="Protein (g)" value={mealData.protein} onChange={handleChange} required />
                <input type="number" name="fat" placeholder="Fat (g)" value={mealData.fat} onChange={handleChange} required />
                <input type="number" name="carbs" placeholder="Carbs (g)" value={mealData.carbs} onChange={handleChange} required />
                <div className="preference-options">
                    <label>
                        <input type="checkbox" value="vegetarian" onChange={handlePreferenceChange} checked={mealData.preference.includes("vegetarian")} />
                        Vegetarian
                    </label>
                    <label>
                        <input type="checkbox" value="vegan" onChange={handlePreferenceChange} checked={mealData.preference.includes("vegan")} />
                        Vegan
                    </label>
                    <label>
                        <input type="checkbox" value="gluten-free" onChange={handlePreferenceChange} checked={mealData.preference.includes("gluten-free")} />
                        Gluten-Free
                    </label>
                    <label>
                        <input type="checkbox" value="nut-free" onChange={handlePreferenceChange} checked={mealData.preference.includes("nut-free")} />
                        Nut-Free
                    </label>
                    <label>
                        <input type="checkbox" value="none" onChange={handlePreferenceChange} checked={mealData.preference.includes("none")} />
                        None
                    </label>
                </div>


                <button type="submit">Submit</button>
                <button className="back-btn" onClick={() => navigate("/menu")}>Cancel</button>
            </form>
        </div>
    );
};

export default AddMeal;
