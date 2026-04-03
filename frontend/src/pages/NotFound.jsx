import React from 'react';

const NotFound = ({ onNavigate }) => {
  return (
    <div className='not-found-container'>
      <div className='not-found-content'>
        <h1 className='not-found-title'>404</h1>
        <h2 className='not-found-subtitle'>Page Not Found</h2>
        <p className='not-found-message'>
          Sorry, the page you're looking for doesn't exist.
        </p>
        <button className='not-found-button' onClick={() => onNavigate('home')}>
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
