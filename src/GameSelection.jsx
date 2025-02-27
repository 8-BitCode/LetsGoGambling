import React, { useState, useEffect } from 'react';
import './CssFiles/GameSelection.css';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';
import { auth, db, collection, query, where, getDocs, onSnapshot } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Creature from './Assets/PDTheCreature.png';
import Slots from './Slots';
import Stats from './Stats';
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const MoneySlot = ({ amount }) => {
  const digits = amount.toString().split(''); 

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
  const [userDocId, setUserDocId] = useState(null);
  const [activeGames, setActiveGames] = useState([]); // Changed to array
  const navigate = useNavigate();

  const games = [
    { id: 1, name: 'Statistics', icon: '📈', route: '/GameSelection' },
    { id: 2, name: 'Black Jack', icon: '🃏', route: '/Blackjack' },
    { id: 3, name: 'Roulette', icon: '🛞', route: '/Roulette' },
    { id: 4, name: 'Slots', icon: '🎰', route: '/GameSelection' },
    { id: 5, name: 'Locked', icon: '🔒', route: '/GameSelection' },
    { id: 6, name: 'Mystery', icon: '❓', route: '/GameSelection' },
  ];

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
        fetchUserData(user.uid);
      } else {
        alert('User not authenticated');
        navigate('/GameSelection');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserData = async (uid) => {
    try {
      const playersRef = collection(db, 'Players');
      const q = query(playersRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setMoney(userDoc.data().money);
        setUsername(userDoc.data().username);
        setUserDocId(userDoc.id);

        const userDocRef = doc(db, 'Players', userDoc.id);
        onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setMoney(docSnap.data().money);
          }
        });
      } else {
        alert('User data not found.');
      }
    } catch (err) {
      alert('Failed to fetch user data: ' + err.message);
    }
  };

  const handleGameDoubleClick = (game) => {
    if (!activeGames.includes(game.name)) {
      setActiveGames([...activeGames, game.name]);
      navigate(game.route);
    } else { 
    }
  };

  const closeActiveGame = (gameName) => {
    setActiveGames(activeGames.filter(game => game !== gameName));
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

      {/* Always Show Game Icons */}
      <div className="GS-Icons">
        {games.map((game) => (
          <div
            key={game.id}
            className="GS-IconLink"
            onDoubleClick={() => handleGameDoubleClick(game)}
          >
            <Draggable>
              <div className="GS-Icon">
                <div className="GS-IconImage">{game.icon}</div>
                <div className="GS-IconLabel">{game.name}</div>
              </div>
            </Draggable>
          </div>
        ))}
      </div>

      {/* Display Active Game Overlays */}
      <div className="GS-ActiveGames" >
        {activeGames.includes('Slots') && <Slots closeGame={() => closeActiveGame('Slots')} />}
        {activeGames.includes('Statistics') && <Stats closeGame={() => closeActiveGame('Statistics')} />}
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
