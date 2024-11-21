import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import './PetProfile.css';

/**
 * PetProfile component displays detailed information about a specific pet.
 * Fetches pet data based on the petId from URL parameters.
 * @component
 */
function PetProfile() {
  const navigate = useNavigate();
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Fetch pet data by petId from the backend API.
     */
    const fetchPetData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/pets/${petId}`); // Use your backend URL
        if (!response.ok) {
          if (response.status === 404) {
            setError('Pet not found');
          } else {
            setError('An error occurred while fetching pet data');
          }
          return;
        }
        const data = await response.json();
        setPet(data);
      } catch (err) {
        console.error('Error fetching pet data:', err);
        setError('Failed to fetch pet data');
      } finally {
        setLoading(false); // Ensure loading state is set to false
      }
    };

    fetchPetData();
  }, [petId]);

  if (loading) {
    return (
      <div className="pet-profile-page">
        <Header />
        <Navbar />
        <div className="page-title">
          <h1>Pet Profile</h1>
        </div>
        <div className="loading">
          <h2>Loading pet details...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pet-profile-page">
        <Header />
        <Navbar />
        <div className="page-title">
          <h1>Pet Profile</h1>
        </div>
        <div className="pet-not-found">
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="pet-profile-page">
      <Header />
      <Navbar />

      {/* Page Title */}
      <div className="page-title">
        <h1>Pet Profile</h1>
      </div>

      {/* Pet Information Section */}
      <div className="pet-info-section">
        {/* Left Side */}
        <div className="pet-image-container">
          <img src={pet.photo || '/default-pet-image.png'} alt={pet.name} className="pet-image" />
          <div className="pet-name">
            <h2>{pet.name}</h2>
          </div>
        </div>

        {/* Right Side */}
        <div className="pet-details">
          <p><strong>Age:</strong> {pet.age || 'N/A'}</p>
          <p><strong>Weight:</strong> {pet.size || 'N/A'}</p>
          <p><strong>Breed:</strong> {pet.breed || 'N/A'}</p>
          <p><strong>Location:</strong> {pet.location || 'N/A'}</p>
          <p><strong>Extra Info:</strong> {pet.extraInfo || 'N/A'}</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="pet-additional-info">
        {/* Left Side */}
        <div className="additional-info">
          <h3>About {pet.name}</h3>
          <p>{pet.extraInfo || 'No additional information provided.'}</p>
        </div>

        {/* Right Side */}
        <div className="start-application">
          <button onClick={() => navigate('/start-application/${petId}')}>
            Start Application
          </button>
        </div>
      </div>
    </div>
  );
}

export default PetProfile;
