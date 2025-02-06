import React from 'react';
import './CssFiles/Stats.css';
//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';





const Stats = () => {
    return(
        <>

        <Helmet>
            <title>STATS PAGE!!!!</title>
        </Helmet>
        <div container="Stats-Container">
            <div>Stats page</div>
            <h1>hello</h1>
        </div>
        </>
    );
}

export default Stats;