import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
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
import Alien from "./Assets/Icons/SlottoUwU.png";
import ShamIcon from "./Assets/Icons/ShamIcon.png";
import SevenIcon from "./Assets/Icons/SevenIcon.png";
import CherryIcon from "./Assets/Icons/CherryIcon.png";
import DiamondIcon from "./Assets/Icons/DiamondIcon.png";
import Guy from "./Assets/Icons/Guy.png";
import HorseShoeIcon from "./Assets/Icons/HorseShoeIcon.png";
import SoundOnIcon from "./Assets/Icons/SoundOnIcon.png";
import SoundOffIcon from "./Assets/Icons/SoundOffIcon.png";

const symbols = ["7", "🎵", "🍀", "🔔", "💎", "🐎"];

const symbolImages = {
    7: SevenIcon,
    "🎵": Guy,
    "🍀": ShamIcon,
    "🔔": CherryIcon,
    "💎": DiamondIcon,
    "🐎": HorseShoeIcon,
};

export default function SlotMachine({
    closeGame,
    setLevel,
    updateLevelInFirestore,
}) {
    const navigate = useNavigate();
    const auth = getAuth();
    const db = getFirestore();
    const randomX = Math.floor(Math.random() * (window.innerWidth - 600));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 490 - 40));
    const [slottoVolume, setSlottoVolume] = useState(1); // Volume for Slotto's voice
    const [reels, setReels] = useState([
        ["🐎", "7", "🎵"],
        ["🍀", "7", "🐎"],
        ["💎", "7", "🔔"],
    ]);
    const [credits, setCredits] = useState(0);
    const [bet, setBet] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [highlighted, setHighlighted] = useState([]);
    const [userDocId, setUserDocId] = useState(null);
    const [SlottoText, setSlottoText] = useState("Step right in, pal. Let's see what you got.");
    const [userEmail, setUserEmail] = useState(""); // State to store the user's email

    const winningMessageTemplates = [
        (winAmount) => `Nice one, pal. You won ${winAmount} Shambux.`,
        (winAmount) => `Heh, not bad. +${winAmount} Shambux.`,
        (winAmount) => `Well I'll be. +${winAmount} Shambux.`,
        (winAmount) => `Well, Well, Well, miracles DO happen. You won ${winAmount} Shambux.`,
        (winAmount) => `+${winAmount} Shambux eh. Don't spend it all in one place.`,
        (winAmount) => `Nice, but I mean, it's no ULTIMATE PRIZE. Still, you win ${winAmount} Shambux.`,
        (winAmount) => `+${winAmount} Shambux. 'Guess you've earned it.`,
        (winAmount) => `You won ${winAmount}. Heh, alright hotshot. Let’s see if you can keep that streak alive.`,
        (winAmount) => `Heh, knew you had it in you. You won ${winAmount} Shambux.`,
        (winAmount) => `Heh.  +${winAmount} Shambux.`,
        (winAmount) => `Good job kid, +${winAmount} Shambux.`,
        (winAmount) => `I'm not telling you how much you won this time. Heh, why? Just to piss you off.`,
        (winAmount) => `+${winAmount}? Eh, i've seen bigger wins.`,
        (winAmount) => `+${winAmount} Shambux. Nice one. But we both know you can do better, don't we, pal?`,
        (winAmount) => `+${winAmount} Shambux. Try not to let it get to your head`,
        (winAmount) => `Woah, a win?! Didn't think i'd live to see the day. +${winAmount} Shambux.`,
        (winAmount) => `"Alright, alright, don’t get too excited. It’s just ${winAmount} Shambux. Ultimate prize’s still waitin’."`,
    ];

    const losingMessages = [
        "Eh, better luck next time.",
        "*cough**cough* LOSER! *cough* Huh, did you hear somethin'?",
        "You're not very good at this, are you?",
        "Heh",
        "That all you got?",
        "Heh, how 'bout you give it another shot?",
        "I wouldn't trust that CEO if I were you, he's always been odd, but lately...",
        "Well, one more spin couldn't hurt.",
        "Guess luck ain't on your side today eh, pal?",
        "Ooh, tough one. Guess you're just gonna have to go home and cry then, right?",
        "Hey pal, your mom just called. Oh, heh, no not for you.",
        "The odds are NOT on your side apparently.",
        "Heh, I could watch this all day",
        "So what's the plan now? Give up?",
        "You know I've heard there's some kind of 'ultimate prize' in this game, but it could just be a rumor, who knows right?",
        "You're so close to the jackpot I can just feel it! Oh, oh wait no that's just my cell phone ringing. Yeah it's your mom again.",
        "What we thinkin, one more spin?",
        "You keep this up, you might just set a record. Not a good one, though.",
        "Look on the bright side! 'tleast you're giving everyone else a confidence boost!",
        "Hey, I think that one was close! Next one's a win for sure!",
        "Well, you can't win 'em all, right?",
        "Well, you can't end it there now can ya'?",
        "Hold on... I just got a tip that the next spin is supposed to be a win! Don't quote me on that though.",
        "You know, I think you're just getting started. One more spin?",
        "Don't worry about how much you could lose, think about how much you're just about to win!",
        "Losses happen, pal, it’s all part of the game! Real determination? Now that’s dusting yourself off and spinning again no matter what!",
        `Eh don't feel too bad, 'tleast ${userEmail} is footing the bill! Oh wait, that's you?`,
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
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(false); // Changed to false for muted by default

    const toggleAudio = () => {
        setIsVoiceEnabled((prev) => !prev); // Toggle voice on/off
    };

    const speakText = (text) => {
        if (!isVoiceEnabled) return; // Don't speak if voice is disabled

        const utterance = new SpeechSynthesisUtterance(text);
        // Randomize pitch and rate for a creepy effect
        utterance.pitch = Math.random() * 100;
        utterance.rate = 0.8 + Math.random() * 0.4;
        utterance.volume = slottoVolume;


        const voices = window.speechSynthesis.getVoices();
        const slottoVoice = voices.find((voice) =>
            voice.name.includes("Microsoft David"),
        );
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
                    row.map(() => symbols[Math.floor(Math.random() * symbols.length)]),
                ),
            );
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const newReels = reels.map((row) =>
                row.map(() => symbols[Math.floor(Math.random() * symbols.length)]),
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
            (message) => !usedMessages.includes(message),
        );

        const nextMessage =
            availableMessages[Math.floor(Math.random() * availableMessages.length)];

        // Update the used messages list
        setUsedMessages([...usedMessages, nextMessage]);

        return nextMessage;
    };

    const checkWins = (grid, updatedCredits) => {
        // We'll count each winning line separately
        let basicLines = 0;
        let diagonalLines = 0;
        let consolidationLines = 0;
    
        // We'll store the board cells that form winning lines so we can highlight them
        let wins = [];
    
        // --- Check horizontal (Basic) ---
        grid.forEach((row, rowIndex) => {
            if (row[0] === row[1] && row[1] === row[2]) {
                basicLines++;
                wins.push(...row.map((_, colIndex) => [rowIndex, colIndex]));
            }
        });
    
        // --- Check vertical (Basic) ---
        for (let col = 0; col < 3; col++) {
            if (grid[0][col] === grid[1][col] && grid[1][col] === grid[2][col]) {
                basicLines++;
                wins.push([0, col], [1, col], [2, col]);
            }
        }
    
        // --- Check diagonals ---
        // main diagonal
        if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
            diagonalLines++;
            wins.push([0, 0], [1, 1], [2, 2]);
        }
        // anti-diagonal
        if (grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
            diagonalLines++;
            wins.push([0, 2], [1, 1], [2, 0]);
        }
    
        // --- Check "consolidation" ---
        // top-left, center, top-right
        if (grid[0][0] === grid[1][1] && grid[1][1] === grid[0][2]) {
            consolidationLines++;
            wins.push([0, 0], [1, 1], [0, 2]);
        }
        // bottom-left, center, bottom-right
        if (grid[2][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
            consolidationLines++;
            wins.push([2, 0], [1, 1], [2, 2]);
        }
    
        // --- Calculate total payout by summing each line type ---
        const basicPayout         = basicLines         * 3.2 * bet;
        const diagonalPayout      = diagonalLines      * 4.8 * bet;
        const consolidationPayout = consolidationLines * 2.1 * bet;
    
        // Round at the end
        const winAmount = Math.round(basicPayout + diagonalPayout + consolidationPayout);
    
        const totalCredits = updatedCredits + winAmount;
        setCredits(totalCredits);
    
        // Remove any duplicate cells in 'wins' so we don't double-highlight the same cell
        const uniqueWins = [];
        const used = new Set();
        for (const [r, c] of wins) {
            const key = r + "-" + c;
            if (!used.has(key)) {
                used.add(key);
                uniqueWins.push([r, c]);
            }
        }
        setHighlighted(uniqueWins);
    
        // --- Show message based on win or loss ---
        if (winAmount > 0) {
            const randomTemplate =
                winningMessageTemplates[
                    Math.floor(Math.random() * winningMessageTemplates.length)
                ];
            setSlottoText(randomTemplate(winAmount));
        } else {
            const nextMessage = getNextMessage(
                losingMessages,
                usedLosingMessages,
                setUsedLosingMessages
            );
            setSlottoText(nextMessage);
        }
    
        // Update Firestore
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
            <Draggable style={{ zIndex: "99999" }}>
                <div className="SlottoCon">
                    <div className="bubble right">{SlottoText}</div>
                    <img
                        className="Slotto"
                        src={Alien}
                        alt="Alien"
                        style={{ pointerEvents: "none" }}
                    />
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
                                    <button
                                        onClick={() =>
                                            setBet((prevBet) => Math.max(1, (prevBet / 2).toFixed(2)))
                                        }
                                    >
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
                                                    <img
                                                        src={symbolImages[symbol]}
                                                        alt={symbol}
                                                        className="symbol-image"
                                                    />
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
                            <div className="audio-controls">
    {/* Sound On/Off Button */}
    <div className="volume-iconSLo" onClick={toggleAudio}>
        <img
            src={isVoiceEnabled ? SoundOnIcon : SoundOffIcon}
            alt={isVoiceEnabled ? "Sound On" : "Sound Off"}
        />
    </div>
</div>
                        </div>
                    </div>
                </div>
            </Draggable>
        </>
    );
}
