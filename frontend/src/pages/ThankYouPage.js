// ThankYouPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ThankYouPage.css';

function ThankYouPage({ donationDetails }) {
  const navigate = useNavigate();

  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        <h2 className="thank-you-header">Thank You for Your Generosity!</h2>
        <p className="thank-you-message">
          Your support helps us make a difference. Below is a summary of your donation:
        </p>

        <div className="donation-summary">
          <p><strong>Amount Donated:</strong> ${donationDetails.donationAmount}</p>
          <p><strong>Frequency:</strong> {donationDetails.frequency}</p>
          <p><strong>Donor Name:</strong> {donationDetails.name}</p>
          <p><strong>Email:</strong> {donationDetails.email}</p>
          <p><strong>Dedication:</strong> {donationDetails.dedication || 'None'}</p>
          <p><strong>Employer (for matching):</strong> {donationDetails.employer || 'N/A'}</p>
          <p><strong>Tax Receipt Requested:</strong> {donationDetails.taxReceipt ? 'Yes' : 'No'}</p>
        </div>

        <p className="confirmation-note">
          A confirmation email has been sent to <strong>{donationDetails.email}</strong>. Thank you for your contribution!
        </p>

        {/* Navigate Back to Home Button */}
        <button className="navigate-back-button" onClick={() => navigate('/')}>
          Navigate Back to Home
        </button>
      </div>
    </div>
  );
}

export default ThankYouPage;