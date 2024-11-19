// src/pages/UserDashboard.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import './UserDashboard.css';

function UserDashboard() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // Fetch user's favorites (simulate API call)
  useEffect(() => {
    setTimeout(() => {
      setFavorites([
        {
          name: 'Snowflake',
          breed: 'Pomeranian',
          gender: 'Female',
          location: 'Storrs, CT',
          image: '/images/bunny.png',
        },
        {
          name: 'Pumpkin',
          breed: 'Cat',
          gender: 'Male',
          location: 'Hartford, CT',
          image: '/images/kitten.png',
        },
        {
          name: 'Jonathan',
          breed: 'Siberian Husky',
          gender: 'Male',
          location: 'New Haven, CT',
          image: '/images/husky.png',
        },
      ]);
    }, 500);
  }, []);

  return (
    <div className="user-dashboard-page">
      <Header />
      <Navbar />

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Good Afternoon, Emily Chen</h1>
        </div>
        <div className="user-profile">
          <img src="/images/user-profile-pic.jpg" alt="Emily Chen" className="profile-pic" />
        </div>
      </div>

      <div className="dashboard-content">
        {/* Sidebar Navigation */}
        <div className="sidebar-navigation">
          <h2>My Adoption</h2>
          <ul>
            <li className="active" onClick={() => navigate('/user-dashboard')}>Summary</li>
            <li onClick={() => navigate('/change-profile')}>Change Profile</li>
            <li onClick={() => navigate('/my-applications')}>My Application</li>
            {/* Add more profile-related items if needed */}
          </ul>
        </div>

        {/* Favorites Panel */}
        <div className="favorites-panel">
          <h2>Your Favorites</h2>
          <div className="favorites-grid">
            {favorites.map((pet, index) => (
              <div key={index} className="favorite-card">
                <div className="favorite-image-container">
                  <img src={pet.image} alt={pet.name} />
                </div>
                <div className="favorite-info">
                  <h3>{pet.name}</h3>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Gender:</strong> {pet.gender}</p>
                  <p><strong>Location:</strong> {pet.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
