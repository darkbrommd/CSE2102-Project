// src/pages/Contact.js
import React, { useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import './Contact.css';

function Contact() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const contactData = {
      firstName,
      lastName,
      email,
      message,
    };

    console.log('Contact Data:', contactData);

    setConfirmationMessage('Sent message!');
    setFirstName('');
    setLastName('');
    setEmail('');
    setMessage('');

    setTimeout(() => setConfirmationMessage(''), 3000);
  };

  return (
    <div>
      <Header />
      <Navbar />
      <div className="contact-page">
        <h2>Contact Us</h2>
        <p>We’d love to hear from you! Please fill out the form below.</p>

        {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}

        <div className="contact-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="form-section">
              <label className="form-label">Name:</label>
              <div className="name-inputs">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  placeholder="First"
                  required
                />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  placeholder="Last"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="form-section">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="Email"
                required
              />
            </div>

            {/* Message Input */}
            <div className="form-section">
              <label>Message:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
