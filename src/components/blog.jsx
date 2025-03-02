import React from "react";
import "../styles/blog.css";

const Blog = () => {
  const blogPosts = [
    { id: 1, image: "/assets/blog1.jpg", link: "/blog/1" },
    { id: 2, image: "/assets/blog2.jpg", link: "/blog/2" },
    { id: 3, image: "/assets/blog3.jpg", link: "/blog/3" },
    { id: 4, image: "/assets/blog4.jpg", link: "/blog/4" },
    { id: 5, image: "/assets/blog5.jpg", link: "/blog/5" },
    { id: 6, image: "/assets/blog6.jpg", link: "/blog/6" },
  ];

  return (
    <div className="blog-page">
      <div className="blog-banner">BANNER</div>
      <div className="blog-container">
        <div className="blog-filter">
          <h3>Filter by Type</h3>
          <ul>
            {["All", "Nutrition", "Fitness", "Wellness"].map((category) => (
              <li key={category}>{category}</li> /* No sorting logic, backend handles it */
            ))}
          </ul>
        </div>
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <a key={post.id} href={post.link} className="blog-card">
              <img src={post.image} alt="Blog Post" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
