// src/pages/Login.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="login-page">
      {/* Header */}
      <header className="header">
        <h1 className="logo">HuskyAdoption</h1>
      </header>

      {/* Background Image */}
      <div className="background-image">
        {/* Login Box */}
        <div className="login-box">
          <h2>User Single Sign On</h2>
          {/* Removed profile-icon to fix spacing issue */}
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
          <Link to="/register" className="signup-button">
            New User? Sign Up!
          </Link>
          <button className="google-signin" aria-label="Sign in with Google">
            <img src="/images/google-logo.png" alt="Google Sign-In" />
          </button>
          <Link to="/forgot-password" className="forgot-password">
            Forgot Username or Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
