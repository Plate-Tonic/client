import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("personal-details");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    activitylevel: "",
    goal: "",
  });

  const [calorieRequirement, setCalorieRequirement] = useState(0);
  const [proteinRequirement, setProteinRequirement] = useState(0);
  const [carbRequirement, setCarbRequirement] = useState(0);
  const [fatRequirement, setFatRequirement] = useState(0);

  const [currentCalories, setCurrentCalories] = useState(0);
  const [currentProtein, setCurrentProtein] = useState(0);
  const [currentCarbs, setCurrentCarbs] = useState(0);
  const [currentFats, setCurrentFats] = useState(0);

  const [selectedMeals, setSelectedMeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.log("No token found, redirecting to login...");
        navigate("/login");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      try {
        const response = await axios.get(`http://localhost:8008/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        console.log("Fetched userData:", userData);

        setUserDetails({
          name: userData.name || "N/A",
          email: userData.email || "N/A",
          age: userData.macroTracker?.age || "N/A",
          gender: userData.macroTracker?.gender || "N/A",
          activitylevel: userData.macroTracker?.activity || "N/A",
          goal: userData.macroTracker?.goal || "N/A",
        });

        if (userData.macroTracker) {
          setCalorieRequirement(userData.macroTracker.calories || 0);
          setProteinRequirement(userData.macroTracker.protein || 0);
          setCarbRequirement(userData.macroTracker.carbs || 0);
          setFatRequirement(userData.macroTracker.fat || 0);
        }

        setSelectedMeals(Array.isArray(userData.selectedMealPlan) ? userData.selectedMealPlan : []);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    setCurrentCalories(selectedMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0));
    setCurrentProtein(selectedMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0));
    setCurrentCarbs(selectedMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0));
    setCurrentFats(selectedMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0));
  }, [selectedMeals]);

  const removeMeal = async (mealId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found, user not authenticated.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      await axios.delete(
        `http://localhost:8008/user/${userId}/meal-plan/${mealId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedMeals = selectedMeals.filter((meal) => meal._id !== mealId);
      setSelectedMeals(updatedMeals);

      localStorage.setItem("chosenMeals", JSON.stringify(updatedMeals));
    } catch (err) {
      console.error("Error removing meal:", err);
    }
  };

  const handleUpdateUserDetails = async (field, value) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found, user not authenticated.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      await axios.put(`http://localhost:8008/user/${userId}`, { [field]: value }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const response = await axios.get(`http://localhost:8008/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
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

  const handleChangePassword = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found, user not authenticated.");
      return;
    }

    if (!currentPassword.trim() || !newPassword.trim()) {
      alert("Both fields are required.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      await axios.put(`http://localhost:8008/user/${userId}`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="sidebar">
          <button onClick={() => setActiveSection("personal-details")}>Personal Details</button>
          <button onClick={() => setActiveSection("calorie-tracker")}>Calorie Tracker</button>
          <button onClick={() => setActiveSection("current-meals")}>Current Meals</button>
          <button onClick={() => setActiveSection("change-password")}>Change Password</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>

        <div className="main-content">
          {activeSection === "personal-details" ? (
            <div className="content-box">
              <h3>Personal Details</h3>

              <div className="input-group">
                <p><strong>Name:</strong></p>
                <input
                  type="text"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                />
                <button onClick={() => handleUpdateUserDetails("name", userDetails.name)}>Save</button>
              </div>

              <div className="input-group">
                <p><strong>Email:</strong></p>
                <input
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                />
                <button onClick={() => handleUpdateUserDetails("email", userDetails.email)}>Save</button>
              </div>

              <p><strong>Age:</strong> {userDetails.age}</p>
              <p><strong>Gender:</strong> {userDetails.gender}</p>
              <p><strong>Activity Level:</strong> {userDetails.activitylevel}</p>
              <p><strong>Goal:</strong> {userDetails.goal}</p>
            </div>
          ) : activeSection === "calorie-tracker" ? (
            <div className="content-box">
              <h3>Calorie Tracker</h3>
              <p><strong>Calorie Requirement:</strong> {calorieRequirement} kcal</p>
              <p><strong>Protein Requirement:</strong> {proteinRequirement} g</p>
              <p><strong>Carb Requirement:</strong> {carbRequirement} g</p>
              <p><strong>Fat Requirement:</strong> {fatRequirement} g</p>
              <p><strong>Current Intake:</strong> {currentCalories} kcal</p>
              <p><strong>Current Protein:</strong> {currentProtein} g</p>
              <p><strong>Current Carbs:</strong> {currentCarbs} g</p>
              <p><strong>Current Fats:</strong> {currentFats} g</p>
            </div>
          ) : activeSection === "current-meals" ? (
            <div className="content-box">
              <h3>Current Meals</h3>
              {selectedMeals.length === 0 ? <p>No meals selected yet.</p> : (
                <ul className="current-meals-list">
                  {selectedMeals.map((meal) => (
                    <li key={meal._id}>
                      <p className="meal-name"
                        onClick={() => navigate(`/meal/${meal._id}`)}
                        style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>
                        {meal.name} - {meal.calories} kcal
                      </p>
                      
                      <button className="remove-meal" onClick={() => removeMeal(meal._id)}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}
              <button className="add-meal-btn" onClick={() => navigate("/menu")}>Add Meal</button>
            </div>
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

                <button className="save-password-btn" onClick={handleChangePassword}>Save</button>

              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
