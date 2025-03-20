import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { db, collection, onSnapshot } from "./firebase";
import "./CssFiles/Stats.css";

// Function to calculate Steve-o's Shambux based on the player's level
const calculateSteveOShambux = (playerLevel) => {
  let shambux = 40; // Starting Shambux at level 1

  if (playerLevel >= 1 && playerLevel < 4) {
    // Level 1-3: Shambux remains 40
    shambux = 40;
  } else if (playerLevel >= 4 && playerLevel <= 21) {
    // Every 3 levels, multiply by 1.5 (rounded down)
    const steps = Math.floor((playerLevel - 1) / 3);
    shambux = 40 * Math.pow(1.5, steps);
    shambux = Math.floor(shambux);
  } else if (playerLevel >= 22 && playerLevel <= 60) {
    // From level 22 to 60, multiply by 1.1 every 2 levels
    const steps = Math.floor((playerLevel - 22) / 2);
    shambux = 683 * Math.pow(1.1, steps);
    shambux = Math.floor(shambux);
  } else if (playerLevel >= 61 && playerLevel <= 77) {
    // From level 61 to 77, multiply by 1.02 every level
    const steps = playerLevel - 61;
    shambux = 4179 * Math.pow(1.02, steps);
    shambux = Math.floor(shambux);
  } else if (playerLevel === 78) {
    // At level 78, lose half of Shambux
    shambux = Math.floor(5851 / 2);
  } else if (playerLevel >= 79 && playerLevel <= 119) {
    // From level 79 to 119, multiply by 1.01 every level
    const steps = playerLevel - 79;
    shambux = 2925 * Math.pow(1.01, steps);
    shambux = Math.floor(shambux);
  } else if (playerLevel >= 120 && playerLevel <= 150) {
    // From level 120 to 150, multiply by 0.9 every 5 levels
    const steps = Math.floor((playerLevel - 120) / 5);
    shambux = 4356 * Math.pow(0.9, steps);
    shambux = Math.floor(shambux);
  } else if (playerLevel >= 151 && playerLevel < 176) {
    // From level 151 to 175, Shambux remains at 2314 (no changes)
    shambux = 2314;
  } else if (playerLevel === 176) {
    // At level 176, lose 1815 Shambux
    shambux = 2314 - 1815;
  } else if (playerLevel >= 177 && playerLevel <= 240) {
    // From level 177 to 240, multiply by 1.01 every level
    const steps = playerLevel - 177;
    shambux = 499 * Math.pow(1.01, steps);
    shambux = Math.floor(shambux);
  } else if (playerLevel >= 241 && playerLevel <= 340) {
    // From level 241 to 340, multiply by 0.9456 every level
    const steps = playerLevel - 241;
    shambux = 804 * Math.pow(0.9456, steps);
    shambux = Math.floor(shambux);
  } else if (playerLevel > 340) {
    // After level 340, Shambux remains 3
    shambux = 3;
  }

  return shambux;
};

export default function Stats({ closeGame, loggedInUser, selectedUser, Level }) {
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
          level: `${data.level}`, // Assuming "level" represents the level
        };
      });

      // Calculate Steve-o's Shambux based on the player's level
      const steveOShambux = calculateSteveOShambux(Level);

      // Add fake data for "Steve-o"
      const fakeSteveO = {
        name: "Steve-o",
        cash: `$${steveOShambux}`, // Dynamic Shambux
        debt: "$0", // Debt is always 0 for Steve-o
        level: Level === 1 ? "" : `${Level}`, // Hide level if player is at level 1
      };

      // Combine real data with fake data
      const combinedData = [...playerData, fakeSteveO];

      // Sort the combined data alphabetically by name
      combinedData.sort((a, b) => a.name.localeCompare(b.name));

      setPlayers(combinedData);
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, [Level]); // Re-run effect when Level changes

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
                <th>Shambux 🍀</th>
                <th>Anti Shambux</th>
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