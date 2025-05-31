import React, { useState, useEffect } from 'react';
import '../components_styling/Home.css';

const Blog = ({ refresh }) => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogPopup, setBlogPopup] = useState(null);
  const blogsPerPage = 8;

  useEffect(() => {
    fetch(`http://localhost:8080/auth/Home`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched blog data:", data);
        setBlogs(data);
        setCurrentPage(1); // Reset to first page on refresh/fetch
      })
      .catch(error => {
        console.error('Error fetching blogs:', error);
      });
  }, [refresh]);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h2>All Blogs</h2>
      </div>

      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <>
          <div className="blog-grid">
            {currentBlogs.map((blog, index) => (
              // Use combined key to ensure uniqueness even if id is not unique
              <div className="blog-card" key={`${blog.id}-${index}`}>
                <div className="blog-title-row">
                  <h3>{blog.title}</h3>
                </div>
                <h5>{blog.subtitle}</h5>
                <p>{blog.content?.slice(0, 100)}...</p>
                <button onClick={() => setBlogPopup(blog)}>View</button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {blogPopup && (
        <div className="blog-popup-overlay" onClick={() => setBlogPopup(null)}>
          <div className="blog-popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>{blogPopup.title}</h2>
            <h4>{blogPopup.subtitle}</h4>
            <p>{blogPopup.content}</p>
            <button onClick={() => setBlogPopup(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
