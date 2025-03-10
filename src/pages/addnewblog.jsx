import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/addnewblog.css";

const AddNewBlog = () => {
    // Initialize navigation and admin states
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    // State for blog form data
    const [blogData, setBlogData] = useState({
        title: "",
        author: "",
        content: "",
        tags: [],
    });

    // State for form submission feedback
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Handle checkbox changes for blog tags (categories)
    const handleTagsChange = (e) => {
        const { value, checked } = e.target;
        setBlogData((prevState) => { // Update the tags array based on checkbox status
            if (checked) {
                return { ...prevState, tags: [...prevState.tags, value] };
            } else {
                return { ...prevState, tags: prevState.tags.filter((item) => item !== value) };
            }
        });
    };

    // Check if the user is an admin
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const decodedToken = jwtDecode(token);
            setIsAdmin(decodedToken.isAdmin);
        }
    }, []);

    // Handle input change for text fields
    const handleChange = (e) => {
        setBlogData({ ...blogData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send blog data to server with authorization token
            const token = localStorage.getItem("authToken");
            await axios.post(

                `http://localhost:8008/blog`, { ...blogData, tags: blogData.tags, },
                { headers: { Authorization: `Bearer ${token}` }, }
            );

            // Show success message and clear form data
            window.alert("Blog post added successfully!");

            setBlogData({
                title: "",
                author: "",
                content: "",
                tags: ""
            });

            // Redirect to blog page after 2 seconds
            setTimeout(() => navigate("/blog"), 2000);
        } catch (err) {
            const message = err.response?.data?.message || "Something went wrong. Please try again.";
            window.alert(`Error: ${message}`);
        }
    };

    // Redirect if user is not an admin
    if (!isAdmin) return <p>Redirecting...</p>;

    // Render blog form
    return (
        <div className="add-blog-page">

            <h2>Add New Blog Post</h2>
            <form className="add-blog-form" onSubmit={handleSubmit}>

                <label htmlFor="title">Title:</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    value={blogData.title}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="author">Author:</label>
                <input
                    id="author"
                    type="text"
                    name="author"
                    value={blogData.author}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="content">Content:</label>
                <textarea
                    id="content"
                    name="content"
                    value={blogData.content}
                    onChange={handleChange}
                    required
                ></textarea>

                {/* Categories Check Box (Multiple) */}
                <div className="blog-tags">

                    <label>
                        <input
                            type="checkbox"
                            value="Nutrition"
                            onChange={handleTagsChange}
                            checked={blogData.tags.includes("Nutrition")} /> Nutrition
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            value="Meal Prep"
                            onChange={handleTagsChange}
                            checked={blogData.tags.includes("Meal Prep")} /> Meal Prep
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            value="Fitness"
                            onChange={handleTagsChange}
                            checked={blogData.tags.includes("Fitness")} /> Fitness
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            value="Healthy Eating"
                            onChange={handleTagsChange}
                            checked={blogData.tags.includes("Healthy Eating")} /> Healthy Eating
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            value="Weight Management"
                            onChange={handleTagsChange}
                            checked={blogData.tags.includes("Weight Management")} /> Weight Management
                    </label>

                    <label>
                        <input
                            type="checkbox"
                            value="Gluten Free"
                            onChange={handleTagsChange}
                            checked={blogData.tags.includes("Gluten Free")} /> Gluten Free
                    </label>

                </div>

                {/* Button to submit form */}
                <button
                    type="submit">Create Blog Post
                </button>


                {/* Button to redirect back to Blog Page */}
                <button
                    className="back-btn"
                    onClick={() => navigate("/blog")}>  Back to Blog
                </button>

            </form>

            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default AddNewBlog;
