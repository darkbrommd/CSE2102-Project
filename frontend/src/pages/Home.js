// src/pages/Home.js
import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Slogan from '../components/Slogan';
import AdoptionGallery from '../components/AdoptionGallery';
import './Home.css'; // Import the CSS file for Home component

function Home() {
  return (
    <div className="home-page">
      <Header />
      <Navbar />
      <Slogan />
      <AdoptionGallery />
    </div>
  );
}

export default Home;