// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Login from './components/Login';
import Signup from './components/Signup';
import Blog from './components/Blog';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import './App.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [displayADD, setDisplayADD] = useState(false);
  const [Id, setId] = useState(0);
  const [refresh, setrefresh] = useState(0);

  const handleOpenModal = (tab) => {
    setActiveTab(tab);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLoginSuccess = (userId) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', userId);
    setDisplayADD(true);
    setId(userId);
    setShowModal(false);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedId = localStorage.getItem('userId');
    if (isLoggedIn && storedId) {
      setDisplayADD(true);
      setId(Number(storedId));
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Nav onTabClick={handleOpenModal} ADD={displayADD} setAdd={setDisplayADD} />
        <Routes>
          <Route path="/" element={<Home refresh={refresh} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog ADD={displayADD} Id={Id} refresh={refresh} setrefresh={setrefresh} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={handleCloseModal}>×</button>
              {activeTab === 'login' ? (
                <Login onLoginSuccess={handleLoginSuccess} close={handleCloseModal} />
              ) : (
                <Signup />
              )}
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
