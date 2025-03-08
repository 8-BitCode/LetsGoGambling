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
import Bank from './Bank';
import Blackjack from './Blackjack';
import Roulette from './Roulette'
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

const MoneySlot = ({ amount }) => {
  const digits = amount.toString().split('');
  
  return (
    <div className="money-slot-window" style={{ width: (digits.length + 1) * 50 + 'px' }}>
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
  const [activeGames, setActiveGames] = useState([]);
  const [activePopups, setActivePopups] = useState([]); // Track active popups
  const [gameToClose, setGameToClose] = useState(null); // Track the game to be closed
  const navigate = useNavigate();

  const randomX = Math.floor(Math.random() * (window.innerWidth - 500));
  const randomY = Math.floor(Math.random() * (window.innerHeight - 500 - 40)); // - 40 becuase of the button bar

  const games = [
    { id: 1, name: 'Statistics', icon: '📈', route: '/GameSelection' },
    { id: 2, name: 'Black Jack', icon: '🃏', route: '/GameSelection' },
    { id: 3, name: 'Roulette', icon: '🛞', route: '/GameSelection' },
    { id: 4, name: 'Slots', icon: '🎰', route: '/GameSelection' },
    { id: 5, name: 'Bank', icon: '🏦', route: '/GameSelection' },
    { id: 6, name: 'Locked', icon: '🔒', route: '/GameSelection' },
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
    }
  };

  const openLeavePopup = (gameName) => {
    const gamesWithPopupChance = ['Black Jack', 'Slots', 'Roulette'];
  
    if (gamesWithPopupChance.includes(gameName)) {
      const randomChance = Math.floor(Math.random() * 5) + 1; 
      if (randomChance === 1) {
        setActivePopups((prev) => [...prev, gameName]);
      } else {
        setActiveGames((prev) => prev.filter((game) => game !== gameName));
      }
    } else {
      setActiveGames((prev) => prev.filter((game) => game !== gameName));
    }
  };

  const closeLeavePopup = (gameName) => {
    setActivePopups(prev => prev.filter(game => game !== gameName));
  };

  const handleConfirmLeave = (gameName) => {
    setActiveGames(activeGames.filter(game => game !== gameName));
    closeLeavePopup(gameName);
  };

  return (
    <div className="GS-Container">
      <Helmet>
        <title>Game Selection</title>
      </Helmet>
      <img className="PDImage" src={Creature} alt="cur" />

      <div className="GS-TimeDisplay">{currentTime}</div>

      <Draggable>
        <div className="GS-MoneyDisplay">
          <MoneySlot amount={money} />
        </div>
      </Draggable>

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

      <div className="GS-ActiveGames">
        {activeGames.includes('Slots') && <Slots closeGame={() => openLeavePopup('Slots')} />}
        {activeGames.includes('Statistics') && <Stats closeGame={() => openLeavePopup('Statistics')} loggedInUser={username} />}
        {activeGames.includes('Bank') && <Bank closeBank={() => openLeavePopup('Bank')} userId={userDocId} />}
        {activeGames.includes('Black Jack') && <Blackjack closeGame={() => openLeavePopup('Black Jack')} />}
        {activeGames.includes('Roulette') && <Roulette closeGame={() => openLeavePopup('Roulette')} />}
      </div>

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

      <div className="GS-EasterEgg">🗑️</div>

      {activePopups.map((gameName) => (
        <Draggable key={gameName} defaultPosition={{ x: randomX, y: randomY }}>
          <div className="popup">
            <div className="popup-title-bar">
              <span className="popup-title">Are you sure?</span>
              <button onClick={() => closeLeavePopup(gameName)} className="control-button close-button">X</button>
            </div>
            <div className="popup-content">
              One more game! something tells me you'll get really lucky really soon
              <div className="popup-buttons">
                <button onClick={() => closeLeavePopup(gameName)} className="popup-button">Yes</button>
                <button onClick={() => closeLeavePopup(gameName)} className="popup-button">Yes</button>
              </div>
            </div>
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default GameSelection;
