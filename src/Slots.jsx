import React from 'react';
import {useState} from 'react'; 

//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';



const Slots = () => {
    var text = 0
    var num1 = Math.floor(Math.random() * 10);

    return(
        <>

        <Helmet>
            <title>SLOTS!!!!!</title>
        </Helmet>
        <div className='Slots-Container'>
            <div>WELCOME TO SLOTS</div>
            <div>{text}</div>
            <div>{num1}</div>
            <button>hello</button>
        </div>
        </>
    );
}



export default Slots;

