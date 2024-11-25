// src/components/SidebarNavigation.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SidebarNavigation.css';

function SidebarNavigation({ active }) {
  const navigate = useNavigate();

  return (
    <div className="sidebar-navigation">
      <h2>My Adoption</h2>
      <ul>
        <li 
          className={active === 'summary' ? 'active' : ''}
          onClick={() => navigate('/profile')}
        >
          Summary
        </li>
        <li 
          className={active === 'change-profile' ? 'active' : ''}
          onClick={() => navigate('/change-profile')}
        >
          Change Profile
        </li>
        <li 
          className={active === 'my-applications' ? 'active' : ''}
          onClick={() => navigate('/my-applications')}
        >
          My Application
        </li>
      </ul>
    </div>
  );
}

export default SidebarNavigation;
