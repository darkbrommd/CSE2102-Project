// src/pages/ApplicationDetail.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import SidebarNavigation from '../components/SidebarNavigation';
import Breadcrumb from '../components/Breadcrumb';
import './ApplicationDetail.css';

function ApplicationDetail() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching application details from an API
    setTimeout(() => {
      // Replace this with your actual API call using applicationId
      const fetchedApplication = {
        id: applicationId,
        petName: 'Snowflake',
        petBreed: 'Pomeranian',
        status: 'Pending',
        dateApplied: '2023-11-01',
        image: '/images/bunny.png',
        petAge: '2 years',
        petGender: 'Female',
        petDescription: 'A friendly and playful Pomeranian who loves to cuddle and play fetch.',
        adopterName: 'Emily Chen',
        adopterContact: 'emily.chen@example.com',
        adopterAddress: '123 Main St, Storrs, CT 06269',
        // Add more application details as needed
      };

      setApplication(fetchedApplication);
      setLoading(false);
    }, 1000);
  }, [applicationId]);

  if (loading) {
    return (
      <div className="application-detail-page">
        <Header />
        <Navbar />
        <div className="dashboard-content">
          <SidebarNavigation active="" /> {/* No active item */}
          <div className="application-detail-main-content">
            <p className="status-message">Loading application details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="application-detail-page">
        <Header />
        <Navbar />
        <div className="dashboard-content">
          <SidebarNavigation active="" /> {/* No active item */}
          <div className="application-detail-main-content">
            <p className="status-message">Application not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="application-detail-page">
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
        <SidebarNavigation active="" /> {/* No active item */}

        {/* Main Content */}
        <div className="application-detail-main-content">
          {/* Breadcrumb Navigation */}
          <Breadcrumb 
            paths={[
              { name: 'My Application', url: '/my-applications' },
              { name: application.petName },
            ]}
          />

          <div className="application-detail-card">
            <div className="image-section">
              <img src={application.image} alt={application.petName} className="pet-image" />
            </div>
            <div className="info-section">
              <h1>{application.petName}</h1>
              <p className="breed"><strong>Breed:</strong> {application.petBreed}</p>
              <p className="age"><strong>Age:</strong> {application.petAge}</p>
              <p className="gender"><strong>Gender:</strong> {application.petGender}</p>
              <p className="status"><strong>Status:</strong> {application.status}</p>
              <p className="date-applied"><strong>Date Applied:</strong> {new Date(application.dateApplied).toLocaleDateString()}</p>
              <p className="description"><strong>Description:</strong> {application.petDescription}</p>
              
              {/* Adopter Information */}
              <div className="adopter-info">
                <h2>Adopter Information</h2>
                <p><strong>Name:</strong> {application.adopterName}</p>
                <p><strong>Contact:</strong> {application.adopterContact}</p>
                <p><strong>Address:</strong> {application.adopterAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;
