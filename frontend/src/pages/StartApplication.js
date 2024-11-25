import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import './StartApplication.css';

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

  // Fetch pet details when component loads
  useEffect(() => {
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
        setError('Unable to load pet information.');
      }
    };
    fetchPetData();
  }, [petId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setApplicationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const validationErrors = [];

    if (!applicationData.name.trim()) validationErrors.push('Name cannot be empty.');
    if (!applicationData.address.trim()) validationErrors.push('Address cannot be empty.');
    if (!/^\d{5}$/.test(applicationData.zipCode)) validationErrors.push('ZIP Code must be exactly 5 digits.');
    if (!applicationData.email.includes('@')) validationErrors.push('Email must contain an "@" symbol.');
    if (!applicationData.phoneNumber.trim()) validationErrors.push('Phone number cannot be empty.');
    if (!applicationData.date) validationErrors.push('Please select a date for the meeting.');
    if (!applicationData.time) validationErrors.push('Please select a time for the meeting.');
    if (!applicationData.duration || isNaN(applicationData.duration) || applicationData.duration <= 0) {
      validationErrors.push('Please enter a valid duration in minutes.');
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(' '));
      return;
    }

    const dateTime = `${applicationData.date} ${applicationData.time}:00`;

    const applicationPayload = {
      pet_id: parseInt(petId, 10),
      adopter_name: applicationData.name,
      address: applicationData.address,
      address2: applicationData.address2,
      zip_code: applicationData.zipCode,
      email: applicationData.email,
      phone_number: applicationData.phoneNumber,
      additional_comments: applicationData.additionalComments,
      date_time: dateTime,
      duration: parseInt(applicationData.duration, 10),
    };

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://127.0.0.1:5000/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(applicationPayload),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message || 'Application submitted successfully!');
        setTimeout(() => navigate('/my-applications'), 2000); // Redirect after success
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.error || 'Failed to submit the application.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Failed to submit the application. Please try again.');
    }
  };

  return (
    <div className="start-application-page">
      <Header />
      <Navbar />
      <div className="page-title">
        <h1>Start Application</h1>
      </div>
      <div className="application-container">
        {/* Pet Info Section */}
        <div className="pet-info">
          {pet ? (
            <>
              <img
                src={`/${pet.photo || 'images/default/default-pet.png'}`}
                alt={pet.name}
                className="pet-image"
              />
              <h2>{pet.name}</h2>
              <p><strong>Species:</strong> {pet.species || 'N/A'}</p>
              <p><strong>Breed:</strong> {pet.breed || 'N/A'}</p>
              <p><strong>Age:</strong> {pet.age || 'N/A'}</p>
              <p><strong>Size:</strong> {pet.size || 'N/A'}</p>
              <p><strong>Gender:</strong> {pet.gender || 'N/A'}</p>
              <p><strong>Special Needs:</strong> {pet.special_needs || 'None'}</p>
              <p><strong>About:</strong> {pet.about || 'No details available.'}</p>
              <p><strong>Available for Adoption:</strong> {pet.available_for_adoption ? 'Yes' : 'No'}</p>
            </>
          ) : (
            <p>Loading pet information...</p>
          )}
        </div>

        {/* Application Form Section */}
        <div className="application-form">
          <form onSubmit={handleSubmit}>
            <h2>Applicant Information</h2>
            {error && <div className="error-message">{error}</div>}
            <label>
              Name:
              <input type="text" name="name" value={applicationData.name} onChange={handleInputChange} required />
            </label>
            <label>
              Address:
              <input type="text" name="address" value={applicationData.address} onChange={handleInputChange} required />
            </label>
            <label>
              Address 2 (optional):
              <input type="text" name="address2" value={applicationData.address2} onChange={handleInputChange} />
            </label>
            <label>
              Zip Code:
              <input type="text" name="zipCode" value={applicationData.zipCode} onChange={handleInputChange} required />
            </label>
            <label>
              Contact Email:
              <input type="email" name="email" value={applicationData.email} onChange={handleInputChange} required />
            </label>
            <label>
              Phone Number:
              <input type="tel" name="phoneNumber" value={applicationData.phoneNumber} onChange={handleInputChange} required />
            </label>
            <label>
              Additional Comments:
              <textarea name="additionalComments" value={applicationData.additionalComments} onChange={handleInputChange} />
            </label>
            <h2>Select a Meeting Date, Time, and Duration</h2>
            <label>
              Date:
              <input type="date" name="date" value={applicationData.date} onChange={handleInputChange} required />
            </label>
            <label>
              Time:
              <input type="time" name="time" value={applicationData.time} onChange={handleInputChange} required />
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
            <button type="submit" className="submit-button">Submit Application</button>
          </form>
          {message && <p className="success-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default StartApplication;