import React, { useState, useEffect } from 'react';

//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';
import './CssFiles/Slots.css';



const Slots = () => {
  // Store gambucks and bet in state so that updates trigger a re-render
  // Game state
  const [gambucks, setGambucks] = useState(1000);
  const [bet, setBet] = useState(100);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [num3, setNum3] = useState(0);
  const [message, setMessage] = useState('');

  // Bank state
  const [loan, setLoan] = useState(0);
  const [borrowAmount, setBorrowAmount] = useState(0);
  const [payBackAmount, setPayBackAmount] = useState(0);
  
  // Compound interest on the loan every 10 seconds (5% increase)
  useEffect(() => {
    const interestInterval = setInterval(() => {
      setLoan(prevLoan => prevLoan * 1.05);
    }, 10000); // 10,000 ms = 10 seconds
  
    return () => clearInterval(interestInterval);
  }, []);

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
    const newNum1 = Math.floor(Math.random() * 6);
    setNum1(newNum1);

    // After 500ms, update the second reel
    setTimeout(() => {
      const newNum2 = Math.floor(Math.random() * 6);
      setNum2(newNum2);

      // After another 500ms, update the third reel
      setTimeout(() => {
        const newNum3 = Math.floor(Math.random() * 6);
        setNum3(newNum3);

        // After an additional 500ms, check the win/loss condition
        setTimeout(() => {
          if (newNum1 === newNum2 && newNum2 === newNum3) {
            // Exact match win condition
            if (newNum1 === 0) {
              setMessage(`ULTIMATE JACKPOT PRIZE! SPECIAL REELS MATCH! YOU JUST DECUPLED YOUR MONEY!!! ${bet * 10} gambucks! (but if only you'd bet higher...)`);
              setGambucks(prev => prev + bet * 10);
            } else {
              setMessage(`WOOHOO! THREE IN ROW! 4x your bet, you win ${bet * 4} gambucks! Keep going for the ultimate prize!`);
              setGambucks(prev => prev + bet * 4);
            }
          } else if (
            ((newNum1 === newNum2 + 1) || (newNum1 === newNum2 - 1)) &&
            ((newNum3 === newNum2 + 1) || (newNum3 === newNum2 - 1))
          ) {
            // Outer reels match like tic-tac-toe, 2x win condition
            setMessage(`Outer reels match! Double your bet! You win ${bet * 2} gambucks!!`);
            setGambucks(prev => prev + bet * 2);
          }
          else if (newNum1 === newNum2 || newNum2 === newNum3) {
            // Two reels matching win condition
            setMessage(`Two in a row! 1.25x your bet! You win ${bet * 1.25} gambucks! Keep going!`);
            setGambucks(prev => prev + bet * 1.25);
          }
          else {
            // Loss: reels don't match any winning condition
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
          <br/>
          <button className="bigbuttons" onClick={() => setBet(bet +10)}>+10</button>
          <button className="bigbuttons" onClick={() => setBet(bet +100)}>+100</button>
          <button className="bigbuttons" onClick={() => setBet(bet +1000)}>+1000</button>
          <br/>
          <button className="bigbuttons" onClick={() => setBet(bet -10)}>-10</button>
          <button className="bigbuttons" onClick={() => setBet(bet -100)}>-100</button>
          <button className="bigbuttons" onClick={() => setBet(bet -1000)}>-1000</button>

          <br/><br/>
          <button className="mulbuttons" onClick={() => setBet(bet * 2)}>Double Bet</button>
          <button className="mulbuttons" onClick={() => setBet(Math.max(1, Math.floor(bet / 2)))}>Halve Bet</button>
          <br/><br/>
        </div>
        <br />
        <div>
          {num1 - 1}, {num2 - 1}, {num3 - 1}
        </div>
        <div>
          {num1}, {num2}, {num3}
        </div>
        <div>
          {num1 + 1}, {num2 + 1}, {num3 + 1}
        </div>
        <div>{message}</div>
        <button onClick={spinSlots}>SPIN</button>
        <br /><br />
        {/* Bank Section */}
        <div className="bank-section">
          <h3>Bank</h3>
          <p>Outstanding Loan: {loan.toFixed(2)} gambucks</p>
          <div>
            <input
              type="number"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(Number(e.target.value))}
              placeholder="Enter amount to borrow"
              min="0"
            />
            <button
              onClick={() => {
                setGambucks(prev => prev + borrowAmount);
                setLoan(prev => prev + borrowAmount);
                setBorrowAmount(0);
              }}
            >
              Borrow Gambucks
            </button>
          </div>
          <br/>
          <div>
            <input
              type="number"
              value={payBackAmount}
              onChange={(e) => setPayBackAmount(Number(e.target.value))}
              placeholder="Enter amount to pay back"
              min="0"
            />
            <button
              onClick={() => {
                // Ensure the player has enough gambucks to pay back
                if (payBackAmount > gambucks) {
                  alert("Not enough gambucks to pay back that amount!");
                  return;
                }
                setGambucks(prev => prev - payBackAmount);
                setLoan(prev => Math.max(0, prev - payBackAmount));
                setPayBackAmount(0);
              }}
            >
              Pay back Gambucks
            </button> 
          </div>
        </div>
    </>
  );
});

export default Slots;
