import React from 'react';

//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';
import './CssFiles/Roulette.css';

const Roulette = () => {
    return(
        <>

        <Helmet>
            <title>ROULETTE!!!!!</title>
        </Helmet>

        <div className='Roulette.css'>
            <div>Roulette Page</div>
        </div>

        </>
    );
}

export default Roulette;
