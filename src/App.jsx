import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import TermsOfService from './TermsOfService';
import UserEntry from './UserEntry';
import GameSelection from './GameSelection';
import Blackjack from './Blackjack';
import Slots from './Slots';
import Roulette from './Roulette';

export default () => (
  <>
     <BrowserRouter>
      <Routes>
        <Route path="/TermsOfService" element={<TermsOfService />} />
        <Route path="/UserEntry" element={<UserEntry />} />
        <Route path="/GameSelection" element={<GameSelection />} />
        <Route path="/Blackjack" element={<Blackjack />} />
        <Route path="/Slots" element={<Slots />} />
        <Route path="/Roulette" element={<Roulette />} />
      </Routes>
    </BrowserRouter>

  </>
);
