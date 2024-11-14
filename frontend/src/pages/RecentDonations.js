import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Import the Header component
import Navbar from '../components/Navbar'; // Import the Navbar component
import './RecentDonations.css';

function RecentDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/recent_donations');
        console.log("API response:", response.data);
        setDonations(response.data); 
      } catch (err) {
        setError('Failed to load recent donations. Please try again later.');
        console.error('Error fetching donations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  if (loading) {
    return <p>Loading recent donations...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Header /> {/* Header component for consistent top navigation */}
      <Navbar /> {/* Navbar component for site-wide navigation */}
      <div className="recent-donations">
        <h1>Support Our Cause</h1>
        <p className="intro-text">
          Every contribution helps us make a difference. Join our community of supporters and help us achieve our mission
          to bring positive change. Your donations go directly toward making a real impact.
        </p>
        <button className="donate-button" onClick={() => navigate('/donation')}>
          Donate Now
        </button>

        <div className="image-section">
          <img src="https://via.placeholder.com/600x300" alt="Supporting Cause" className="support-image" />
          <p className="image-caption">Your generosity supports meaningful projects and life-changing initiatives.</p>
        </div>

        <h2>Recent Donations</h2>
        <div className="donation-entries">
          {donations.map((donation, index) => (
            <div className="donation-entry" key={index}>
              <span className="donor-name">
                {donation.anonymous ? 'Anonymous' : donation.name}
              </span>
              <span className="donation-amount">${donation.amount}</span>
              <span className="donation-date">{new Date(donation.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentDonations;