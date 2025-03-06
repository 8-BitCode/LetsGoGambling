import React from 'react'

function ZeroBet({onClick, type}) {

    if (type == 'single') {
        return(
            <button onClick={onClick}></button>
        )
    }
    else {
        return (
            <button onClick={onClick}></button>
        )
    }
};

export default ZeroBet;