import React from 'react'
import { default as placeBet } from './PlaceBet';

function ColourBet({colour, betAmount}) {

 return(
    <button onClick={() => placeBet(colour, betAmount, 2)}>{colour}</button>
 )   
};

export default ColourBet;