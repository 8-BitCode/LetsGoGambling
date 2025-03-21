import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TitlePage from "./TitlePage";
import TermsOfService from "./TermsOfService";
import UserEntry from "./UserEntry";
import GameSelection from "./GameSelection";
import END from "./END";

import "./CssFiles/App.css";

export default () => {
  const [isPortrait, setIsPortrait] = useState(
    window.innerWidth < 768 || window.matchMedia("(orientation: portrait)").matches
  );

  // Detect mobile devices using the user agent string
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerWidth < 768 || window.matchMedia("(orientation: portrait)").matches);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show the message if the user is on a mobile device OR the screen is in portrait mode
  if (isMobile || isPortrait) {
    return (
      <div className="funny-message">
        <h1>🎰 Bad Bet, Buddy! 🎰</h1>
        <p>
          {isMobile
            ? "We don't gamble on mobile devices. Get on a desktop, or you're out of luck! 🍀"
            : "We don't gamble in portrait mode. Rotate your device to landscape mode, or you're out of luck! 🍀"}
        </p>
      </div>
    );
  }

  return (
    <div className="Intro-Container">
      <BrowserRouter>
        <Routes>
          <Route index element={<TitlePage />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
          <Route path="/UserEntry" element={<UserEntry />} />
          <Route path="/GameSelection" element={<GameSelection />} />
          <Route path="/END" element={<END />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};