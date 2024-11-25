import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Login.css';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();

  // State variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Success message state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error messages
    setSuccessMessage(''); // Reset success messages

    try {
      // Send login data to the backend
      const response = await axios.post('http://127.0.0.1:5000/login', {
        username,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;

        // Save the JWT token and user info in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userName', user.username); // Save username
        localStorage.setItem(
          'profilePic',
          user.profilePic || '/images/default/default-profile-pic.png' // Save profile pic or default
        );

        // Show success message
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/'); // Redirect to the dashboard after a delay
        }, 2000); // 2-second delay
      }
    } catch (err) {
      // Handle errors
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Invalid username or password.');
      } else {
        setError('Failed to connect to the server.');
      }
    }
  };

  return (
    <div className="login-page">
      <Header /> {/* Reuse the Header component */}

      <div className="background-image">
        <div className="login-box">
          <h2>User Single Sign-On</h2>

          {/* Display success message if present */}
          {successMessage && (
            <div className="success-message">
              <p>{successMessage}</p>
            </div>
          )}

          {/* Display error message if present */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>

          {/* Link to Register */}
          <Link to="/register" className="signup-button">
            New User? Sign Up!
          </Link>

          {/* Google Sign-In Button */}
          <button
            className="google-signin"
            aria-label="Sign in with Google"
            onClick={() => alert('Google Sign-In is not implemented yet.')}
          >
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