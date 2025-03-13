import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/dashboard.css";

// Dashboard component
const Dashboard = () => {
  // Initialize Active Rendered states
  const [activeSection, setActiveSection] = useState("personal-details");

  // Initialize password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Initialize user details state
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    activitylevel: "",
    goal: "",
  });

  // Initialize macro states for Requirements and Setting current intake
  const [calorieRequirement, setCalorieRequirement] = useState(0);
  const [proteinRequirement, setProteinRequirement] = useState(0);
  const [carbRequirement, setCarbRequirement] = useState(0);
  const [fatRequirement, setFatRequirement] = useState(0);

  const [currentCalories, setCurrentCalories] = useState(0);
  const [currentProtein, setCurrentProtein] = useState(0);
  const [currentCarbs, setCurrentCarbs] = useState(0);
  const [currentFats, setCurrentFats] = useState(0);

  // Initialize selected meals state
  const [selectedMeals, setSelectedMeals] = useState([]);
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken"); // Get token from localStorage

      // Redirect to login if no token is found
      if (!token) {
        console.log("No token found, redirecting to login...");
        navigate("/login");
        return;
      }

      // Decode token to get user ID
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      // Fetch user data from the backend
      try {
        const response = await axios.get(`${import.meta.env.VITE_AUTH_API_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.data; // Store the fetched user data
        console.log("Fetched userData:", userData);

        // Set user details from the fetched data
        setUserDetails({
          name: userData.name || "N/A",
          email: userData.email || "N/A",
          age: userData.macroTracker?.age || "N/A",
          gender: userData.macroTracker?.gender || "N/A",
          activitylevel: userData.macroTracker?.activity || "N/A",
          goal: userData.macroTracker?.goal || "N/A",
        });

        // Set macro requirements from the fetched data
        if (userData.macroTracker) {
          setCalorieRequirement(userData.macroTracker.calories || 0);
          setProteinRequirement(userData.macroTracker.protein || 0);
          setCarbRequirement(userData.macroTracker.carbs || 0);
          setFatRequirement(userData.macroTracker.fat || 0);
        }

        // Set selected meals from the fetched data
        setSelectedMeals(Array.isArray(userData.selectedMealPlan) ? userData.selectedMealPlan : []);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData(); // Call the function to fetch user data
  }, []);

  // Update current intake when selected meals change
  useEffect(() => {
    setCurrentCalories(selectedMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0));
    setCurrentProtein(selectedMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0));
    setCurrentCarbs(selectedMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0));
    setCurrentFats(selectedMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0));
  }, [selectedMeals]);

  // Remove a meal from the selected meals
  const removeMeal = async (mealId) => {
    const token = localStorage.getItem("authToken");
    if (!token) { // Redirect to login if no token is found
      console.log("No token found, user not authenticated.");
      return;
    }

    // Decode token to get user ID
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      // Send a DELETE request to remove the meal
      await axios.delete(
        `${import.meta.env.VITE_AUTH_API_URL}/user/${userId}/meal-plan/${mealId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the selected meals state
      const updatedMeals = selectedMeals.filter((meal) => meal._id !== mealId);
      setSelectedMeals(updatedMeals);

      // Update localStorage with the updated meals
      localStorage.setItem("chosenMeals", JSON.stringify(updatedMeals));
    } catch (err) {
      console.error("Error removing meal:", err);
    }
  };

  // Update user details in the backend
  const handleUpdateUserDetails = async (field, value) => {
    const token = localStorage.getItem("authToken");
    if (!token) { // Redirect to login if no token is found
      console.log("No token found, user not authenticated.");
      return;
    }

    // Decode token to get user ID
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      // Send a PUT request to update the user details
      await axios.put(`${import.meta.env.VITE_AUTH_API_URL}/user/${userId}`, { [field]: value }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the user details state
      const response = await axios.get(`${import.meta.env.VITE_AUTH_API_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Show success message if the update was successful
      if (response.data.success) {
        // Update the user details state
        setUserDetails((prevUserDetails) => ({
          ...prevUserDetails,
          [field]: value,
        }));
        alert("Details updated successfully!");
      }
    } catch (err) {
      console.error("Error updating user details:", err);
      alert("An error occurred while updating the details.");
    }
  };

  // Change user password
  const handleChangePassword = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found, user not authenticated.");
      return;
    }

    // Validate password fields
    if (!currentPassword.trim() || !newPassword.trim()) {
      alert("Both fields are required.");
      return;
    }

    // Check if new password is different from the current password
    if (currentPassword === newPassword) {
      alert("New password must be different from the current password.");
      return;
    }

    // Check new password length
    if (newPassword.length < 8) { // Check password length
      alert("New password must be at least 8 characters long.");
      return;
    }

    // Decode token to get user ID
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      // Send a PUT request to change the password
      const response = await axios.put(
        `${import.meta.env.VITE_AUTH_API_URL}/user/${userId}`,
        { password: currentPassword, newPassword: newPassword }, // Sending both currentPassword and newPassword
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Show success message if the password was changed successfully
      if (response.data.success) {
        alert("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        alert("Incorrect current password.");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      alert("An error occurred while changing the password.");
    }
  };

  // Handle logout button
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the token from localStorage
    localStorage.removeItem("macroTracker"); // Remove the macroTracker from localStorage
    navigate("/login");
  };

  // Render the dashboard content
  return (
    <div className="dashboard-page">
      {/* Dashboard Banner */}
      <div className="dashboard-banner">Your Dashboard</div>

      <p>Manage your personal details, track your calories, and update your meals.</p>

      <div className="dashboard-wrapper">
        <div className="dashboard-container">

          {/* Sidebar */}
          <div className="sidebar">
            <button onClick={() =>
              setActiveSection("personal-details")}>Personal Details
            </button>

            <button onClick={() =>
              setActiveSection("calorie-tracker")}>Calorie Tracker
            </button>

            <button onClick={() =>
              setActiveSection("current-meals")}>Current Meals
            </button>

            <button onClick={() =>
              setActiveSection("change-password")}>Change Password
            </button>

            <button onClick=
              {handleLogout} className="logout-btn">Logout
            </button>

          </div>

          {/* Main Content */}
          <div className="main-content">

            {activeSection === "personal-details" ? (
              <div className="content-box">
                <h3>Personal Details</h3>

                <div className="input-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })} />
                  <button
                    onClick={() => handleUpdateUserDetails("name", userDetails.name)}>Save
                  </button>
                </div>

                <div className="input-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} />
                  <button
                    onClick={() => handleUpdateUserDetails("email", userDetails.email)}>Save
                  </button>
                </div>

                <div className="personal-details">
                  <div className="info-row">
                    <label>Age:</label>
                    <span>28</span>
                  </div>
                  <div className="info-row">
                    <label>Gender:</label>
                    <span>Female</span>
                  </div>
                  <div className="info-row">
                    <label>Activity Level:</label>
                    <span>Moderately active (moderate exercise 3-5 days/week)</span>
                  </div>
                  <div className="info-row">
                    <label>Goal:</label>
                    <span>Maintain Weight</span>
                  </div>
                </div>
              </div>

              // Display Calorie Tracker section
            ) : activeSection === "calorie-tracker" ? (
              <div className="content-box">

                <h3>Calorie Tracker</h3>

                {/* Progress Bars */}
                <div className="progress-container">
                  
                  <div className="progress-label">
                    <span>Calories</span>
                    <span>{currentCalories} kcal / {calorieRequirement} kcal</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill calories-fill"
                      style={{ width: `${(currentCalories / calorieRequirement) * 100}%` }}
                    ></div>
                  </div>

                  <div className="progress-label">
                    <span>Protein</span>
                    <span>{currentProtein}g / {proteinRequirement}g</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill protein-fill"
                      style={{ width: `${(currentProtein / proteinRequirement) * 100}%` }}
                    ></div>
                  </div>

                  <div className="progress-label">
                    <span>Carbs</span>
                    <span>{currentCarbs}g / {carbRequirement}g</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill carbs-fill"
                      style={{ width: `${(currentCarbs / carbRequirement) * 100}%` }}
                    ></div>
                  </div>

                  <div className="progress-label">
                    <span>Fats</span>
                    <span>{currentFats}g / {fatRequirement}g</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill fats-fill"
                      style={{ width: `${(currentFats / fatRequirement) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Requirement Grid */}
                <h4>Your Required Calories</h4>
                <div className="calorie-tracker-grid">
                  <div>
                    <label>Calories</label>
                    <p>{calorieRequirement} kcal</p>
                  </div>

                  <div>
                    <label>Protein</label>
                    <p>{proteinRequirement} g</p>
                  </div>

                  <div>
                    <label>Fat</label>
                    <p>{fatRequirement} g</p>
                  </div>

                  <div>
                    <label>Carbs</label>
                    <p>{carbRequirement} g</p>
                  </div>
                </div>

                {/* Selected Meal Calories Grid */}
                <h4>Your Calorie Intake</h4>
                <div className="calorie-tracker-grid">
                  <div>
                    <label>Calories</label>
                    <p>{currentCalories} kcal</p>
                  </div>

                  <div>
                    <label>Protein</label>
                    <p>{currentProtein} g</p>
                  </div>

                  <div>
                    <label>Fat</label>
                    <p>{currentFats} g</p>
                  </div>

                  <div>
                    <label>Carbs</label>
                    <p>{currentCarbs} g</p>
                  </div>
                </div>
              </div>


              // Display Current Meals section
            ) : activeSection === "current-meals" ? (
              <div className="content-box">
                <h3>Current Meals</h3>

                {selectedMeals.length === 0 ? (
                  <p>No meals selected yet.</p>
                ) : (
                  <div className="current-meals-container">
                    {selectedMeals.map((meal) => (
                      <div key={meal._id} className="meal-card">
                        {/* Meal Image */}
                        <img
                          src={`${import.meta.env.VITE_AUTH_API_URL}${meal.mealImage || "/uploads/placeholder-image.jpg"}`}
                          alt={meal.name}
                          crossOrigin="anonymous"
                        />

                        {/* Meal Info */}
                        <div className="dashboard-meal-info">
                          <p className="meal-name" onClick={() => navigate(`/meal/${meal._id}`)}>
                            {meal.name}
                          </p>
                          <p className="meal-macros">
                            {meal.calories} KCAL P {meal.protein}G C {meal.carbs}G F {meal.fat}G
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button className="remove-meal" onClick={() => removeMeal(meal._id)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Meal button */}
                <button className="add-meal-btn"
                  onClick={() => navigate("/menu")}>Add Meal
                </button>
              </div>

              // Display Change Password section
            ) : activeSection === "change-password" ? (
              <div className="content-box">
                <h3>Change Password</h3>
                <div className="password-change-container">

                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <button className="save-password-btn"
                  onClick={handleChangePassword}>Save
                </button>

              </div>
            ) : null} {/* End of activeSection conditional rendering */}
          </div>
        </div>
      </div >
    </div>
  );
};

export default Dashboard;
