// src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Import the Header component
import './Register.css';

function Register() {
  const navigate = useNavigate();

  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);

  // State variables for form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');

  // State for handling error messages
  const [error, setError] = useState('');

  // Allowed image types
  const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!allowedImageTypes.includes(file.type)) {
        setError('Profile picture must be a PNG or JPG image.');
        setProfilePicture(null);
        setPreview(null);
        return;
      }
      
      setProfilePicture(file);
      setError(''); // Clear previous errors if any
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset any previous error messages
    setError('');
    
    // Initialize an array to collect error messages
    const validationErrors = [];
    
    // Username validation
    if (!username.trim()) {
      validationErrors.push('Username cannot be empty.');
    }
    
    // Password match validation
    if (password !== confirmPassword) {
      validationErrors.push('Passwords do not match.');
    }
    
    // Email validation
    if (!email.includes('@')) {
      validationErrors.push('Email must contain an "@" symbol.');
    }
    
    // ZIP code validation: exactly 5 digits
    const zipCodeRegex = /^\d{5}$/;
    if (!zipCodeRegex.test(zipCode)) {
      validationErrors.push('ZIP Code must be exactly 5 digits.');
    }
    
    // Profile picture validation (if a picture is uploaded)
    if (profilePicture && !allowedImageTypes.includes(profilePicture.type)) {
      validationErrors.push('Profile picture must be a PNG or JPG image.');
    }
    
    // If there are validation errors, display them and prevent form submission
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      return;
    }
    
    // Handle registration logic here, e.g., form validation and API call
    console.log('Registering user...');
    
    // Navigate to the login page after successful registration
    navigate('/login');
  };

  return (
    <div className="register-page">
      <Header /> {/* Use the Header component */}
      
      {/* Background Image */}
      <div className="background-image">
        {/* Register Box */}
        <div className="register-box">
          <h2>Create an Account</h2>

          {/* Profile Section */}
          <div className="profile-section">
            <div className="profile-placeholder">
              {preview ? (
                <img src={preview} alt="Profile Preview" style={{ borderRadius: '50%', width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>👤</span>
              )}
            </div>
            <label htmlFor="profile-upload" className="upload-button">
              Click to Upload Profile Picture
            </label>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfilePictureChange}
            />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Enter Username" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            
            {/* Password Field */}
            <input 
              type="password" 
              placeholder="Enter Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {/* Confirm Password Field */}
            <input 
              type="password" 
              placeholder="Re-enter Password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
            <input 
              type="email" 
              placeholder="Enter Email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <input 
              type="text" 
              placeholder="Enter Your ZIP Code" 
              required 
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
            
            {/* Display error message if any */}
            {error && (
              <div className="error-message">
                {error.split('. ').map((err, index) => (
                  <p key={index}>{err.trim()}{index !== error.split('. ').length - 1 ? '.' : ''}</p>
                ))}
              </div>
            )}
            
            <button type="submit">Register</button>
          </form>

          {/* Link to Login */}
          <Link to="/login" className="login-link">
            Already Have an Account? Sign In
          </Link>

          {/* Google Sign-In Button */}
          <button className="google-signin" aria-label="Sign in with Google">
            <img src="/images/google-logo-sign-up.png" alt="Google Sign-In" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
