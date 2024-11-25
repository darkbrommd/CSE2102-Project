// src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'active' : 'inactive')}
        end
      >
        Home
      </NavLink>
      <NavLink
        to="/search"
        className={({ isActive }) => (isActive ? 'active' : 'inactive')}
      >
        Search
      </NavLink>
      <NavLink
        to="/donate"
        className={({ isActive }) => (isActive ? 'active' : 'inactive')}
      >
        Donate
      </NavLink>
      <NavLink
        to="/about-us"
        className={({ isActive }) => (isActive ? 'active' : 'inactive')}
      >
        About Us
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive }) => (isActive ? 'active' : 'inactive')}
      >
        Contact
      </NavLink>
    </nav>
  );
}

export default Navbar;