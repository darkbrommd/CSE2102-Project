import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import './SearchResults.css';

function SearchResults() {
  // State variables for filters
  const [distance, setDistance] = useState('30');
  const [zipCode, setZipCode] = useState('06269');
  const [includeShippable, setIncludeShippable] = useState(false);
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [petTypes, setPetTypes] = useState([]);
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate applied filters based on state
  const getAppliedFilters = () => {
    const appliedFilters = [];

    if (includeShippable) {
      appliedFilters.push('Shippable');
    }

    if (petTypes.length > 0) {
      petTypes.forEach((type) => appliedFilters.push(type));
    }

    if (color.length > 0) {
      color.forEach((col) => appliedFilters.push(col));
    }

    if (size.length > 0) {
      size.forEach((s) => appliedFilters.push(s));
    }

    if (minAge || maxAge) {
      appliedFilters.push(`Age: ${minAge || 'Any'} - ${maxAge || 'Any'}`);
    }

    return appliedFilters;
  };

  // Remove filter and update state
  const removeFilter = (filterToRemove) => {
    if (filterToRemove === 'Shippable') {
      setIncludeShippable(false);
    } else if (petTypes.includes(filterToRemove)) {
      setPetTypes(petTypes.filter((type) => type !== filterToRemove));
    } else if (color.includes(filterToRemove)) {
      setColor(color.filter((col) => col !== filterToRemove));
    } else if (size.includes(filterToRemove)) {
      setSize(size.filter((s) => s !== filterToRemove));
    } else if (filterToRemove.startsWith('Age:')) {
      setMinAge('');
      setMaxAge('');
    }
  };

  // Handle Search Function
  const handleSearch = () => {
    console.log('Search triggered with query:', searchQuery);
    // Implement your search logic here
    // For demonstration, we'll just log the search query
    // You might want to update the searchResults based on the query
  };

  // Fetch search results when filters change
  
  useEffect(() => {
    const fetchPets = async () => {
      console.log('Fetching search results with current filters...');
      try {
        // Construct query parameters based on filters
        const params = new URLSearchParams();
  
        if (distance) params.append('distance', distance);
        if (zipCode) params.append('zipCode', zipCode);
        if (includeShippable) params.append('includeShippable', includeShippable);
        if (minAge) params.append('minAge', minAge);
        if (maxAge) params.append('maxAge', maxAge);
        if (petTypes.length > 0) params.append('petTypes', petTypes.join(','));
        if (color.length > 0) params.append('color', color.join(','));
        if (size.length > 0) params.append('size', size.join(','));
  
        // Fetch pets from the backend API
        const response = await fetch(`http://127.0.0.1:5000/pets?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch pets');
        }
  
        const data = await response.json();
        setSearchResults(data); // Update the search results with the fetched data
      } catch (err) {
        console.error('Error fetching pets:', err);
        setSearchResults([]); // Clear results in case of error
      }
    };
  
    fetchPets();
  }, [distance, zipCode, includeShippable, minAge, maxAge, petTypes, color, size]);
  

  // Handle Enter Key Press in Search Input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const navigate = useNavigate();
  
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
            onChange={(e) => setSearchQuery(e.target.value)}
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
            <h3>{searchResults.length} matches</h3>
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
              <label>Distance:</label>
              <select
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              >
                <option value="10">10 miles</option>
                <option value="20">20 miles</option>
                <option value="30">30 miles</option>
                <option value="50">50 miles</option>
                <option value="100">100 miles</option>
              </select>
              <input
                type="text"
                placeholder="ZIP Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />

              <label>
                <input
                  type="checkbox"
                  checked={includeShippable}
                  onChange={(e) => setIncludeShippable(e.target.checked)}
                />
                Include Shippable Pets
              </label>

              <label>Age Range:</label>
              <select
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
              >
                <option value="">Min Age</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                {/* Add more options */}
              </select>
              <select
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
              >
                <option value="">Max Age</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                {/* Add more options */}
              </select>

              <label>Pet Type:</label>
              <div className="pet-types">
                <label>
                  <input
                    type="checkbox"
                    value="Cat"
                    checked={petTypes.includes('Cat')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPetTypes((prev) =>
                        prev.includes(value)
                          ? prev.filter((type) => type !== value)
                          : [...prev, value]
                      );
                    }}
                  />
                  Cat
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Parrot"
                    checked={petTypes.includes('Parrot')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPetTypes((prev) =>
                        prev.includes(value)
                          ? prev.filter((type) => type !== value)
                          : [...prev, value]
                      );
                    }}
                  />
                  Parrot
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Dog"
                    checked={petTypes.includes('Dog')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPetTypes((prev) =>
                        prev.includes(value)
                          ? prev.filter((type) => type !== value)
                          : [...prev, value]
                      );
                    }}
                  />
                  Dog
                </label>
                {/* Add more pet types */}
              </div>

              {/* Additional Categories */}
              <label>Color:</label>
              <div className="colors">
                <label>
                  <input
                    type="checkbox"
                    value="Black"
                    checked={color.includes('Black')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setColor((prev) =>
                        prev.includes(value)
                          ? prev.filter((col) => col !== value)
                          : [...prev, value]
                      );
                    }}
                  />
                  Black
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="White"
                    checked={color.includes('White')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setColor((prev) =>
                        prev.includes(value)
                          ? prev.filter((col) => col !== value)
                          : [...prev, value]
                      );
                    }}
                  />
                  White
                </label>
                {/* Add more colors */}
              </div>

              <label>Size:</label>
              <div className="sizes">
                <label>
                  <input
                    type="checkbox"
                    value="Small"
                    checked={size.includes('Small')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSize((prev) =>
                        prev.includes(value)
                          ? prev.filter((s) => s !== value)
                          : [...prev, value]
                      );
                    }}
                  />
                  Small
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Medium"
                    checked={size.includes('Medium')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSize((prev) =>
                        prev.includes(value)
                          ? prev.filter((s) => s !== value)
                          : [...prev, value]
                      );
                    }}
                  />
                  Medium
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Large"
                    checked={size.includes('Large')}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSize((prev) =>
                        prev.includes(value)
                          ? prev.filter((s) => s !== value)
                          : [...prev, value]
                      );
                    }}
                  />
                  Large
                </label>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="results-grid">
            {searchResults.map((pet, index) => (
              <div key={index} className="pet-card">
                <div className="pet-image-container">
                  <img src={pet.image} alt={pet.name} />
                </div>
                <div className="pet-info">
                  <h4>{pet.name}</h4>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Age:</strong> {pet.age}</p>
                  <p><strong>Gender:</strong> {pet.gender}</p>
                  <p><strong>Location:</strong> {pet.location}</p>
                  <p><strong>Distance:</strong> {pet.distance}</p>
                  <button
                    className="adopt-button"
                    onClick={() => navigate(`/PetProfile/${pet.id}`)} // Navigate to the PetProfile page
                  >
                    Adopt me!
                  </button>
                </div>
              </div>
            ))}
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