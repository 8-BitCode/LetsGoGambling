import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { Helmet } from "react-helmet";
import { db, doc, getDoc, updateDoc } from "./firebase"; // Import the necessary functions
import "./CssFiles/Bank.css";
import Click from './Assets/SoundEffects/Click.wav';

export default function Bank({ closeBank, userId }) {
  const [balance, setBalance] = useState(0);
  const [debt, setDebt] = useState(0); // Only track debt now
  const [amount, setAmount] = useState(0);

  // Generate a random position for the window
  const randomX = Math.floor(Math.random() * (window.innerWidth - 400));
  const randomY = Math.floor(Math.random() * (window.innerHeight - 275 - 40));

  const playClickSound = () => {
    const audio = new Audio(Click);
    audio.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
  };

  // Fetch data from Firebase when the component mounts
  useEffect(() => {
    const fetchBankData = async () => {
      const docRef = doc(db, "Players", userId); // Assumes you have a collection "Players" and userId is passed as a prop
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBalance(docSnap.data().money || 0);
        setDebt(docSnap.data().debt || 0); // Fetch debt from the database
      } else {
        console.log("No such document!");
      }
    };
    fetchBankData();
  }, [userId]);

  const handleTakeLoan = async () => {
    playClickSound()
    if (amount > 0) {
      const newBalance = balance + amount;
      const newDebt = debt + amount; // Increase the debt by the loan amount

      // Update state
      setBalance(newBalance);
      setDebt(newDebt);
      setAmount(0);

      // Update data in Firestore
      const docRef = doc(db, "Players", userId);
      await updateDoc(docRef, {
        money: newBalance,
        debt: newDebt, // Update the debt field
      });
    }
  };

  const handleRepayLoan = async () => {
    playClickSound()
    if (amount > 0 && amount <= balance && amount <= debt) {
      const newBalance = balance - amount;
      const newDebt = debt - amount; // Decrease the debt by the repayment amount

      // Update state
      setBalance(newBalance);
      setDebt(newDebt);
      setAmount(0);

      // Update data in Firestore
      const docRef = doc(db, "Players", userId);
      await updateDoc(docRef, {
        money: newBalance,
        debt: newDebt, // Update the debt field
      });
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
          <div className="balance-display">Debt: ${debt}</div> {/* Display the debt */}
          <input
            type="number"
            className="money-input"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
          />
          <div style={{color:'black'}}>Interest (1% per minute)</div>
          <div className="button-group">
            <button className="bank-button" onClick={handleTakeLoan}>Take Loan</button>
            <button className="bank-button" onClick={handleRepayLoan} disabled={amount > balance || amount > debt}>
              Repay Loan
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
}
