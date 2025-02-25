import React from 'react'

function ColourBet({onClick, colour}) {

 return(
    <button onClick={onClick}>{colour}</button>
 )   
};

export default ColourBet;