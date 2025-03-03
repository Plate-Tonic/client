import React, { useState } from "react";
import "../styles/blog.css";

const Blog = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prevFilters) =>
      checked ? [...prevFilters, value] : prevFilters.filter((f) => f !== value)
    );
  };

  const placeholderBlogs = [
    { title: "The Benefits of Meal Prepping", tags: ["nutrition", "meal-prep"] },
    { title: "How to Balance Macros Effectively", tags: ["nutrition", "fitness"] },
    { title: "5 Quick & Healthy Breakfast Ideas", tags: ["healthy-eating", "meal-prep"] },
    { title: "Understanding Caloric Deficit", tags: ["weight-loss", "nutrition"] },
    { title: "Top Protein Sources for Muscle Growth", tags: ["fitness", "high-protein"] },
    { title: "Gluten-Free Meal Planning", tags: ["gluten-free", "healthy-eating"] },
  ];

  return (
    <div className="blog-page">
      <div className="blog-banner">Blog & Articles</div>
      <div className="filter-section">
        <h3>Filter by Tags</h3>
        <div className="filter-options">
          <label>
            <input type="checkbox" value="nutrition" onChange={handleFilterChange} /> Nutrition
          </label>
          <label>
            <input type="checkbox" value="meal-prep" onChange={handleFilterChange} /> Meal Prep
          </label>
          <label>
            <input type="checkbox" value="fitness" onChange={handleFilterChange} /> Fitness
          </label>
          <label>
            <input type="checkbox" value="healthy-eating" onChange={handleFilterChange} /> Healthy Eating
          </label>
          <label>
            <input type="checkbox" value="weight-loss" onChange={handleFilterChange} /> Weight Loss
          </label>
          <label>
            <input type="checkbox" value="gluten-free" onChange={handleFilterChange} /> Gluten-Free
          </label>
        </div>
      </div>

      <div className="blog-section">
        <h3>Latest Posts</h3>
        <div className="blog-list">
          {placeholderBlogs.map((blog, index) => (
            <div key={index} className="blog-item">
              <h4>{blog.title}</h4>
              <p>Tags: {blog.tags.join(", ")}</p>
              <button>Read More</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
