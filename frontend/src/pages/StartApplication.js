// src/pages/StartApplication.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import './StartApplication.css';

/**
 * StartApplication component allows users to apply for adopting a pet.
 * Displays pet information and an application form.
 * @component
 */
function StartApplication() {
  const navigate = useNavigate();
  const { petId } = useParams(); // Assuming petId is passed via URL
  const [pet, setPet] = useState(null);
  const [applicationData, setApplicationData] = useState({
    name: '',
    address: '',
    address2: '',
    zipCode: '',
    email: '',
    phoneNumber: '',
    additionalComments: '',
    date: '',
    time: '',
    duration: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    /**
     * Fetch pet data by petId from the backend API.
     */
    const fetchPetData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/pets/${petId}`);
        if (!response.ok) {
          throw new Error('Pet not found');
        }
        const data = await response.json();
        setPet(data);
      } catch (error) {
        console.error('Error fetching pet data:', error);
      }
    };
    fetchPetData();
  }, [petId]);

  /**
   * Handle input changes in the form.
   * @param {Object} event - The event object.
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setApplicationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handle form submission.
   * @param {Object} event - The event object.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    // Form validation
    const validationErrors = [];

    if (!applicationData.name.trim()) {
      validationErrors.push('Name cannot be empty.');
    }
    if (!applicationData.address.trim()) {
      validationErrors.push('Address cannot be empty.');
    }
    if (!/^\d{5}$/.test(applicationData.zipCode)) {
      validationErrors.push('ZIP Code must be exactly 5 digits.');
    }
    if (!applicationData.email.includes('@')) {
      validationErrors.push('Email must contain an "@" symbol.');
    }
    if (!applicationData.phoneNumber.trim()) {
      validationErrors.push('Phone number cannot be empty.');
    }
    if (!applicationData.date) {
      validationErrors.push('Please select a date for the meeting.');
    }
    if (!applicationData.time) {
      validationErrors.push('Please select a time for the meeting.');
    }
    if (!applicationData.duration || isNaN(applicationData.duration) || applicationData.duration <= 0) {
      validationErrors.push('Please enter a valid duration in minutes.');
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      return;
    }

    // Combine date and time into a datetime string
    const dateTime = `${applicationData.date} ${applicationData.time}:00`;

    // Prepare data for the backend API
    const meetingData = {
      user_id: 1, // Replace with actual user ID
      facility_id: pet.facility_id || 'default_facility', // Replace with actual facility ID
      pet_id: petId,
      date_time: dateTime,
      duration: parseInt(applicationData.duration),
    };

    // TODO: Integrate schedule API to set up the meeting.
    // For now, display a success message.
    setMessage('Your application has been submitted successfully!');
  };

  return (
    <div className="start-application-page">
      <Header />
      <Navbar />

      {/* Page Title */}
      <div className="page-title">
        <h1>Start Application</h1>
      </div>

      {/* Main Content */}
      <div className="application-container">
        {/* Left Side - Pet Info */}
        <div className="pet-info">
          {pet ? (
            <>
              <img
                src={pet.photo || '/default-pet-image.png'}
                alt={pet.name}
                className="pet-image"
              />
              <h2>{pet.name}</h2>
              <p>
                <strong>Breed:</strong> {pet.breed || 'N/A'}
              </p>
              <p>
                <strong>Age:</strong> {pet.age || 'N/A'}
              </p>
              <p>
                <strong>Location:</strong> {pet.location || 'N/A'}
              </p>
            </>
          ) : (
            <p>Loading pet information...</p>
          )}
        </div>

        {/* Middle - Application Form */}
        <div className="application-form">
          <form onSubmit={handleSubmit}>
            <h2>Applicant Information</h2>
            {/* Display error message if any */}
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
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={applicationData.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={applicationData.address}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Address 2 (optional):
              <input
                type="text"
                name="address2"
                value={applicationData.address2}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Zip Code:
              <input
                type="text"
                name="zipCode"
                value={applicationData.zipCode}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Contact Email:
              <input
                type="email"
                name="email"
                value={applicationData.email}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Phone Number:
              <input
                type="tel"
                name="phoneNumber"
                value={applicationData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Additional Comments:
              <textarea
                name="additionalComments"
                value={applicationData.additionalComments}
                onChange={handleInputChange}
              />
            </label>

            {/* Calendar Component */}
            <h2>Select a Meeting Date, Time, and Duration</h2>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={applicationData.date}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Time:
              <input
                type="time"
                name="time"
                value={applicationData.time}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Duration (in minutes):
              <input
                type="number"
                name="duration"
                value={applicationData.duration}
                onChange={handleInputChange}
                required
                min="1"
              />
            </label>

            {/* Submit Button */}
            <button type="submit" className="submit-button">
              Submit Application
            </button>
          </form>
          {message && <p className="success-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default StartApplication;
