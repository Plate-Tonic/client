import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/addnewblog.css"; // Create a CSS file for styling

const AddNewBlog = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        content: "",
        tags: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Check if the user is an admin
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            const decodedToken = jwtDecode(token);
            setIsAdmin(decodedToken.isAdmin);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("authToken");
            await axios.post(
                "http://localhost:8008/blog",
                {
                    ...formData,
                    tags: formData.tags.split(",").map((tag) => tag.trim()), // Convert tags to an array
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSuccess("Blog post added successfully!");
            setFormData({ title: "", author: "", content: "", tags: "" });

            setTimeout(() => navigate("/blog"), 2000); // Redirect after 2 sec
        } catch (err) {
            console.error("Error adding blog:", err);
            setError("Failed to add blog. Ensure all fields are filled.");
        }
    };

    if (!isAdmin) return <p>Redirecting...</p>;

    return (
        <div className="add-blog-page">
            <h2>Add New Blog Post</h2>

            {/* ✅ Added className="add-blog-form" to the form */}
            <form className="add-blog-form" onSubmit={handleSubmit}>
                <label>Title:</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <label>Author:</label>
                <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                />

                <label>Content:</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                ></textarea>

                <label>Tags (comma-separated):</label>
                <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., Nutrition, Meal Prep"
                    required
                />

                <button type="submit">Add Blog</button>
                <button className="back-btn" onClick={() => navigate("/blog")}>
                    Back to Blog
                </button>
            </form>


        </div>
    );
};

export default AddNewBlog;
