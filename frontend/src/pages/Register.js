import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Register.css';
import axios from 'axios';

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

  // State for handling error and success messages
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Allowed image types
  const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!allowedImageTypes.includes(file.type)) {
        setError('Profile picture must be a PNG or JPG image.');
        setProfilePicture(null);
        setPreview(null);
        return;
      }
      setProfilePicture(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const validationErrors = [];
    if (!username.trim()) validationErrors.push('Username cannot be empty.');
    if (password !== confirmPassword) validationErrors.push('Passwords do not match.');
    if (!email.includes('@')) validationErrors.push('Email must contain an "@" symbol.');
    const zipCodeRegex = /^\d{5}$/;
    if (!zipCodeRegex.test(zipCode)) validationErrors.push('ZIP Code must be exactly 5 digits.');
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('email', email);
      formData.append('zip_code', zipCode);

      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      } else {
        formData.append('profile_picture', '/images/default/default-profile-pic.png');
      }

      const response = await axios.post('http://127.0.0.1:5000/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000); // Redirect to login page after 3 seconds
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'An error occurred during registration.');
      } else {
        setError('Failed to connect to the server.');
      }
    }
  };

  return (
    <div className="register-page">
      <Header />
      <div className="background-image">
        <div className="register-box">
          <h2>Create an Account</h2>
          <div className="profile-section">
            <div className="profile-placeholder">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  style={{ borderRadius: '50%', width: '100%', height: '100%', objectFit: 'cover' }}
                />
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

          {successMessage && (
            <div className="success-message">
              <p>{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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

            <button type="submit">Register</button>
          </form>

          <Link to="/login" className="login-link">
            Already Have an Account? Sign In
          </Link>

          <button className="google-signin" aria-label="Sign in with Google">
            <img src="/images/google-logo-sign-up.png" alt="Google Sign-In" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;