import {Table,Corner} from './table.js';
import React, { useState, useEffect } from 'react';
import DominoBot from './Bot.js';
import { useNavigate } from 'react-router-dom';

function MainGame(){

    /*Variable added to navigate between gamestate and lobby */
    const navigate = useNavigate();
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
    const [currentTurn, setCurrentTurn] =useState('Player');

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
        DbHand: drawBotChips(botHand),
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

    /** Uses the playturn function from the bot to see if the bot can make a move. If they can't, they will pickup 
     * dominoes until they can or until chips run out. Is recursive. 
     * 
     * @param {array} botData - The hand the bot currently has. 
     * @param {array} tableData - The current setup of the table.
     * @param {*} setbotData - Setter for the bot hand.
     * @param {*} setTableData - Setter for the table data.
     */
    function botPlayTurn(botData, tableData, setbotData, setTableData) {
        setTimeout(() => {
            let botMoved = botData.BotPlayer.playTurn();
            if (botMoved) {
                // Update bot data and table if a move was successfully made
                setbotData({
                    BotHand: botData.BotPlayer.hand,
                    DbHand : drawBotChips(botData.BotHand),
                    BotPlayer: botData.BotPlayer
                });
                setTableData({
                    TableState: tableData.TableState,
                    DrawMatrix: tableData.TableState.drawTable().split('\n')
                });
               
                if(botData.BotPlayer.hand.length === 0){
                    alert("Bot has won.");
                    return; 
                }
                setCurrentTurn('Player');
            } else if (tableData.TableState.availableDominos !== 0) {
                // If the bot cannot play, and there are still dominos available to draw
                botData.BotHand.push(tableData.TableState.grabRandomChip()); 
                
                // Update the bot's hand
                setbotData({
                    BotHand: botData.BotHand,
                    DbHand: drawBotChips(botData.BotHand),
                    BotPlayer: botData.BotPlayer
                });

                // Retry playing after grabbing a new domino
                botPlayTurn(botData, tableData, setbotData, setTableData);
            } else { //Bot cannot make a move and cannot draw more dominoes.
                setCurrentTurn('Player');
            }
        }, 3000); // Give a 3-second delay before the bot plays
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
                
                if(playerData.PlayerHand.length === 0 ){
                    alert("Player wins!");
                    return;
                }
                // Bot's turn to play
                setCurrentTurn('bot');
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
    
    // Convert a matrix into a string to visualize the bots hand. The numbers are not shown.
    function drawBotChips(chips){
        let str = "";
        for(let i = 0; i < chips.length; i++){
            if(chips[i]) str += "|::|::| ";
        }
        return str;
    }
    
    return(
    <div className='table_game'>
        {/*Button to switch between gamestate and lobby ui*/}
        <button
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '10px',
                    backgroundColor: '#1A3636',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
                onClick={() => navigate('/lobby')}
            >
                Lobby
            </button>

        {/*Displays who's turn it is.*/}
        <div className='turnInfo'>
                <p>{currentTurn === 'Player' ? "It's your turn!" : "Bot is thinking..."}</p>
        </div>

        {/*Shows the placeholder dominoes for the bot.*/}
        <div className='BotInfo'>
                <p>{botData.DbHand}</p>
        </div>

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
        </div>
    </div>
    );
}

export default MainGame
