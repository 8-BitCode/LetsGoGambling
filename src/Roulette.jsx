import React, { useState, Fragment, useEffect } from 'react';
import IntervalBet from './RouletteComponents/IntervalBet';
import ZeroBet from './RouletteComponents/ZeroBet';
import BetListItem from './RouletteComponents/BetListItem'
import Draggable from "react-draggable";
//Helmet is used to give each sub page a title dynamically (just a little akram detail)
import { Helmet } from 'react-helmet';
import './CssFiles/Roulette.css'
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Table from'./Assets/roulettetable.png';
import {
    auth,
    db,
    collection,
    query,
    where,
    onSnapshot,
    updateDoc,
    doc,
} from "./firebase"; 

const randomX = Math.floor(Math.random() * (window.innerWidth - 1208));
const randomY = Math.floor(Math.random() * (window.innerHeight - 698 - 40));


const Roulette = ({ closeGame }) => {
    const [balance, setBalance] = useState(0);
    const [userDocId, setUserDocId] = useState(null);
    const [winningNumber, setWin] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const navigate = useNavigate();
    // main functions within the game
    const spinWheel = () => {
        if (isSpinning) return; // Prevent multiple spins at once
        setIsSpinning(true); // Start spinning
    
        // Generate a random final result
        const finalResult = Math.floor(Math.random() * 38) - 1;
    
        // Rapidly change the displayed number
        const spinInterval = setInterval(() => {
            setDisplay(Math.floor(Math.random() * 36)); // Random number between 0 and 36
        }, 50); // Update every 100ms
    
        // Stop spinning after 3 seconds and set the final result
        setTimeout(() => {
            clearInterval(spinInterval); // Stop the spinning effect
            setDisplay(finalResult); // Set the final result
            setWin(finalResult); // Update the winning number
            setIsSpinning(false); // Stop spinning
        }, 1000); // Spin for 3 seconds
    };
      // Fetch user money when authenticated using onSnapshot for real-time data
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            fetchMoney(user.uid);
          } else {
            alert("User not authenticated");
            navigate("/GameSelection");
          }
        });
        return () => unsubscribe();
      }, [navigate]);

      const fetchMoney = (uid) => {
        const playersRef = collection(db, "Players");
        const q = query(playersRef, where("uid", "==", uid));
    
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setBalance(userDoc.data().money);
            setUserDocId(userDoc.id);
          } else {
            alert("User data not found.");
          }
        });
    
        return () => unsubscribe();
      };
      const updateMoney = async (newMoney) => {
        try {
            if (userDocId) {
                const userDocRef = doc(db, "Players", userDocId);
                await updateDoc(userDocRef, { money: newMoney });
                setBalance(newMoney); // Update local state
            }
        } catch (err) {
            alert("Failed to update money: " + err.message);
        }
    };
    // check each bet for a win
    // each bet is checked for colour, even/ odd first 
    // then if it is a single 
    // this leaves the bet ids that are arrays left allowing to check if the winning bet is in th array

    useEffect(() => {
        if (winningNumber !== null) {
            setDisplay(winningNumber);
    
            let anyWin = false;
            betsPlaced.forEach(element => {
                let id = element[0];
                if (id == 'red' || id == 'black') {
                    if (redNumbers.includes(winningNumber)) {
                        winningColour = 'red';
                    } else {
                        winningColour = 'black';
                    }
                    if (winningColour == id) {
                        handleWin(element);
                        anyWin = true;
                    }
                } else if (id == 'even' || id == 'odd') {
                    if (evenNumbers.includes(winningNumber)) {
                        winningEvenOdd = 'even';
                    } else {
                        winningEvenOdd = 'odd';
                    }
                    if (winningEvenOdd == id) {
                        handleWin(element);
                        anyWin = true;
                    }
                } else if (Number.isInteger(id)) {
                    if (id == winningNumber) {
                        handleWin(element);
                        anyWin = true;
                    }
                } else if (id.includes(winningNumber)) {
                    handleWin(element);
                    anyWin = true;
                }
            });
    
            // If no bets won, update the database with the current balance
            if (!anyWin) {
                updateMoney(balance);
            }
    
            // Clear bets and reset stake
            if (betsPlaced.length > 0) {
                setPlaced([]);
                setStake(0);
            }
            setWin(null);
        }
    }, [winningNumber]);


    
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

        if (betsPlaced.includes(previousBets) || betsPlaced == previousBets || previousBets.length == 0) {
            return
        }
        // if bets are already placed, this will remove the bet amount of those bets from the stake
        let addAmount = 0
        if (betsPlaced.length > 0) {
            betsPlaced.forEach(element => {
                addAmount += element[1]
            })
        }
        setPlaced(previousBets)

        let sum = 0
        previousBets.forEach(element => {
            sum += element[1]
        })
        if (sum > balance) {
            alert('not enough money in balance')
            return
        }
        setBalance(balance - sum + addAmount);
        if (betsPlaced == undefined) {
            setStake(sum)
            return
        }
        setStake(stakePlaced + sum - addAmount);
    }

    const handleWin = (element) => {
        setBalance(balance + (element[1] * element[2]))
        updateMoney(balance + (element[1] * element[2]))
    }

    // defining variables that get updated 
    const [chipSelected, setChip] = useState(0);
    const [stakePlaced, setStake] = useState(0);
    const [betsPlaced, setPlaced] = useState([]);
    const [previousBets, setPrevious] = useState([])
    const [displayWin, setDisplay] = useState(Math.floor(Math.random() * 36));

    let multiplier = 0
    let winningColour = 0
    let winningEvenOdd = 0

    const placeBet = (betAmount, id) => {
        
        if (betAmount === undefined || betAmount == 0) {
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
    

    // all potention outcomes from wheel spin 
    const possibleOutcomes = ['single', 'double', 1, 2, 3, 4, 5, 6, 7, 
                              8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 
                              19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
                              30, 31, 32, 33, 34, 35, 36];

    return(
        <Fragment>
        <div className='Roulette-Container'>
            <Helmet>
                <title>ROULETTE!!!!!</title>
            </Helmet>

            <Draggable defaultPosition={{ x:15, y: 15 }}>
                    <div className="AB-container">
                        <div className="AB-window">
                            <div className="AB-top-bar">
                                <span className="AB-top-bar-title">C:\LGG\ActiveBets.txt</span>
                                <div className="AB-top-bar-buttons">
                                    <button className="AB-close-button" onClick={closeGame}>
                                        X
                                    </button>
                                </div>
                            </div>
    
                            <div className="AB-Bet">
                            <div id="bets-list">
    <h3>Active Bets</h3>
    {betsPlaced.length > 0 ? (
        <ul className='bets-list-items'>
            {betsPlaced.map((bet, index) => {
                // Calculate potential winnings for each bet
                const potentialWinnings = bet.betAmount * bet.multiplier;
                return (
                    <li key={index}>
                        <BetListItem bet={bet} potentialWinnings={potentialWinnings} />
                    </li>
                );
            })}
                <div className="total-earnings">
    </div>
        </ul>
        
    ) : (
        <p>No bets placed</p>
    )}
</div>

                            </div>
                    </div>
                    </div>
                </Draggable>
                <Draggable defaultPosition={{ x: randomX, y: randomY }}>
                    <div className="Rou-container">
                        <div className="Rou-window">
                            <div className="Rou-top-bar">
                                <span className="Rou-top-bar-title">Roulette.exe</span>
                                <div className="Rou-top-bar-buttons">
                                    <button className="Rou-close-button" onClick={closeGame}>
                                        X
                                    </button>
                                </div>
                            </div>
    
                            <div className="Rou-Bet">

<div id='wheel'>{displayWin}</div>
<img src={Table}></img>

<div id='roulette-table'>
    <div id='zero-column'>
        {zeroTypes.map(item => <ZeroBet onClick={() => placeBet(chipSelected, item.type)} className='zero' type={item.type} key={item.type}/>)}
    </div>

    <div id='roulette-table-grid'>
        <div id='row-one'>
            <div className='row-subdivision-one'>
                {rowOneNumbers.map(number => <button onClick={() => placeBet(chipSelected, number)} className='numbers'/>)}
                <div className='two-to-one'>{intervalBetsRowOne.map(item => <IntervalBet onClick={() => placeBet(chipSelected, item.interval[0])} twoToOne={item.twoToOne} interval={item.interval} key={item.key} /> )}</div>
            </div>
                <div className='double-one'>{doubleBetRowOne.map(numbers => <button onClick={() => placeBet(chipSelected, numbers)}/>)}</div>
            <div className='row-subdivision-two'>
                <div className='double-two'>{doubleBetRowOnev2.map(numbers => <button onClick={() => placeBet(chipSelected, numbers)}/>)}</div>
                <div className='quad'>{quadBetsRowOne.map(numbers => <button onClick={() => placeBet(chipSelected, numbers)}/>)}</div>
            </div>
        </div>
        
        <div id='row-two'>
            <div className='row-subdivision-one'>
                {rowTwoNumbers.map(number => <button onClick={() => placeBet(chipSelected, number)}/>)}    
                <div className='two-to-one'>{intervalBetsRowTwo.map(item => <IntervalBet onClick={() => placeBet(chipSelected, item.interval[0])} twoToOne={item.twoToOne} interval={item.interval} key={item.key} /> )}</div>
            </div>
                <div className='double-one'>{doubleBetRowTwo.map(numbers => <button onClick={() => placeBet(chipSelected, numbers)}/>)}</div>
            <div className='row-subdivision-two'>
                <div className='double-two'>{doubleBetRowTwov2.map(numbers => <button onClick={() => placeBet(chipSelected, numbers)}/>)}</div>
                <div className='quad'>{quadBetsRowTwo.map(numbers => <button onClick={() => placeBet(chipSelected, numbers)}/>)}</div>
            </div>
        </div>
        <div id='row-three'>
            <div className='row-subdivision-one'>
                {rowThreeNumbers.map(number => <button onClick={() => placeBet(chipSelected, number)}/>)}
                <div className='two-to-one'>{intervalBetsRowThree.map(item => <IntervalBet onClick={() => placeBet(chipSelected, item.interval[0])} twoToOne={item.twoToOne} interval={item.interval} key={item.key} /> )}</div>
            </div>
                <div className='double-one'>{doubleBetRowThree.map(numbers => <button onClick={() => placeBet(chipSelected, numbers)}/>)}</div>
            <div className='row-subdivision-two'>  
                <div className='columns-container'>{columnBets.map(numbers => <button onClick={() => placeBet(chipSelected, numbers)}/> )}</div>
            </div>
        </div>
        <div id='row-four'>
            {intervalBetsRowFour.map(item => <IntervalBet onClick={() => placeBet(chipSelected, item.interval)} twoToOne={item.twoToOne} interval={item.interval} key={item.key}/>)}
        </div>
        <div id='row-five'>
            {oddEven.map(item => <button onClick={() => placeBet(chipSelected, item.type)}/>)}
            {colours.map(item => <button onClick={() => placeBet(chipSelected, item.colour)}/>)}
            {intervalBetsRowFive.map(item => <IntervalBet onClick={() => placeBet(chipSelected, item.interval)} twoTwoOne={item.twoToOne} interval={item.interval} key={item.key} /> )}
        </div> 

    </div>

</div>
<div id='information-container'>
  <div className="info-item">
    <div className="info-title">Selected Chip</div>
    <div>{chipSelected}</div>
  </div>
  <div className="info-item">
    <div className="info-title">Balance</div>
    <div>{balance}</div>
  </div>
  <div className="info-item">
    <div className="info-title">Total Bet Placed</div>
    <div>{stakePlaced}</div>
  </div>
</div>
<div id='Rou-buttons-container'>
    <button onClick={() => reBet()}>Re-Bet</button>
    <button onClick={() => clearBet()}>Clear Bet</button>
    <button onClick={() => undoBet()}>Undo Bet</button>
    <button onClick={() => spinWheel()} disabled={isSpinning}>Spin Wheel</button>
</div>



<div id='chip-container'>        
    {chipValues.map(value => <button onClick={() => updateSelected(value)} id={value} key={value} className='chip'>{value}</button>)}
</div>

                        </div>
                    </div>
                    </div>
                </Draggable>


        </div>
        </Fragment>
    );
}

export default Roulette;
