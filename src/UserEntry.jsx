import React from 'react';

//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';




const UserEntry = () => {
    return(
        <>

        <Helmet>
            <title>ENTRY ZONE!!!!!</title>
        </Helmet>

        <div>Login / Register Page</div>
        
        </>
    );
}

export default UserEntry;
