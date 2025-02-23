import React, { useState } from 'react';
import './CssFiles/TitlePage.css';
import Draggable from 'react-draggable'; // The default
import { useNavigate } from "react-router-dom";

export default function Windows95App() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  // Sound effect on button click
  const playClickSound = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  const Continue = () =>{
    navigate('./TermsOfService')
  }

  return (
    <div className="app-container">
    
      {/* Full Window Frame - square shape */}
      <Draggable>
      <div className="window-frame">
        {/* Windows 95 style top bar for full application window */}
        <div className="window-title-bar">
          <span className="window-title">Le�s_�o_��m�li�g.exe</span>
          <div className="window-controls">
            <button className="control-button">-</button>
            <button className="control-button close-button">X</button>
          </div>
        </div>

        {/* Main content */}
        <div className="window-content">
          {/* Static Blocky Title */}
          <h1 className="window-title-text">Lets Go Gambling</h1>

          {/* Windows 95 Style Popup Button */}
          <button onClick={playClickSound} className="continue-button">
            Continue
          </button>
        </div>
      </div>
      </Draggable>
      {/* Windows 95 Style Popup */}
      {showPopup && (
        <Draggable>
        <div className="popup">
          {/* Popup Title Bar */}
          <div className="popup-title-bar">
            <span className="popup-title">Prompt</span>
            <button onClick={closePopup} className="control-button close-button">X</button>
          </div>
          {/* Popup Content */}
          <div className="popup-content">
            Are you sure you want to continue?
            <div className="popup-buttons">
              <button onClick={Continue} className="popup-button">Yes</button>
              <button onClick={closePopup} className="popup-button">No</button>
            </div>
          </div>
        </div>
        </Draggable>
      )}
    </div>
  );
}
