import React, { useState } from "react";
import Draggable from "react-draggable";
import { Helmet } from "react-helmet";
import "./CssFiles/Bank.css";

export default function Bank({ closeBank }) {
  const [balance, setBalance] = useState(0);
  const [loan, setLoan] = useState(0);
  const [amount, setAmount] = useState(0);

  // Generate a random position for the window
  const randomX = Math.floor(Math.random() * (window.innerWidth - 400));
  const randomY = Math.floor(Math.random() * (window.innerHeight - 275 - 40)); // - 40 becuase of the button bar
  

  const handleTakeLoan = () => {
    if (amount > 0) {
      setBalance(balance + amount);
      setLoan(loan + amount);
      setAmount(0);
    }
  };

  const handleRepayLoan = () => {
    if (amount > 0 && amount <= balance && amount <= loan) {
      setBalance(balance - amount);
      setLoan(loan - amount);
      setAmount(0);
    }
  };

  return (
    <Draggable defaultPosition={{ x: randomX, y: randomY }}>
      <div className="bank-window">
        <Helmet>
          <title>Bank</title>
        </Helmet>
        <div className="top-bar">
          <span className="top-bar-title">Bank95.exe</span>
          <div className="top-bar-buttons">
            <button className="close-button" onClick={closeBank}>X</button>
          </div>
        </div>
        <div className="bank-content">
          <div className="balance-display">Balance: ${balance}</div>
          <div className="loan-display">Loan: ${loan}</div>
          <input
            type="number"
            className="money-input"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
          />
          <div className="button-group">
            <button className="bank-button" onClick={handleTakeLoan}>Take Loan</button>
            <button className="bank-button" onClick={handleRepayLoan} disabled={amount > balance || amount > loan}>
              Repay Loan
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
}
