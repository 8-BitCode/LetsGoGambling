import React, { useState, useEffect, useRef } from 'react';
import './CssFiles/GameSelection.css';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';
import { auth, db, collection, query, where, getDocs, onSnapshot } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Creature from './Assets/PDTheCreature.png';
import Messages from './Messages'; // Import the Messages component
import Slots from './Slots';
import Stats from './Stats';
import Bank from './Bank';
import Blackjack from './Blackjack';
import Roulette from './Roulette';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import Click from './Assets/SoundEffects/Click.wav';
import EmailSound from './Assets/SoundEffects/YouGotMail.wav'
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
  const [activePopups, setActivePopups] = useState([]);
  const [deletedIcons, setDeletedIcons] = useState([]);
  const [isEndUnlocked, setIsEndUnlocked] = useState(false); // Track if END is unlocked
  const [games, setGames] = useState([
    { id: 0, name: 'Messages', icon: '📭', route: '/GameSelection' }, // Add Messages to the games list
    { id: 1, name: 'Statistics', icon: '📈', route: '/GameSelection' },
    { id: 2, name: 'Black Jack', icon: '🃏', route: '/GameSelection' },
    { id: 3, name: 'Roulette', icon: '🛞', route: '/GameSelection' },
    { id: 4, name: 'Slots', icon: '🎰', route: '/GameSelection' },
    { id: 5, name: 'Bank', icon: '🏦', route: '/GameSelection' },
    { id: 6, name: 'Locked', icon: '🔒', route: '/GameSelection' },
  ]);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [selectedUserForStats, setSelectedUserForStats] = useState(null);
  const [Level, setLevel] = useState(0); // Add Level state
  const [hasNewMail, setHasNewMail] = useState(false); // Track new mail state
  const navigate = useNavigate();
  const easterEggRef = useRef(null);
  const iconRefs = useRef({});

  const randomX = Math.floor(Math.random() * (window.innerWidth - 500));
  const randomY = Math.floor(Math.random() * (window.innerHeight - 500 - 40));

  const playClickSound = () => {
    const audio = new Audio(Click);
    audio.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
  };

  useEffect(() => {
    // Define level milestones that trigger new mail
    const newMailLevels = [
      0,  2,  14, 20, 21, 30, 45, 46, 55, 65, 75, 78, 79, 
      90, 100, 110, 120, 130, 132, 140, 150, 155, 175, 190, 
      210, 220, 240, 249, 250, 270, 280, 285, 290, 310, 330, 331, 360];
    const audio = new Audio(EmailSound);

    if (newMailLevels.includes(Level)) {
      setHasNewMail(true);
      audio.play().catch((error) => {
        console.error('Error playing sound:', error);
      });
    }
  }, [Level]); 

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

  const [debt, setDebt] = useState(0);
  const fetchUserData = async (uid) => {
    try {
      const playersRef = collection(db, 'Players');
      const q = query(playersRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        setMoney(userData.money);
        setUsername(userData.username);
        setUserDocId(userDoc.id);
        setLevel(userData.level || 1); // Initialize Level from Firestore (default to 1 if not present)
  
        const userDocRef = doc(db, 'Players', userDoc.id);
        onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setMoney(docSnap.data().money);
            // Fetch debt if it exists
            setLevel(docSnap.data().level || 1); // Update Level from Firestore
            if (docSnap.data().debt) {
              setDebt(docSnap.data().debt);
            }
          }
        });
      } else {
        alert('User data not found.');
      }
    } catch (err) {
      alert('Failed to fetch user data: ' + err.message);
    }
  };
  useEffect(() => {
    const calculateInterest = async () => {
      if (debt > 0 && userDocId) {
        const interest = debt * 0.01; // 1% interest
        const newDebt = debt + interest;
  
        try {
          const userDocRef = doc(db, 'Players', userDocId);
          await updateDoc(userDocRef, {
            debt: newDebt,
          });
          setDebt(newDebt);
        } catch (err) {
          console.error('Failed to update debt:', err);
        }
      }
    };
  
    const interval = setInterval(calculateInterest, 60000); // 1 minute
    return () => clearInterval(interval);
  }, [debt, userDocId]);

  const updateLevelInFirestore = async (newLevel) => {
    try {
      if (userDocId) {
        const userDocRef = doc(db, 'Players', userDocId);
        await updateDoc(userDocRef, { level: newLevel }); // Update Level in Firestore
      }
    } catch (err) {
      console.error('Failed to update level:', err);
    }
  };

  useEffect(() => {
    const calculateInterest = async () => {
      if (debt > 0 && userDocId) {
        const interest = debt * 0.01; // 1% interest
        const newDebt = debt + interest;

        try {
          const userDocRef = doc(db, 'Players', userDocId);
          await updateDoc(userDocRef, {
            debt: newDebt,
          });
          setDebt(newDebt);
        } catch (err) {
          console.error('Failed to update debt:', err);
        }
      }
    };
    

        

    const interval = setInterval(calculateInterest, 60000); // 1 minute
    return () => clearInterval(interval);
  }, [debt, userDocId]);

  // DEBUG TESTING BUTTON!
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '9') {
        setLevel(prevLevel => {
          const newLevel = prevLevel + 1;
          updateLevelInFirestore(newLevel);
          return newLevel;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [updateLevelInFirestore]);
  // DEBUG TESTING BUTTON!

  useEffect(() => {
    const calculateInterest = async () => {
      if (debt > 0 && userDocId) {
        const interest = debt * 0.01; // 1% interest
        const newDebt = debt + interest;

        try {
          const userDocRef = doc(db, 'Players', userDocId);
          await updateDoc(userDocRef, {
            debt: newDebt,
          });
          setDebt(newDebt);
        } catch (err) {
          console.error('Failed to update debt:', err);
        }
      }
    };

    const interval = setInterval(calculateInterest, 60000); // 1 minute
    return () => clearInterval(interval);
  }, [debt, userDocId]);

  const handleGameDoubleClick = (game) => {
    playClickSound();
    if (game.name === 'Unlocked' && !isEndUnlocked) {
      alert('You must bin all icons first!');
      return;
    }

    if (!activeGames.includes(game.name)) {
      setActiveGames([...activeGames, game.name]);
      if (game.name === 'Unlocked') {
        navigate('/END', { state: { fromUnlocked: true } }); // Pass state
      } else {
        navigate(game.route);
      }
    }

  };
  useEffect(() => {
    const updatedGames = games.map((game) => {
      if (game.name === 'Messages') {
        return {
          ...game,
          icon: hasNewMail ? '📬' : '📭', // Change icon based on hasNewMail
        };
      }
      return game;
    });
    setGames(updatedGames);
  }, [hasNewMail]);

  const handleDragStop = (event, game) => {
    const iconRef = iconRefs.current[game.id];
    if (!easterEggRef.current || !iconRef) return;

    const iconRect = iconRef.getBoundingClientRect();
    const easterEggRect = easterEggRef.current.getBoundingClientRect();

    const isOverlapping =
      iconRect.left < easterEggRect.right &&
      iconRect.right > easterEggRect.left &&
      iconRect.top < easterEggRect.bottom &&
      iconRect.bottom > easterEggRect.top;

    if (isOverlapping) {
      console.log(`Icon ${game.name} deleted.`);
      iconRef.style.display = 'none';
      setDeletedIcons((prev) => {
        const newDeletedIcons = [...prev, game.id];
        console.log('Deleted Icons:', newDeletedIcons);

        // Check if all icons (except "Locked") are deleted
        const allIconsDeleted = games
          .filter((game) => game.name !== 'Locked')
          .every((game) => newDeletedIcons.includes(game.id));

        console.log('All icons deleted?', allIconsDeleted);

        if (allIconsDeleted) {
          console.log('Unlocking END route...');
          setIsEndUnlocked(true);
          const updatedGames = games.map((game) => {
            if (game.name === 'Locked') {
              return {
                ...game,
                icon: '🔓',
                name: 'Unlocked',
                route: '/END',
              };
            }
            return game;
          });
          setGames(updatedGames);
          console.log('Games array updated:', updatedGames);
        }

        return newDeletedIcons;
      });
    }
  };

  const openLeavePopup = (gameName) => {
    const gamesWithPopupChance = ['Black Jack', 'Slots', 'Roulette'];
    playClickSound();
    if (gamesWithPopupChance.includes(gameName)) {
      const randomChance = Math.floor(Math.random() * 8) + 1;
      if (randomChance === 1) {
        setActivePopups([...activePopups, gameName]);
      } else {
        setActiveGames((prev) => prev.filter((game) => game !== gameName));
      }
    } else {
      setActiveGames((prev) => prev.filter((game) => game !== gameName));
    }
  };

  const closeLeavePopup = (gameName) => {
    playClickSound();
    setActivePopups((prev) => prev.filter((game) => game !== gameName));
  };

  const handleConfirmLeave = (gameName) => {
    setActiveGames(activeGames.filter((game) => game !== gameName));
    closeLeavePopup(gameName);
  };

  useEffect(() => {
    const fetchUsernames = async () => {
      if (taskInput.trim() === '') {
        setUserSuggestions([]);
        return;
      }

      try {
        const playersRef = collection(db, 'Players');
        const querySnapshot = await getDocs(playersRef);

        const suggestions = querySnapshot.docs
          .map((doc) => doc.data().username)
          .filter((username) =>
            username.toLowerCase().includes(taskInput.toLowerCase())
          );

        const sortedSuggestions = suggestions.sort((a, b) => {
          const aStartsWith = a.toLowerCase().startsWith(taskInput.toLowerCase());
          const bStartsWith = b.toLowerCase().startsWith(taskInput.toLowerCase());

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return 0;
        });

        setUserSuggestions(sortedSuggestions);
      } catch (err) {
        console.error('Failed to fetch usernames:', err);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchUsernames();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [taskInput]);

  const handleSuggestionClick = (username) => {
    setTaskInput(username);
    setUserSuggestions([]);
    setSelectedUserForStats(username);
    setActiveGames((prev) => [...prev, 'Statistics']);
  };
  function GoBack(){
    playClickSound()
    navigate("/UserEntry")
  }

  // function GoBack() {
  //   playClickSound();
  //   navigate('/UserEntry');
  // }

  // Update the Messages icon based on hasNewMail
useEffect(() => {
  const updatedGames = games.map((game) => {
    if (game.name === 'Messages') {
      return {
        ...game,
        icon: hasNewMail ? '📬' : '📭', // Change icon based on hasNewMail
      };
    }
    return game;
  });
  setGames(updatedGames);
}, [hasNewMail]);

  function GoBack() {
    playClickSound();
    navigate('/UserEntry');
  }

  // Update the Messages icon based on hasNewMail
useEffect(() => {
  const updatedGames = games.map((game) => {
    if (game.name === 'Messages') {
      return {
        ...game,
        icon: hasNewMail ? '📬' : '📭', // Change icon based on hasNewMail
      };
    }
    return game;
  });
  setGames(updatedGames);
}, [hasNewMail]);
const onNewMail = (hasNewMail) => {
  setHasNewMail(hasNewMail);
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
            <Draggable onStop={(event) => handleDragStop(event, game)}>
              <div
                className="GS-Icon"
                ref={(el) => (iconRefs.current[game.id] = el)}
              >
                <div className="GS-IconImage">{game.icon}</div>
                <div className="GS-IconLabel">{game.name}</div>
              </div>
            </Draggable>
          </div>
        ))}
      </div>

      <div className="GS-ActiveGames">
      {activeGames.includes('Slots') && (
    <Slots
        closeGame={() => openLeavePopup('Slots')}
        Level={Level}
        setLevel={setLevel}
        updateLevelInFirestore={updateLevelInFirestore}
    />
)}
        {activeGames.includes('Messages') && (
          <Messages
            closeGame={() => openLeavePopup('Messages')}
            Level={Level}
            onNewMail={onNewMail}
            username={username} 
            money={money}      
            hasNewMail={hasNewMail} 
          />
        )}
        {activeGames.includes('Statistics') && (
          <Stats
            closeGame={() => openLeavePopup('Statistics')}
            loggedInUser={username}
            selectedUser={selectedUserForStats}
          />
        )}
        {activeGames.includes('Bank') && <Bank closeBank={() => openLeavePopup('Bank')} userId={userDocId} />}
        {activeGames.includes('Black Jack') && <Blackjack closeGame={() => openLeavePopup('Black Jack')} Level={Level} setLevel={setLevel} updateLevelInFirestore={updateLevelInFirestore}/>}
        {activeGames.includes('Roulette') && <Roulette closeGame={() => openLeavePopup('Roulette')} Level={Level} setLevel={setLevel} updateLevelInFirestore={updateLevelInFirestore}/>}
        {/* {activeGames.includes('Slots') && <Slots closeGame={() => openLeavePopup('Slots')} Level={Level} setLevel={setLevel} updateLevelInFirestore={updateLevelInFirestore}/>} */}
      </div>

      <div className="GS-Taskbar">
        <div className="GS-TaskbarInputContainer">
          <input
            type="text"
            className="GS-TaskbarInput"
            placeholder="🔎|User Search 📈"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <button className="GoBack" onClick={GoBack}>
            Go Back To Login
          </button>
          {userSuggestions.length > 0 && (
            <div className="GS-UserSuggestions">
              {userSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="GS-SuggestionItem"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="GS-TaskbarUsername">Hello, {username}</div>
      </div>

      <div className="GS-EasterEgg" ref={easterEggRef}>
        🗑️
      </div>

      {activePopups.map((gameName) => (
        <Draggable key={gameName} defaultPosition={{ x: randomX, y: randomY }}>
          <div className="popup">
            <div className="popup-title-bar">
              <span className="popup-title">Are you sure?</span>
              <button onClick={() => closeLeavePopup(gameName)} className="control-button close-button">
                X
              </button>
            </div>
            <div className="popup-content">
              One more game! Something tells me you'll get really lucky really soon.
              <div className="popup-buttons">
                <button onClick={() => closeLeavePopup(gameName)} className="popup-button">
                  Yes
                </button>
                <button onClick={() => closeLeavePopup(gameName)} className="popup-button">
                  Yes
                </button>
              </div>
            </div>
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default GameSelection;