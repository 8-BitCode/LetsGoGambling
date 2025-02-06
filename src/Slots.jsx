import React from 'react';

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

        <div>Slots Page</div>
        
        </>
    );
}



export default Slots;

