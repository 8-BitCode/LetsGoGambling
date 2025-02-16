import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import TermsOfService from './TermsOfService';
import UserEntry from './UserEntry';
import GameSelection from './GameSelection';
import Blackjack from './Blackjack';
import Slots from './Slots';
import Roulette from './Roulette';
import Stats from './Stats';

import './CssFiles/App.css';

export default () => (
  <>
    <div className='Windows95-Theme'>
      {/* Title Bar (Now Part of Windows95-Theme) */}
      <div className="Window-Title-Bar">
        <span className="Window-Title">Hello.exe</span>
        <div className="ButtonCon">
          <button>-</button>
          <button>X</button>
        </div>
      </div>

      {/* Content Wrapper (Starts Right After Title Bar) */}
      <div className='Content-Wrapper'>
        <div className='Intro-Container'>
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
      </div>
    </div>
  </>
);
