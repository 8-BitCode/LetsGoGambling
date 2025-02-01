import React from 'react';
import './CssFiles/Slots.css';
//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';





const Slots = () => {
    return(
        <>

        <Helmet>
            <title>SLOTS!!!!!</title>
        </Helmet>

        <div className='Slots-Container'>
            <div>Slots Page</div>
        </div>

        </>
    );
}

export default Slots;
