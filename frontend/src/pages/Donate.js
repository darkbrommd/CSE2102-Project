// src/pages/Donate.js
import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import WaysToGive from '../components/WaysToGive';
import ThankYouPage from './ThankYouPage';
import './Donate.css';
import axios from 'axios';

function Donate() {
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

  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [donationDetails, setDonationDetails] = useState(null);

  const feedbackRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      date: new Date().toISOString(),
    };

    try {
      await axios.post('http://127.0.0.1:5000/add_donation', donationData);
      setDonationSuccess(true);
      setDonationDetails(donationData);
      resetForm();
    } catch (error) {
      setFeedbackMessage({ type: 'error', text: 'Failed to process your donation. Please try again.' });
      console.error('Error submitting donation:', error);
      if (feedbackRef.current) feedbackRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setDonationAmount('');
    setFrequency('one-time');
    setName('');
    setEmail('');
    setPhone('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setBillingAddress('');
    setZipCode('');
    setDedication('');
    setAnonymous(false);
    setEmployer('');
    setSubscribe(false);
    setConsent(false);
    setTaxReceipt(false);
  };

  if (donationSuccess) {
    return <ThankYouPage donationDetails={donationDetails} />;
  }

  return (
    <div>
      <Header />
      <Navbar />
      <div className="donate-page">
        <h1>Support Our Mission</h1>
        <p className="intro-text">
          Your generosity fuels our efforts to make a real difference. Contribute today and become a part of our journey toward positive change.
        </p>
        <WaysToGive />

        {/* Feedback Message */}
        {feedbackMessage && (
          <p ref={feedbackRef} className={`feedback-message ${feedbackMessage.type}`}>
            {feedbackMessage.text}
          </p>
        )}

        <form className="donation-form" onSubmit={handleSubmit}>
          {/* Donation Amount */}
          <div className="form-section">
            <h2>Donation Amount</h2>
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
              Or Enter a Custom Amount:
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
            <h2>Donation Frequency</h2>
            <label className="radio-label">
              <input
                type="radio"
                name="frequency"
                value="one-time"
                checked={frequency === 'one-time'}
                onChange={(e) => setFrequency(e.target.value)}
              />
              One-Time
            </label>
            <label className="radio-label">
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
            <h2>Personal Information</h2>
            <label>
              Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Email:
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Phone Number:
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
          </div>

          {/* Payment Information */}
          <div className="form-section">
            <h2>Payment Information</h2>
            <label>
              Card Number:
              <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
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
              <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
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
              <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
            </label>
          </div>

          {/* Additional Options */}
          <div className="form-section">
            <h2>Additional Options</h2>
            <label>
              Dedicate This Donation:
              <input
                type="text"
                placeholder="In honor of..."
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
              />
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              Make this donation anonymous
            </label>
            <label>
              Employer (for matching donations):
              <input type="text" value={employer} onChange={(e) => setEmployer(e.target.value)} />
            </label>
          </div>

          {/* Newsletter Signup */}
          <div className="form-section">
            <label className="checkbox-label">
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
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
              />
              I agree to the terms, conditions, and privacy policy
            </label>
            <label className="checkbox-label">
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
