// src/pages/MyApplications.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import SidebarNavigation from '../components/SidebarNavigation';
import Breadcrumb from '../components/Breadcrumb';
import './MyApplications.css';

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching applications from an API
    setTimeout(() => {
      // Replace this with your actual API call
      const fetchedApplications = [
        {
          id: 1,
          petName: 'Snowflake',
          petBreed: 'Pomeranian',
          status: 'Pending',
          dateApplied: '2023-11-01',
          image: '/images/bunny.png',
        },
        {
          id: 2,
          petName: 'Pumpkin',
          petBreed: 'Cat',
          status: 'Approved',
          dateApplied: '2023-10-28',
          image: '/images/kitten.png',
        },
        // Add more applications as needed
      ];

      setApplications(fetchedApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApplicationClick = (applicationId) => {
    // Navigate to the application detail page
    navigate(`/application/${applicationId}`);
  };

  return (
    <div className="my-applications-page">
      <Header />
      <Navbar />

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>My Applications</h1>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Sidebar Navigation */}
        <SidebarNavigation active="my-applications" />

        {/* Main Content */}
        <div className="applications-main-content">
          {/* Breadcrumb Navigation */}
          <Breadcrumb 
            paths={[
              { name: 'My Adoption', url: '/my-applications' },
            ]}
          />

          {/* Applications List */}
          {loading ? (
            <p className="status-message">Loading applications...</p>
          ) : applications.length === 0 ? (
            <p className="status-message">No applications yet.</p>
          ) : (
            <div className="applications-list">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="application-card"
                  onClick={() => handleApplicationClick(app.id)}
                >
                  <div className="application-card-content">
                    <img src={app.image} alt={app.petName} className="pet-image" />
                    <div className="application-info">
                      <h2>{app.petName}</h2>
                      <p><strong>Breed:</strong> {app.petBreed}</p>
                      <p><strong>Status:</strong> {app.status}</p>
                      <p><strong>Date Applied:</strong> {new Date(app.dateApplied).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyApplications;
