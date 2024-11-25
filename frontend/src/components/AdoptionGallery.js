import React, { useEffect, useState } from 'react';
import PetCard from './PetCard';
import './AdoptionGallery.css';

function AdoptionGallery() {
  const [pets, setPets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const petsPerView = 3;

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/pets'); // Fetch from the backend API
        if (!response.ok) {
          throw new Error('Failed to fetch pet data');
        }
        const data = await response.json();
        setPets(data); // Update pets state with the fetched data
      } catch (err) {
        setError('Failed to load pets. Please try again later.');
        console.error('Error fetching pets:', err);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchPets();
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

  if (loading) {
    return <div>Loading pets...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
          {displayedPets.length > 0 ? (
            displayedPets.map((pet) => (
              <PetCard
                key={pet.id}
                id={pet.id}
                image={pet.photo || '/default-pet-image.png'} // Fallback image
                name={pet.name}
              />
            ))
          ) : (
            <p>No pets available for adoption at the moment.</p>
          )}
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
