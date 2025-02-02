import React from 'react';
import './CssFiles/UserEntry.css';
import { Helmet } from 'react-helmet';

const UserEntry = () => {
    return (
        <>
        <Helmet>
            <title>ENTRY ZONE!!!!!</title>
        </Helmet>

        <div className='UE-Container'>
            <nav><button className='navbutton'>START</button></nav>
        </div>

        </>
    );
}

export default UserEntry;
