import React, { useState, Fragment } from 'react';
import ColourBet from './RouletteComponents/ColourBet';
import ColumnBet from './RouletteComponents/ColumnBet';
import DoubleBet from './RouletteComponents/DoubleBet';
import IntervalBet from './RouletteComponents/IntervalBet';
import NumberBet from './RouletteComponents/NumberBet';
import OddEvenBet from './RouletteComponents/OddEvenBet';
import QuadBet from './RouletteComponents/QuadBet';
import ZeroBet from './RouletteComponents/ZeroBet';

//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';
import './RouletteComponents/Roulette.css'


const Roulette = () => {

    const spinWheel = () => {
        return 
    }
    
    const clearBet = () => {
        return 
    }
    
    const undoBet = () => {
        return 
    }


    const deposit = (amount) => {
        
        if (balance === undefined) {
            setBalance(amount)
        }
        else {
            setBalance(balance + amount)
        }
    }

    const [balance, setBalance] = useState();
    

    const [chipSelected, setChip] = useState();

    function updateSelected(value) {
        setChip(value)
    }

    const chipValues = [0.5, 1, 2, 5, 10, 25, 50, 100, 500]; 


    // following arrays are for used to generate the componets for table

    const zeroTypes = [
        {type: 'single'},
        {type: 'double'}
        ];

    const rowOneNumbers = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
    const rowTwoNumbers = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
    const rowThreeNumbers = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];

    const intervalBetsRowOne = [
        {key: 'interval 1', twoToOne: true, interval: [rowOneNumbers]}
    ];
    const intervalBetsRowTwo = [
        {key: 'interval 2', twoToOne: true, interval: [rowTwoNumbers]}
    ];
    const intervalBetsRowThree = [
        {key: 'interval 3', twoToOne: true, interval: [rowThreeNumbers]}
    ];

    const intervalBetsRowFour = [
        {key: 'interval 4', twoToOne: false, interval: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]},
        {key: 'interval 5', twoToOne: false, interval: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]},
        {key: 'interval 6', twoToOne: false, interval: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]}
    ];

    const intervalBetsRowFive = [
    {key: 'interval 7' , twoToOne: false, interval: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]},
    {key: 'interval 8', twoToOne: false, interval: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]},
    ];

    const oddEven = [
        {type: 'odd'},
        {type: 'even'}
    ];

    const colours = [
        {colour: 'red'},
        {colour: 'black'}
    ]

    const doubleBetRowOne = [
        [3, 6], [6, 9], [9, 12], [12, 15], [15, 18], [18, 21], [21, 24], [24, 27], [27, 30], [30, 33], [33, 36]
    ];
    const doubleBetRowOnev2 = [
        [2, 3], [5, 6], [8, 9], [11, 12], [14, 15], [17, 18], [20, 21], [23, 24], [26, 27], [29, 30], [32, 33], [35, 36]
    ]
    const doubleBetRowTwo = [
        [2, 5], [5, 8], [8, 11], [11, 14], [14, 17], [17, 20], [20, 23], [23, 26], [26, 29], [29, 32], [32, 35]
    ];
    const doubleBetRowTwov2 = [
        [1, 2], [4, 5], [7, 8], [10, 11], [13, 14], [16, 17], [19, 20], [22, 23], [25, 26], [28, 29], [31, 32], [34, 35]
    ]
    const doubleBetRowThree = [
        [1, 4], [4, 7], [7, 10], [10, 13], [13, 16], [16, 19], [19, 22], [22, 25], [25, 28], [28, 31], [31, 34]
    ];

    const quadBetsRowOne = [
        [1, 2, 4, 5], [4, 5, 7, 8], [7, 8, 10, 11], [10, 11, 13, 14], [13, 14, 16, 17], [16, 17, 19, 20],
        [19, 20, 22, 23], [22, 23, 25, 26], [25, 26, 28, 29], [28, 29, 31, 32], [31, 32, 34, 35]
    ]
    const quadBetsRowTwo = [
        [2, 3, 5, 6], [5, 6, 8, 9], [8, 9, 11, 12], [11, 12, 14, 15], [14, 15, 17, 18], [17, 18, 20, 21],
        [20, 21, 23, 24], [23, 24, 26, 27], [26, 27, 29, 30], [29, 30, 32, 33], [32, 33, 35, 36]
    ]

    const columnBets = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12], 
        [13, 14, 15], [16, 17, 18], [19, 20, 21], [22, 23, 24], 
        [25, 26, 27], [28, 29, 30], [31, 32, 33], [34, 35, 36],
        [1, 2, 3, 4, 5, 6], [4, 5, 6, 7, 8, 9], [7, 8, 9, 10, 11, 12],
        [10, 11, 12, 13, 14, 15], [13, 14, 15, 16, 17, 18], [16, 17, 18, 19, 20, 21],
        [19, 20, 21, 22, 23, 24], [22, 23, 24, 25, 26, 27], [25, 26, 27, 28, 29, 30],
        [28, 29, 30, 31, 32, 33], [31, 32, 33, 34, 35, 36]
    ];
    

    return(
        <Fragment>
        <div className='Roulette-Container'>
            <Helmet>
                <title>ROULETTE!!!!!</title>
            </Helmet>

            <div>Selected Chip: {chipSelected}</div>
            <div>balance: {balance}</div>

            <div id='chip-container'>        
                {chipValues.map(value => <button onClick={() => updateSelected(value)} id={value} key={value} className='chip'>{value}</button>)}
            </div>


            <div id='buttons-container'>
                <button onClick={() => spinWheel()}>Spin Wheel</button>
                <button onClick={() => clearBet()}>Clear Bet</button>
                <button onClick={() => undoBet()}>Undo Bet</button>
                <form>
                    <input type='text' className='deposit-input'/>
                    <input type='button' onClick={() => deposit(parseInt(document.querySelector('.deposit-input').value))}/>
                </form>
            </div>



            <div id='roulette-table'>
                <div id='zero-column'>
                    {zeroTypes.map(item => <ZeroBet className='zero' type={item.type} key={item.type}/>)}
                </div>
            <div id='roulette-table-grid'>
                <div id='row-one'>
                    <div className='row-subdivision-one'>
                        {rowOneNumbers.map(number => <NumberBet className='numbers' number={number} key={number}/>)}
                        {intervalBetsRowOne.map(item => <IntervalBet className='two-to-one' twoToOne={item.twoToOne} interval={item.interval} key={item.key} /> )}
                    </div>
                        <div className='double-one'>{doubleBetRowOne.map(numbers => <DoubleBet numbers={numbers} key={numbers}/>)}</div>
                    <div className='row-subdivision-two'>
                        <div className='double-two'>{doubleBetRowOnev2.map(numbers => <DoubleBet numbers={numbers} key={numbers}/>)}</div>
                        <div className='quad'>{quadBetsRowOne.map(numbers => <QuadBet numbers={numbers} key={numbers}/>)}</div>
                    </div>
                </div>
                <div id='row-two'>
                    <div className='row-subdivision-one'>
                        {rowTwoNumbers.map(number => <NumberBet number={number} key={number}/>)}    
                        {intervalBetsRowTwo.map(item => <IntervalBet twoToOne={item.twoToOne} interval={item.interval} key={item.key} /> )}
                    </div>
                        <div className='double-one'>{doubleBetRowTwo.map(numbers => <DoubleBet numbers={numbers} key={numbers}/>)}</div>
                    <div className='row-subdivision-two'>
                        <div className='double-two'>{doubleBetRowTwov2.map(numbers => <DoubleBet numbers={numbers} key={numbers}/>)}</div>
                        <div className='quad'>{quadBetsRowTwo.map(numbers => <QuadBet numbers={numbers} key={numbers}/>)}</div>
                    </div>
                </div>
                <div id='row-three'>
                    <div className='row-subdivision-one'>
                        {rowThreeNumbers.map(number => <NumberBet number={number} key={number}/>)}
                        {intervalBetsRowThree.map(item => <IntervalBet twoToOne={item.twoToOne} interval={item.interval} key={item.key} /> )}
                    </div>
                        <div className='double-one'>{doubleBetRowThree.map(numbers => <DoubleBet numbers={numbers} key={numbers}/>)}</div>
                    <div className='row-subdivision-two'>  
                        <div className='columns-container'>{columnBets.map(numbers => <ColumnBet numbers={numbers} key={numbers}/> )}</div>
                    </div>
                </div>
                <div id='row-four'>
                    {intervalBetsRowFour.map(item => <IntervalBet twoToOne={item.twoToOne} interval={item.interval} key={item.key}/>)}
                </div>
                <div id='row-five'>
                    {oddEven.map(item => <OddEvenBet type={item.type} key={item.type}/>)}
                    {colours.map(item => <ColourBet colour={item.colour} key={item.colour}/>)}
                    {intervalBetsRowFive.map(item => <IntervalBet twoTwoOne={item.twoToOne} interval={item.interval} key={item.key} /> )}
                </div>            
            </div>
            </div>

        </div>
        </Fragment>
    );
}

export default Roulette;
