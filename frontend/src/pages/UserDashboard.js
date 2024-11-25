import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import './UserDashboard.css';

function UserDashboard() {
  const [user, setUser] = useState({ name: '', profilePic: '' });
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]); // User's favorites
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('You are not logged in. Please log in to access your dashboard.');
      return;
    }

    // Fetch user profile
    fetch('http://127.0.0.1:5000/get-profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        return response.json();
      })
      .then((data) => {
        setUser({ name: data.name, profilePic: data.profilePic });
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch user profile. Please log in again.');
      });

    // Fetch user favorites
    fetch('http://127.0.0.1:5000/get-favorites', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        return response.json();
      })
      .then((data) => {
        setFavorites(data); // Update favorites with fetched data
      })
      .catch((error) => {
        console.error('Error fetching favorites:', error);
        setFavorites([]);
      });
  }, [navigate]);

  return (
    <div className="user-dashboard-page">
      <Header />
      <Navbar />

      {error ? (
        <div className="error-banner">
          <p>{error}</p>
          <button className="login-button" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      ) : (
        <>
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>Dashboard, {user.name || 'User'}</h1>
            </div>
          </div>

          <div className="dashboard-content">
            {/* Sidebar Navigation */}
            <div className="sidebar-navigation">
              <h2>My Adoption</h2>
              <ul>
                <li className="active" onClick={() => navigate('/user-dashboard')}>
                  Summary
                </li>
                <li onClick={() => navigate('/change-profile')}>Change Profile</li>
                <li onClick={() => navigate('/my-applications')}>My Application</li>
              </ul>
            </div>

            {/* Favorites Panel */}
            <div className="favorites-panel">
              <h2>Your Favorites</h2>
              <div className="favorites-grid">
                {favorites.length > 0 ? (
                  favorites.map((favorite, index) => (
                    <div
                      key={index}
                      className="favorite-card"
                      onClick={() => navigate(`/PetProfile/${favorite.id}`)} // Redirect to pet profile page
                      style={{ cursor: 'pointer' }} // Pointer cursor for click feedback
                    >
                      <div className="favorite-image-container">
                        <img
                          src={favorite.photo}
                          alt={favorite.name}
                          onError={(e) => {
                            e.target.src = '/images/default/default-pet.png'; // Fallback for missing images
                          }}
                        />
                      </div>
                      <div className="favorite-info">
                        <h3>{favorite.name}</h3>
                        <p>
                          <strong>Breed:</strong> {favorite.breed}
                        </p>
                        <p>
                          <strong>Gender:</strong> {favorite.gender}
                        </p>
                        <p>
                          <strong>Location:</strong> {favorite.location}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No favorites found.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserDashboard;