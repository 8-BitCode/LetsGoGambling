import React from 'react'

function BetListItem({bet}) {
    if (Array.isArray(bet[0])) {
        
        let output = '';

        console.log(bet[0], bet[0].length)

        switch (bet[0].length) {
            case 2:
                output = `Split - ${bet[0][0]}: ${bet[0][1]}`;
                break;
            case 3:
                output = `Street = ${bet[0][0]}: ${bet[0][1]}: ${bet[0][2]}`
                break;
            case 4: 
                output = `Corner - ${bet[0][0]}: ${bet[0][1]}: ${bet[0][2]}: ${bet[0][3]}`;
                break; 
            case 5: 
                output = `Basket - ${bet[0][0]}: ${bet[0][1]}: ${bet[0][2]}: ${bet[0][3]}: ${bet[0][4]}`;
                break;
            case 6: 
                output = `Six line - ${bet[0][0]} to ${bet[0][5]}`;
                break;
            case 12:
                // column bet and dozens
                switch (bet[0][1]) {
                    // column bets
                    // using the second item in the array to differentiate between dozen bets easier
                    case 4:
                        output = `First Column`;
                        break;
                    case 5:
                        output = `Second Column`;
                        break;
                    case 6:
                        output = `Third Column`;
                        break;

                    // dozen bets
                    case 2:
                        output = `First Dozen`;
                        break;
                    case 14:
                        output = `Second Dozen`;
                        break;                     
                    case 26:
                        output = `Third Dozen`;
                        break;
                    }
                break;
                
            case 18:

                if (bet[0][0] == 1) {
                    output = `Low - ${bet[0][0]} to ${bet[0][17]}`
                }
                else {
                    output = `High - ${bet[0][0]} to ${bet[0][17]}`
                }
                break;
            }            
            return <div>{`${output} | Stake ${bet[1]} | Payout ${bet[1] * bet[2]} `}</div>

            }
    else {
        
        let output = ''

        if (Number.isInteger(bet[0])) {
            output = `Single - ${bet[0]}`
        }
        else if (bet[0] == 'single') {
            output = `Single - 0`
        }
        else if (bet[0] == 'double') {
            output = `Single - 00`
        }
        else {
            output = `${bet[0]}`
        }

        return <div>{`${output} | Stake: ${bet[1]} | Payout: ${bet[1] * bet[2]} `}</div>
    }
};

export default BetListItem