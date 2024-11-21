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
        petDescription:
          'A friendly and playful Pomeranian who loves to cuddle and play fetch.',
        adopterName: 'Emily Chen',
        adopterContact: 'emily.chen@example.com',
        adopterAddress: '123 Main St, Storrs, CT 06269',
        // Scheduled meeting details
        meetingDate: '2023-11-15',
        meetingTime: '14:00',
        meetingDuration: '60', // in minutes
        meetingStatus: 'Confirmed',
      };

      setApplication(fetchedApplication);
      setLoading(false);
    }, 1000);
  }, [applicationId]);

  // Function to handle rescheduling (placeholder)
  const handleReschedule = () => {
    // TODO: Implement reschedule functionality
    alert('Reschedule functionality will be available soon.');
  };

  // Function to handle cancellation (placeholder)
  const handleCancel = () => {
    // TODO: Implement cancel functionality
    alert('Cancel functionality will be available soon.');
  };

  if (loading) {
    return (
      <div className="application-detail-page">
        <Header />
        <Navbar />
        <div className="dashboard-content">
          <SidebarNavigation active="my-applications" />
          <div className="applications-main-content">
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
          <SidebarNavigation active="my-applications" />
          <div className="applications-main-content">
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
          <h1>Application Details</h1>
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
              { name: 'My Applications', url: '/my-applications' },
              { name: application.petName },
            ]}
          />

          {/* Application Detail Card */}
          <div className="application-detail-card">
            <div className="application-card-content">
              <img
                src={application.image}
                alt={application.petName}
                className="application-pet-image" /* Updated className */
              />
              <div className="application-info">
                <h2>{application.petName}</h2>
                <p>
                  <strong>Breed:</strong> {application.petBreed}
                </p>
                <p>
                  <strong>Age:</strong> {application.petAge}
                </p>
                <p>
                  <strong>Gender:</strong> {application.petGender}
                </p>
                <p>
                  <strong>Description:</strong> {application.petDescription}
                </p>
                <p>
                  <strong>Status:</strong> {application.status}
                </p>
                <p>
                  <strong>Date Applied:</strong>{' '}
                  {new Date(application.dateApplied).toLocaleDateString()}
                </p>

                {/* Adopter Information */}
                <h2>Adopter Information</h2>
                <p>
                  <strong>Name:</strong> {application.adopterName}
                </p>
                <p>
                  <strong>Contact:</strong> {application.adopterContact}
                </p>
                <p>
                  <strong>Address:</strong> {application.adopterAddress}
                </p>

                {/* Scheduled Meeting Details */}
                <h2>Scheduled Meeting</h2>
                {application.meetingDate ? (
                  <>
                    <p>
                      <strong>Date:</strong>{' '}
                      {new Date(application.meetingDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Time:</strong> {application.meetingTime}
                    </p>
                    <p>
                      <strong>Duration:</strong> {application.meetingDuration} minutes
                    </p>
                    <p>
                      <strong>Status:</strong> {application.meetingStatus}
                    </p>
                    <div className="meeting-actions">
                      <button onClick={handleReschedule} className="reschedule-button">
                        Reschedule
                      </button>
                      <button onClick={handleCancel} className="cancel-button">
                        Cancel Meeting
                      </button>
                    </div>
                  </>
                ) : (
                  <p>No meeting scheduled yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;
