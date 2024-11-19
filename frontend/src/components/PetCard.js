// src/components/PetCard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PetCard.css';

/**
 * PetCard component displays a summary of pet information.
 * @component
 * @param {Object} props
 * @param {string} props.image - URL of the pet image.
 * @param {string} props.name - Name of the pet.
 * @param {number} props.id - Unique identifier of the pet.
 */
function PetCard({ image, name, id }) {
  const navigate = useNavigate();

  const handleAdoptClick = () => {
    navigate(`/PetProfile/${id}`);
  };

  return (
    <div className="pet-card">
      <img src={image} alt={name} />
      <h4>{name}</h4>
      <button onClick={handleAdoptClick}>Adopt Me</button>
    </div>
  );
}

export default PetCard;
