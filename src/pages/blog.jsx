import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/blog.css";

const Blog = () => {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Fetch blogs from the backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:8008/blog");
        const data = await response.json();
        setBlogs(data); // Set the fetched blog data
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
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
          {['Nutrition', 'Meal Prep', 'Fitness', 'Healthy Eating', 'Weight-loss', 'Gluten-free'].map(tag => (
            <label key={tag}>
              <input type="checkbox" value={tag} onChange={handleFilterChange} /> {tag.replace('-', ' ')}
            </label>
          ))}
        </div>
      </div>

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
