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

const symbols = ["7", "🎵", "🍀", "🔔", "💎", "🐎"];

export default function SlotMachine({ closeGame, Level, setLevel, setHasNewMail }) {
    //CODE FOR ADDING TO 1 LEVEL
    // setLevel((prevLevel) => prevLevel + 1);

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

    // Fetch user money when authenticated using onSnapshot for real-time data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
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

    const spin = () => {
        if (spinning || credits < bet) return;
        // Check if the bet is zero
        if (bet === 0) {
            alert("Please place a bet to start the game.");
            return;
        }

        setSpinning(true);
        const newCredits = credits - bet; // Deduct the bet from the user's credits
        setCredits(newCredits); // Update the local state with the new credits
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
            checkWins(newReels, newCredits); // Pass updated credits after deducting the bet
        }, spinDuration);
    };

    const checkWins = (grid, updatedCredits) => {
        let wins = [];
        let winDetected = false;
        let BasicWin = false;
        let DiagonalWin = false;
        let ConsolidationWin = false;

        // Check horizontal wins (basic wins)
        grid.forEach((row, rowIndex) => {
            if (row.every((symbol) => symbol === row[0])) {
                winDetected = true;
                BasicWin = true;
                wins.push(...row.map((_, colIndex) => [rowIndex, colIndex]));
            }
        });

        // Check vertical wins (basic wins)
        for (let col = 0; col < 3; col++) {
            const column = [grid[0][col], grid[1][col], grid[2][col]];
            if (column.every((symbol) => symbol === column[0])) {
                winDetected = true;
                BasicWin = true;
                wins.push(...column.map((_, rowIndex) => [rowIndex, col]));
            }
        }

        // Check diagonal wins
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

        // Check consolidation wins
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

        // Update credits based on the type of win
        let winAmount = 0;
        //must be greater than 0.78
        let betProportion = 1;
        if (winDetected) {
            if (BasicWin) {
                winAmount = Math.round(bet * (18 / 7) * betProportion); // Example win logic
            }
            if (DiagonalWin) {
                winAmount = Math.round(bet * (54 / 7) * betProportion);
            }
            if (ConsolidationWin) {
                winAmount = Math.round(bet * (9 / 7) * betProportion);
            }
        }

        const totalCredits = updatedCredits + winAmount;
        setCredits(totalCredits); // Update local credits after win/loss
        setHighlighted(wins);

        // After updating local state, update the user's credits in Firestore
        updateMoney(totalCredits);
    };

    // Update money in Firestore
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
                        <div className="credits">Gambucks: {credits}</div>

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
                                <button onClick={() => setBet((prevBet) => prevBet / 2)}>
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
    );
}
