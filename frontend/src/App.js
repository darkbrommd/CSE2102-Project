// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Donate from './pages/Donate';
import RecentDonations from './pages/RecentDonations';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import SearchResults from './pages/SearchResults';
import UserDashboard from './pages/UserDashboard';
import ChangeProfile from './pages/ChangeProfile';
import MyApplications from './pages/MyApplications';
import ApplicationDetail from './pages/ApplicationDetail';
import PetProfile from './pages/PetProfile';
import StartApplication from "./pages/StartApplication";
import ForgotPassword from './pages/ForgotPassword';

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
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchResults/>} />
        <Route path="/profile" element={<UserDashboard/>} />
        <Route path="/change-profile" element={<ChangeProfile/>} />
        <Route path="/my-applications" element={<MyApplications/>} />
        <Route path="/application/:applicationId" element={<ApplicationDetail />} />
        <Route path="/PetProfile/:petId" element={<PetProfile />} />
        <Route path="/start-application/:petId" element={<StartApplication />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />  
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
