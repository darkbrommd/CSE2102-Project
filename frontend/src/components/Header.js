// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Ensure this file exists and is correctly styled

function Header() {
  return (
    <header className="header">
      {/* Wrap the logo with Link to make it clickable */}
      <Link to="/" className="logo-link" aria-label="Go to homepage">
        <h1 className="logo">HuskyAdoption</h1>
      </Link>
      <Link to="/login" className="sign-in">Sign In</Link>
    </header>
  );
}

export default Header;
