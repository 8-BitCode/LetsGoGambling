import React from 'react';
import Chip from './RouletteComponents/Chip';
import { Fragment } from 'react';

//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';
import './CssFiles/Roulette.css';

const Roulette = () => {

    const chipValues = [
        0.5, 1, 5, 10, 20, 50, 100
    ]

    return(
        <Fragment>

            <Helmet>
                <title>ROULETTE!!!!!</title>
            </Helmet>
            <ul>
            {chipValues.map(value => <li><Chip class={value} value={value} /></li>)}
            </ul>
    
        </Fragment>
    );
}

export default Roulette;
