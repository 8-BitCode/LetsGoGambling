import React from 'react';
import './CssFiles/Blackjack.css'
//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';


const Blackjack = () => {
    const navigate = useNavigate();

    const goToGameSelection = () => {
        navigate('/GameSelection');
    };

    return(
        <>

        <Helmet>
            <title>BLACKJACK</title>
        </Helmet>
        <div className='Blackjack-Container'>
            <h1>Blackjack</h1>

            <div className='Blackjack-Options'>
                <button>Hit</button>
                <button>Stand</button>
            </div>

            <button onClick={goToGameSelection}>Exit</button>
        </div>
        
        </>
    );
}

export default Blackjack;
