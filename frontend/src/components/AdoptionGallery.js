// src/components/AdoptionGallery.js

import React, { useEffect, useState } from 'react';
import PetCard from './PetCard';
import './AdoptionGallery.css';

function AdoptionGallery() {
  const [pets, setPets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const petsPerView = 3;

  useEffect(() => {
    // Mock data representing pets available for adoption
    const localPets = [
      { id: 1, name: 'Husky', imageUrl: '/images/husky.png' },
      { id: 2, name: 'Kitten', imageUrl: '/images/kitten.png' },
      { id: 3, name: 'Golden Retriever', imageUrl: '/images/golden-retriever.png' },
      { id: 4, name: 'Bunny', imageUrl: '/images/bunny.png' },
      { id: 5, name: 'Parrot', imageUrl: '/images/parrot.png' },
      { id: 6, name: 'Turtle', imageUrl: '/images/turtle.png' },
    ];
    setPets(localPets);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < pets.length - petsPerView ? prevIndex + 1 : prevIndex
    );
  };

  // Determine the pets to display
  const displayedPets = pets.slice(currentIndex, currentIndex + petsPerView);

  return (
    <div className="adoption-gallery">
      <h3>Adopt Your New Best Friend!</h3>
      <div className="gallery-container">
        {/* Left Arrow */}
        <button
          className="arrow-button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <img src="/images/left-arrow.png" alt="Left Arrow" className="arrow" />
        </button>

        {/* Pet Cards */}
        <div className="gallery">
          {displayedPets.map((pet) => (
            <PetCard key={pet.id} id={pet.id} image={pet.imageUrl} name={pet.name} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="arrow-button"
          onClick={handleNext}
          disabled={currentIndex >= pets.length - petsPerView}
        >
          <img src="/images/right-arrow.png" alt="Right Arrow" className="arrow" />
        </button>
      </div>
    </div>
  );
}

export default AdoptionGallery;
