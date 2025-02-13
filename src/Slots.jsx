import React, { useState } from 'react';

//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';
import './CssFiles/Slots.css';



const Slots = () => {
  // Store gambucks and bet in state so that updates trigger a re-render
  const [gambucks, setGambucks] = useState(1000);
  const [bet, setBet] = useState(100);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [num3, setNum3] = useState(0);
  const [message, setMessage] = useState('');

  const spinSlots = () => {
    // Simple validations:
    if (bet <= 0) {
      setMessage("Bet must be greater than 0!");
      return;
    }
    if (bet > gambucks) {
      setMessage("You don't have enough gambucks for that bet!");
      return;
    }

    setMessage('');
    // Update first reel immediately
    const newNum1 = Math.floor(Math.random() * 3);
    setNum1(newNum1);

    // After 1 second, update the second reel
    setTimeout(() => {
      const newNum2 = Math.floor(Math.random() * 3);
      setNum2(newNum2);

      // After another 1 second, update the third reel
      setTimeout(() => {
        const newNum3 = Math.floor(Math.random() * 3);
        setNum3(newNum3);

        // After an additional 1 second, check the win/loss condition
        setTimeout(() => {
          if (newNum1 === newNum2 && newNum2 === newNum3) {
            // Win condition: reels match
            if (newNum1 === 0) {
              // Special win: three zeros
              setMessage(`ULTIMATE JACKPOT PRIZE! SPECIAL REELS MATCH! YOU JUST DECUPLED YOUR MONEY!!! ${bet * 10} gambucks! (but if only you'd bet higher...)`);
              setGambucks(prev => prev + bet * 10);
            } else {
              setMessage(`WOOHOO! You win ${bet * 2} gambucks! Keep going for the ultimate prize!`);
              setGambucks(prev => prev + bet * 2);
            }
          } else {
            // Loss: subtract the bet amount
            setMessage(`LOSER!!!! You lost ${bet} gambucks! ...Well you can't end on that!`);
            setGambucks(prev => prev - bet);
          }
        }, 500);
      }, 500);
    }, 500);
  };

  return (
    <>
      <Helmet>
        <title>SLOTS!!!!!</title>
      </Helmet>
      <div className="Slots-Container">
        <div>Welcome to SLOTS!!</div>
        <br />
        <div className="gold-text">GAMBUCKS: {gambucks}</div>
        <br />
        <div>
          <label htmlFor="bet-input">Bet Amount: </label>
          <input
            id="bet-input"
            type="number"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            min="1"
          />
        </div>
        <br />
        <div>{num1 - 1}, {num2 - 1}, {num3 - 1}</div>
        <div>{num1}, {num2}, {num3}</div>
        <div>{num1 + 1}, {num2 + 1}, {num3 + 1}</div>
        <div>{message}</div>
        <button onClick={spinSlots}>SPIN</button>
      </div>
    </>
  );
};



export default Slots;

