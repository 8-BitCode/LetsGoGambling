import React from 'react'

function ZeroBet({onClick, type}) {

    if (type == 'single') {
        return(
            <button onClick={onClick}>0</button>
        )
    }
    else {
        return (
            <button onClick={onClick}>00</button>
        )
    }
};

export default ZeroBet;