import React from 'react'

function OddEvenBet({onClick, type}) {

 return(
    <button onClick={onClick}>{type}</button>
 )   
};

export default OddEvenBet;