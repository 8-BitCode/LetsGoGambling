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
    const [gameActive, setGameActive] = useState(false);
    const [gameOver, setGameOver] = useState(true);
    const [message, setMessage] = useState('');


    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    const [money, setMoney] = useState(1000);
    const [bet, setBet] = useState(0);

    // TODO: if player is on 21, they win without needing to stand

    // TODO: create a game active state to disable start button when game is active
    // TODO: change start to replay after game is over
    // TODO: add a delay between each card being dealt
    // TODO: update the money and bet when game is over

    // TODO: create a game over function that sets game over to true, game active to false and clears hands

    // Typical blackjack payout is 3:2 (1.5x), but this uses 2:1 (2x) for simplicity

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

        if (getHandValue(playerHand) === 21) {
            setMessage('Blackjack! You win! Your bet is doubled! + ' + 2 * bet);
            setGameOver(true);
            setGameActive(false);
            // TODO: double bet and add it to money. set bet to 0
            setMoney(money => money + 2 * bet);
            setBet(0);
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
        if (getHandValue(newPlayerHand) > 21) {
            setGameOver(true);
            setGameActive(false);
            setMessage('Bust! You lose your bet. - ' + bet);
            // TODO: set bet to 0
            setBet(0);
        } else if (getHandValue(newPlayerHand) === 21) {
            setMessage('You win! Your bet is doubled! + ' + 2 * bet);
            setGameOver(true);
            setGameActive(false);
            // TODO: double bet and add it to money. set bet to 0
            setMoney(money => money + 2 * bet);
            setBet(0);
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
            setMessage('You win! Your bet is doubled! + ' + 2 * bet);
            // TODO: double bet and add it to money. set bet to 0
            setMoney(money => money + 2 * bet);
            setBet(0);
        } else if (playerValue < dealerValue) {
            setMessage('Dealer wins. You lose your bet. - ' + bet);
            // TODO: set bet to 0
            setBet(0);
        } else {
            setMessage('It\'s a tie. Your bet is returned. + ' + bet);
            // TODO: add bet back to money. set bet to 0
            setMoney(money => money + bet);
            setBet(0);
        }
        gameOverFunction();
        // setGameActive(false);
        // setGameOver(true);
    };

    
    const gameOverFunction = () => {
        setGameOver(true);
        setGameActive(false);

        // TODO: add delay before clearing hands
        // TODO: remove setBet(0) from each condition
        setBet(0);
        setPlayerHand([]);
        setDealerHand([]);
    };

    const betMoney = (amount) => {
        if (money - amount < 0) {
            alert('Not enough money!');
        } else if (amount < 0 && bet + amount < 0) {
            alert('Cannot bet negative money!');    
            // TODO: alert could be changed to a message on the screen
        } else {
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

            <hr/>

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
            
            <button className='Blackjack-Options' onClick={goToGameSelection}>Exit</button>

        </div>

        </>
    );
};

export default Blackjack;