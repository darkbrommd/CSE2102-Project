// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Donate from './pages/Donate';
import RecentDonations from './pages/RecentDonations';
import Login from './pages/Login';
import Register from './pages/Register';
// Import other pages as needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/Donate" element={<RecentDonations />} />
        <Route path="/Donation" element={<Donate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
