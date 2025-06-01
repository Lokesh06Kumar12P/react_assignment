import React, { useState, useEffect } from 'react';
import '../components_styling/Blog.css';

const Blog = ({ ADD, Id , refresh , setrefresh }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({ title: '', subtitle: '', content: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [blogPopup, setBlogPopup] = useState(null);
  const [feedback, setFeedback] = useState(null); 
  const blogsPerPage = 8;

  useEffect(() => {
    fetch(`https://spring-assig-5.onrender.com/auth/My_Blogs?i=${Id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        return response.json();
      })
      .then(data => setBlogs(data))
      .catch(error => {
        console.error('Error fetching blogs:', error);
      });
  }, [Id,refresh]);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);

  const handleDelete = async (id, title) => {
  try {
    const response = await fetch('https://spring-assig-5.onrender.com/auth/My_Blogs/Delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: Id,
        title: title,
        subtitle: "",
        content: ""
      }),
    });

    if (response.ok) {
      const updatedBlogs = blogs.filter((blog) => blog.id !== id);
      //const newTotalPages = Math.ceil(updatedBlogs.length / blogsPerPage);
      
      // Save immediately to state
      setBlogs(updatedBlogs);

      // Wait for state to update before adjusting page
      setTimeout(() => {
        let adjustedPage = currentPage;

        // If we are on a page that is now empty (after deletion)
        if ((currentPage - 1) * blogsPerPage >= updatedBlogs.length && currentPage > 1) {
          adjustedPage = currentPage - 1;
        }

        setCurrentPage(adjustedPage);
      }, 0);

      setrefresh(refresh + 1);
      setFeedback({ type: 'success', message: '✔️ Blog Deleted successfully!' });
      setTimeout(() => setFeedback(null), 2000);
    } else {
      setFeedback({ type: 'error', message: '❌ Failed to Delete blog.' });
      setTimeout(() => setFeedback(null), 2000);
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    alert('An error occurred while deleting the blog');
  }
};


  const handleEditSave = () => {
    fetch(`https://spring-assig-5.onrender.com/auth/My_Blogs/Edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: Id,
        title: editBlog.title,
        subtitle: editBlog.subtitle,
        content: editBlog.content
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update blog');
        }
        return response.json();
      })
      .then(updatedBlog => {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.id === updatedBlog.id ? updatedBlog : blog
          )
        );
        setEditBlog(null);
        setFeedback({ type: 'success', message: '✔️ Blog updated successfully!' }); 
        setTimeout(() => setFeedback(null), 2000);
        setrefresh(refresh+1)
      })
      .catch(error => {
        console.error('Error updating blog:', error);
        setFeedback({ type: 'error', message: '❌ Failed to update blog.' });
        setTimeout(() => setFeedback(null), 2000);
      });
  };



  const handleAdd = async (newBlog) => {
  try {
    const response = await fetch('https://spring-assig-5.onrender.com/auth/My_Blogs/Add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBlog),
    });

    if (response.ok) {
      const savedBlog = await response.json();
      setBlogs([...blogs, savedBlog]);
      setShowAddForm(false);
      setFeedback({ type: 'success', message: '✔️ Blog Added successfully!' });
      setTimeout(() => setFeedback(null), 2000);
    } else {
      setFeedback({ type: 'error', message: '❌ Failed to Add blog.' });
      setTimeout(() => setFeedback(null), 2000);
    }
  } catch (error) {
    console.error('Error adding blog:', error);
    alert('An error occurred while adding the blog');
  }
};
  return (
    <div className="blog-container">
      <div className="blog-header">
        <h2>My Blogs</h2>
        {ADD && (
          <button className="add-button" onClick={() => setShowAddForm(true)}>
            ADD
          </button>
        )}
      </div>

      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <>
          <div className="blog-grid">
            {currentBlogs.map((blog) => (
              <div className="blog-card" key={blog.id}>
                <div className="blog-title-row">
                  <h3>{blog.title}</h3>
                  <div className="blog-title-actions">
                    {ADD && <button onClick={() => setEditBlog(blog)}>Edit</button>}
                    {ADD && <button onClick={() => handleDelete(blog.id, blog.title)}>Delete</button>}
                  </div>
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
                onClick={() => setCurrentPage(currentPage - 1)}
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
                onClick={() => setCurrentPage(currentPage + 1)}
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

      {showAddForm && (
        <div className="blog-popup-overlay" onClick={() => setShowAddForm(false)}>
          <div className="blog-popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Blog</h2>
            <input
              type="text"
              placeholder="Title"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Subtitle"
              value={newBlog.subtitle}
              onChange={(e) => setNewBlog({ ...newBlog, subtitle: e.target.value })}
            />
            <textarea
              placeholder="Content"
              value={newBlog.content}
              onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
            ></textarea>
            <button
  onClick={() => {
    const blogToAdd = { ...newBlog, id: Id };
    handleAdd(blogToAdd);
    setNewBlog({ title: '', subtitle: '', content: '' });
  }}
>
  Submit
</button>
          </div>
        </div>
      )}

      {editBlog && (
        <div className="blog-popup-overlay" onClick={() => setEditBlog(null)}>
          <div className="blog-popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Blog</h2>
            <input
              type="text"
              value={editBlog.title}
              onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
            />
            <input
              type="text"
              value={editBlog.subtitle}
              onChange={(e) => setEditBlog({ ...editBlog, subtitle: e.target.value })}
            />
            <textarea
              value={editBlog.content}
              onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
            ></textarea>
            <button onClick={handleEditSave}>Save</button>
          </div>
        </div>
      )}

      {/* ✅ Feedback Popup */}
      {feedback && (
        <div className={`feedback-popup ${feedback.type}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default Blog;
