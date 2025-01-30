import React from 'react';

//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';





const Blackjack = () => {
    return(
        <>

        <Helmet>
            <title>BLACKJACK</title>
        </Helmet>

        <div>Blackjack Page</div>
        <div>Insert blackjack</div>
        
        </>
    );
}

export default Blackjack;
