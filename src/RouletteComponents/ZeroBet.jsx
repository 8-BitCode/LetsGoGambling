import React from 'react'

function ZeroBet({type}) {

    if (type == 'single') {
        return(
            <button>0</button>
        )
    }
    else {
        return (
            <button>00</button>
        )
    }
};

export default ZeroBet;