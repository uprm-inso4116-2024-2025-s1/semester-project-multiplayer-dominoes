import { Table, Corner } from './table.js';
import React, { useState, useEffect } from 'react';
import DominoBot from './Bot.js';
import RuleEngine from './RuleEngine.js';
import { useNavigate, useLocation } from 'react-router-dom';
import PauseScreen from './Pause.js';
import AchievementManager from './AchievementManager.js';
import { ToastContainer } from 'react-toastify';  // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';   // Import Toastify CSS
import IntermediateBot from './intermediateBot.js';

const tileWidth = 3840 / 28; // Width of each tile (~137.14 pixels)
const tileHeight = 91; // Height of each tile (91 pixels)
const totalTiles = 28; // Total number of tiles (excluding the back tile)
const tileMap = new Map();

function MainGame() {
    const [tileMap, setTileMap] = useState(new Map());
    const [tilesInitialized, setTilesInitialized] = useState(false);

    const tileImage = new Image();
    tileImage.src = '/Dominos-28-Horrizontally.png'; // Adjust this path as needed
    function initTiles() {
        return new Promise((resolve) => {
            console.log("Starting to load image...");
            tileImage.onload = () => {
                console.log("Image loaded successfully");
                const newTileMap = new Map();
                const dominoes = [
                    "00", "01", "02", "03", "04", "05", "06",
                    "11", "12", "13", "14", "15", "16", "22",
                    "23", "24", "25", "26", "33", "34", "35",
                    "36", "44", "45", "46", "55", "56", "66"
                ];
    
                for (let i = 0; i < totalTiles; i++) {
                    newTileMap.set(dominoes[i], {
                        image: tileImage,
                        sx: i * tileWidth,
                        sy: 0,
                        width: tileWidth,
                        height: tileHeight,
                    });
                }
                console.log("TileMap created with size:", newTileMap.size);
                resolve(newTileMap);
            };
            tileImage.onerror = () => {
                console.error("Failed to load image");
                resolve(new Map());
            };
        });
    }
    useEffect(() => {
        console.log("Starting initTiles...");
        initTiles().then((newTileMap) => {
            console.log("Tiles initialized, updating state");
            setTileMap(newTileMap);
            setTilesInitialized(true);
        });
    }, []);

    useEffect(() => {
        if (tilesInitialized) {
            console.log("Tiles initialized, updating player data");
            setPlayerData(prevData => ({
                ...prevData,
                DrawHand: drawChips(prevData.PlayerHand)
            }));
        }
    }, [tilesInitialized, tileMap]);

    /*Variable added to navigate between gamestate and lobby */
    const navigate = useNavigate();
    let default_path = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];


    const [playerDominoIndex, setPlayerDominoIndex] = useState('');
    const [currentTurn, setCurrentTurn] = useState('Player');

    const [data, setData] = useState({
        Domino: undefined,
        DominoDirection: undefined,
    });

    const gameMode = useLocation().state.gameMode;

    const ruleEngine = new RuleEngine(gameMode);
    let tempTableState = new Table(default_path);
    let initialPlayerHand = tempTableState.playerChips();
    let botHand = tempTableState.playerChips();
    let bot = new IntermediateBot(tempTableState, botHand);

    const achievementManager = new AchievementManager();

    useEffect(() => {
        achievementManager.checkStartWithDoubleSix(initialPlayerHand);
        achievementManager.checkAllDoublesHand(initialPlayerHand);
    }, []);


    const [botData, setbotData] = useState({
        BotHand: botHand,
        DbHand: drawBotChips(botHand.length),
        BotPlayer: bot,
        TileCount: botHand.length
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

    const [isPaused, setPaused] = useState(false);

    const pauseGame = () => {
        setPaused(true);
    }

    const resumeGame = () => {
        setPaused(false);
    }

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
                setbotData(prevBotData => ({
                    ...prevBotData,
                    BotHand: botData.BotPlayer.hand,
                    TileCount: botData.BotPlayer.hand.length,
                    DbHand: drawBotChips(botData.BotPlayer.hand.length)
                }));
                setTableData({
                    TableState: tableData.TableState,
                    DrawMatrix: tableData.TableState.drawTable().split('\n')
                });
    
                if (botData.BotPlayer.hand.length === 0) {
                    alert("Bot has won.");
                    return;
                }
                setCurrentTurn('Player');
            } else if (tableData.TableState.availableDominos !== 0) {
                // If the bot cannot play, and there are still dominos available to draw
                botData.BotHand.push(tableData.TableState.grabRandomChip());
    
                // Update the bot's hand
                setbotData(prevBotData => ({
                    ...prevBotData,
                    BotHand: botData.BotHand,
                    TileCount: botData.BotHand.length,
                    DbHand: drawBotChips(botData.BotHand.length)
                }));
    
                // Retry playing after grabbing a new domino
                botPlayTurn(botData, tableData, setbotData, setTableData);
            } else { //Bot cannot make a move and cannot draw more dominoes.
                setCurrentTurn('Player');
            }
        }, 3000); // Give a 3-second delay before the bot plays
    }

    useEffect(() => {
        // This runs when the player places a domino on the table.
        if (data.Domino && data.Domino.length === 2) {
            let tempTableState = tableData.TableState;
            if (playerDominoIndex >= 0 && playerDominoIndex < playerData.PlayerHand.length && ruleEngine.validateMove(data.Domino, tempTableState)) {
                tempTableState.placeDomino(data.Domino, data.DominoDirection);

                setData({
                    Domino: undefined,
                    DominoDirection: undefined,
                });

                setTableData({
                    TableState: tempTableState,
                    DrawMatrix: tempTableState.drawTable().split('\n'),
                });

                playerData.PlayerHand.splice(playerDominoIndex, 1);

                setPlayerData({
                    PlayerHand: playerData.PlayerHand,
                    DrawHand: drawChips(playerData.PlayerHand),
                    PlayerInput: false,
                });

                setPlayerDominoIndex('');

                // Check win condition for player
                achievementManager.checkWin(playerData.PlayerHand);

                if (playerData.PlayerHand.length === 0) {
                    alert("Player wins!");
                    return;
                }
                // Bot's turn to play
                setCurrentTurn('bot');
                botPlayTurn(botData, tableData, setbotData, setTableData);
            }
        }

        // This runs when the player grabs a domino from the dominoes pool.
        if (playerData.PlayerInput) {

            playerData.PlayerHand.push(tableData.TableState.grabRandomChip());
            achievementManager.trackDrawing();  // Track if the player draws a domino

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
    function drawChips(chips) {
        console.log("drawChips called, tilesInitialized:", tilesInitialized, "tileMap size:", tileMap.size);
        if (!tilesInitialized || tileMap.size === 0) {
            console.log("Tiles not initialized or empty tileMap");
            return <div>Loading...</div>;
        }
        return (
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                {chips.map((chip, index) => {
                    const tileKey = chip[0].toString() + chip[1].toString();
                    const tile = tileMap.get(tileKey);
                    console.log(`Chip ${index}:`, tileKey, "Tile:", tile);
                    if (tile && tile.image) {
                        return (
                            <div key={index} style={{ display: 'inline-block', textAlign: 'center', margin: '0 5px' }}>
                                <img
                                    src={tile.image.src}
                                    style={{
                                        width: `${tile.width}px`,
                                        height: `${tile.height}px`,
                                        display: 'block',
                                        objectFit: 'none',
                                        objectPosition: `-${tile.sx}px 0px`,
                                    }}
                                    alt={`Domino ${chip[0]}-${chip[1]}`}
                                />
                                <div style={{ marginTop: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                                    {index % 7}
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    }
    

    // Convert a matrix into a string to visualize the bots hand. The numbers are not shown.
    function drawBotChips(tileCount) {
        const backtileImage = '/backtile.png'; // Adjust this path as needed
         // Use the same scale as in renderDominoImage
        const displayWidth = tileWidth
        const displayHeight = tileHeight

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {[...Array(tileCount)].map((_, index) => (
                    <div key={index} style={{ margin: '0 2px' }}>
                        <img
                            src={backtileImage}
                            style={{
                                width: `${displayWidth}px`,
                                height: `${displayHeight}px`,
                                objectFit: 'cover'
                            }}
                            alt={`Bot's domino ${index + 1}`}
                        />
                    </div>
                ))}
            </div>
        );
    }

    function renderDominoImage(domino) {
        if (!domino || domino.length !== 2) return null;
        const tileKey = domino[0].toString() + domino[1].toString();
        const tile = tileMap.get(tileKey);
        if (tile && tile.image) {
            const scale = 0.3; // Adjust this value to change the size of the domino
            return (
                <img
                    src={tile.image.src}
                    style={{
                        width: `${tile.width }px`,
                        height: `${tile.height }px`,
                        objectFit: 'none',
                        objectPosition: `-${tile.sx }px 0px`,
                        display: 'inline-block',
                        verticalAlign: 'middle',
                    }}
                    alt={`Domino ${domino[0]}-${domino[1]}`}
                />
            );
        }
        return `[${domino[0]},${domino[1]}]`; // Fallback to text if image not found
    }

    function renderGameBoard() {
        return tableData.DrawMatrix.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px' }}>
                {row.split(' ').map((cell, cellIndex) => {
                    if (cell === '===') {
                        return <span key={cellIndex} style={{ width: '40px', display: 'inline-block' }}></span>;
                    } else if (cell.startsWith('|')) {
                        const [val1, val2] = cell.slice(1, -1).split('|').map(Number);
                        return <span key={cellIndex}>{renderDominoImage([val1, val2])}</span>;
                    }
                    return null;
                })}
            </div>
        ));
    }

    return (
        <div>
            {!isPaused ? (
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
                        {renderGameBoard()}
                    </div>
                    <div className='input_chips'>
                        <div className='Player1'>
                            <p>{playerData.DrawHand}</p>

                            <input type='number'
                                value={playerDominoIndex}
                                onChange={(e) => setPlayerDominoIndex(e.target.value)}
                                placeholder='Enter the position of a domino' />

                            <button onClick={() => {
                                if (playerDominoIndex) {
                                    setData({
                                        Domino: playerData.PlayerHand[playerDominoIndex],
                                        DominoDirection: Corner.LEFT
                                    });
                                }
                            }}>Left Tail</button>
                            <button onClick={() => {
                                if (playerDominoIndex) {
                                    setData({
                                        Domino: playerData.PlayerHand[playerDominoIndex],
                                        DominoDirection: Corner.RIGHT
                                    });
                                }
                            }}>Right Tail</button>
                            <button onClick={() => {
                                setPlayerData({
                                    PlayerHand: playerData.PlayerHand,
                                    DrawHand: playerData.DrawHand,
                                    PlayerInput: true,
                                })
                            }}>Grab a Random Chip</button>
                            <button onClick={pauseGame}>Pause Game</button>
                        </div>
                    </div>
                    {/* Add ToastContainer to display toast notifications */}
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"  // Add theme for better visual presentation
                    />

                    {/* Button and UI for navigating and game controls */}
                </div>
            ) : (<PauseScreen onResume={resumeGame} />)}</div>
    );

}

export default MainGame