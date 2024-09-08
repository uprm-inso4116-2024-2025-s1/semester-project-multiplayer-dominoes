import {Table,Corner} from './table.js';
import React, { useState, useEffect } from 'react';
import DominoBot from './Bot.js';

function MainGame(){
    let default_path = [
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,0,1],
        [0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0],
        [1,0,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1],
    ];

    const [playerDominoIndex, setPlayerDominoIndex] = useState('');

    const [data, setData] = useState({
        Domino: undefined,
        DominoDirection: undefined,
    });

    let tempTableState = new Table(default_path);
    let initialPlayerHand = tempTableState.playerChips();
    let botHand = tempTableState.playerChips();
    let bot = new DominoBot(tempTableState, botHand);
    
    const [botData, setbotData] = useState({
        BotHand: botHand,
        BotPlayer: bot
    })

    const [tableData, setTableData] = useState({
        TableState: tempTableState,
        DrawMatrix: tempTableState.drawTable().split('\n'),
    });
    const [playerData, setPlayerData] = useState({
        PlayerHand: initialPlayerHand,
        DrawHand: drawChips(initialPlayerHand),
        PlayerInput: false,
    });

    function botPlayTurn(botData, tableData, setbotData, setTableData) {
    setTimeout(() => {
        let botMoved = botData.BotPlayer.playTurn();
        if (botMoved) {
            // Update bot data and table if a move was successfully made
            setbotData({
                BotHand: botData.BotPlayer.hand,
                BotPlayer: botData.BotPlayer
            });
            setTableData({
                TableState: tableData.TableState,
                DrawMatrix: tableData.TableState.drawTable().split('\n')
            });
        } else if (botData.BotPlayer.hand.length < tableData.TableState.availableDominos) {
            // If the bot cannot play, and there are still dominos available to draw
            botData.BotHand.push(tableData.TableState.grabRandomChip()); 
            
            // Update the bot's hand
            setbotData({
                BotHand: botData.BotHand,
                BotPlayer: botData.BotPlayer
            });

            // Retry playing after grabbing a new domino
            botPlayTurn(botData, tableData, setbotData, setTableData);
        } else {
            console.log("Bot cannot make a move and no dominos left to draw.");
        }
    }, 2000); // Give a 2-second delay before the bot plays
    }

    useEffect(() => {
        // This runs when the player places a domino on the table.
        if(data.Domino && data.Domino.length === 2){
            let tempTableState = tableData.TableState;
            if(playerDominoIndex >= 0 &&  playerDominoIndex< playerData.PlayerHand.length && tempTableState.placeDomino(data.Domino,data.DominoDirection)){
                setData({
                    Domino : undefined,
                    DominoDirection: undefined,
                    });

                setTableData({
                    TableState: tempTableState,
                    DrawMatrix: tempTableState.drawTable().split('\n')
                });
                
                playerData.PlayerHand.splice(playerDominoIndex,1);

                setPlayerData({
                    PlayerHand: playerData.PlayerHand,
                    DrawHand: drawChips(playerData.PlayerHand),
                    PlayerInput: false,
                });

                setPlayerDominoIndex('');
                // Bot's turn to play
                botPlayTurn(botData, tableData, setbotData, setTableData);
            }
        }

        // This runs when the player grabs a domino from the dominoes pool.
        if(playerData.PlayerInput){
    
            playerData.PlayerHand.push(tableData.TableState.grabRandomChip());

            setPlayerData({
                PlayerHand: playerData.PlayerHand,
                DrawHand: drawChips(playerData.PlayerHand),
                PlayerInput: false,
            });

            setTableData({
                TableState: tableData.TableState,
                DrawMatrix: tableData.TableState.drawTable().split('\n')
            });
        }
    }, [data, playerData]);

    // Convert a matrix into a string to visualize the player's hand.
    function drawChips(chips){
        let str = "";
        for(let i = 0; i < chips.length; i++){
            if(chips[i]) str += i.toString() + ( "=|" + chips[i][0].toString()) + "|" 
                                + (chips[i][1].toString() + "| ");
        }
        return str;
    }
    

    
    return(
    <div className='table_game'>
        <div className='table'>
            {tableData.DrawMatrix.map(e => <p>{e}</p>)}
        </div>
        <div className='input_chips'>
            <div className='Player1'>
                <p>{playerData.DrawHand}</p>
            
                <input type='number' 
                value={playerDominoIndex} 
                onChange={(e)=> setPlayerDominoIndex(e.target.value)} 
                placeholder='Enter the position of a domino'/>

                <button onClick={()=>{
                    if(playerDominoIndex){
                        setData({
                            Domino: playerData.PlayerHand[playerDominoIndex],
                            DominoDirection: Corner.LEFT
                        });
                    }
                }}>Left Tail</button>
                <button onClick={()=>{
                    if(playerDominoIndex){
                        setData({
                            Domino: playerData.PlayerHand[playerDominoIndex],
                            DominoDirection: Corner.RIGHT
                        });
                    }
                }}>Right Tail</button>
                <button onClick={()=>{
                        setPlayerData({
                            PlayerHand: playerData.PlayerHand,
                            DrawHand: playerData.DrawHand,
                            PlayerInput: true,
                        })
                    }}>Grab a Random Chip</button>
            </div>
            {/* Display bot's domino count */}
            <div className='BotInfo'>
                <p>Bot has {botData.BotHand.length} dominos</p>
            </div>
        </div>
    </div>
    );
}

export default MainGame
