import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/blogdetails.css"; 

const BlogDetail = () => {
  const { id } = useParams(); // Getting the blog ID from the URL
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  // Fetch the blog post details from the backend
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:8008/blog/${id}`);
        const data = await response.json();
        setBlog(data); // Store the fetched blog post
      } catch (err) {
        console.error("Error fetching blog details:", err);
      }
    };

    fetchBlog();
  }, [id]); // Refetch when the `id` changes

  if (!blog) {
    return <p>Loading...</p>; // Show loading message while the data is being fetched
  }

  return (
    <div>
      {/* Blog Detail Banner */}
      <div className="blog-detail-banner">
        Blog Detail
      </div>

      {/* Blog Detail Content */}
      <div className="blog-detail-container">
        <h2 className="blog-detail-title">{blog.title}</h2>
        <p className="blog-detail-author">Author: {blog.author}</p>
        <p className="blog-detail-tags">Tags: {blog.tags.join(", ")}</p>
        <div className="blog-detail-content">
          <p>{blog.content}</p>
        </div>
        <button className="back-button" onClick={() => navigate("/blog")}>
          Back to Blogs
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;
