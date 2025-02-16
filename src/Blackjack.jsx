import React, { useState, useEffect } from 'react';
import './CssFiles/Blackjack.css';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { auth, db, collection, query, where, getDocs, updateDoc, doc } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Blackjack = () => {
    const navigate = useNavigate();
    const [money, setMoney] = useState(0);
    const [bet, setBet] = useState(0);
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameActive, setGameActive] = useState(false);
    const [gameOver, setGameOver] = useState(true);
    const [message, setMessage] = useState('');
    const [userDocId, setUserDocId] = useState(null);

    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchMoney(user.uid);
            } else {
                alert('User not authenticated');
                navigate('/GameSelection');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchMoney = async (uid) => {
        try {
            const playersRef = collection(db, 'Players');
            const q = query(playersRef, where('uid', '==', uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                setMoney(userDoc.data().money);
                setUserDocId(userDoc.id); // Store document ID for future updates
            } else {
                alert('User data not found.');
            }
        } catch (err) {
            alert('Failed to fetch money: ' + err.message);
        }
    };

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

    const startGame = () => {
        if (money === 0 && bet === 0) {
            alert('You are out of money! Please exit the game.');
            return;
        } else if (bet === 0) {
            alert('Please place a bet to start the game.');
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
        setMessage('');

        if (getHandValue(playerHand) === 21 && getHandValue(dealerHand) !== 21) {
            setMessage(`Blackjack! You win! Your bet is doubled! + ${2 * bet}`);
            updateMoney(money + 2 * bet); // Add double the bet to money
            gameOverFunction();
        } else if (getHandValue(playerHand) === 21 && getHandValue(dealerHand) === 21) {
            setMessage(`It's a tie. Your bet is returned. + ${bet}`);
            updateMoney(money + bet); // Bet is returned, no change
            gameOverFunction();
        }
    };

    const getHandValue = (hand) => {
        let value = 0;
        let numAces = 0;
        for (let card of hand) {
            if (card.value === 'A') {
                numAces += 1;
                value += 11;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
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

    const hit = () => {
        if (gameOver) return;
        const newDeck = [...deck];
        const newPlayerHand = [...playerHand, newDeck.pop()];
        setDeck(newDeck);
        setPlayerHand(newPlayerHand);
    
        const newPlayerHandValue = getHandValue(newPlayerHand);
        if (newPlayerHandValue > 21) {
            setMessage(`Bust! You lose your bet. - ${bet}`);
            updateMoney(money); // Subtract bet on loss
            gameOverFunction();
        } else if (newPlayerHandValue === 21 && getHandValue(dealerHand) !== 21) {
            setMessage(`You win! Your bet is doubled! + ${2 * bet}`);
            updateMoney(money + 2 * bet); // Add double the bet to money
            gameOverFunction();
        } else if (newPlayerHandValue === 21 && getHandValue(dealerHand) === 21) {
            setMessage(`It's a tie. Your bet is returned. + ${bet}`);
            updateMoney(money + bet); // Bet is returned, no change
            gameOverFunction();
        }

    };
    
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
            updateMoney(money + 2 * bet); // Add double the bet to money
        } else if (playerValue < dealerValue) {
            setMessage(`Dealer wins. You lose your bet. - ${bet}`);
            updateMoney(money); // Subtract bet on loss
        } else {
            setMessage(`It's a tie. Your bet is returned. + ${bet}`);
            updateMoney(money + bet); // Bet is returned, no change
        }
        gameOverFunction();

    };
    

    const gameOverFunction = () => {
        setGameOver(true);
        setGameActive(false);
        setBet(0);
        setMessage(`${message} Resetting game...`);
        setTimeout(() => {
            setPlayerHand([]);
            setDealerHand([]);
            setMessage('');
        }, 2000);
    };

    const betMoney = (amount) => {
        if (money - amount < 0) {
            alert('Not enough money!');
        } else if (amount < 0 && bet + amount < 0) {
            alert('Cannot bet negative money!');
        } else {
            setMoney(money - amount);
            setBet(bet + amount);
        }
    };

    return (
        <>
            <Helmet>
                <title>BLACKJACK</title>
            </Helmet>

            <div className='Blackjack-Container'>
                <h1>Blackjack</h1>

                <div className='Blackjack-Bet'>
                    <h2>Money = {money}</h2>
                    <h2>Bet = {bet}</h2>

                    <div className='Blackjack-Bet-Buttons'>
                        <button onClick={() => betMoney(1)}> + 1 </button>
                        <button onClick={() => betMoney(10)}> + 10 </button>
                        <button onClick={() => betMoney(50)}> + 50 </button>
                        <button onClick={() => betMoney(100)}> + 100 </button>
                        <button onClick={() => betMoney(500)}> + 500 </button>
                        <button onClick={() => betMoney(money)} > + Max </button>
                    </div>

                    <div className='Blackjack-Bet-Buttons'>
                        <button onClick={() => betMoney(-1)}> - 1 </button>
                        <button onClick={() => betMoney(-10)}> - 10 </button>
                        <button onClick={() => betMoney(-50)}> - 50 </button>
                        <button onClick={() => betMoney(-100)}> - 100 </button>
                        <button onClick={() => betMoney(-500)}> - 500 </button>
                        <button onClick={() => betMoney(-bet)}> - Max </button>
                    </div>
                </div>

                <hr />

                <button className='Blackjack-Start' onClick={startGame} disabled={gameActive}>Start Game</button>

                <div className='Blackjack-Hand'>
                    <h2>Dealer's Hand</h2>
                    {dealerHand.map((card, index) => (
                        <div key={index}>{card.value} of {card.suit}</div>
                    ))}
                    <p>Value: {getHandValue(dealerHand)}</p>
                </div>

                <div className='Blackjack-Hand'>
                    <h2>Player's Hand</h2>
                    {playerHand.map((card, index) => (
                        <div key={index}>{card.value} of {card.suit}</div>
                    ))}
                    <p>Value: {getHandValue(playerHand)}</p>
                </div>

                <div className='Blackjack-Options'>
                    <button onClick={hit} disabled={gameOver}>Hit</button>
                    <button onClick={stand} disabled={gameOver}>Stand</button>
                </div>

                {message && <p>{message}</p>}

                <button className='Blackjack-Options' onClick={() => navigate('/GameSelection')}>Exit</button>

            </div>
        </>
    );
};

export default Blackjack;
