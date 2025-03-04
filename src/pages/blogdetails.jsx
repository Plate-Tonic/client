import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/blogdetails.css"; 

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="blog-detail-container">
      <h2 className="blog-detail-title">Blog Post {id}</h2>
      <p className="blog-detail-tags">Tags: Placeholder Tags</p>
      <p className="blog-detail-content">
        ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
      </p>
      <button className="back-button" onClick={() => navigate("/blog")}>Back to Blogs</button>
    </div>
  );
};

export default BlogDetail;
