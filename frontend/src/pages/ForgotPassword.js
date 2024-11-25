import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './Login.css';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      // Send the reset password request to the backend
      const response = await axios.post('http://127.0.0.1:5000/forgot_password', { email });

      if (response.status === 200) {
        // Display the success message from the API
        setMessage(response.data.message);
      }
    } catch (err) {
      // Check if it's a 404 error for a nonexistent email
      if (err.response && err.response.status === 404) {
        setError(err.response.data.error || 'No account associated with this email.');
      } else {
        // General error handling
        setError('An error occurred while processing your request. Please try again later.');
      }
    }
  };

  return (
    <div className="login-page">
      <Header />

      <div className="background-image">
        <div className="login-box">
          <h2>Forgot Password</h2>

          {/* Display success message if any */}
          {message && (
            <div className="success-message">
              <p>{message}</p>
            </div>
          )}

          {/* Display error message if any */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Send Reset Link</button>
          </form>

          {/* Link to Login */}
          <Link to="/login" className="signup-button">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;