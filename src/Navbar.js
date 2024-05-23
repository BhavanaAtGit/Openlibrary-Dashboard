import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          MyApp
        </Link>
        <div className="navbar-links">
          <Link to="/about" className="navbar-link">
            About Us
          </Link>
          <Link to="/contact" className="navbar-link">
            Contact Us
          </Link>
          <Link to="/login" className="navbar-link">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
