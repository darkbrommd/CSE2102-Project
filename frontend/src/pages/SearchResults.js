import React, { useState, useEffect } from 'react';
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
    console.log('Fetching search results with current filters...');
    // Simulate API call with more pet entries to fill the grid
    setTimeout(() => {
      setSearchResults([
        {
          name: 'Snowflake',
          breed: 'Pomeranian',
          age: '2 years',
          gender: 'Female',
          location: 'Storrs, CT',
          distance: '5 miles',
          image: '/images/puppies-background.png',
        },
        {
          name: 'Fluffy',
          breed: 'Husky',
          age: '1 year',
          gender: 'Male',
          location: 'Hartford, CT',
          distance: '10 miles',
          image: '/images/husky.png',
        },
        {
          name: 'Whiskers',
          breed: 'Kitten',
          age: '6 months',
          gender: 'Female',
          location: 'New Haven, CT',
          distance: '8 miles',
          image: '/images/kitten.png',
        },
        {
          name: 'Coco',
          breed: 'Parrot',
          age: '3 years',
          gender: 'Male',
          location: 'Boston, MA',
          distance: '15 miles',
          image: '/images/parrot.png',
        },
        {
          name: 'Hopper',
          breed: 'Bunny',
          age: '1 year',
          gender: 'Male',
          location: 'Providence, RI',
          distance: '12 miles',
          image: '/images/bunny.png',
        },
        {
          name: 'Shelly',
          breed: 'Turtle',
          age: '5 years',
          gender: 'Female',
          location: 'Springfield, MA',
          distance: '20 miles',
          image: '/images/turtle.png',
        },
        {
          name: 'Buddy',
          breed: 'Golden Retriever',
          age: '4 years',
          gender: 'Male',
          location: 'Bridgeport, CT',
          distance: '7 miles',
          image: '/images/golden-retriever.png',
        },
        {
          name: 'Luna',
          breed: 'Cat',
          age: '2 years',
          gender: 'Female',
          location: 'Albany, NY',
          distance: '25 miles',
          image: '/images/kitten.png',
        },
        {
          name: 'Charlie',
          breed: 'Dog',
          age: '3 years',
          gender: 'Male',
          location: 'Stamford, CT',
          distance: '9 miles',
          image: '/images/husky.png',
        },
        // Add more pets as needed
      ]);
    }, 500);
  }, [distance, zipCode, includeShippable, minAge, maxAge, petTypes, color, size]);

  // Handle Enter Key Press in Search Input
  const handleKeyPress = (e) => {
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
                  <button className="adopt-button">Adopt me!</button>
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