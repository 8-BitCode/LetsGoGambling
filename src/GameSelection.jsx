import React, { useState, useEffect } from 'react';
import './CssFiles/GameSelection.css';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';
import { auth, db, collection, query, where, getDocs, updateDoc, doc } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Creature from './Assets/PDTheCreature.png';

const MoneySlot = ({ amount }) => {
  const digits = amount.toString().split(''); // Split the amount digits

  return (
    <div className="money-slot-window" style={{ width: `${(digits.length + 1) * 50}px` }}>
      <div className="title-bar">
        <span className="title-text">Money</span>
        <div className="window-buttons">
          <div className="window-btn minimize"></div>
          <div className="window-btn close"></div>
        </div>
      </div>
      <div className="slot-display">
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
  const [money, setMoney] = useState(0);
  const [username, setUsername] = useState('Guest');
  const [currentTime, setCurrentTime] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [userDocId, setUserDocId] = useState(null); // Store the user document ID for future updates
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid); // Fetch the user's data when authenticated
      } else {
        alert('User not authenticated');
        navigate('/GameSelection');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Function to fetch user data (money and username) from Firebase
  const fetchUserData = async (uid) => {
    try {
      const playersRef = collection(db, 'Players');
      const q = query(playersRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setMoney(userDoc.data().money); // Set the user's money
        setUsername(userDoc.data().username); // Set the username
        setUserDocId(userDoc.id); // Store document ID for future updates
      } else {
        alert('User data not found.');
      }
    } catch (err) {
      alert('Failed to fetch user data: ' + err.message);
    }
  };

  // Function to update the user's money in the database
  const updateMoney = async (newMoney) => {
    try {
      if (userDocId) {
        const userDocRef = doc(db, 'Players', userDocId);
        await updateDoc(userDocRef, { money: newMoney });
        setMoney(newMoney); // Update local state
      }
    } catch (err) {
      alert('Failed to update money: ' + err.message);
    }
  };

  const games = [
    { id: 1, name: 'Statistics', icon: '📈', route: '/Stats' },
    { id: 2, name: 'Black Jack', icon: '🃏', route: '/Blackjack' },
    { id: 3, name: 'Roulette', icon: '🛞', route: '/Roulette' },
    { id: 4, name: 'Slots', icon: '🎰', route: '/Slots' },
    { id: 5, name: 'Locked', icon: '🔒', route: '/GameSelection' },
    { id: 6, name: 'Mystery', icon: '❓', route: '/GameSelection' },
  ];

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="GS-Container">
      <Helmet>
        <title>Game Selection</title>
      </Helmet>
      <img className="PDImage" src={Creature} alt="cur" />

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
