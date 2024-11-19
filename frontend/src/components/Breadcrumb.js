// src/components/Breadcrumb.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Breadcrumb.css';

function Breadcrumb({ paths }) {
  const navigate = useNavigate();

  return (
    <div className="breadcrumb">
      {paths.map((path, index) => (
        <span key={index}>
          {path.url ? (
            <>
              <span 
                className="breadcrumb-link" 
                onClick={() => navigate(path.url)}
              >
                {path.name}
              </span>
              {index < paths.length - 1 && ' > '}
            </>
          ) : (
            <span className="breadcrumb-current">{path.name}</span>
          )}
        </span>
      ))}
    </div>
  );
}

export default Breadcrumb;
