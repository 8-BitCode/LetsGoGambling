import React from 'react'
import Draggable from 'react-draggable';

function Chip({value}) {
    
    let startingPositions = {
        '0.5': {'x': 20, 'y': 200},
        '1': {'x': 120, 'y': 200},
        '2': {'x': 220, 'y': 200},
        '5': {'x': 320, 'y': 200},
        '10': {'x': 420, 'y': 200},
        '20': {'x': 520, 'y': 200},
        '50': {'x': 620, 'y': 200},
        '100': {'x': 720, 'y': 200},
    }

    const startingX = startingPositions[value]['x']
    const startingY = startingPositions[value]['y']

    return (
    <Draggable onMouseDown={returnPosition()} position = {{x: startingX, y: startingY}}>    
        <div className='Chip'>{value}</div>
    </Draggable>);
}

const returnPosition = () => {

}

export default Chip;