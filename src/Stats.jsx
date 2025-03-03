import React from "react";
import Draggable from "react-draggable";
import "./CssFiles/Stats.css";

const initialData = [
  ["NAME", "CASH", "LOSS", "REVENUE", "AVG. PROFIT"],
  ["X_JOE_X", "-$1000", "-$1000", "$0", "-$100"],
  ["JEB", "$2", "-$100", "$102", "$0"],
  ["COOL_GUY_64", "$105", "$0", "$105", "$10"],
  ["ETC ETC", "$50", "-$10", "$80", "$5"],
  ["USER_123", "$500", "-$50", "$600", "$50"],
  ["GAMER_X", "$300", "-$20", "$400", "$30"],
  ["RETRO_FAN", "$120", "-$10", "$140", "$10"],
  ["PIXEL_PETE", "$200", "-$15", "$250", "$20"],
  ["DOS_MASTER", "$180", "-$25", "$230", "$15"],
  ["DOS_MASTER", "$180", "-$25", "$230", "$15"],
  ["DOS_MASTER", "$180", "-$25", "$230", "$15"],
  ["DOS_MASTER", "$180", "-$25", "$230", "$15"],
];

export default function Stats({ closeGame }) {
    // Generate a random position for the window
    const randomX = Math.floor(Math.random() * (window.innerWidth - 600));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 400 - 40));
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
                {initialData[0].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {initialData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} title={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Draggable>
  );
}
