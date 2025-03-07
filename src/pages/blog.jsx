import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/blog.css";

const Blog = () => {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch blogs from the backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_AUTH_API_URL}/blog`);
        const data = await response.json();
        setBlogs(data); // Set the fetched blog data
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();


    // Check if user is an admin
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
      setIsAdmin(decodedToken.isAdmin);
    }
  }, []);

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prevFilters) =>
      checked ? [...prevFilters, value] : prevFilters.filter((f) => f !== value)
    );
  };

  const filteredBlogs = selectedFilters.length > 0
    ? blogs.filter(blog =>
      selectedFilters.some(filter => blog.tags && blog.tags.includes(filter)) // Ensure blog has tags before checking
    )
    : blogs;

  return (
    <div className="blog-page">
      <div className="blog-banner">Blog & Articles</div>

      <div className="filter-section">
        <h3>Filter by Tags</h3>
        <div className="filter-options">
          {['Nutrition', 'Meal Prep', 'Fitness', 'Healthy Eating', 'Weight Management', 'Gluten-free'].map(tag => (
            <label key={tag}>
              <input type="checkbox" value={tag} onChange={handleFilterChange} /> {tag.replace('-', ' ')}
            </label>
          ))}
        </div>
      </div>

      {/* Show "Add New Blog" button only for admin users */}
      {isAdmin && (
        <div className="new-blog-button">
          <button onClick={() => navigate("/addnewblog")}>+ Add New Blog</button>
        </div>
      )}

      <div className="blog-section">
        <h3>Latest Posts</h3>

        <div className="blog-list">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div key={blog._id} className="blog-item">
                <h4>{blog.title}</h4>
                <p>Tags: {blog.tags.join(", ")}</p>
                <button onClick={() => navigate(`/blog/${blog._id}`)}>Read More</button>
              </div>
            ))
          ) : (
            <p>No blogs match your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
