// src/pages/PetProfile.js

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

  // Simulate fetching pet data based on petId
  useEffect(() => {
    /**
     * Fetch pet data by petId.
     * TODO: Replace this with actual API call to fetch pet data by petId.
     * For backend engineers: API endpoint should be something like /api/pets/:petId
     */
    const fetchPetData = async () => {
      // Simulated pet data
      const petData = {
        1: {
          id: 1,
          name: 'Jonathan',
          age: '2 years',
          weight: '50 lbs',
          breed: 'Siberian Husky',
          location: 'New Haven, CT',
          extraInfo: 'Loves to play in the snow and is great with kids.',
          image: '/images/husky.png',
        },
        2: {
          id: 2,
          name: 'Snowflake',
          age: '1 year',
          weight: '15 lbs',
          breed: 'Pomeranian',
          location: 'Storrs, CT',
          extraInfo: 'Very friendly and energetic.',
          image: '/public/images/puppies-background.png',
        },
        // Add more pet data as needed
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const petInfo = petData[petId];

      if (petInfo) {
        setPet(petInfo);
      } else {
        // Handle pet not found
        setPet(null);
      }
    };

    fetchPetData();
  }, [petId]);

  if (pet === null) {
    return (
      <div className="pet-profile-page">
        <Header />
        <Navbar />
        <div className="page-title">
          <h1>Pet Profile</h1>
        </div>
        <div className="pet-not-found">
          <h2>Pet not found</h2>
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
          <img src={pet.image} alt={pet.name} className="pet-image" />
          <div className="pet-name">
            <h2>{pet.name}</h2>
          </div>
        </div>

        {/* Right Side */}
        <div className="pet-details">
          <p><strong>Age:</strong> {pet.age}</p>
          <p><strong>Weight:</strong> {pet.weight}</p>
          <p><strong>Breed:</strong> {pet.breed}</p>
          <p><strong>Location:</strong> {pet.location}</p>
          <p><strong>Extra Info:</strong> {pet.extraInfo}</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="pet-additional-info">
        {/* Left Side */}
        <div className="additional-info">
          <h3>About {pet.name}</h3>
          <p>{pet.extraInfo}</p>
          {/* Additional images or text can be added here */}
        </div>

        {/* Right Side */}
        <div className="start-application">
          <button onClick={() => navigate('/start-application')}>
            Start Application
          </button>
        </div>
      </div>
    </div>
  );
}

export default PetProfile;
