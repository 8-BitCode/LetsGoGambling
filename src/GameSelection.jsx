import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CssFiles/GameSelection.css';
import { Helmet } from 'react-helmet';
import { Button } from "@headlessui/react"; //download this package using "npm install @headlessui/react"

const games = [
  { name: "Blackjack", description: "Test your card skills against the dealer.", path: "/blackjack" },
  { name: "Roulette", description: "Spin the wheel and see where luck takes you.", path: "/roulette" },
  { name: "Slots", description: "Pull the lever and match the reels.", path: "/slots" }
];

const GameSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {}; // Extracting the username

  return (
    <>
      <Helmet>
        <title>Game Selection</title>
      </Helmet>

      <div className='GS-Container'>
        <h1 className='text-3xl font-bold mb-6'>Game Selection Page</h1>
        {username ? (
          <div>Welcome, {username}!</div>
        ) : (
          <div>No username set yet. Please set a username in the entry page.</div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {games.map((game) => (
            <div
              key={game.name}
              onClick={() => navigate(game.path)}
              className='game-card'
            >
              <div className='game-card-content'>
                <h2 className='text-2xl font-semibold mb-2'>{game.name}</h2>
                <p className='text-sm text-gray-400'>{game.description}</p>
                <Button className='mt-4 bg-blue-600 hover:bg-blue-700'>Play</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GameSelection;