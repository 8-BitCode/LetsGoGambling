import React from 'react';

//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';





const Stats = () => {
    return(
        <>

        <Helmet>
            <title>STATS PAGE!!!!</title>
        </Helmet>

        <div>Stats page</div>
        
        </>
    );
}

export default Stats;