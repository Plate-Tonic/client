import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/addnewblog.css"; // Create a CSS file for styling

const AddNewBlog = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [blogData, setBlogData] = useState({
        title: "",
        author: "",
        content: "",
        tags: [],
    });

    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleTagsChange = (e) => {
        const { value, checked } = e.target;
        setBlogData((prevState) => {
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

    const handleChange = (e) => {
        setBlogData({ ...blogData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("authToken");
            await axios.post(
                `${import.meta.env.VITE_AUTH_API_URL}/blog`,
                {
                    ...blogData,
                    tags: blogData.tags, 
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSuccess("Blog post added successfully!");
            setBlogData({ title: "", author: "", content: "", tags: "" });

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
                    value={blogData.title}
                    onChange={handleChange}
                    required
                />

                <label>Author:</label>
                <input
                    type="text"
                    name="author"
                    value={blogData.author}
                    onChange={handleChange}
                    required
                />

                <label>Content:</label>
                <textarea
                    name="content"
                    value={blogData.content}
                    onChange={handleChange}
                    required
                ></textarea>

                <div className="blog-tags">
                    <label>
                        <input type="checkbox" value="Nutrition" onChange={handleTagsChange} checked={blogData.tags.includes("Nutrition")} />
                        Nutrition
                    </label>
                    <label>
                        <input type="checkbox" value="Meal Prep" onChange={handleTagsChange} checked={blogData.tags.includes("Meal Prep")} />
                        Meal Prep
                    </label>
                    <label>
                        <input type="checkbox" value="Fitness" onChange={handleTagsChange} checked={blogData.tags.includes("Fitness")} />
                        Fitness
                    </label>
                    <label>
                        <input type="checkbox" value="Healthy Eating" onChange={handleTagsChange} checked={blogData.tags.includes("Healthy Eating")} />
                        Healthy Eating
                    </label>
                    <label>
                        <input type="checkbox" value="Weight Management" onChange={handleTagsChange} checked={blogData.tags.includes("Weight Management")} />
                        Weight Management
                    </label>
                    <label>
                        <input type="checkbox" value="Gluten Free" onChange={handleTagsChange} checked={blogData.tags.includes("Gluten Free")} />
                        Gluten Free
                    </label>
                </div>

                <button type="submit">Add Blog</button>
                <button className="back-btn" onClick={() => navigate("/blog")}>
                    Back to Blog
                </button>
            </form>


        </div>
    );
};

export default AddNewBlog;
