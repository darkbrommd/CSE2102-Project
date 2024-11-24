import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import './PetProfile.css';

function PetProfile() {
  const navigate = useNavigate();
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriteMessage, setFavoriteMessage] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [hasActiveAdoption, setHasActiveAdoption] = useState(false); // Track if an adoption exists

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/pets/${petId}`);
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
        setLoading(false);
      }
    };

    const checkIfFavorited = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:5000/get-favorites', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const favorites = await response.json();
        const isAlreadyFavorited = favorites.some((favorite) => favorite.id === parseInt(petId, 10));
        setIsFavorited(isAlreadyFavorited);
      } catch (error) {
        console.error('Error checking favorites:', error);
      }
    };

    const checkActiveAdoption = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:5000/my-adoptions`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const activeAdoption = data.adoptions.some((adoption) => adoption.pet_id === parseInt(petId, 10));
          setHasActiveAdoption(activeAdoption);
        }
      } catch (error) {
        console.error('Error checking active adoption:', error);
      }
    };

    fetchPetData();
    checkIfFavorited();
    checkActiveAdoption();
  }, [petId]);

  const handleAddToFavorites = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/add-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pet_id: petId }),
      });

      const data = await response.json();
      if (response.ok) {
        setFavoriteMessage(data.message);
        setIsFavorited(true);
      } else {
        setFavoriteMessage(data.error || 'Failed to add favorite.');
      }
    } catch (error) {
      console.error('Error adding pet to favorites:', error);
      setFavoriteMessage('Failed to add pet to favorites. Please try again.');
    }
  };

  const handleRemoveFromFavorites = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/remove-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pet_id: petId.toString() }),
      });

      const data = await response.json();
      if (response.ok) {
        setFavoriteMessage(data.message);
        setIsFavorited(false);
      } else {
        setFavoriteMessage(data.error || 'Failed to remove favorite.');
      }
    } catch (error) {
      console.error('Error removing pet from favorites:', error);
      setFavoriteMessage('Failed to remove pet from favorites. Please try again.');
    }
  };

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

      <div className="page-title">
        <h1>Pet Profile</h1>
      </div>

      <div className="pet-info-section">
        <div className="pet-image-container">
          <img src={`/${pet.photo || 'images/default/default-pet.png'}`} alt={pet.name} className="pet-image" />
          <div className="pet-name">
            <h2>{pet.name}</h2>
          </div>
        </div>

        <div className="pet-details">
          <p><strong>Age:</strong> {pet.age || 'N/A'}</p>
          <p><strong>Weight:</strong> {pet.size || 'N/A'}</p>
          <p><strong>Breed:</strong> {pet.breed || 'N/A'}</p>
          <p><strong>Gender:</strong> {pet.gender || 'N/A'}</p>
          <p><strong>Location:</strong> {pet.location || 'N/A'}</p>
        </div>
      </div>

      <div className="pet-additional-info">
        <div className="additional-info">
          <h3>About {pet.name}</h3>
          <p>{pet.about || 'No additional information provided.'}</p>
        </div>

        <div className="action-buttons">
          <button
            className="start-application-button"
            onClick={() => navigate(`/start-application/${petId}`)}
            disabled={hasActiveAdoption} // Disable button if adoption exists
          >
            {hasActiveAdoption ? 'Application Already Started' : 'Start Application'}
          </button>
          {isFavorited ? (
            <button className="remove-from-favorites" onClick={handleRemoveFromFavorites}>
              Unfavorite
            </button>
          ) : (
            <button className="add-to-favorites" onClick={handleAddToFavorites}>
              Add to Favorites
            </button>
          )}
          {favoriteMessage && <p className="favorite-message">{favoriteMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default PetProfile;