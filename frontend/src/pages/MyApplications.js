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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken'); // Ensure the user is authenticated
        const response = await fetch('http://127.0.0.1:5000/my-adoptions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setApplications(data.adoptions);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch applications.');
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('An error occurred while fetching your applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
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
          ) : error ? (
            <p className="status-message error-message">{error}</p>
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
                    <img
                      src={app.petImage}
                      alt={app.petName}
                      className="pet-image"
                    />
                    <div className="application-info">
                      <h2>{app.petName}</h2>
                      <p><strong>Breed:</strong> {app.petBreed}</p>
                      <p><strong>Status:</strong> {app.status}</p>
                      <p>
                        <strong>Date Applied:</strong>{' '}
                        {new Date(app.dateAdopted).toLocaleDateString()}
                      </p>
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