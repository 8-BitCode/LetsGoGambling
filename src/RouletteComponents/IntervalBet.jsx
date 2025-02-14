import React from 'react'

function IntervalBet({twoToOne, interval}) {

    // includes 2 to 1 type bet (entire row)

    if (twoToOne === true) {
        return(
            <button>2/1</button>
        )
    }

    else {

        const firstNumber = interval[0]
        const finalNumber = interval[interval.length - 1]

        return(
            <button>{firstNumber} to {finalNumber}</button>
        )
    }

};

export default IntervalBet;