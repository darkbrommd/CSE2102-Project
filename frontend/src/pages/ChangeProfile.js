import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Import the Header component
import './ChangeProfile.css';
import axios from 'axios';

function ChangeProfile() {
  const navigate = useNavigate();

  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);

  // State variables for form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // State for handling error messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch current user profile
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch current user details
    axios
      .get('http://127.0.0.1:5000/get-profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const { name, profilePic, email, zipCode } = response.data;
        setUsername(name);
        setPreview(profilePic || '/images/default/default-profile-pic.png');
        setEmail(email || '');
        setZipCode(zipCode || '');
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch user profile.');
      });
  }, [navigate]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setError('Profile picture must be a PNG or JPG image.');
        setProfilePicture(null);
        setPreview(null);
        return;
      }

      setProfilePicture(file);
      setError(''); // Clear previous errors
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationErrors = [];
    if (!username.trim()) validationErrors.push('Username cannot be empty.');
    if (!email.includes('@')) validationErrors.push('Email must contain an "@" symbol.');
    if (!/^\d{5}$/.test(zipCode)) validationErrors.push('ZIP Code must be exactly 5 digits.');

    if (currentPassword || newPassword || confirmNewPassword) {
      if (!currentPassword) validationErrors.push('Current password is required to change your password.');
      if (newPassword !== confirmNewPassword) validationErrors.push('Passwords do not match.');
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('zip_code', zipCode);
    if (currentPassword) formData.append('current_password', currentPassword);
    if (newPassword) formData.append('new_password', newPassword);
    if (profilePicture) formData.append('profile_picture', profilePicture);

    const token = localStorage.getItem('authToken');
    axios
      .post('http://127.0.0.1:5000/change_profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setSuccess(response.data.message || 'Profile updated successfully!');
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        setError(error.response?.data?.error || 'Failed to update profile.');
      });
  };

  return (
    <div className="change-profile-page">
      <Header /> {/* Use the Header component */}
      <div className="background-image">
        <div className="change-profile-box">
          <h2>Update Your Profile</h2>
          <div className="profile-section">
            <div className="profile-placeholder">
              <img
                src={preview || '/images/default/default-profile-pic.png'}
                alt="Profile Preview"
                style={{
                  borderRadius: '50%',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
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
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Update Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Update Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Update Your ZIP Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
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
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button type="submit">Update Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangeProfile;