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

    const [chipIndex, setChipIndex] = useState('')

    const [data, setData] = useState({
        Domino: undefined,
        DominoDirection: undefined,
    })

    let tempTableState = new Table(default_path)
    let initialPlayerChips = tempTableState.playerChips()

    const [tableData, setTableData] = useState({
        TableState: tempTableState,
        DrawMatrix: tempTableState.drawTable().split('\n'),
    })
    const [playerData, setPlayerData] = useState({
        PlayerChips: initialPlayerChips,
        DrawChips: drawChips(initialPlayerChips),
        PlayerInput: false,
    })

    useEffect(() => {
        if(data.Domino && data.Domino.length === 2){
            let tempTableState = tableData.TableState
            // 
            if(chipIndex >= 0 &&  chipIndex< playerData.PlayerChips.length && tempTableState.placeDomino(data.Domino,data.DominoDirection)){
                setData({
                    Domino : undefined,
                    DominoDirection: undefined,
                    })

                setTableData({
                    TableState: tempTableState,
                    DrawMatrix: tempTableState.drawTable().split('\n')
                })
                
                let temp_player = Object.assign({},playerData)
                temp_player.PlayerChips.splice(chipIndex,1)

                setPlayerData({
                    PlayerChips: temp_player.PlayerChips,
                    DrawChips: drawChips(temp_player.PlayerChips),
                    PlayerInput: false,
                })

                setChipIndex('')
            }
        }
        if(playerData.PlayerInput){
    
            let temp_player = Object.assign({},playerData)
            temp_player.PlayerChips.push(tableData.TableState.grabRandomChip())

            setPlayerData({
                PlayerChips: temp_player.PlayerChips,
                DrawChips: drawChips(temp_player.PlayerChips),
                PlayerInput: false,
            })

            setTableData({
                TableState: tableData.TableState,
                DrawMatrix: tableData.TableState.drawTable().split('\n')
            })
        }
    }, [data, playerData])


    function drawChips(chips){
        let str = ""
        for(let i = 0; i < chips.length; i++){
            if(chips[i]) str += i.toString() + ( "=|" + chips[i][0].toString()) + "|" 
                                + (chips[i][1].toString() + "| ")
        }
        return str
    }
    

    
    return(
    <div className='table_game'>
        <div className='table'>
            {tableData.DrawMatrix.map(e => <p>{e}</p>)}
        </div>
        <div className='input_chips'>
            <div className='Player1'>
                <p>{playerData.DrawChips}</p>
            
                <input type='number' 
                value={chipIndex} 
                onChange={(e)=> setChipIndex(e.target.value)} 
                placeholder='Enter the position of a domino'/>

                <button onClick={()=>{
                    if(chipIndex){
                        setData({
                            Domino: playerData.PlayerChips[chipIndex],
                            DominoDirection: Corner.LEFT
                        });
                    }
                }}>Left Tail</button>
                <button onClick={()=>{
                    if(chipIndex){
                        setData({
                            Domino: playerData.PlayerChips[chipIndex],
                            DominoDirection: Corner.RIGHT
                        });
                    }
                }}>Right Tail</button>
                <button onClick={()=>{
                        setPlayerData({...playerData, ['PlayerInput']: true})
                    }}>Grab a Random Chip</button>
            </div>
        </div>
    </div>
    );
}




export default MainGame
