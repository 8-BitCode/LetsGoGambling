import React, { useState, useEffect, useRef } from "react";
import "./CssFiles/GameSelection.css";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Draggable from "react-draggable";
import {
    auth,
    db,
    collection,
    query,
    where,
    getDocs,
    onSnapshot,
} from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Creature from "./Assets/PDTheCreature.png";
import Messages from "./Messages"; // Import the Messages component
import Slots from "./Slots";
import Stats from "./Stats";
import Bank from "./Bank";
import Blackjack from "./Blackjack";
import Roulette from "./Roulette";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import Click from "./Assets/SoundEffects/Click.wav";
import EmailSound from "./Assets/SoundEffects/YouGotMail.wav";
import JAZZ from "./Assets/SoundEffects/JAZZ.mp3";
import NoMailIcon from "./Assets/Icons/NoMailIcon.png";
import NewMailIcon from "./Assets/Icons/NewMailIcon.png";
import StatsIcon from "./Assets/Icons/StatsIcon.png";
import BlackJackIcon from "./Assets/Icons/BlackJackIcon.png";
import RouletteIcon from "./Assets/Icons/RouletteIcon.png";
import SlotsIcon from "./Assets/Icons/SlotsIcon.png";
import BankIcon from "./Assets/Icons/BankIcon.png";
import LockedIcon from './Assets/Icons/LockedIcon.png'
import UnlockedIcon from './Assets/Icons/UnlockedIcon.png'
import SoundOnIcon from "./Assets/Icons/SoundOnIcon.png";
import SoundOffIcon from "./Assets/Icons/SoundOffIcon.png";
import BinIcon from "./Assets/Icons/BinIcon.png";
const MoneySlot = ({ amount }) => {
    const digits = amount.toString().split("");

    return (
        <div
            className="money-slot-window"
            style={{ width: (digits.length + 1) * 50 + "px" }}
        >
            <div className="title-bar">
                <span className="title-text">Shambux 🍀</span>
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
                    transition={{ delay: 0, type: "spring", stiffness: 100 }}
                >
                    $
                </motion.div>
                {digits.map((digit, index) => (
                    <motion.div
                        key={index}
                        className="slot-digit"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            delay: (index + 1) * 0.1,
                            type: "spring",
                            stiffness: 100,
                        }}
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
    const [username, setUsername] = useState("Guest");
    const [currentTime, setCurrentTime] = useState("");
    const [taskInput, setTaskInput] = useState("");
    const [userDocId, setUserDocId] = useState(null);
    const [activeGames, setActiveGames] = useState([]);
    const [activePopups, setActivePopups] = useState([]);
    const [deletedIcons, setDeletedIcons] = useState([]);
    const [isEndUnlocked, setIsEndUnlocked] = useState(false); // Track if END is unlocked
    const [isPlaying, setIsPlaying] = useState(true); // Track audio state
    const audioRef = useRef(null); // Ref for the audio element
    const [volume, setVolume] = useState(1);
    const [games, setGames] = useState([
        { id: 0, name: "Messages", icon: NoMailIcon, route: "/GameSelection" }, // Add Messages to the games list
        { id: 1, name: "Statistics", icon: StatsIcon, route: "/GameSelection" },
        { id: 2, name: "Black Jack", icon: BlackJackIcon, route: "/GameSelection" },
        { id: 3, name: "Roulette", icon: RouletteIcon, route: "/GameSelection" },
        { id: 4, name: "Slots", icon: SlotsIcon, route: "/GameSelection" },
        { id: 5, name: "Bank", icon: BankIcon, route: "/GameSelection" },
        { id: 6, name: "Locked", icon: LockedIcon, route: "/GameSelection" },
    ]);

    const toggleAudio = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

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
            console.error("Error playing sound:", error);
        });
    };

    useEffect(() => {
        // Define level milestones that trigger new mail
        const newMailLevels = [
            1,   2,  14,  20,  21,  30,  45,  46,  55,  65,
           75,  78,  79,  90, 100, 110, 120, 130, 132, 140,
          150, 155, 175, 190, 210, 220, 240, 249, 250, 270,
          280, 285, 290, 310, 330, 331, 360, 400
        ]
        const audio = new Audio(EmailSound);

        if (newMailLevels.includes(Level)) {
            setHasNewMail(true);
            audio.play().catch((error) => {
                console.error("Error playing sound:", error);
            });
        }
    }, [Level]);

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
            });
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
                alert("User not authenticated");
                navigate("/GameSelection");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const [debt, setDebt] = useState(0);
    const fetchUserData = async (uid) => {
        try {
            const playersRef = collection(db, "Players");
            const q = query(playersRef, where("uid", "==", uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                setMoney(userData.money);
                setUsername(userData.username);
                setUserDocId(userDoc.id);
                setLevel(userData.level || 1); // Initialize Level from Firestore (default to 1 if not present)

                const userDocRef = doc(db, "Players", userDoc.id);
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
                alert("User data not found.");
            }
        } catch (err) {
            alert("Failed to fetch user data: " + err.message);
        }
    };

 useEffect(() => {
        const calculateInterest = async () => {
            // Check if any of the games (Blackjack, Roulette, or Slots) are active
            const isGameActive =
                activeGames.includes("Black Jack") ||
                activeGames.includes("Roulette") ||
                activeGames.includes("Slots");

            if (isGameActive && debt > 0 && userDocId) {
                const interest = (debt * Math.E) / 100; // 1% interest
                const newDebt = parseFloat((debt + interest).toFixed(2)); // Round to 2 decimal places

                try {
                    const userDocRef = doc(db, "Players", userDocId);
                    await updateDoc(userDocRef, {
                        debt: newDebt,
                    });
                    setDebt(newDebt);
                } catch (err) {
                    console.error("Failed to update debt:", err);
                }
            }
        };

        const interval = setInterval(calculateInterest, 60000); // 1 minute
        return () => clearInterval(interval);
    }, [debt, userDocId, activeGames]); // Add activeGames as a dependency

    const updateLevelInFirestore = async (newLevel) => {
        try {
            if (userDocId) {
                const userDocRef = doc(db, "Players", userDocId);
                await updateDoc(userDocRef, { level: newLevel }); // Update Level in Firestore
            }
        } catch (err) {
            console.error("Failed to update level:", err);
        }
    };

    // // DEBUG TESTING BUTTON!
    // useEffect(() => {
    //     const handleKeyDown = (e) => {
    //         if (e.key === "9") {
    //             setLevel((prevLevel) => {
    //                 const newLevel = prevLevel + 1;
    //                 updateLevelInFirestore(newLevel);
    //                 return newLevel;
    //             });
    //         }
    //     };
    //     window.addEventListener("keydown", handleKeyDown);
    //     return () => window.removeEventListener("keydown", handleKeyDown);
    // }, [updateLevelInFirestore]);
    // // DEBUG TESTING BUTTON!

    const handleGameDoubleClick = (game) => {
        playClickSound();
    
        if (game.name === "Locked") {
            // Navigate to /END with isEndUnlocked and money
            navigate("/END", { state: { isEndUnlocked, money } });
            return;
        }
        if (game.name === "Unlocked") {
            // Navigate to /END with isEndUnlocked and money
            navigate("/END", { state: { isEndUnlocked, money } });
            return;
        }
    
        if (!activeGames.includes(game.name)) {
            setActiveGames([...activeGames, game.name]);
            navigate(game.route);
        }
    };

    useEffect(() => {
        const updatedGames = games.map((game) => {
            if (game.name === "Messages") {
                return {
                    ...game,
                    icon: hasNewMail ? NewMailIcon : NoMailIcon, // Change icon based on hasNewMail
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
            iconRef.style.display = "none";
            setDeletedIcons((prev) => {
                const newDeletedIcons = [...prev, game.id];
    
                // Check if all icons (except "Locked", "Messages", and "Bank") are deleted
                const allIconsDeleted = games
                    .filter((game) => !["Locked", "Messages", "Bank"].includes(game.name))
                    .every((game) => newDeletedIcons.includes(game.id));
    
    
                if (allIconsDeleted) {
                    console.log("Unlocking END route...");
                    setIsEndUnlocked(true); // Set isEndUnlocked to true
                    const updatedGames = games.map((game) => {
                        if (game.name === "Locked") {
                            return {
                                ...game,
                                icon: UnlockedIcon,
                                name: "Unlocked",
                                route: "/END",
                            };
                        }
                        return game;
                    });
                    setGames(updatedGames);
                    console.log("Games array updated:", updatedGames);
                }
    
                return newDeletedIcons;
            });
        }
    };

    const openLeavePopup = (gameName) => {
        const gamesWithPopupChance = ["Black Jack", "Slots", "Roulette"];
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
            if (taskInput.trim() === "") {
                setUserSuggestions([]);
                return;
            }

            try {
                const playersRef = collection(db, "Players");
                const querySnapshot = await getDocs(playersRef);

                const suggestions = querySnapshot.docs
                    .map((doc) => doc.data().username)
                    .filter((username) =>
                        username.toLowerCase().includes(taskInput.toLowerCase()),
                    );

                const sortedSuggestions = suggestions.sort((a, b) => {
                    const aStartsWith = a
                        .toLowerCase()
                        .startsWith(taskInput.toLowerCase());
                    const bStartsWith = b
                        .toLowerCase()
                        .startsWith(taskInput.toLowerCase());

                    if (aStartsWith && !bStartsWith) return -1;
                    if (!aStartsWith && bStartsWith) return 1;
                    return 0;
                });

                setUserSuggestions(sortedSuggestions);
            } catch (err) {
                console.error("Failed to fetch usernames:", err);
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
        setActiveGames((prev) => [...prev, "Statistics"]);
    };
    function GoBack() {
        playClickSound();
        navigate("/UserEntry");
    }

    // function GoBack() {
    //   playClickSound();
    //   navigate('/UserEntry');
    // }

    function GoBack() {
        playClickSound();
        navigate("/UserEntry");
    }

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
            <audio ref={audioRef} src={JAZZ} loop autoPlay />
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
                                <div className="GS-IconImage">
                                    <img src={game.icon} alt={game.name} />
                                </div>
                                <div className="GS-IconLabel">{game.name}</div>
                            </div>
                        </Draggable>
                    </div>
                ))}
            </div>

            <div className="GS-ActiveGames">
                {activeGames.includes("Slots") && (
                    <Slots
                        closeGame={() => openLeavePopup("Slots")}
                        Level={Level}
                        setLevel={setLevel}
                        updateLevelInFirestore={updateLevelInFirestore}
                    />
                )}
                {activeGames.includes("Messages") && (
                    <Messages
                        closeGame={() => openLeavePopup("Messages")}
                        Level={Level}
                        onNewMail={onNewMail}
                        username={username}
                        money={money}
                        hasNewMail={hasNewMail}
                        setLevel={setLevel}
                        updateLevelInFirestore={updateLevelInFirestore}
                    />
                )}
                {activeGames.includes("Statistics") && (
                    <Stats
                        closeGame={() => openLeavePopup("Statistics")}
                        loggedInUser={username}
                        selectedUser={selectedUserForStats}
                        Level={Level}
                    />
                )}
                {activeGames.includes("Bank") && (
                    <Bank closeBank={() => openLeavePopup("Bank")} userId={userDocId} />
                )}
                {activeGames.includes("Black Jack") && (
                    <Blackjack
                        closeGame={() => openLeavePopup("Black Jack")}
                        Level={Level}
                        setLevel={setLevel}
                        updateLevelInFirestore={updateLevelInFirestore}
                    />
                )}
                {activeGames.includes("Roulette") && (
                    <Roulette
                        closeGame={() => openLeavePopup("Roulette")}
                        Level={Level}
                        setLevel={setLevel}
                        updateLevelInFirestore={updateLevelInFirestore}
                    />
                )}
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
                <div className="audio-controls">
                    <div className="volume-icon" onClick={toggleAudio}>
                        <img src={isPlaying ? SoundOnIcon : SoundOffIcon} alt="Volume" />
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => {
                            const newVolume = parseFloat(e.target.value);
                            setVolume(newVolume);
                            audioRef.current.volume = newVolume; // Update audio volume
                        }}
                        className="volume-slider"
                    />
                </div>
                <div className="GS-TaskbarUsername">Hello, {username}</div>
            </div>

            <img src={BinIcon} className="GS-EasterEgg" ref={easterEggRef}>
            </img>

            {activePopups.map((gameName) => (
                <Draggable key={gameName} defaultPosition={{ x: randomX, y: randomY }}>
                    <div className="popup">
                        <div className="popup-title-bar">
                            <span className="popup-title">Are you sure?</span>
                            <button
                                onClick={() => closeLeavePopup(gameName)}
                                className="control-button close-button"
                            >
                                X
                            </button>
                        </div>
                        <div className="popup-content">
                            One more game! Something tells me you'll get really lucky really
                            soon.
                            <div className="popup-buttons">
                                <button
                                    onClick={() => closeLeavePopup(gameName)}
                                    className="popup-button"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => closeLeavePopup(gameName)}
                                    className="popup-button"
                                >
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
