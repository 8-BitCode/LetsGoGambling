import React from 'react';
import './CssFiles/GameSelection.css'
//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';





const GameSelection = () => {
    return(
        <>

        <Helmet>
            <title>GAMES ZONE!!!!!</title>
        </Helmet>
        
        <div className='GS-Container'>
            <div>Games Selection Page</div>
        </div>

        
        </>
    );
}

export default GameSelection;
