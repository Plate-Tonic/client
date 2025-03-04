import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/blog.css";

const Blog = () => {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [blogs, setBlogs] = useState([
    { id: 1, title: "The Benefits of Meal Prepping", tags: ["nutrition", "meal-prep"] },
    { id: 2, title: "How to Balance Macros Effectively", tags: ["nutrition", "fitness"] },
    { id: 3, title: "5 Quick & Healthy Breakfast Ideas", tags: ["healthy-eating", "meal-prep"] },
    { id: 4, title: "Understanding Caloric Deficit", tags: ["weight-loss", "nutrition"] },
    { id: 5, title: "Top Protein Sources for Muscle Growth", tags: ["fitness", "high-protein"] },
    { id: 6, title: "Gluten-Free Meal Planning", tags: ["gluten-free", "healthy-eating"] },
  ]);

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prevFilters) =>
      checked ? [...prevFilters, value] : prevFilters.filter((f) => f !== value)
    );
  };

  const filteredBlogs = selectedFilters.length > 0
    ? blogs.filter(blog => selectedFilters.some(filter => blog.tags.includes(filter)))
    : blogs;

  // Placeholder functions for future admin backend integration
  const handleAddBlog = () => {
    console.log("Add blog functionality will be implemented in backend");
  };

  const handleEditBlog = (id) => {
    console.log(`Edit blog ${id} functionality will be implemented in backend`);
  };

  const handleDeleteBlog = (id) => {
    console.log(`Delete blog ${id} functionality will be implemented in backend`);
  };

  return (
    <div className="blog-page">
      <div className="blog-banner">Blog & Articles</div>
      
      <div className="filter-section">
        <h3>Filter by Tags</h3>
        <div className="filter-options">
          {['nutrition', 'meal-prep', 'fitness', 'healthy-eating', 'weight-loss', 'gluten-free'].map(tag => (
            <label key={tag}>
              <input type="checkbox" value={tag} onChange={handleFilterChange} /> {tag.replace('-', ' ')}
            </label>
          ))}
        </div>
      </div>

      <div className="blog-section">
        <h3>Latest Posts</h3>
        <div className="blog-list">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="blog-item">
              <h4>{blog.title}</h4>
              <p>Tags: {blog.tags.join(", ")}</p>
              <button onClick={() => navigate(`/blog/${blog.id}`)}>Read More</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
