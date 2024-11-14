// src/pages/AboutUs.js
import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

function AboutUs() {
  return (
    <div>
      <Header />
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>About Us</h2>
        <p>Information about HuskyAdoption.</p>
      </div>
    </div>
  );
}

export default AboutUs;
