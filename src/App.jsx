import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TermsOfService from "./TermsOfService";
import UserEntry from "./UserEntry";
import GameSelection from "./GameSelection";
import Blackjack from "./Blackjack";
import Slots from "./Slots";
import Roulette from "./Roulette";
import Stats from "./Stats";

import "./CssFiles/App.css";

export default () => {
  const [isPortrait, setIsPortrait] = useState(
    window.innerWidth < 768 || window.matchMedia("(orientation: portrait)").matches
  );

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerWidth < 768 || window.matchMedia("(orientation: portrait)").matches);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isPortrait) {
    return (
      <div className="funny-message">
        <h1>🎰 Bad Bet, Buddy! 🎰</h1>
        <p>We don’t gamble in portrait mode. Flip your phone, or you’re out of luck! 🍀</p>
      </div>
    );
  }

  return (
    <div className="Intro-Container">
      <BrowserRouter>
        <Routes>
          <Route path="/TermsOfService" element={<TermsOfService />} />
          <Route path="/UserEntry" element={<UserEntry />} />
          <Route path="/GameSelection" element={<GameSelection />} />
          <Route path="/Blackjack" element={<Blackjack />} />
          <Route path="/Slots" element={<Slots />} />
          <Route path="/Roulette" element={<Roulette />} />
          <Route path="/Stats" element={<Stats />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
