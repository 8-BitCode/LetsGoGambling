import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { db, collection, onSnapshot } from "./firebase";
import "./CssFiles/Stats.css";

export default function Stats({ closeGame, loggedInUser, selectedUser }) {
  const [players, setPlayers] = useState([]);

  // Fetch player data from Firestore with real-time updates using onSnapshot
  useEffect(() => {
    const playersRef = collection(db, "Players");

    // Set up the real-time listener
    const unsubscribe = onSnapshot(playersRef, (querySnapshot) => {
      const playerData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          name: data.username,
          cash: `$${data.money}`, // Assuming "money" represents the cash
          debt: `$${data.debt}`, // Assuming "debt" represents the debt
          level: `${data.level}`, // Assuming "debt" represents the debt
        };
      });
      setPlayers(playerData);
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  // Generate a random position for the window
  const randomX = Math.floor(Math.random() * (window.innerWidth - 600));
  const randomY = Math.floor(Math.random() * (window.innerHeight - 400 - 40));

  return (
    <Draggable handle=".title-bar" defaultPosition={{ x: randomX, y: randomY }}>
      <div className="win95-app-container">
        <div className="title-bar">
          <span>USER SEARCH.XLS</span>
          <div className="buttons">
            <button className="window-button" onClick={closeGame}>
              X
            </button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>ShamBux 🍀</th>
                <th>
                  <s>debt</s> anti cash.
                </th>
                <th>LEVEL</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor:
                      loggedInUser && player.name.toLowerCase() === loggedInUser.toLowerCase()
                        ? "yellow" // Highlight logged-in user in yellow
                        : selectedUser && player.name.toLowerCase() === selectedUser.toLowerCase()
                        ? "lightgreen" // Highlight selected user in green
                        : "white",
                  }}
                >
                  <td>{player.name}</td>
                  <td style={{ color: "green" }}>{player.cash}</td>
                  <td style={{ color: "rgba(0, 0, 0, 0.5)" }}>{player.debt}</td>
                  <td>{player.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Draggable>
  );
}