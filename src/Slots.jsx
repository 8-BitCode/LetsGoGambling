import React, { useState } from 'react';

//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';



const Slots = () => {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [num3, setNum3] = useState(0);
    const [message, setMessage] = useState('');
  
    function Ran_Num() {
        const newNum1 = Math.floor(Math.random() * 4);
        const newNum2 = Math.floor(Math.random() * 4);
        const newNum3 = Math.floor(Math.random() * 4);
      
    // Check if all three numbers are equal
      if (newNum1 === newNum2 && newNum2 === newNum3) {
        setMessage('Wow! Good job buddy :)    +32 gambucks');
      } else {
        setMessage('LOSER!!! -1000 GAMBUCKS');
      }
  
      // Update the state with the new numbers
      setNum1(newNum1);
      setNum2(newNum2);
      setNum3(newNum3);
    }


    return(
        <>

        <Helmet>
            <title>SLOTS!!!!!</title>
        </Helmet>
        <div className='Slots-Container'>
            <div>Welcome to SLOTS!!</div>
            <br></br>
            <div>slots result: {num1}, {num2}, {num3}</div>
            <div>{message}</div>
            <button onClick={Ran_Num}> SPIN </button>
            
        </div>

        
        </>
    );
}



export default Slots;

