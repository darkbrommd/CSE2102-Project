// src/pages/ChangeProfile.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Import the Header component
import './ChangeProfile.css';

function ChangeProfile() {
  const navigate = useNavigate();

  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);

  // State variables for form fields
  const [username, setUsername] = useState(''); // You may want to pre-fill this with the current username
  const [email, setEmail] = useState('');       // Pre-fill with current email
  const [zipCode, setZipCode] = useState('');   // Pre-fill with current ZIP code

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // State for handling error messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Allowed image types
  const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  // Simulate fetching current user data
  useEffect(() => {
    // Here you would typically fetch user data from an API
    // For demonstration, we'll use placeholder data
    setUsername('Emily Chen');
    setEmail('emily.chen@example.com');
    setZipCode('06269');
    setPreview('/images/user-profile-pic.jpg'); // Assuming this is the current profile picture
  }, []);

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

    // Reset any previous error or success messages
    setError('');
    setSuccess('');

    // Initialize an array to collect error messages
    const validationErrors = [];

    // Username validation
    if (!username.trim()) {
      validationErrors.push('Username cannot be empty.');
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

    // Password validations
    if (currentPassword || newPassword || confirmNewPassword) {
      // If any password field is filled, all must be filled
      if (!currentPassword) {
        validationErrors.push('Current password is required to change your password.');
      }
      if (!newPassword) {
        validationErrors.push('New password is required.');
      }
      if (!confirmNewPassword) {
        validationErrors.push('Please confirm your new password.');
      }
      if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
        validationErrors.push('New password and confirmation do not match.');
      }
      // Optional: Add more password strength validations here (e.g., minimum length)
      if (newPassword && newPassword.length < 6) {
        validationErrors.push('New password must be at least 6 characters long.');
      }
    }

    // If there are validation errors, display them and prevent form submission
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      return;
    }

    // Handle profile update logic here, e.g., form validation and API call
    // This is a placeholder for demonstration purposes
    console.log('Updating user profile...');
    console.log({
      username,
      email,
      zipCode,
      profilePicture,
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    // Simulate successful profile update
    setSuccess('Profile updated successfully!');
    // Optionally, navigate back to the dashboard after a delay
    setTimeout(() => {
      navigate('/user-dashboard');
    }, 2000);
  };

  return (
    <div className="change-profile-page">
      <Header /> {/* Use the Header component */}

      {/* Background Image */}
      <div className="background-image">
        {/* Change Profile Box */}
        <div className="change-profile-box">
          <h2>Update Your Profile</h2>

          {/* Profile Section */}
          <div className="profile-section">
            <div className="profile-placeholder">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  style={{
                    borderRadius: '50%',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <span>👤</span>
              )}
            </div>
            <label htmlFor="profile-upload" className="upload-button">
              Click to Upload New Profile Picture
            </label>
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfilePictureChange}
            />
          </div>

          {/* Profile Update Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Update Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="email"
              placeholder="Update Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="text"
              placeholder="Update Your ZIP Code"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />

            {/* Password Change Section */}
            <div className="password-change-section">
              <h3>Change Password</h3>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>

            {/* Display error message if any */}
            {error && (
              <div className="error-message">
                {error.split('. ').map((err, index) => (
                  <p key={index}>
                    {err.trim()}
                    {index !== error.split('. ').length - 1 ? '.' : ''}
                  </p>
                ))}
              </div>
            )}

            {/* Display success message if any */}
            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <button type="submit">Update Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangeProfile;
