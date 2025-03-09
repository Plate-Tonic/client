import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/blog.css";

const Blog = () => {
  // Hook to navigate programmatically
  const navigate = useNavigate();

  // State to store selected filters for blog tags
  const [selectedFilters, setSelectedFilters] = useState([]);

  // State to store the list of blogs fetched from backend
  const [blogs, setBlogs] = useState([]);

  // State to track if the user is an admin
  const [isAdmin, setIsAdmin] = useState(false);

  // Effect to fetch blogs and check admin status when component mounts
  useEffect(() => {

    // Function to fetch blog posts from the backend server
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_AUTH_API_URL}/blog`);
        const data = await response.json();
        setBlogs(data); // Store the fetched blogs in state
      } catch (err) {
        console.error("Error fetching blogs:", err); // Log any errors (NEED MORE SPECIFIC ERROR HANDLING)
      }
    };

    fetchBlogs(); // Call the function to fetch blogs

    // Retrieve auth token from local storage
    const token = localStorage.getItem("authToken");

    if (token) {
      // Decode the token to check if user is an admin
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
      setIsAdmin(decodedToken.isAdmin);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // Handle changes to the filter checkboxes
  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prevFilters) =>
      // Add or remove filter based on checkbox status
      checked ? [...prevFilters, value] : prevFilters.filter((f) => f !== value)
    );
  };

  // Filter blogs based on selected tags
  const filteredBlogs = selectedFilters.length > 0
    ? blogs.filter(blog =>
      selectedFilters.some(filter =>
        blog.tags && blog.tags.includes(filter) // Ensure blog has tags before checking
      )
    )
    : blogs; // If no filters, show all blogs

  return (
    <div className="blog-page">
      {/* Blog page banner */}
      <div className="blog-banner">Blog & Articles</div>

      {/* Filter section for blog tags */}
      <div className="filter-section">
        <h3>Filter by Tags</h3>
        <div className="filter-options">
          {[

            'Nutrition',
            'Meal Prep',
            'Fitness',
            'Healthy Eating',
            'Weight Management',
            'Gluten-free'

          ].map(tag => (
            <label key={tag}>
              <input
                type="checkbox"
                value={tag}
                onChange={handleFilterChange} />{tag.replace('-', ' ')}
            </label>
          ))}
        </div>
      </div>

      {/* Button to add a new blog; visible only to admins */}
      {isAdmin && (
        <div className="new-blog-button">
          <button
            onClick={() => navigate("/addnewblog")}>+ Add New Blog
          </button>
        </div>
      )}

      {/* Section displaying the list of blogs */}
      <div className="blog-section">
        <h3>Latest Posts</h3>

        <div className="blog-list">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div key={blog._id} className="blog-item">
                <h4>{blog.title}</h4>
                <p>
                  Tags: {blog.tags.join(", ")}
                </p>
                <button
                  onClick={() => navigate(`/blog/${blog._id}`)}>Read More
                </button>
              </div>
            ))

          ) : (
            <p>No blogs match your filters.</p> // Message if no blogs match filters
          )}

        </div>
      </div>
    </div>
  );
};

export default Blog;
