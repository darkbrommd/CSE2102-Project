// src/components/PetCard.js
import React from 'react';
import './PetCard.css';

function PetCard({ image, name }) {
  return (
    <div className="pet-card">
      <img src={image} alt={name} />
      <h4>{name}</h4>
      <button>Adopt Me</button>
    </div>
  );
}

export default PetCard;
