// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Donate from './pages/Donate';
import RecentDonations from './pages/RecentDonations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/Donate" element={<RecentDonations />} />
        <Route path="/Donation" element={<Donate />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
