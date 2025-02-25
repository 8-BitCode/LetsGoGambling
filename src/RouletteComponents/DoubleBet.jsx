import React from 'react'

function DoubleBet({onClick, numbers}) {

 return(
    <button onClick={onClick}>{numbers[0]}/{numbers[1]}</button>
 )   
};

export default DoubleBet;