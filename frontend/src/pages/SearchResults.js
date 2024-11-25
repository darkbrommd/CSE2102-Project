import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import './SearchResults.css';

function SearchResults() {
  // State variables for mandatory filters
  const [distance, setDistance] = useState('30');
  const [zipCode, setZipCode] = useState('06269');

  // State variables for optional filters
  const [includeShippable, setIncludeShippable] = useState(false);
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [petTypes, setPetTypes] = useState([]);
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // State variables for pet data
  const [allPets, setAllPets] = useState([]); // Stores all fetched pets
  const [searchResults, setSearchResults] = useState([]); // Stores filtered pets

  // State variables for available filter options
  const [availablePetTypes, setAvailablePetTypes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  const navigate = useNavigate();

  // Function to fetch pets based on mandatory filters
  const fetchPets = async () => {
    console.log('Fetching pets with mandatory filters...');
    try {
      const params = new URLSearchParams();

      if (distance) params.append('distance', distance);
      if (zipCode) params.append('zipCode', zipCode);

      // Include shippable as it's a mandatory filter
      params.append('includeShippable', includeShippable);

      const response = await fetch(`http://127.0.0.1:5000/pets?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pets');
      }

      const data = await response.json();
      setAllPets(data); // Store all fetched pets
      setSearchResults(data); // Initialize searchResults with all pets

      // Derive unique filter options from fetched data
      const uniquePetTypes = [...new Set(data.map(pet => pet.breed))].sort();
      const uniqueColors = [...new Set(data.map(pet => pet.color))].filter(Boolean).sort();
      const uniqueSizes = [...new Set(data.map(pet => pet.size))].filter(Boolean).sort();

      setAvailablePetTypes(uniquePetTypes);
      setAvailableColors(uniqueColors);
      setAvailableSizes(uniqueSizes);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setAllPets([]);
      setSearchResults([]);
      setAvailablePetTypes([]);
      setAvailableColors([]);
      setAvailableSizes([]);
    }
  };

  // Fetch pets when mandatory filters change
  useEffect(() => {
    fetchPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance, zipCode, includeShippable]);

  // Function to apply optional filters
  const applyFilters = () => {
    console.log('Applying filters to all pets...');
    let filteredPets = [...allPets];

    // Apply Pet Types filter
    if (petTypes.length > 0) {
      filteredPets = filteredPets.filter(pet => petTypes.includes(pet.breed));
    }

    // Apply Color filter
    if (color.length > 0) {
      filteredPets = filteredPets.filter(pet => pet.color && color.includes(pet.color));
    }

    // Apply Size filter
    if (size.length > 0) {
      filteredPets = filteredPets.filter(pet => pet.size && size.includes(pet.size));
    }

    // Apply Age filter only if minAge or maxAge is set
    if (minAge || maxAge) {
      filteredPets = filteredPets.filter(pet => {
        const petAge = parseInt(pet.age, 10);
        if (minAge && petAge < parseInt(minAge, 10)) return false;
        if (maxAge && petAge > parseInt(maxAge, 10)) return false;
        return true;
      });
    }

    // Apply Search Query filter
    if (searchQuery) {
      filteredPets = filteredPets.filter(pet =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setSearchResults(filteredPets);
  };

  // Apply filters whenever any optional filter changes
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petTypes, color, size, minAge, maxAge, searchQuery]);

  // Function to handle search button click or Enter key press
  const handleSearch = () => {
    applyFilters();
  };

  // Generate applied filters based on state
  const getAppliedFilters = () => {
    const appliedFilters = [];

    if (includeShippable) {
      appliedFilters.push('Shippable');
    }

    if (petTypes.length > 0) {
      petTypes.forEach(type => appliedFilters.push(type));
    }

    if (color.length > 0) {
      color.forEach(col => appliedFilters.push(col));
    }

    if (size.length > 0) {
      size.forEach(s => appliedFilters.push(s));
    }

    if (minAge || maxAge) {
      appliedFilters.push(`Age: ${minAge || 'Any'} - ${maxAge || 'Any'}`);
    }

    return appliedFilters;
  };

  // Remove filter and update state
  const removeFilter = filterToRemove => {
    if (filterToRemove === 'Shippable') {
      setIncludeShippable(false);
    } else if (petTypes.includes(filterToRemove)) {
      setPetTypes(petTypes.filter(type => type !== filterToRemove));
    } else if (color.includes(filterToRemove)) {
      setColor(color.filter(col => col !== filterToRemove));
    } else if (size.includes(filterToRemove)) {
      setSize(size.filter(s => s !== filterToRemove));
    } else if (filterToRemove.startsWith('Age:')) {
      setMinAge('');
      setMaxAge('');
    }
  };

  // Handle Enter Key Press in Search Input
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-results-page">
      <Header />
      <Navbar />

      {/* Slogan Banner with Gradient Background */}
      <div className="slogan-banner">
        <h2>Meet your new best friend!</h2>
      </div>

      {/* Floating Search Bar with Search Icon */}
      <div className="floating-search-bar">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search for pets..."
            className="search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearch}>
            <img src="/images/search-icon.png" alt="Search" className="search-icon" />
          </button>
        </div>
      </div>

      <div className="content">
        {/* Main Content */}
        <div className="main-content">
          {/* Filter Panel */}
          <div className="filter-panel">
            <h3>{searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'}</h3>
            {/* Applied Filters */}
            <div className="applied-filters">
              {getAppliedFilters().map((filter, index) => (
                <div key={index} className="filter-tag">
                  {filter}{' '}
                  <span className="remove" onClick={() => removeFilter(filter)}>
                    ×
                  </span>
                </div>
              ))}
            </div>
            {/* Filters */}
            <div className="filters">
              {/* Distance Filter */}
              <label htmlFor="distance-select">Distance:</label>
              <select
                id="distance-select"
                value={distance}
                onChange={e => setDistance(e.target.value)}
              >
                <option value="10">10 miles</option>
                <option value="20">20 miles</option>
                <option value="30">30 miles</option>
                <option value="50">50 miles</option>
                <option value="100">100 miles</option>
              </select>

              {/* ZIP Code Filter */}
              <label htmlFor="zip-code-input">ZIP Code:</label>
              <input
                type="text"
                id="zip-code-input"
                placeholder="ZIP Code"
                value={zipCode}
                onChange={e => setZipCode(e.target.value)}
              />

              {/* Include Shippable Pets Filter */}
              <label>
                <input
                  type="checkbox"
                  checked={includeShippable}
                  onChange={e => setIncludeShippable(e.target.checked)}
                />
                Include Shippable Pets
              </label>

              {/* Age Range Filter */}
              <label htmlFor="min-age-select">Age Range:</label>
              <div className="age-range">
                <select
                  id="min-age-select"
                  value={minAge}
                  onChange={e => setMinAge(e.target.value)}
                >
                  <option value="">Min Age</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  {/* Add more options as needed */}
                </select>
                <select
                  id="max-age-select"
                  value={maxAge}
                  onChange={e => setMaxAge(e.target.value)}
                >
                  <option value="">Max Age</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  {/* Add more options as needed */}
                </select>
              </div>

              {/* Pet Type Filter */}
              {availablePetTypes.length > 0 && (
                <>
                  <label>Pet Type:</label>
                  <div className="pet-types">
                    {availablePetTypes.map(type => (
                      <label key={type}>
                        <input
                          type="checkbox"
                          value={type}
                          checked={petTypes.includes(type)}
                          onChange={e => {
                            const value = e.target.value;
                            setPetTypes(prev =>
                              prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
                            );
                          }}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </>
              )}

              {/* Color Filter */}
              {availableColors.length > 0 && (
                <>
                  <label>Color:</label>
                  <div className="colors">
                    {availableColors.map(col => (
                      <label key={col}>
                        <input
                          type="checkbox"
                          value={col}
                          checked={color.includes(col)}
                          onChange={e => {
                            const value = e.target.value;
                            setColor(prev =>
                              prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
                            );
                          }}
                        />
                        {col}
                      </label>
                    ))}
                  </div>
                </>
              )}

              {/* Size Filter */}
              {availableSizes.length > 0 && (
                <>
                  <label>Size:</label>
                  <div className="sizes">
                    {availableSizes.map(s => (
                      <label key={s}>
                        <input
                          type="checkbox"
                          value={s}
                          checked={size.includes(s)}
                          onChange={e => {
                            const value = e.target.value;
                            setSize(prev =>
                              prev.includes(value) ? prev.filter(sz => sz !== value) : [...prev, value]
                            );
                          }}
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Search Results */}
          <div className="results-grid">
            {searchResults.map((pet, index) => (
              <div key={index} className="animal-card">
                <div className="animal-image-container">
                <img src={`/${pet.photo || 'images/default/default-pet.png'}`} alt={pet.name} />
                </div>
                <div className="animal-info">
                  <h4>{pet.name}</h4>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Age:</strong> {pet.age}</p>
                  <p><strong>Gender:</strong> {pet.gender}</p>
                  <p><strong>Location:</strong> {pet.location}</p>
                  <p><strong>Distance:</strong> {pet.distance} miles</p>
                  <button
                    className="adopt-button"
                    onClick={() => navigate(`/PetProfile/${pet.id}`)} // Navigate to the PetProfile page
                  >
                    Adopt me!
                  </button>
                </div>
              </div>
            ))}
            {searchResults.length === 0 && <p>No pets match your criteria.</p>}
          </div>
        </div>
      </div>

      {/* Optional: Remove this if you don't need the end slogan */}
      {/* <div className="end-slogan">
        <h2>Meet your new best friend!</h2>
      </div> */}
    </div>
  );
}

export default SearchResults;
