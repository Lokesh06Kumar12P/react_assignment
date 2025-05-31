// src/components/Navbar.js
import React, { useState } from 'react';
import '../components_styling/Nav.css';
import { Link } from 'react-router-dom';

const Nav = ({ onTabClick, ADD ,setAdd }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userId');
  setAdd(false);         
  window.location.reload();
};


  return (
    <nav className="navbar">
      <div className="logo">MyApp</div>

      <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/Blog">Blog</Link>
        <Link to="/contact">Contact</Link>

        {!ADD ? (
          <>
            <button className="nav-btn login-btn" onClick={() => onTabClick('login')}>Login</button>
            <button className="nav-btn signup-btn" onClick={() => onTabClick('signup')}>Sign Up</button>
          </>
        ) : (
          <button className="nav-btn logout-btn" onClick={handleLogout}>Logout</button>
        )}
      </div>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        &#9776;
      </div>
    </nav>
  );
};

export default Nav;
