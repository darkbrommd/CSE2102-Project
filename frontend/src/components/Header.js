// src/components/Header.js
import React from 'react';
import './Header.css'; // Create a CSS file for styling

function Header() {
  return (
    <header className="header">
      <h1 className="logo">HuskyAdoption</h1>
      <a href="/signin" className="sign-in">Sign In</a>
    </header>
  );
}

export default Header;
