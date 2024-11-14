// src/pages/Home.js
import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Slogan from '../components/Slogan';
import AdoptionGallery from '../components/AdoptionGallery';

function Home() {
  return (
    <div>
      <Header />
      <Navbar />
      <Slogan />
      <AdoptionGallery />
    </div>
  );
}

export default Home;
