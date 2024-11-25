import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      fetch('http://127.0.0.1:5000/get-profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch user profile');
          }
          return response.json();
        })
        .then((data) => {
          setUser({
            name: data.name,
            profilePic: data.profilePic || '/images/default/default-profile-pic.png',
          });
          localStorage.setItem('userName', data.name);
          localStorage.setItem('profilePic', data.profilePic || '/images/default/default-profile-pic.png');
        })
        .catch((error) => {
          console.error('Error fetching profile:', error);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('profilePic');
    setUser(null);
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="header">
      <Link to="/" className="logo-link" aria-label="Go to homepage">
        <h1 className="logo">HuskyAdoption</h1>
      </Link>
      {user ? (
        <div className="user-info">
          <img
            src={
              user?.profilePic
                ? `/${user.profilePic}`
                : '/images/default/default-profile-pic.png'
            }
            alt={`${user?.name || 'User'}'s profile`}
            className="profile-pic"
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          />
          <span className="user-name">{user.name}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login" className="sign-in-button">
          Sign In
        </Link>
      )}
    </header>
  );
}

export default Header;