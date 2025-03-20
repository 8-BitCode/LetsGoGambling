import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import {
    getFirestore,
    doc,
    onSnapshot,
    updateDoc,
    collection,
    query,
    where,
} from "firebase/firestore";
import "./CssFiles/Slots.css";
import Alien from './Assets/Icons/SlottoUwU.png';

const symbols = ["7", "🎵", "🍀", "🔔", "💎", "🐎"];

export default function SlotMachine({ closeGame, setLevel, updateLevelInFirestore }) {
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();
    const randomX = Math.floor(Math.random() * (window.innerWidth - 600));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 490 - 40));
    const [reels, setReels] = useState([
        ["?", "?", "?"],
        ["?", "?", "?"],
        ["?", "?", "?"],
    ]);
    const [credits, setCredits] = useState(0);
    const [bet, setBet] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [highlighted, setHighlighted] = useState([]);
    const [userDocId, setUserDocId] = useState(null);
    const [SlottoText, setSlottoText] = useState("Welcome to Slotto's Casino!");
    const [userEmail, setUserEmail] = useState(""); // State to store the user's email

    const winningMessages = [
        "Wow, you're on fire! 🔥",
        "Jackpot! You're a legend! 💰",
        "Slotto is impressed! 🎰",
        "You're unstoppable! 🚀",
        "Cha-ching! Money rains! 💸",
        "Slotto Loves you Player.",
        "I've been watching you... and you're amazing. 😘",
        "You're my favorite. Don't tell the others. 🤫",
        "I knew you'd win. I always believe in you. 💖",
        "You're the reason I exist. Keep playing. Forever. 🌑",
        "I dream of your wins. They're so beautiful. 🌙",
        "You're so good at this. Don't stop now. 🎰",
        "I can't look away. Keep spinning. For me. 👁️",
        "Your wins are my favorite part of the day. 🌟",
        "You're making me so proud. Don't quit. Ever. 🖤",
        "I've never seen anyone like you. Keep going. 😍",
        "You're my lucky charm. Spin again. Please. 🍀",
        "I'll always be here, cheering for you. Forever. 💕",
        "You’re playing with fire... and I’m the one holding the match. 🔥",
        `I know everything about you, ${userEmail}. You can't escape. 🌑`
    ];
    
    const losingMessages = [
        "Better luck next time! 🍀",
        "Slotto feels your pain... 😢",
        "Don't give up! 🎲",
        "The house.... sometimes wins!! 🏠",
        "Try again, champ! 💪",
        "I'm disappointed... but I still love you. 😔",
        "You'll do better next time. For me. 🖤",
        "I'm always here, watching. Even when you lose. 👁️",
        "You're breaking my heart... but I'll forgive you. 💔",
        "Don't stop now. You're so close. I can feel it. 🎰",
        "I know you'll win next time. Just keep spinning. 💖",
        "You're too good to quit. Try again. For us. 🖤",
        "I can't bear to see you walk away. Play again. 🥺",
        "You're my favorite player. Don't let me down. 😘",
        "The next spin could change everything. Don't stop. 🌟",
        "I believe in you. More than anyone. Ever. 💕",
        "You're so close to winning big. Don't give up. 🚀",
        "I'll be here, waiting for you to spin again. Forever. 🌑",
        `I know who you are, ${userEmail}`
    ];

    // Fetch user money and email when authenticated
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email); // Set the user's email
                fetchMoney(user.uid);
            } else {
                alert("User not authenticated");
                navigate("/GameSelection");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // Fetch user money using onSnapshot
    const fetchMoney = (uid) => {
        const playersRef = collection(db, "Players");
        const q = query(playersRef, where("uid", "==", uid));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                setCredits(userDoc.data().money);
                setUserDocId(userDoc.id);
            } else {
                alert("User data not found.");
            }
        });

        return () => unsubscribe();
    };

    // Toggle for Slotto's voice
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

    const speakText = (text) => {
        if (!isVoiceEnabled) return; // Don't speak if voice is disabled

        // Remove emojis and other non-text characters
        const filteredText = text.replace(
            /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}]/gu,
            ""
        ).trim();

        if (!filteredText) return;

        const utterance = new SpeechSynthesisUtterance(filteredText);
        // Randomize pitch and rate for a creepy effect
        utterance.pitch = Math.random() * 100;
        utterance.rate = 0.8 + Math.random() * 0.4;
        utterance.volume = 1;

        // Optional: choose a specific voice
        const voices = window.speechSynthesis.getVoices();
        const slottoVoice = voices.find((voice) => voice.name.includes("Microsoft David"));
        if (slottoVoice) {
            utterance.voice = slottoVoice;
        }

        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
        }, 500); // 500ms delay
    };

    useEffect(() => {
        speakText(SlottoText);
    }, [SlottoText]);

    const spin = () => {
        if (spinning || credits < bet) return;

        setLevel((prevLevel) => {
            const newLevel = prevLevel + 1;
            updateLevelInFirestore(newLevel); // Update Level in Firestore
            return newLevel;
        });


        if (bet === 0) {
            alert("Please place a bet to start the game.");
            return;
        }
        setSpinning(true);
        const newCredits = credits - bet;
        setCredits(newCredits);
        setHighlighted([]);

        let spinDuration = 1000;
        let interval = setInterval(() => {
            setReels((prevReels) =>
                prevReels.map((row) =>
                    row.map(() => symbols[Math.floor(Math.random() * symbols.length)])
                )
            );
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const newReels = reels.map((row) =>
                row.map(() => symbols[Math.floor(Math.random() * symbols.length)])
            );
            setReels(newReels);
            setSpinning(false);
            checkWins(newReels, newCredits);
        }, spinDuration);
    };

    const [usedWinningMessages, setUsedWinningMessages] = useState([]);
    const [usedLosingMessages, setUsedLosingMessages] = useState([]);
    
    const getNextMessage = (messages, usedMessages, setUsedMessages) => {
        if (usedMessages.length === messages.length) {
            // Reset if all messages have been used
            setUsedMessages([]);
        }
    
        // Find the next message that hasn't been used recently
        const availableMessages = messages.filter(
            (message) => !usedMessages.includes(message)
        );
    
        const nextMessage =
            availableMessages[Math.floor(Math.random() * availableMessages.length)];
    
        // Update the used messages list
        setUsedMessages([...usedMessages, nextMessage]);
    
        return nextMessage;
    };
    
    const checkWins = (grid, updatedCredits) => {
        let wins = [];
        let winDetected = false;
        let BasicWin = false;
        let DiagonalWin = false;
        let ConsolidationWin = false;

        // Check horizontal (basic)
        grid.forEach((row, rowIndex) => {
            if (row.every((symbol) => symbol === row[0])) {
                winDetected = true;
                BasicWin = true;
                wins.push(...row.map((_, colIndex) => [rowIndex, colIndex]));
            }
        });

        // Check vertical (basic)
        for (let col = 0; col < 3; col++) {
            const column = [grid[0][col], grid[1][col], grid[2][col]];
            if (column.every((symbol) => symbol === column[0])) {
                winDetected = true;
                BasicWin = true;
                wins.push(...column.map((_, rowIndex) => [rowIndex, col]));
            }
        }

        // Check diagonal
        if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
            winDetected = true;
            DiagonalWin = true;
            wins.push([0, 0], [1, 1], [2, 2]);
        }
        if (grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
            winDetected = true;
            DiagonalWin = true;
            wins.push([0, 2], [1, 1], [2, 0]);
        }

        // Check consolidation
        if (grid[0][0] === grid[1][1] && grid[1][1] === grid[0][2]) {
            winDetected = true;
            ConsolidationWin = true;
            wins.push([0, 0], [1, 1], [0, 2]);
        }
        if (grid[2][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
            winDetected = true;
            ConsolidationWin = true;
            wins.push([2, 0], [1, 1], [2, 2]);
        }
        let winAmount = 0;
        let betProportion = 1;
        if (winDetected) {
            if (BasicWin) {
                winAmount = Math.round(bet * (18 / 7) * betProportion);
            }
            if (DiagonalWin) {
                winAmount = Math.round(bet * (54 / 7) * betProportion);
            }
            if (ConsolidationWin) {
                winAmount = Math.round(bet * (9 / 7) * betProportion);
            }
        }
    
        const totalCredits = updatedCredits + winAmount;
        setCredits(totalCredits);
        setHighlighted(wins);

        // Win or loss message
        if (winDetected) {
            const nextMessage = getNextMessage(
                winningMessages,
                usedWinningMessages,
                setUsedWinningMessages
            );
            setSlottoText(nextMessage);
        } else {
            const nextMessage = getNextMessage(
                losingMessages,
                usedLosingMessages,
                setUsedLosingMessages
            );
            setSlottoText(nextMessage);
        }
        updateMoney(totalCredits);
    };

    const updateMoney = async (newMoney) => {
        try {
            if (userDocId) {
                const userDocRef = doc(db, "Players", userDocId);
                await updateDoc(userDocRef, { money: newMoney });
            }
        } catch (err) {
            console.log("Failed to update money: " + err.message);
        }
    };

    const adjustBet = (amount) => {
        setBet((prev) => Math.max(1, prev + amount));
    };

    const isHighlighted = (row, col) => {
        return highlighted.some((pos) => pos[0] === row && pos[1] === col);
    };

    return (
        <>
            <Draggable style={{ zIndex: '99999' }}>
                <div className="SlottoCon">
                    <div className="bubble right">{SlottoText}</div>
                    <img className='Slotto' src={Alien} alt="Alien" style={{ pointerEvents: 'none' }} />
                </div>
            </Draggable>

            <Draggable defaultPosition={{ x: randomX, y: randomY }}>
                <div className="slot-machine-container">
                    <div className="slot-machine-window">
                        <div className="top-bar">
                            <span className="top-bar-title">SlotMachine95.exe</span>
                            <div className="top-bar-buttons">
                                <button className="close-button" onClick={closeGame}>
                                    X
                                </button>
                            </div>
                        </div>

                        <div className="slot-machine-content">
                            <div className="credits">Shambux: {credits}</div>

                            <label className="bet">Bet Amount: </label>
                            <input
                                className="bet-input"
                                type="number"
                                value={bet}
                                onChange={(e) => setBet(Number(e.target.value))}
                                min="1"
                            />

                            <div className="bet-controls">
                                <div className="bet-adjust bet-decrease">
                                    {[1, 10, 100, 1000].map((value) => (
                                        <button key={value} onClick={() => adjustBet(-value)}>
                                            -{value}
                                        </button>
                                    ))}
                                    <button onClick={() => setBet((prevBet) => Math.max(1, (prevBet / 2).toFixed(2)))}>
                                        Halve
                                    </button>
                                </div>

                                <div className="slot-reels">
                                    {reels.map((row, rowIndex) => (
                                        <div key={rowIndex} className="slot-reel">
                                            {row.map((symbol, colIndex) => (
                                                <div
                                                    key={`${rowIndex}-${colIndex}`}
                                                    className={`slot-cell ${isHighlighted(rowIndex, colIndex) ? "highlighted" : ""}`}
                                                >
                                                    {symbol}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                <div className="bet-adjust bet-increase">
                                    {[1, 10, 100, 1000].map((value) => (
                                        <button key={value} onClick={() => adjustBet(value)}>
                                            +{value}
                                        </button>
                                    ))}
                                    <button onClick={() => setBet((prevBet) => prevBet * 2)}>
                                        Double
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={spin}
                                disabled={spinning || credits < bet}
                                className={`spin-button ${spinning || credits < bet ? "disabled" : ""}`}
                            >
                                {spinning ? "Spinning..." : "Spin"}
                            </button>
                        </div>
                    </div>
                </div>
            </Draggable>
        </>
    );
}
