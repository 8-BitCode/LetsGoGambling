import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { db, collection, onSnapshot } from "./firebase"; // Import the necessary Firestore functions
import "./CssFiles/Stats.css";

export default function Stats({ closeGame, loggedInUser }) {
  const [players, setPlayers] = useState([]);

  // Debugging: log the logged-in user
  useEffect(() => {
    console.log("Logged-in user:", loggedInUser);
  }, [loggedInUser]);

  // Generate a random position for the window
  const randomX = Math.floor(Math.random() * (window.innerWidth - 600));
  const randomY = Math.floor(Math.random() * (window.innerHeight - 400 - 40));

  // Fetch player data from Firestore with real-time updates using onSnapshot
  useEffect(() => {
    const playersRef = collection(db, "Players");

    // Set up the real-time listener
    const unsubscribe = onSnapshot(playersRef, (querySnapshot) => {
      const playerData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          name: data.username,
          cash: `$${data.money}`,  // Assuming "money" represents the cash
          debt: `$${data.debt}`,   // Assuming "debt" represents the debt
        };
      });
      setPlayers(playerData);
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  // Debugging: log the players data
  useEffect(() => {
    console.log("Players data:", players);
  }, [players]);

  return (
    <Draggable handle=".title-bar" defaultPosition={{ x: randomX, y: randomY }}>
      <div className="win95-app-container">
        <div className="title-bar">
          <span>USER SEARCH.XLS</span>
          <div className="buttons">
            <button className="window-button" onClick={closeGame}>X</button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>MONEY!!!!</th>
                <th><s>debt</s> anti cash.</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: loggedInUser && player.name.toLowerCase() === loggedInUser.toLowerCase() ? "yellow" : "white"
                  }}
                >
                  <td>{player.name}</td>
                  <td style={{ color: 'green' }}>{player.cash}</td>
                  <td style={{ color: 'rgba(0, 0, 0, 0.5)' }}>{player.debt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Draggable>
  );
}
