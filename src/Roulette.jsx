import React, { useState, Fragment, useEffect } from 'react';
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

    // main functions within the game
    const spinWheel = () => {
        console.log(betsPlaced)
        // number from 'wheel spin'
        setWin(Math.floor(Math.random() * 38) - 1)  
        setPrevious(betsPlaced)
        setStake(undefined)      
    }

    // check each bet for a win
    // each bet is checked for colour, even/ odd first 
    // then if it is a single 
    // this leaves the bet ids that are arrays left allowing to check if the winning bet is in th array

    useEffect(() =>  {
       if (winningNumber !== null) {
        
            // since the winning number is soon cleared
            // this allows the number to still be displayed 
            setDisplay(winningNumber)

            betsPlaced.forEach(element => {
                let id = element[0]
                console.log(id)
                // checking colour 
                if (id == 'red' || id == 'black') {
        
                    if (redNumbers.includes(winningNumber)) {
                        winningColour = 'red';
                    } 
                    else {
                        winningColour = 'black';
                    }
        
                    if (winningColour == id) {
                        handleWin(element)
                    }
                }
        
                // checking even or odd
                else if (id == 'even' || id == 'odd') {
                        
                    if (evenNumbers.includes(winningNumber)) {
                        winningEvenOdd = 'even';
                    }
                    else {
                        winningEvenOdd = 'odd'; 
                    }
                        
                    if (winningEvenOdd == id) {
                        console.log(winningEvenOdd, id)
                        handleWin(element)
                    }
                }

                else if (Number.isInteger(id)) {
                    if (id == winningNumber)
                        handleWin(element)
                }

                else if (id.includes(winningNumber)) {
                    handleWin(element)
                }
            }
        )
        // prevents the function from being continually called 
        if (betsPlaced.length > 0) {
            setPlaced([])
            setStake(0)
        }
        setWin(null)
    }})


    
    const clearBet = () => {
        // resets the stake and balance
        let sum = 0
        betsPlaced.forEach(element => {
            sum += element[1]
        })
        setBalance(balance + sum)
        setStake(0)

        setPlaced([])
    }
    
    const undoBet = () => {
        let lastNum = betsPlaced.pop()
        setPlaced(betsPlaced)

        setBalance(balance + lastNum[1])
        setStake(stakePlaced - lastNum[1])
    }

    const reBet = () => {

        console.log(betsPlaced)
        console.log(previousBets)

        if (betsPlaced.includes(previousBets) || betsPlaced == previousBets || previousBets.length == 0) {
            console.log('hello')
            return
        }
        // if bets are already placed, this will remove the bet amount of those bets from the stake
        let addAmount = 0
        if (betsPlaced.length > 0) {
            betsPlaced.forEach(element => {
                addAmount += element[1]
            })
        }
        console.log('passed through')
        setPlaced(previousBets)

        let sum = 0
        previousBets.forEach(element => {
            sum += element[1]
        })
        if (sum > balance) {
            alert('not enough money in balance')
            return
        }
        console.log(sum, addAmount);
        setBalance(balance - sum + addAmount);
        if (betsPlaced == undefined) {
            setStake(sum)
            return
        }
        setStake(stakePlaced + sum - addAmount);
    }

    const handleWin = (element) => {
        alert('You Won ' + (element[1] * element[2]))
        console.log(balance)
        console.log(balance + (element[1] * element[2]))
        setBalance(balance + (element[1] * element[2]))
    }

    const deposit = (amount) => {
        
        if (balance === undefined) {
            setBalance(amount)
        }
        else {
            setBalance(balance + amount)
        }
    }

    // defining variables that get updated 
    const [balance, setBalance] = useState();
    const [chipSelected, setChip] = useState();
    const [stakePlaced, setStake] = useState();
    const [betsPlaced, setPlaced] = useState([]);
    const [previousBets, setPrevious] = useState([])
    const [winningNumber, setWin] = useState(null);
    const [displayWin, setDisplay] = useState();

    let multiplier = 0
    let winningColour = 0
    let winningEvenOdd = 0

    const placeBet = (betAmount, id) => {
        
        if (betAmount === undefined) {
            alert('Please select a bet amount')
            return 
        }


        if (betAmount > balance || balance == undefined) {
            alert('balance is too low')
            return
        }

        setBalance(balance - betAmount)
        
        if (stakePlaced === undefined) {
            setStake(betAmount);
        }
        else {
            setStake(stakePlaced + betAmount);
        }

        // calculates the appropriate multiplier based on the id
        // number bet
        if (Number.isInteger(id)) {
            multiplier = 36;
        }
        // zero or double zero
        else if (id == 'single' ||  id == 'double') {
            multiplier = 36;
        }
        else if (id == 'red' || id == 'black' || id == 'even'|| id == 'odd') {
            multiplier = 2;
        }
        else {
            switch (id.length) {
                case 2:
                    multiplier = 18;
                    break;
                case 4:
                    multiplier = 9;
                    break;
                case 5:
                    multiplier = 7;
                    break;
                case 6:
                    multiplier = 6;
                    break;
                case 3:
                    multiplier = 12;
                    break;
                case 18:
                    multiplier = 2;
                    break;
                case 12:
                    multiplier = 3;
                    break;
            }
        }

        setPlaced(prevBetsPlaced => [...prevBetsPlaced, [id, betAmount, multiplier]]);
    };


    function updateSelected(value) {
        setChip(value)
    }

    const chipValues = [0.5, 1, 2, 5, 10, 25, 50, 100, 500]; 


    // following arrays are for used to generate the componets for table

    const zeroTypes = [
        {type: 'single'},
        {type: 'double'}
        ];

    const evenNumbers = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36]
    const redNumbers = [3, 9, 12, 18, 21, 27, 30, 36, 5, 14, 23, 32, 1, 7, 16, 19, 25, 34]

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
        ['single', 'double', 1, 2, 3], [1, 2, 3], [1, 2, 3, 4, 5, 6], [4, 5, 6], [4, 5, 6, 7, 8, 9], [7, 8, 9],  [7, 8, 9, 10, 11, 12],
        [10, 11, 12], [10, 11, 12, 13, 14, 15], [13, 14, 15], [13, 14, 15, 16, 17, 18], [16, 17, 18],
        [16, 17, 18, 19, 20, 21], [19, 20, 21], [19, 20, 21, 22, 23, 24], [22, 23, 24], [22, 23, 24, 25, 26, 27],
        [25, 26, 27],  [25, 26, 27, 28, 29, 30], [28, 29, 30], [28, 29, 30, 31, 32, 33], [31, 32, 33],
        [31, 32, 33, 34, 35, 36], [34, 35, 36],
    ];
    

    return(
        <Fragment>
        <div className='Roulette-Container'>
            <Helmet>
                <title>ROULETTE!!!!!</title>
            </Helmet>

            <div id='information-container'>
                <div>Selected Chip: {chipSelected}</div>
                <div>Balance: {balance}</div>
                <div>Bet Placed: {stakePlaced}</div>
            </div>            


            <div id='wheel'>Wheel: {displayWin}</div>

            <div id='chip-container'>        
                {chipValues.map(value => <button onClick={() => updateSelected(value)} id={value} key={value} className='chip'>{value}</button>)}
            </div>


            <div id='buttons-container'>
                <button onClick={() => reBet()}>Re-Bet</button>
                <button onClick={() => clearBet()}>Clear Bet</button>
                <button onClick={() => undoBet()}>Undo Bet</button>
                <button onClick={() => spinWheel()}>Spin Wheel</button>
            </div>

            <form id='deposit-container'>
                <div>Deposit</div>
                <input type='text' className='deposit-input'/>
                <input type='button' onClick={() => deposit(parseInt(document.querySelector('.deposit-input').value))}/>
            </form>




            <div id='roulette-table'>
                <div id='zero-column'>
                    {zeroTypes.map(item => <ZeroBet onClick={() => placeBet(chipSelected, item.type)} className='zero' type={item.type} key={item.type}/>)}
                </div>
            <div id='roulette-table-grid'>
                <div id='row-one'>
                    <div className='row-subdivision-one'>
                        {rowOneNumbers.map(number => <NumberBet onClick={() => placeBet(chipSelected, number)} className='numbers' number={number} key={number}/>)}
                        {intervalBetsRowOne.map(item => <IntervalBet onClick={() => placeBet(chipSelected, item.interval[0])} className='two-to-one' twoToOne={item.twoToOne} interval={item.interval} key={item.key} /> )}
                    </div>
                        <div className='double-one'>{doubleBetRowOne.map(numbers => <DoubleBet onClick={() => placeBet(chipSelected, numbers)} numbers={numbers} key={numbers}/>)}</div>
                    <div className='row-subdivision-two'>
                        <div className='double-two'>{doubleBetRowOnev2.map(numbers => <DoubleBet onClick={() => placeBet(chipSelected, numbers)} numbers={numbers} key={numbers}/>)}</div>
                        <div className='quad'>{quadBetsRowOne.map(numbers => <QuadBet onClick={() => placeBet(chipSelected, numbers)} numbers={numbers} key={numbers}/>)}</div>
                    </div>
                </div>
                <div id='row-two'>
                    <div className='row-subdivision-one'>
                        {rowTwoNumbers.map(number => <NumberBet onClick={() => placeBet(chipSelected, number)} number={number} key={number}/>)}    
                        {intervalBetsRowTwo.map(item => <IntervalBet onClick={() => placeBet(chipSelected, item.interval[0])} twoToOne={item.twoToOne} interval={item.interval} key={item.key} /> )}
                    </div>
                        <div className='double-one'>{doubleBetRowTwo.map(numbers => <DoubleBet onClick={() => placeBet(chipSelected, numbers)} numbers={numbers} key={numbers}/>)}</div>
                    <div className='row-subdivision-two'>
                        <div className='double-two'>{doubleBetRowTwov2.map(numbers => <DoubleBet onClick={() => placeBet(chipSelected, numbers)} numbers={numbers} key={numbers}/>)}</div>
                        <div className='quad'>{quadBetsRowTwo.map(numbers => <QuadBet onClick={() => placeBet(chipSelected, numbers)} numbers={numbers} key={numbers}/>)}</div>
                    </div>
                </div>
                <div id='row-three'>
                    <div className='row-subdivision-one'>
                        {rowThreeNumbers.map(number => <NumberBet onClick={() => placeBet(chipSelected, number)} number={number} key={number}/>)}
                        {intervalBetsRowThree.map(item => <IntervalBet onClick={() => placeBet(chipSelected, item.interval[0])} twoToOne={item.twoToOne} interval={item.interval} key={item.key} /> )}
                    </div>
                        <div className='double-one'>{doubleBetRowThree.map(numbers => <DoubleBet onClick={() => placeBet(chipSelected, numbers)} numbers={numbers} key={numbers}/>)}</div>
                    <div className='row-subdivision-two'>  
                        <div className='columns-container'>{columnBets.map(numbers => <ColumnBet onClick={() => placeBet(chipSelected, numbers)} numbers={numbers} key={numbers}/> )}</div>
                    </div>
                </div>
                <div id='row-four'>
                    {intervalBetsRowFour.map(item => <IntervalBet onClick={() => placeBet(chipSelected, item.interval)} twoToOne={item.twoToOne} interval={item.interval} key={item.key}/>)}
                </div>
                <div id='row-five'>
                    {oddEven.map(item => <OddEvenBet onClick={() => placeBet(chipSelected, item.type)} type={item.type} key={item.type}/>)}
                    {colours.map(item => <ColourBet onClick={() => placeBet(chipSelected, item.colour)} colour={item.colour} key={item.colour}/>)}
                    {intervalBetsRowFive.map(item => <IntervalBet onClick={() => placeBet(chipSelected, item.interval)} twoTwoOne={item.twoToOne} interval={item.interval} key={item.key} /> )}
                </div>            
            </div>
            </div>

            <div id="bets-list" style={{ marginLeft: "20px" }}>
    <h3>Active Bets</h3>
    {betsPlaced.length > 0 ? (
        <ul>
            {betsPlaced.map((bet, index) => (
                <li key={index}>
                    Bet on: <strong>{Array.isArray(bet[0]) ? bet[0].join(", ") : bet[0]}</strong> 
                    | Amount: <strong>${bet[1]}</strong> 
                    | Potential Winnings: <strong>${bet[1] * bet[2]}</strong>
                </li>
            ))}
        </ul>
        ) : (
        <p>No bets placed</p>
    )}
    </div>

        </div>
        </Fragment>
    );
}

export default Roulette;
