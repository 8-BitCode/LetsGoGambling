import React, { useState, useEffect, useRef } from "react";
import "./CssFiles/Blackjack.css";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import {
    auth,
    db,
    collection,
    query,
    where,
    onSnapshot,
    updateDoc,
    doc,
} from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const Blackjack = ({ closeGame }) => {
    const navigate = useNavigate();
    const [money, setMoney] = useState(1000);
    const [bet, setBet] = useState(0);
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameActive, setGameActive] = useState(false);
    const [gameOver, setGameOver] = useState(true);
    const [message, setMessage] = useState("");
    const [userDocId, setUserDocId] = useState(null);

    const randomX = Math.floor(Math.random() * (window.innerWidth - 600));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 583 - 40)); // - 40 becuase of the button bar

    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const values = [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
        "A",
    ];

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

  const fetchMoney = (uid) => {
    const playersRef = collection(db, "Players");
    const q = query(playersRef, where("uid", "==", uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setMoney(userDoc.data().money);
        setUserDocId(userDoc.id);
      } else {
        alert("User data not found.");
      }
    });

    return () => unsubscribe();
  };


    const updateMoney = async (newMoney) => {
        try {
            if (userDocId) {
                const userDocRef = doc(db, "Players", userDocId);
                await updateDoc(userDocRef, { money: newMoney });
                setMoney(newMoney); // Update local state
            }
        } catch (err) {
            alert("Failed to update money: " + err.message);
        }
    };

    // Initialize Deck & Shuffle
    const initialiseDeck = () => {
        const newDeck = [];
        for (let suit of suits) {
            for (let value of values) {
                newDeck.push({ suit, value });
            }
        }
        return shuffleDeck(newDeck);
    };

    const shuffleDeck = (deck) => {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    };

    // Start Game
    const startGame = () => {
        if (money === 0 && bet === 0) {
            alert("You are out of money! Please exit the game.");
            return;
        } else if (bet === 0) {
            alert("Please place a bet to start the game.");
            return;
        }

        setGameActive(true);
        const newDeck = initialiseDeck();
        const playerHand = [newDeck.pop(), newDeck.pop()];
        const dealerHand = [newDeck.pop(), newDeck.pop()];
        setDeck(newDeck);
        setPlayerHand(playerHand);
        setDealerHand(dealerHand);

        setGameOver(false);
        setMessage("");

        if (getHandValue(playerHand) === 21 && getHandValue(dealerHand) !== 21) {
            setMessage(`Blackjack! You win! Your bet is doubled! + ${2 * bet}`);
            updateMoney(money + 2 * bet);
            gameOverFunction();
        } else if (
            getHandValue(playerHand) === 21 &&
            getHandValue(dealerHand) === 21
        ) {
            setMessage(`It's a tie. Your bet is returned. + ${bet}`);
            updateMoney(money + bet);
            gameOverFunction();
        }
    };

    // Calculate Hand Value
    const getHandValue = (hand) => {
        let value = 0;
        let numAces = 0;
        for (let card of hand) {
            if (card.value === "A") {
                numAces += 1;
                value += 11;
            } else if (["K", "Q", "J"].includes(card.value)) {
                value += 10;
            } else {
                value += parseInt(card.value);
            }
        }
        while (value > 21 && numAces > 0) {
            value -= 10;
            numAces -= 1;
        }
        return value;
    };

    // Hit Function
    const hit = () => {
        if (gameOver) return;
        const newDeck = [...deck];
        const newPlayerHand = [...playerHand, newDeck.pop()];
        setDeck(newDeck);
        setPlayerHand(newPlayerHand);

        const newPlayerHandValue = getHandValue(newPlayerHand);
        if (newPlayerHandValue > 21) {
            setMessage(`Bust! You lose your bet. - ${bet}`);
            updateMoney(Math.max(money, 0)); // Ensure money doesn't go below 0
            gameOverFunction();
        } else if (newPlayerHandValue === 21 && getHandValue(dealerHand) !== 21) {
            setMessage(`You win! Your bet is doubled! + ${2 * bet}`);
            updateMoney(money + 2 * bet);
            gameOverFunction();
        } else if (newPlayerHandValue === 21 && getHandValue(dealerHand) === 21) {
            setMessage(`It's a tie. Your bet is returned. + ${bet}`);
            updateMoney(money + bet);
            gameOverFunction();
        }
    };

    // Stand Function
    const stand = () => {
        if (gameOver) return;
        let newDeck = [...deck];
        let newDealerHand = [...dealerHand];
        while (getHandValue(newDealerHand) < 17) {
            newDealerHand = [...newDealerHand, newDeck.pop()];
        }
        setDeck(newDeck);
        setDealerHand(newDealerHand);

        const playerValue = getHandValue(playerHand);
        const dealerValue = getHandValue(newDealerHand);

        if (dealerValue > 21 || playerValue > dealerValue) {
            setMessage(`You win! Your bet is doubled! + ${2 * bet}`);
            updateMoney(money + 2 * bet);
        } else if (playerValue < dealerValue) {
            setMessage(`Dealer wins. You lose your bet. - ${bet}`);
            updateMoney(Math.max(money, 0)); // Ensure money doesn't go below 0
        } else {
            setMessage(`It's a tie. Your bet is returned. + ${bet}`);
            updateMoney(money + bet);
        }
        gameOverFunction();
    };

    // Game Over Function
    const gameOverFunction = () => {
        setGameOver(true);
        setGameActive(false);
        setBet(0);
        setMessage(
            (message) => `${message}
      Resetting game...`,
        );
        setTimeout(() => {
            setPlayerHand([]);
            setDealerHand([]);
            setMessage("");
        }, 2000);
    };

    // Bet Functions
    const betMoney = (amount) => {
        if (amount > 0) {
            setMoney((prevMoney) => {
                const newMoney = prevMoney - amount;
                if (newMoney < 0) {
                    return prevMoney;
                }
                setBet((prevBet) => prevBet + amount);
                return newMoney;
            });
        } else if (amount < 0) {
            setBet((prevBet) => {
                const newBet = prevBet + amount;
                if (newBet < 0) {
                    return prevBet;
                }
                setMoney((prevMoney) => {
                    const newMoney = prevMoney - amount;
                    return newMoney;
                });
                return newBet;
            });
        }
    };

    // Bet Intervals
    const incrementInterval = useRef(null);
    const decrementInterval = useRef(null);

    const startIncrement = () => {
        if (!incrementInterval.current) {
            incrementInterval.current = setInterval(() => {
                betMoney(1);
            }, 100);
        }
    };

    const stopIncrement = () => {
        clearInterval(incrementInterval.current);
        incrementInterval.current = null;
    };

    const startDecrement = () => {
        if (!decrementInterval.current) {
            decrementInterval.current = setInterval(() => {
                betMoney(-1);
            }, 100);
        }
    };

    const stopDecrement = () => {
        clearInterval(decrementInterval.current);
        decrementInterval.current = null;
    };

    return (
        <>
            <Helmet>
                <title>BLACKJACK</title>
            </Helmet>

            {/* Windows 95 Style Container */}
            <Draggable defaultPosition={{ x: randomX, y: randomY }}>
                <div className="Blackjack-container" style={{ width: "600px" }}>
                    <div className="Blackjack-window">
                        <div className="top-bar">
                            <span className="top-bar-title">SlotMachine95.exe</span>
                            <div className="top-bar-buttons">
                                <button className="close-button" onClick={closeGame}>
                                    X
                                </button>
                            </div>
                        </div>

                        <div className="Blackjack-Bet">
                            <div className="Blackjack-Money">
                                <div className="Blackjack-Money-Child">
                                    <h2>ShamBux = {money}</h2>
                                    <h2>Bet = {bet}</h2>
                                </div>
                                <div className="Blackjack-Money-Child">
                                    <button
                                        onMouseDown={startIncrement}
                                        onMouseUp={stopIncrement}
                                        onMouseLeave={stopIncrement}
                                        disabled={gameActive}
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onMouseDown={startDecrement}
                                        onMouseUp={stopDecrement}
                                        onMouseLeave={stopDecrement}
                                        disabled={gameActive}
                                    >
                                        ↓
                                    </button>
                                </div>
                            </div>

                            <div className="Blackjack-Bet-Buttons">
                                <button disabled={gameActive} onClick={() => betMoney(10)}>
                                    + 10
                                </button>
                                <button disabled={gameActive} onClick={() => betMoney(50)}>
                                    + 50
                                </button>
                                <button disabled={gameActive} onClick={() => betMoney(100)}>
                                    + 100
                                </button>
                                <button disabled={gameActive} onClick={() => betMoney(500)}>
                                    + 500
                                </button>
                                <button disabled={gameActive} onClick={() => betMoney(money)}>
                                    + Max
                                </button>
                            </div>

                            <div className="Blackjack-Bet-Buttons">
                                <button disabled={gameActive} onClick={() => betMoney(-10)}>
                                    - 10
                                </button>
                                <button disabled={gameActive} onClick={() => betMoney(-50)}>
                                    - 50
                                </button>
                                <button disabled={gameActive} onClick={() => betMoney(-100)}>
                                    - 100
                                </button>
                                <button disabled={gameActive} onClick={() => betMoney(-500)}>
                                    - 500
                                </button>
                                <button disabled={gameActive} onClick={() => betMoney(-bet)}>
                                    - Max
                                </button>
                            </div>
                        </div>

                        <hr />

                        <button
                            className="Blackjack-Start"
                            onClick={startGame}
                            disabled={gameActive}
                        >
                            Start Game
                        </button>
                        <div className="Blackjack-Hands">
                            <div className="Blackjack-Hand">
                                <h2>Dealer's Hand</h2>
                                {dealerHand.map((card, index) => (
                                    <div key={index}>
                                        {card.value} of {card.suit}
                                    </div>
                                ))}
                                <p>Value: {getHandValue(dealerHand)}</p>
                            </div>

                            <div className="Blackjack-Hand">
                                <h2>Player's Hand</h2>
                                {playerHand.map((card, index) => (
                                    <div key={index}>
                                        {card.value} of {card.suit}
                                    </div>
                                ))}
                                <p>Value: {getHandValue(playerHand)}</p>
                            </div>
                        </div>

                        <div className="Blackjack-Options">
                            <button onClick={hit} disabled={gameOver}>
                                Hit
                            </button>
                            <button onClick={stand} disabled={gameOver}>
                                Stand
                            </button>
                        </div>

                        {message && <p className="EndGameText">{message}</p>}
                    </div>
                </div>
            </Draggable>
        </>
    );
};

export default Blackjack;
