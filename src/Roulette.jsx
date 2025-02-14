import React, { useState, Fragment } from 'react';


//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';
import './RouletteComponents/Roulette.css'

const Roulette = () => {

    const [chipSelected, setChip] = useState();

    function updateSelected(value) {
        setChip(value)
    }

    const chipValues = [0.5, 1, 2, 5, 10, 25, 50, 100, 500]; 

    return(
        <Fragment>
        <div className='Roulette-Container'>
            <Helmet>
                <title>ROULETTE!!!!!</title>
            </Helmet>

            <div>Selected Chip: {chipSelected}</div>

            <div id='chip-container'>        
                {chipValues.map(value => <button onClick={() => updateSelected(value)} id={value} key={value} className='chip'>{value}</button>)}
            </div>

            <div id='roulette-table'>
                <div id='zero-column'>
                    
                </div>
                <div id='row-one'>

                </div>
                <div id='row-two'>

                </div>
                <div id='row-three'>

                </div>
                <div id='row-four'>

                </div>
                <div id='row-five'>
                    </div>            
            </div>

        </div>
        </Fragment>
    );
}

export default Roulette;
