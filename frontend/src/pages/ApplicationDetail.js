// src/pages/AdoptionDetail.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import SidebarNavigation from '../components/SidebarNavigation';
import Breadcrumb from '../components/Breadcrumb';
import './ApplicationDetail.css';

function AdoptionDetail() {
  const { applicationId } = useParams();
  const [adoption, setAdoption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdoptionDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://127.0.0.1:5000/adoption/${applicationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAdoption(data.adoption);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch adoption details.');
        }
      } catch (err) {
        console.error('Error fetching adoption details:', err);
        setError('An error occurred while fetching the adoption details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptionDetail();
  }, [applicationId]);

  const handleCancelAdoption = async () => {
    const confirmation = window.confirm(
      'Are you sure you want to cancel this adoption? This action cannot be undone.'
    );
    if (!confirmation) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `http://127.0.0.1:5000/adoption/${applicationId}/cancel-adoption`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert('Adoption canceled successfully.');
        navigate('/my-applications'); // Redirect user to the list of applications
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to cancel the adoption.');
      }
    } catch (error) {
      console.error('Error canceling adoption:', error);
      alert('An error occurred while canceling the adoption. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="application-detail-page">
        <Header />
        <Navbar />
        <div className="dashboard-content">
          <SidebarNavigation active="my-applications" />
          <div className="applications-main-content">
            <p className="status-message">Loading adoption details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="application-detail-page">
        <Header />
        <Navbar />
        <div className="dashboard-content">
          <SidebarNavigation active="my-applications" />
          <div className="applications-main-content">
            <p className="status-message error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!adoption) {
    return (
      <div className="application-detail-page">
        <Header />
        <Navbar />
        <div className="dashboard-content">
          <SidebarNavigation active="my-applications" />
          <div className="applications-main-content">
            <p className="status-message">Adoption not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="application-detail-page">
      <Header />
      <Navbar />

      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Adoption Details</h1>
        </div>
      </div>

      <div className="dashboard-content">
        <SidebarNavigation active="my-applications" />

        <div className="applications-main-content">
          <Breadcrumb
            paths={[
              { name: 'My Applications', url: '/my-applications' },
              { name: adoption.pet.name },
            ]}
          />

          <div className="application-detail-card">
            <div className="application-card-content">
              <img
                src={
                  adoption.pet.photo
                    ? `/${adoption.pet.photo}` // Use the provided photo path
                    : '/images/default/default-pet.png' // Use the fallback default image
                }
                alt={adoption.pet.name}
                className="application-pet-image"
              />
              <div className="application-info">
                <h2>{adoption.pet.name}</h2>
                <p>
                  <strong>Breed:</strong> {adoption.pet.breed}
                </p>
                <p>
                  <strong>Age:</strong> {adoption.pet.age || 'N/A'}
                </p>
                <p>
                  <strong>Gender:</strong> {adoption.pet.gender || 'N/A'}
                </p>
                <p>
                  <strong>Description:</strong> {adoption.pet.description || 'No details available.'}
                </p>
                <p>
                  <strong>Status:</strong> {adoption.status}
                </p>
                <p>
                  <strong>Date Adopted:</strong>{' '}
                  {new Date(adoption.date_adopted).toLocaleDateString()}
                </p>

                <h2>Adopter Information</h2>
                <p>
                  <strong>Name:</strong> {adoption.adopter_name}
                </p>
                <p>
                  <strong>Contact:</strong> {adoption.adopter_contact}
                </p>
                <p>
                  <strong>Address:</strong> {adoption.adopter_address}
                </p>
                <p>
                  <strong>Additional Comments:</strong> {adoption.additional_comments || 'N/A'}
                </p>

                <h2>Scheduled Meeting</h2>
                {adoption.meeting ? (
                  <>
                    <p>
                      <strong>Date:</strong>{' '}
                      {new Date(adoption.meeting.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Time:</strong> {adoption.meeting.time}
                    </p>
                    <p>
                      <strong>Duration:</strong> {adoption.meeting.duration} minutes
                    </p>
                    <p>
                      <strong>Status:</strong> {adoption.meeting.status}
                    </p>
                  </>
                ) : (
                  <p>No meeting scheduled yet.</p>
                )}

                <div className="meeting-actions">
                  <button onClick={handleCancelAdoption} className="cancel-button">
                    Cancel Adoption
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdoptionDetail;