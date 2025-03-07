import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import "./CssFiles/Slots.css";

const symbols = ["7", "🎵", "🍀", "🔔", "💎", "🐎"];

export default function SlotMachine({ closeGame }) {
  const randomX = Math.floor(Math.random() * (window.innerWidth - 600));
  const randomY = Math.floor(Math.random() * (window.innerHeight - 490 - 40)); // - 40 becuase of the button bar
  const [reels, setReels] = useState([
    ["7", "7", "7"],
    ["7", "7", "7"],
    ["7", "7", "7"]
  ]);
  const [credits, setCredits] = useState(1000);
  const [bet, setBet] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [highlighted, setHighlighted] = useState([]);

  const spin = () => {
    if (spinning || credits < bet) return;
  
    // Check if the bet is zero
    if (bet === 0) {
      alert("Please place a bet to start the game."); 
      return;
    }
  
    setSpinning(true);
    setCredits(credits - bet);
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
      checkWins(newReels);
    }, spinDuration);
  };
  

  const checkWins = (grid) => {
    let wins = [];
    let winDetected = false;
    let TypeOfWin;

    grid.forEach((row, rowIndex) => {
      if (row.every((symbol) => symbol === row[0])) {
        winDetected = true;
        TypeOfWin = 1;
        wins.push(...row.map((_, colIndex) => [rowIndex, colIndex]));
      }
    });

    for (let col = 0; col < 3; col++) {
      const column = [grid[0][col], grid[1][col], grid[2][col]];
      if (column.every((symbol) => symbol === column[0])) {
        winDetected = true;
        TypeOfWin = 2;
        wins.push(...column.map((_, rowIndex) => [rowIndex, col]));
      }
    }

    if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
      winDetected = true;
      TypeOfWin = 3;
      wins.push([0, 0], [1, 1], [2, 2]);
    }
    if (grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
      winDetected = true;
      TypeOfWin = 4;
      wins.push([0, 2], [1, 1], [2, 0]);
    }


    // BASIC WIN actually not sure
    if (winDetected && TypeOfWin === 1) {
      setCredits((prevCredits) => prevCredits + bet * 10);
      setHighlighted(wins);
    }


    if (winDetected && TypeOfWin === 2) {
      setCredits((prevCredits) => prevCredits + bet * 2);
      setHighlighted(wins);
    }

    // DIAGONAL MATCH definitely not sure
    if (winDetected && TypeOfWin === 3) {
      setCredits((prevCredits) => prevCredits + bet * 100);
      setHighlighted(wins);
    }

    if (winDetected && TypeOfWin === 4) {
      setCredits((prevCredits) => prevCredits + bet * 0.5);
      setHighlighted(wins);
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
              <button className="close-button" onClick={closeGame}>X</button>
            </div>
          </div>

          <div className="slot-machine-content">
            <div className="credits">Gambucks: {credits}</div>
            <div className="bet">Bet: {bet}</div>

            <div className="bet-controls">
              <div className="bet-adjust bet-decrease">
                {[1, 10, 100, 1000].map((value) => (
                  <button key={value} onClick={() => adjustBet(-value)}>
                    -{value}
                  </button>
                ))}
                <button onClick={() => setBet((prevBet) => prevBet / 2)}>Halve</button> 
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
                <button onClick={() => setBet((prevBet) => prevBet * 2)}>Double</button>
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