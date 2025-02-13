import React, { useState } from 'react';
import './CssFiles/Blackjack.css'
//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';


const Blackjack = () => {

    const navigate = useNavigate();

    const goToGameSelection = () => {
        navigate('/GameSelection');
    };


    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameOver, setGameOver] = useState(true);
    const [message, setMessage] = useState('');


    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    // TODO: add money and bets
    // TODO: useState for setMoney and setBet to update the money and bet

    const [money, setMoney] = useState(1000);
    // let money = 1000;
    const [bet, setBet] = useState(0);
    // let bet = 0;

    // TODO: if player is on 21, they win without needing to stand

    const initializeDeck = () => {
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
        const newDeck = initializeDeck();
        const playerHand = [newDeck.pop(), newDeck.pop()];
        const dealerHand = [newDeck.pop(), newDeck.pop()];
        setDeck(newDeck);
        setPlayerHand(playerHand);
        setDealerHand(dealerHand);
        setGameOver(false);
        setMessage('');
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
        if (getHandValue(newPlayerHand) > 21) {
            setGameOver(true);
            setMessage('Bust!');
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
            setMessage('You win!');
        } else if (playerValue < dealerValue) {
            setMessage('Dealer wins!');
        } else {
            setMessage('It\'s a tie!');
        }
        setGameOver(true);
    };


    const betMoney = (amount) => {
        if (money - amount < 0) {
            alert('Not enough money!');
        } else if (amount < 0 && bet + amount < 0) {
            alert('Cannot bet negative money!');    
            // TODO: alert could be changed to a message on the screen
        } else {
            // money -= amount;
            // bet += amount;
            setMoney(money => money - amount);
            setBet(bet => bet + amount);
        }
    };
    
    return (

        <>

        <Helmet>
            <title>BLACKJACK</title>
        </Helmet>

        <div className='Blackjack-Container'>
            <button onClick={startGame}>Start Game</button>

            <div className='Blackjack-Bet'>
                <h2>Money = {money}</h2>
                <h2>Bet = {bet}</h2>

                <div className='Blackjack-Add'>
                    <button onClick={() => betMoney(1)}> + 1 </button>
                    <button onClick={() => betMoney(10)}> + 10 </button>
                    <button onClick={() => betMoney(50)}> + 50 </button>
                    <button onClick={() => betMoney(100)}> + 100 </button>
                    <button onClick={() => betMoney(money)} > + Max </button>
                </div>

                <div className='Blackjack-Minus'>
                    <button onClick={() => betMoney(-1)}> - 1 </button>
                    <button onClick={() => betMoney(-10)}> - 10 </button>
                    <button onClick={() => betMoney(-50)}> - 50 </button>
                    <button onClick={() => betMoney(-100)}> - 100 </button>
                    <button onClick={() => betMoney(-bet)}> - Max </button>
                </div>
            </div>

            
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
            
            <button onClick={goToGameSelection}>Exit</button>

        </div>

        </>
    );
};

export default Blackjack;