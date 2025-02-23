import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable'; // The default
import './CssFiles/GameSelection.css';
import Creature from './Assets/PDTheCreature.png'
const MoneySlot = ({ amount }) => {
  const digits = amount.toString().split(''); // Only split the amount digits

  return (
    <div className="money-slot-window" style={{ width: `${(digits.length + 1) * 50}px` }}>
      {/* Title Bar */}
      <div className="title-bar">
        <span className="title-text">Money</span>
        <div className="window-buttons">
          <div className="window-btn minimize"></div>
          <div className="window-btn close"></div>
        </div>
      </div>
      {/* Slot Display */}
      <div className="slot-display">
        {/* Add the $ symbol first */}
        <motion.div
          className="slot-digit"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0, type: 'spring', stiffness: 100 }}
        >
          $
        </motion.div>
        {digits.map((digit, index) => (
          <motion.div
            key={index}
            className="slot-digit"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: (index + 1) * 0.1, type: 'spring', stiffness: 100 }}
          >
            {digit}
          </motion.div>
        ))}
      </div>
    </div>
  );
};


const GameSelection = () => {
  const [money, setMoney] = useState(123298938190909);
  const [username, setUsername] = useState('Guest');
  const [currentTime, setCurrentTime] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      setCurrentTime(timeString);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const games = [
    { id: 1, name: "Statistics", icon: "📈", route: "/Stats" },
    { id: 2, name: "Black Jack", icon: "🃏", route: "/Blackjack" },
    { id: 3, name: "Roulette", icon: "🛞", route: "/Roulette" },
    { id: 4, name: "Slots", icon: "🎰", route: "/Slots" },
    { id: 5, name: "Locked", icon: "🔒", route: "/GameSelection" },
    { id: 6, name: "Mystery", icon: "❓", route: "/GameSelection" },
  ];

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="GS-Container">
      <Helmet>
        <title>Game Selection</title>
      </Helmet>
      <img className='PDImage' img src={Creature} alt="cur"/>

      {/* Time Display */}
      <div className="GS-TimeDisplay">{currentTime}</div>

      {/* Money Slot Display */}
      <Draggable>
      <div className="GS-MoneyDisplay">
        <MoneySlot amount={money} />
      </div>
      </Draggable>

      {/* Desktop Icons */}
      <div className="GS-Icons">
        {games.map((game) => (
          <div
            key={game.id}
            className="GS-IconLink"
            onClick={() => handleNavigation(game.route)}
          >
            <div className="GS-Icon">
              <div className="GS-IconImage">{game.icon}</div>
              <div className="GS-IconLabel">{game.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Taskbar */}
      <div className="GS-Taskbar">
        <input
          type="text"
          className="GS-TaskbarInput"
          placeholder="🔎|User Search 📈"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <div className="GS-TaskbarUsername">Hello, {username}</div>
      </div>

      {/* Easter Egg Icon */}
      <div className="GS-EasterEgg">🗑️</div>
    </div>
  );
};

export default GameSelection;
