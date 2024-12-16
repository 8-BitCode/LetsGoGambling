import React from 'react';

//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';





const GameSelection = () => {
    return(
        <>

        <Helmet>
            <title>GAMES ZONE!!!!!</title>
        </Helmet>

        <div>Games Selection Page</div>
        
        </>
    );
}

export default GameSelection;
