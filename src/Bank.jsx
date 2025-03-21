import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { Helmet } from "react-helmet";
import { db, doc, updateDoc, onSnapshot } from "./firebase"; // Import onSnapshot
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

  // Fetch data from Firebase using onSnapshot for live updates
  useEffect(() => {
    const docRef = doc(db, "Players", userId); // Reference to the user's document

    // Set up a real-time listener for the document
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setBalance(docSnap.data().money || 0); // Update balance
        setDebt(docSnap.data().debt || 0); // Update debt
      } else {
        console.log("No such document!");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [userId]);

  const handleTakeLoan = async () => {
    playClickSound();
    if (amount > 0) {
      const newBalance = balance + amount;
      const newDebt = debt + amount; // Increase the debt by the loan amount

      // Update data in Firestore
      const docRef = doc(db, "Players", userId);
      await updateDoc(docRef, {
        money: newBalance,
        debt: newDebt, // Update the debt field
      });
    }
  };

  const handleRepayLoan = async () => {
    playClickSound();
    if (amount > 0 && amount <= balance && amount <= debt) {
      const newBalance = balance - amount;
      const newDebt = debt - amount; // Decrease the debt by the repayment amount

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
          <div className="balance-display">Shambux: ${balance}</div>
          <div className="balance-display">Anti Shambux: ${debt}</div> {/* Display the debt */}
          <input
            type="number"
            className="money-input"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
          />
          <div style={{ color: 'black', opacity: '40%' }}>Interest (e% per minute whilst playing)</div>
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