import React from 'react'

function IntervalBet({onClick, twoToOne, interval}) {

    // includes 2 to 1 type bet (entire row)

    if (twoToOne === true) {
        return(
            <button style={{position: 'relative', right: '30px'}} onClick={onClick}></button>
        )
    }

    else {

        const firstNumber = interval[0]
        const finalNumber = interval[interval.length - 1]

        return(
            <button onClick={onClick}></button>
        )
    }

};

export default IntervalBet;