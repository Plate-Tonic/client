import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "../styles/blogdetails.css";

const BlogDetail = () => {
  const { id } = useParams(); // Getting the blog ID from the URL
  const navigate = useNavigate(); // Navigation hook for redirecting to other pages

  // State variables for storing the blog post and admin status
  const [blog, setBlog] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // State variable to show/hide the confirmation popup
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch the blog post details from the backend
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_AUTH_API_URL}/blog/${id}`);
        const data = await response.json();
        setBlog(data.data); // Store the fetched blog post
      } catch (err) {
        console.error("Error fetching blog details:", err); // Log any errors
      }
    };

    fetchBlog(); // Call the function to fetch blog post details

    // Check if the user is an admin
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.isAdmin);
    }

  }, [id]); // Refetch when the `id` changes

  // Delete the blog post
  const handleRemoveBlog = async () => {
    try {
      // Send a DELETE request to the backend to remove the blog post
      const token = localStorage.getItem("authToken");
      await axios.delete(`${import.meta.env.VITE_AUTH_API_URL}/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Blog post deleted successfully!"); // Show success message
      navigate("/blog"); // Redirect to blog page after deleting
    } catch (err) {
      console.error("Error deleting blog post:", err);
      alert("Failed to delete blog post. Please try again.");
    }
  };

  // Show loading message while the data is being fetched
  if (!blog) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {/* Blog Detail Banner */}
      <div className="blog-detail-banner">
        Blog Detail
      </div>

      {/* Blog Detail Content */}
      <div className="blog-detail-container">

        <h2 className="blog-detail-title">
          {blog.title}
        </h2>

        <p>
          Author: {blog.author}
        </p>

        <p className="blog-detail-tags">
          Tags: {blog.tags.join(", ")}
        </p>

        <div className="blog-content">
          {blog.content.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        {/* Remove Blog Button (Only for Admins) */}
        {isAdmin && (
          <>
            <button className="remove-blog-btn"
              onClick={() => setShowConfirm(true)}> Remove Blog Post
            </button>

            {/* Confirmation Popup */}
            {showConfirm && (
              <div className="confirm-popup">

                <p>
                  Are you sure you want to remove this blog post?
                </p>

                <button className="confirm-remove-btn"
                  onClick={handleRemoveBlog}> Confirm Remove
                </button>

                <button className="cancel-btn"
                  onClick={() => setShowConfirm(false)}> Cancel
                </button>

              </div>
            )}
          </>
        )}

        {/* Back Button */}
        <button className="back-button"
          onClick={() => navigate("/blog")}> Back to Blogs
        </button>

      </div>
    </div>
  );
};

export default BlogDetail;
