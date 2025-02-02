import React from 'react';
import { useLocation } from 'react-router-dom';
import './CssFiles/GameSelection.css';
import { Helmet } from 'react-helmet';

const GameSelection = () => {
  const location = useLocation();
  const { username } = location.state || {}; // Safely extract the username from route state

  return (
    <>
      <Helmet>
        <title>Game Selection</title>
      </Helmet>

      <div className='GS-Container'>
        <div>Games Selection Page</div>
        {username ? (
          <div>Welcome, {username}!</div>  // Show username if it's set
        ) : (
          <div>No username set yet. Please set a username in the entry page.</div>
        )}
      </div>
    </>
  );
};

export default GameSelection;
