import React from 'react';
import './CssFiles/UserEntry.css';
//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';




const UserEntry = () => {
    return(
        <>

        <Helmet>
            <title>ENTRY ZONE!!!!!</title>
        </Helmet>

        <div className='UE-Container'>
            <p>Login / Register Page</p>
        </div>

        
        </>
    );
}

export default UserEntry;
