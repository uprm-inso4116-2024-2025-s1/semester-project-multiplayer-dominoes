import {Table,Corner} from './table.js';
import React, { useState, useEffect } from 'react';

function MainGame(){
    let default_path = [
        [1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0],
        [1,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1],
    ]
    const [Domino, setDomino] = useState([]);
    const [DominoDirection, setDominoDirection] = useState(Corner.RIGHT)

    const [TableState, setTableState] = useState(new Table(default_path))
    const [DrawMatrix, setDrawMatrix] = useState(TableState.drawTable());

    const [ChipIndex, setChipIndex] = useState(-1);
    const [Player, setPlayer] = useState(TableState.playerChips());
    const [DrawChip,setDrawChip] = useState(drawChips(Player));


    useEffect(() => {
    if(Domino && Domino.length === 2){
        if(ChipIndex >= 0 && ChipIndex < Player.length && TableState.placeDomino(Domino,DominoDirection)){
            Player.splice(ChipIndex,1)
        }
        setDomino(undefined)
        setDrawMatrix(TableState.drawTable())
    }
    if(Player){
        setDrawChip(drawChips(Player))
    }

    }, [Domino, DominoDirection, ChipIndex, Player, TableState, DrawMatrix, DrawChip])


    function drawChips(chips){
        let str = ""
        for(let i = 0; i < chips.length; i++){
            if(chips[i]) str += ( " |" + chips[i][0].toString()) + "|" 
                                + (chips[i][1].toString() + "| ")
        }
        return str
    }

    return(
    <div className='table_game'>
        <div className='table'>
            {DrawMatrix.split('\n').map(e => <p>{e}</p>)}
        </div>
        <div className='input_chips'>
            <div className='Player1'>
                <p>{DrawChip}</p>
                <button onClick={()=>{
                    Player.push(TableState.grabRandomChip())
                    setPlayer(Player)
                    setDrawChip(drawChips(Player))
                    setTableState(TableState)
                    }}>Grab a Random Chip</button>
            
                <input type='number' 
                value={ChipIndex} 
                onChange={(e)=> setChipIndex(e.target.value)} 
                placeholder='Enter the Index of the chip'/>

                <button onClick={()=>{
                    if(ChipIndex){
                        setDomino(Player[ChipIndex]);
                        setDominoDirection(Corner.LEFT);
                        setDrawChip(drawChips(Player))
                        setDrawMatrix(TableState.drawTable())
                    }
                }}>Left Place Chip</button>

                <button onClick={()=>{
                    if(ChipIndex){
                        setDomino(Player[ChipIndex]);
                        setDominoDirection(Corner.RIGHT);
                        setDrawMatrix(TableState.drawTable())
                        setDrawChip(drawChips(Player))
                    }
                }}>Right Place Chip</button>
            </div>
        </div>
    </div>
    );
}




export default MainGame
