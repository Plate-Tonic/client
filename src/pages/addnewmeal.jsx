import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/addnewmeal.css";

const AddMeal = () => {
    // State to manage input data for a new meal
    const [mealData, setMealData] = useState({
        name: "",
        description: "",
        mealImage: "",
        ingredients: "",
        calories: "",
        protein: "",
        fat: "",
        carbs: "",
        preference: []

    });

    // State to manage image file
    const [image, setImage] = useState(null);

    // Hook to navigate between routes
    const navigate = useNavigate();

    // Function to handle changes in dietary preferences checkboxes
    const handlePreferenceChange = (e) => {
        const { value, checked } = e.target;
        setMealData((prevState) => {
            if (checked) { // If checkbox is checked, add value to preferences
                return { ...prevState, preference: [...prevState.preference, value] };
            } else { // If checkbox is unchecked, remove value from preferences
                return { ...prevState, preference: prevState.preference.filter((item) => item !== value) };
            }
        });
    };

    // Function to handle changes in text and number inputs
    const handleChange = (e) => {
        // Update the state with new input value
        setMealData({ ...mealData, [e.target.name]: e.target.value });
    };

    // Function to handle changes in image file input
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Retrieve auth token from local storage
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Unauthorized. Please log in.");
            navigate("/login");
            return;
        }

        // Validate input fields

        if (
            !mealData.name ||
            !mealData.description ||
            !mealData.ingredients ||
            !mealData.preference ||
            !mealData.calories ||
            !mealData.protein ||
            !mealData.fat ||
            !mealData.carbs) {

            alert("Please fill in all fields."); // Alert user to fill in all fields
            return;
        }

        const formData = new FormData();
        formData.append("name", mealData.name);
        formData.append("description", mealData.description);
        formData.append("ingredients", mealData.ingredients);
        formData.append("calories", mealData.calories);
        formData.append("protein", mealData.protein);
        formData.append("fat", mealData.fat);
        formData.append("carbs", mealData.carbs);
        formData.append("preference", mealData.preference); // Send array directly
        formData.append("mealImage", image); // Attach image file

        try {
            await axios.post(`${import.meta.env.VITE_AUTH_API_URL}/meal-plan`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
      
            });
            alert("Meal added successfully!");
            navigate("/menu"); // Redirect to menu page
        } catch (err) {
            console.error("Error adding meal:", err);
            alert("Error adding meal. Please check your input.");
        }
    };

    // Render the form for adding a new meal
    return (

        <div className="add-meal-page">
            <h2>Add New Meal</h2>
            <form role="form" className="add-meal-form" onSubmit={handleSubmit}>

                {/* Input fields for meal details */}

                <input
                    type="text"
                    name="name"
                    placeholder="Meal Name"
                    value={mealData.name}
                    onChange={handleChange}
                    required />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={mealData.description}
                    onChange={handleChange}
                    required />

                <input
                    type="text"
                    name="ingredients"
                    placeholder="Ingredients (comma separated)"
                    value={mealData.ingredients}
                    onChange={handleChange}
                    required />

                {/* New File Input for Image Upload */}
                <label htmlFor="imageUpload" className="upload-image"> Upload an Image
                    <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        data-testid="file-upload"
                        onChange={handleImageChange}
                        required
                    />
                </label>

                <input
                    type="number"
                    name="calories"
                    placeholder="Calories"
                    value={mealData.calories}
                    onChange={handleChange}
                    required />

                <input
                    type="number"
                    name="protein"
                    placeholder="Protein (g)"
                    value={mealData.protein}
                    onChange={handleChange}
                    required />

                <input
                    type="number"
                    name="fat"
                    placeholder="Fat (g)"
                    value={mealData.fat}
                    onChange={handleChange}
                    required />

                <input
                    type="number"
                    name="carbs"
                    placeholder="Carbs (g)"
                    value={mealData.carbs}
                    onChange={handleChange}
                    required />

                {/* Checkbox inputs for dietary preferences */}
                <div className="preference-options">

                    <label>
                        <input
                            type="checkbox"
                            value="vegetarian"
                            onChange={handlePreferenceChange}
                            checked={mealData.preference.includes("vegetarian")} /> Vegetarian
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            value="vegan"
                            onChange={handlePreferenceChange}
                            checked={mealData.preference.includes("vegan")} /> Vegan
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            value="gluten-free"
                            onChange={handlePreferenceChange}
                            checked={mealData.preference.includes("gluten-free")} /> Gluten-Free
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            value="nut-free"
                            onChange={handlePreferenceChange}
                            checked={mealData.preference.includes("nut-free")} /> Nut-Free
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            value="none"
                            onChange={handlePreferenceChange}
                            checked={mealData.preference.includes("none")} /> None
                    </label>

                </div>

                {/* Submit and Cancel buttons */}
                <button
                    type="submit"> Submit
                </button>

                <button className="back-btn"
                    onClick={() => navigate("/menu")}> Cancel
                </button>

            </form>
        </div>
    );
};

export default AddMeal;