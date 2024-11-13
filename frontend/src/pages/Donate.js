// src/pages/Donate.js
import React, { useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import WaysToGive from '../components/WaysToGive';
import './Donate.css'; // Create a CSS file for styling

function Donate() {
  // State variables for form inputs
  const [donationAmount, setDonationAmount] = useState('');
  const [frequency, setFrequency] = useState('one-time');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [dedication, setDedication] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [employer, setEmployer] = useState('');
  const [subscribe, setSubscribe] = useState(false);
  const [consent, setConsent] = useState(false);
  const [taxReceipt, setTaxReceipt] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can prepare the data to send to the backend
    const donationData = {
      donationAmount,
      frequency,
      name,
      email,
      phone,
      cardNumber,
      expiry,
      cvv,
      billingAddress,
      zipCode,
      dedication,
      anonymous,
      employer,
      subscribe,
      consent,
      taxReceipt,
    };

    // For now, we'll just log the data
    console.log('Donation Data:', donationData);

    // TODO: Connect to backend API to process the donation
  };

  return (
    <div>
      <Header />
      <Navbar />
      <WaysToGive />
      <div className="donate-page">
        <h2>
          We accept a wide range of payment methods, including Visa, Mastercard, and American Express.
        </h2>
        <p>Below is the form to support our work:</p>
        <form className="donation-form" onSubmit={handleSubmit}>
          {/* Donation Amount */}
          <div className="form-section">
            <h3>Donation Amount</h3>
            <div className="preset-amounts">
              <button type="button" onClick={() => setDonationAmount(10)}>
                $10
              </button>
              <button type="button" onClick={() => setDonationAmount(25)}>
                $25
              </button>
              <button type="button" onClick={() => setDonationAmount(50)}>
                $50
              </button>
              <button type="button" onClick={() => setDonationAmount(100)}>
                $100
              </button>
            </div>
            <label>
              Custom Amount:
              <input
                type="number"
                min="1"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                required
              />
            </label>
          </div>

          {/* Donation Frequency */}
          <div className="form-section">
            <h3>Donation Frequency</h3>
            <label>
              <input
                type="radio"
                name="frequency"
                value="one-time"
                checked={frequency === 'one-time'}
                onChange={(e) => setFrequency(e.target.value)}
              />
              One-Time
            </label>
            <label>
              <input
                type="radio"
                name="frequency"
                value="monthly"
                checked={frequency === 'monthly'}
                onChange={(e) => setFrequency(e.target.value)}
              />
              Monthly
            </label>
          </div>

          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Phone Number:
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
          </div>

          {/* Payment Information */}
          <div className="form-section">
            <h3>Payment Information</h3>
            <label>
              Card Number:
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </label>
            <label>
              Expiry Date (MM/YY):
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
              />
            </label>
            <label>
              CVV:
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </label>
            <label>
              Billing Address:
              <input
                type="text"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                required
              />
            </label>
            <label>
              Zip Code:
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />
            </label>
            <p className="security-message">
              Your payment information is secure and encrypted.
            </p>
          </div>

          {/* Additional Options */}
          <div className="form-section">
            <h3>Additional Options</h3>
            <label>
              Dedicate This Donation:
              <input
                type="text"
                placeholder="In honor of..."
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              Make this donation anonymous
            </label>
            <label>
              Employer (for matching donations):
              <input
                type="text"
                value={employer}
                onChange={(e) => setEmployer(e.target.value)}
              />
            </label>
          </div>

          {/* Newsletter Signup */}
          <div className="form-section">
            <label>
              <input
                type="checkbox"
                checked={subscribe}
                onChange={(e) => setSubscribe(e.target.checked)}
              />
              Sign me up for updates and newsletters
            </label>
          </div>

          {/* Consent and Tax Receipt */}
          <div className="form-section">
            <label>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
              />
              I agree to the terms, conditions, and privacy policy
            </label>
            <label>
              <input
                type="checkbox"
                checked={taxReceipt}
                onChange={(e) => setTaxReceipt(e.target.checked)}
              />
              I would like a receipt for tax deduction purposes
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Donate Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default Donate;
