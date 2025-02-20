import React from 'react'

function NumberBet({onClick, number}) {

 return(
    <button onClick={onClick}>{number}</button>
 )   
};

export default NumberBet;