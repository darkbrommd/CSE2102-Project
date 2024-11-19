// src/pages/Login.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from '../components/Header'; // Import the Header component
import './Login.css';

function Login() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    // For example, authenticate the user
    const isAuthenticated = true; // Replace this with actual authentication logic

    if (isAuthenticated) {
      navigate('/profile'); // Redirect to /profile on successful login
    } else {
      alert('Login failed! Please check your username and password.');
    }
  };

  return (
    <div className="login-page">
      <Header /> {/* Use the Header component */}
      
      {/* Background Image */}
      <div className="background-image">
        {/* Login Box */}
        <div className="login-box">
          <h2>User Single Sign On</h2>
          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
          
          {/* Link to Register */}
          <Link to="/register" className="signup-button">
            New User? Sign Up!
          </Link>
          
          {/* Google Sign-In Button */}
          <button className="google-signin" aria-label="Sign in with Google">
            <img src="/images/google-logo.png" alt="Google Sign-In" />
          </button>
          
          {/* Forgot Password Link */}
          <Link to="/forgot-password" className="forgot-password">
            Forgot Username or Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
