import { Table, Corner } from './table.js';
import React, { useState, useEffect, useRef } from 'react';
import DominoBot from './Bot.js';
import IntermediateBot from './intermediateBot.js';
import AdvancedBot from './AdvancedBot.js';
import RuleEngine from './RuleEngine.js';
import { useNavigate, useLocation } from 'react-router-dom';
import PauseScreen from './Pause.js';
import AchievementManager from './AchievementManager.js';
import { ToastContainer, toast } from 'react-toastify';  // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';   // Import Toastify CSS

const tileWidth = 3584 / 28; // Width of each tile (~137.14 pixels)
const tileHeight = 64; // Height of each tile (91 pixels)
const totalTiles = 28; // Total number of tiles (excluding the back tile)
const tileMap = new Map();

const avatarImage = new Image();
avatarImage.src = '/Red-Avatar.png';  // Assuming this is the player's avatar
const blueAvatarImage = new Image();
blueAvatarImage.src = '/Blue-Avatar.png';
const yellowAvatarImage = new Image();
yellowAvatarImage.src = '/Yellow-Avatar.png';
const greenAvatarImage = new Image();
greenAvatarImage.src = '/Green-Avatar.png';

function MainGame() {
    const [tileMap, setTileMap] = useState(new Map());
    const [tilesInitialized, setTilesInitialized] = useState(false);
    const [playerScore, setPlayerScore] = useState(0);
    const [botScore, setBotScore] = useState(0);
    const [stalemate, setStalemate] = useState(false);
    const [botWon, setBotWon] = useState(false);
    const [playerWon, setPlayerWon] = useState(false);

    const BackgroundMusic = ({ src }) => {
        const audioRef = useRef(new Audio(src));
        const [isPlaying, setIsPlaying] = useState(false);
        const [volume, setVolume] = useState(0.5);

        const togglePlay = () => {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(prevIsPlaying => !isPlaying);
        };

        const handleVolumeChange = (event) => {
            const newVolume = event.target.value;
            setVolume(newVolume);
            audioRef.current.volume = newVolume;
        };

        return (
            <div>
                <button className='game-button' onClick={togglePlay}>
                    {isPlaying ? 'Pause background music...' : 'Press for background music!'}
                </button>
                <div>
                    <label className='volume'>
                        Volume:
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                        />
                    </label>
                </div>
            </div>
        );
    };


    const tileImage = new Image();
    tileImage.src = '/New-Dominos-28-Horrizontally.png'; // Adjust this path as needed
    function initTiles() {
        return new Promise((resolve) => {
            tileImage.onload = () => {
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
                resolve(newTileMap);
            };
            tileImage.onerror = () => {
                resolve(new Map());
            };
        });
    }
    useEffect(() => {
        initTiles().then((newTileMap) => {
            setTileMap(newTileMap);
            setTilesInitialized(true);
        });
    }, []);

    useEffect(() => {
        if (tilesInitialized) {
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
    const botdifficulty = useLocation().state.bot;
    const botAmmount = useLocation().state.botNum;

    function createBot(itshand) {
        switch (botdifficulty) {
            case "basic":
                return new DominoBot(tempTableState, itshand);
            case "intermediate":
                return new IntermediateBot(tempTableState, itshand);
            case "advanced":
                return new AdvancedBot(tempTableState, itshand, tempTableState.playedDominoes);
            default:
                return new DominoBot(tempTableState, itshand);
        }
    }

    const ruleEngine = new RuleEngine(gameMode);
    let tempTableState = new Table(default_path);
    let initialPlayerHand = tempTableState.playerChips();
    let botHand = tempTableState.playerChips();
    let initialBotHand = botHand;
    let bot1 = createBot(initialBotHand);
    let botHand2 = null;
    let bot2 = null;
    let botHand3 = null;
    let bot3 = null;

    const achievementManager = new AchievementManager();

    useEffect(() => {
        achievementManager.checkStartWithDoubleSix(initialPlayerHand);
        achievementManager.checkAllDoublesHand(initialPlayerHand);
        achievementManager.checkHasAnyDoubles(initialPlayerHand);
    }, []);

    const [botData, setbotData] = useState({
        BotHand: botHand,
        DbHand: drawBotChips(botHand.length),
        BotPlayer: bot1,
        TileCount: botHand.length
    })

    const [botData2, setbotData2] = useState(null)
    const [botData3, setbotData3] = useState(null)

    if (botAmmount === 'twoBots' || botAmmount === 'threeBots') {
        botHand2 = tempTableState.playerChips();
        bot2 = createBot(botHand2);
    }
    if (botAmmount === 'threeBots') {
        botHand3 = tempTableState.playerChips();
        bot3 = createBot(botHand3);
    }
    useEffect(() => {
        if (botAmmount === 'twoBots' || botAmmount === 'threeBots') {
            setbotData2({
                BotHand: botHand2,
                DbHand: drawBotChips(botHand2.length),
                BotPlayer: bot2,
                TileCount: botHand2.length
            })
        }
        if (botAmmount === 'threeBots') {
            setbotData3({
                BotHand: botHand3,
                DbHand: drawBotChips(botHand3.length),
                BotPlayer: bot3,
                TileCount: botHand3.length
            })
        }
    }, [])


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

    const [playingDraw, setPlayingDraw] = useState(false);

    const pauseGame = () => {
        setPaused(true);
    }

    const resumeGame = () => {
        setPaused(false);
    }

    const ScoreTracker = ({ temp_score, message }) => {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h1 style={{ fontSize: '24px' }}>{message} {temp_score}</h1> {/* Adjust the size as needed */}
            </div>
        );
    };

    const [showWinnerOverlay, setShowWinnerOverlay] = useState(false);
    const [showLoserOverlay, setShowLoserOverlay] = useState(false);
    const [showTurnNotification, setShowTurnNotification] = useState(false);
    const [showLoseProgressIfLobby, setShowLoseProgressIfLobby] = useState(true);

    const [passButton, setPassButton] = useState(false);

    const playSound = () => {
        const audio = document.getElementById('dominoPlaceSound');
        if (audio) {
            audio.play();
        }
    };

    /** Uses the playturn function from the bot to see if the bot can make a move. If they can't, they will pickup 
     * dominoes until they can or until chips run out. Is recursive. 
     * 
     * @param {array} botData - The hand the bot currently has. 
     * @param {array} tableData - The current setup of the table.
     * @param {*} setbotData - Setter for the bot hand.
     * @param {*} setTableData - Setter for the table data.
     */
    function botPlayTurn(botData, tableData, setbotData, setTableData) {
        botData.BotPlayer.updateTable(tableData.TableState);
        let botMoved = botData.BotPlayer.playTurn();
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
        if (botMoved) {
            if (gameMode === 'allFives') {
                let openEndsSum = tableData.TableState.calculateOpenEnds();
                if (openEndsSum % 5 === 0) {
                    toast.success(`Bot scored ${openEndsSum} points!`);
                    setBotScore(prevScore => prevScore + openEndsSum);
                }
            }

            if (botData.BotPlayer.hand.length === 0 || (stalemate && botWon)) {
                setStalemate(false);
                setBotWon(false);
                if (gameMode === 'allFives') {
                    //add here bot vs player score comparison
                    if (playerScore > botScore) {
                        toast.success(`Final Score: ${playerScore} points!`);
                        setShowWinnerOverlay(true);
                        reloadWithDelay(() => setShowWinnerOverlay(false));
                        return;
                    }
                    else if (playerScore < botScore) {
                        toast.success(`Final Score: ${botScore} points!`);
                        setShowLoserOverlay(true);
                        reloadWithDelay(() => setShowWinnerOverlay(false));
                        return;
                    }
                    else {
                        toast.success(`Final Score: TIE`);
                        setShowWinnerOverlay(true);
                        reloadWithDelay(() => setShowWinnerOverlay(false));
                        return;
                    }
                } else {
                    setShowLoserOverlay(true);
                    reloadWithDelay(() => setShowWinnerOverlay(false));
                    return;
                }
            }
            playSound();
        } else if (tableData.TableState.availableDominos > 0) {
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
        }

    }

    function hasValidDomino(tableState, hand) {
        for (let i = 0; i < hand.length; i++) {
            if (ruleEngine.validateMove(hand[i], tableState) === true) {
                return true;
            }
        }
        return false;
    }

    function reloadWithDelay(hideOverlayCallback, delay = 3000) {
        setTimeout(() => {
            hideOverlayCallback();  // Call the function to hide the overlay
            window.location.reload(); // Reload the page after the delay
        }, delay);
    }

    useEffect(() => {
        if (playerData.PlayerHand.length > 0 && botData.BotHand.length > 0 && tableData.TableState.availableDominos === 0) {
            if (!hasValidDomino(tableData.TableState, playerData.PlayerHand) && !hasValidDomino(tableData.TableState, botData.BotHand)) {
                setStalemate(true);
                let playerScore = ruleEngine.domino_win_score(playerData.PlayerHand);
                let botScore = ruleEngine.domino_win_score(botHand);
                if (playerScore < botScore) {
                    //set player score
                    setPlayerScore(prevScore => prevScore + playerScore + botScore);
                    setPlayerWon(true);
                } else {
                    setBotScore(prevScore => prevScore + playerScore + botScore);
                    setBotWon(true);
                }
            }
        }

        // This runs when the player places a domino on the table.
        if (gameMode === "drawDominoes") {
            setPlayingDraw(true);
        }
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
                playSound();

                // Check win condition for player
                achievementManager.checkWin(playerData.PlayerHand);

                if (gameMode === 'allFives') {
                    let openEndsSum = tableData.TableState.calculateOpenEnds();
                    if (openEndsSum % 5 === 0) {
                        toast.success(`Scored ${openEndsSum} points!`);
                        setPlayerScore(prevScore => prevScore + openEndsSum);

                        // **Trigger achievement checks**
                        achievementManager.check15Points(playerScore);
                        achievementManager.check10Exact(openEndsSum);

                    }
                }


                if (playerData.PlayerHand.length === 0 || (stalemate && playerWon)) {
                    setStalemate(false);
                    setPlayerWon(false);
                    if (gameMode === 'allFives') {
                        if (playerScore > botScore) {
                            toast.success(`Final Score: ${playerScore} points!`);
                            achievementManager.checkWinWith5Points(playerScore);
                            setShowWinnerOverlay(true);
                            reloadWithDelay(() => setShowWinnerOverlay(false));
                            return;
                        }
                        else if (playerScore < botScore) {
                            toast.success(`Final Score: ${botScore} points!`);
                            setShowLoserOverlay(true);
                            reloadWithDelay(() => setShowLoserOverlay(false));
                            return;
                        }
                        else {
                            toast.success(`Final Score: TIE`);
                            setShowWinnerOverlay(true);
                            reloadWithDelay(() => setShowWinnerOverlay(false));
                            return;
                        }
                    } else if (gameMode === "drawDominoes") {
                        if (botHand.length <= 0 && playerData.PlayerHand.length > 0) {
                            setBotScore(prevScore => prevScore + ruleEngine.getDrawDominoesRules().domino_win_score(playerData.PlayerHand));
                            if (ruleEngine.getDrawDominoesRules().has_won_game_set(botScore)) {
                                // Player has won draw dominoes and game can end.
                                setShowLoserOverlay(true);
                                reloadWithDelay(() => setShowWinnerOverlay(false));
                            } else {
                                // Game repeats itself until player has won.
                                setbotData({
                                    BotHand: initialBotHand,
                                    DbHand: drawBotChips(initialBotHand.length),
                                    BotPlayer: bot1,
                                    TileCount: botHand.length
                                });
                                setTableData({
                                    TableState: tempTableState,
                                    DrawMatrix: tempTableState.drawTable().split('\n'),
                                });
                                setPlayerData({
                                    PlayerHand: initialPlayerHand,
                                    DrawHand: drawChips(initialPlayerHand),
                                    PlayerInput: false,
                                });
                                setCurrentTurn("Player");
                            }
                        } else if (playerData.PlayerHand.length <= 0) {
                            setPlayerScore(prevScore => prevScore + ruleEngine.getDrawDominoesRules().domino_win_score(botHand));
                            if (ruleEngine.getDrawDominoesRules().has_won_game_set(playerScore)) {
                                // Player has won draw dominoes and game can end.
                                setShowWinnerOverlay(true);
                                reloadWithDelay(() => setShowWinnerOverlay(false));
                            } else {
                                // Game repeats itself until player has won.
                                setbotData({
                                    BotHand: initialBotHand,
                                    DbHand: drawBotChips(initialBotHand.length),
                                    BotPlayer: bot1,
                                    TileCount: botHand.length
                                });
                                setTableData({
                                    TableState: tempTableState,
                                    DrawMatrix: tempTableState.drawTable().split('\n'),
                                });
                                setPlayerData({
                                    PlayerHand: initialPlayerHand,
                                    DrawHand: drawChips(initialPlayerHand),
                                    PlayerInput: false,
                                });
                                setCurrentTurn("Player");
                            }
                        }
                    } else {
                        setShowWinnerOverlay(true);
                        reloadWithDelay(() => setShowWinnerOverlay(false));
                        return;
                    }
                }
                // Bot's turn to play
                setCurrentTurn('bot');

                setTimeout(() => {
                    botPlayTurn(botData, tableData, setbotData, setTableData);
                }, 1000)
                if (botAmmount === 'twoBots' || botAmmount === 'threeBots') {
                    setTimeout(() => {
                    }, 2000)
                }
                if (botAmmount === 'threeBots') {
                    setTimeout(() => {
                        botPlayTurn(botData3, tableData, setbotData3, setTableData);
                    }, 3000)
                }

                setTimeout(() => {
                    setCurrentTurn('Player');
                }, 4000)
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

    // For displaying turn notification
    useEffect(() => {
        if (currentTurn === 'Player' && !showWinnerOverlay && !showLoserOverlay) {
            setShowTurnNotification(true);
            setTimeout(() => setShowTurnNotification(false), 2000); // Show "Your Turn" notification for 2 seconds
        }
    }, [currentTurn]);

    // For activating the bots when you pass your turn.
    useEffect(() => {
        if (passButton) {
            setCurrentTurn('bot');

            setTimeout(() => {
                botPlayTurn(botData, tableData, setbotData, setTableData);
            }, 1000)
            if (botAmmount === 'twoBots' || botAmmount === 'threeBots') {
                setTimeout(() => {
                    botPlayTurn(botData2, tableData, setbotData2, setTableData);
                }, 2000)
            }
            if (botAmmount === 'threeBots') {
                setTimeout(() => {
                    botPlayTurn(botData3, tableData, setbotData3, setTableData);
                }, 3000)
            }

            setTimeout(() => {
                setCurrentTurn('Player');
            }, 4000)
            setPassButton(false);
        }
    }, [passButton])

    // Convert a matrix into a string to visualize the player's hand.
    function drawChips(chips) {
        if (!tilesInitialized || tileMap.size === 0) {
            return <div>Loading...</div>;
        }

        const containerStyle = {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '10px',
            width: '100%',
            overflowX: 'auto'
        };

        const rowStyle = {
            display: 'flex',
            gap: '10px',
        };

        const itemStyle = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        };

        const numberStyle = {
            marginTop: '5px',
            fontWeight: 'bold',
            fontSize: '14px'
        };

        // Group dominoes into rows of 7
        const rows = [];
        for (let i = 0; i < chips.length; i += 7) {
            rows.push(chips.slice(i, i + 7));
        }


        return (
            <div style={containerStyle}>
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} style={rowStyle}>
                        {row.map((chip, index) => {
                            if (!chip) {
                                return null; // Just return null without setting the popup
                            }
                            const tileKey = chip[0].toString() + chip[1].toString();
                            const tile = tileMap.get(tileKey);
                            const globalIndex = rowIndex * 7 + index;
                            if (tile && tile.image) {
                                return (
                                    <div key={globalIndex} style={itemStyle}>
                                        <img
                                            src={tile.image.src}
                                            style={{
                                                width: `${tile.width}px`,
                                                height: `${tile.height}px`,
                                                objectFit: 'none',
                                                objectPosition: `-${tile.sx}px 0px`,
                                            }}
                                            alt={`Domino ${chip[0]}-${chip[1]}`}
                                        />
                                        <div style={numberStyle}>{globalIndex}</div>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                ))}
            </div>
        );
    }


    // Convert a matrix into a string to visualize the bots hand. The numbers are not shown.
    function drawBotChips(tileCount) {
        const backtileImage = '/new-backtile.png'; // Adjust this path as needed
        // Use the same scale as in renderDominoImage
        const displayWidth = tileWidth
        const displayHeight = tileHeight

        return (
            [...Array(tileCount)].map((_, index) => (
                <div key={index}>
                    <img
                        src={backtileImage}
                        style={{
                            width: `${displayWidth}px`,
                            height: `${displayHeight}px`,
                            transform: 'scale(.8)',

                        }}
                        alt={`Bot's domino ${index + 1}`}
                    />
                </div>
            ))
        );
    }

    function renderDominoImage(domino) {
        if (!domino || domino.length !== 2) return null;
        const tileKey = domino[0].toString() + domino[1].toString();
        const tile = tileMap.get(tileKey);
        if (tile && tile.image) {
            return (
                <div style={{
                    width: `${tile.width}px`,
                    height: `${tile.height}px`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <img
                        src={tile.image.src}
                        style={{
                            width: `${tile.width}px`,
                            height: `${tile.height}px`,
                            objectFit: 'none',
                            objectPosition: `-${tile.sx}px 0px`,
                            transform: 'scale(0.6)',  // Increased from 0.5
                            transformOrigin: 'center center',
                        }}
                        alt={`Domino ${domino[0]}-${domino[1]}`}
                    />
                </div>
            );
        }
        return `[${domino[0]},${domino[1]}]`;
    }

    const handleLobbyButton = () => {
        if (showLoseProgressIfLobby) {
            alert("Leaving game will cause you to lose progress.")
            setShowLoseProgressIfLobby(false);
        }
        else {
            navigate('/lobby')
        }
    }

    function renderGameBoard() {
        let matrix = tableData.TableState.dominoesMatrix;
        let html = [];
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                let domino = matrix[i][j]
                if (domino != null) {
                    const [val1, val2] = [domino.values[0], domino.values[1]]
                    html.push(<div key={[i, j]} style={{ display: 'grid', placeItems: 'center' }}>{renderDominoImage([val1, val2])}</div>)
                } else {
                    html.push(<div key={[i, j]} className="gridSquare" style={{ display: 'grid', placeItems: 'center' }}></div>)
                }
            }
        }
        return html;
    }

    const [showPopup, setShowPopup] = useState(false);

    function Popup({ message }) {
        return (
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '10px 20px',
                borderRadius: '5px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                zIndex: 1000
            }}>
                {message}
            </div>
        );
    }

    return (
        <>  {/* Add a fragment to hold both containers */}
            <div style={{
                overflowX: 'auto',
                maxWidth: '100vw',
                padding: '10px'
            }}>
                {!isPaused ? (
                    <div className='table_game' style={{
                        width: 'fit-content',
                        minWidth: '800px',
                        transform: 'scale(0.8)',
                        transformOrigin: 'top center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0px',

                    }}>
                        {/*Button to switch between gamestate and lobby ui*/}
                        <button
                            className='floating-button game-button'  // Added floating-button class
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
                            onClick={handleLobbyButton}
                        >
                            Lobby
                        </button>

                        {/* Display the scores with inline styling */}
                        {gameMode === 'allFives' && (
                            <div className='main-text' style={{
                                position: 'absolute',
                                top: '50px',
                                left: '20px',
                                padding: '10px',
                                borderRadius: '5px',
                                color: 'white',
                                fontSize: '16px'
                            }}>
                                <p>Player Score: {playerScore}</p>
                                <p>Bot Score: {botScore}</p>
                            </div>
                        )}

                        {/*Displays who's turn it is.*/}
                        <div className='turnInfo'>
                            <p>{currentTurn === 'Player' ? "It's your turn!" : "Bot is thinking..."}</p>
                        </div>
                        {/* Turn notification overlay */}
                        {showTurnNotification && (
                            <div className="overlay">
                                <img src={'yourTurn.png'} alt="Your Turn" />
                            </div>
                        )}

                        {playingDraw && (
                            <div className='main-text' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <ScoreTracker temp_score={playerScore} message={"Player score is: "} />
                                <ScoreTracker temp_score={botScore} message={"Bot score is: "} />
                            </div>
                        )}

                        {/* Winner overlay */}
                        {showWinnerOverlay && (
                            <div className="overlay">
                                <img src={'winner.png'} alt="Winner" />
                            </div>
                        )}

                        {/* Loser overlay */}
                        {showLoserOverlay && (
                            <div className="overlay">
                                <img src={'loser.png'} alt="Loser" />
                            </div>
                        )}
                        {/* Top blue avatar and backtiles */}
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '10px'    // Changed from -110px to positive margin to create space
                        }}>
                            <img
                                src={blueAvatarImage.src}
                                alt="Main Bot Avatar"
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    border: '3px solid #1A3636',
                                    marginBottom: '10px'
                                }}
                            />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                transform: 'scale(.9)',
                                transformOrigin: 'top center'
                            }}>
                                {botData.DbHand}
                            </div>
                        </div>

                        {/* Main game area with side avatars */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',    // Set consistent gap for both sides
                            justifyContent: 'center',
                            marginBottom: '-100px'
                        }}>
                            {/* Left side (Green) bot */}
                            {(botAmmount === 'twoBots' || botAmmount === 'threeBots') && (
                                <div style={{
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                    flexShrink: 0,
                                    transform: 'scale(0.8)',
                                    marginRight: '-50px'  // Changed from '10px' to '-20px' to reduce space
                                }}>
                                    <img
                                        src={greenAvatarImage.src}
                                        alt="Second Bot Avatar"
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            border: '3px solid #1A3636',
                                            flexShrink: 0
                                        }}
                                    />
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexShrink: 0,
                                        minWidth: 'max-content'
                                    }}>
                                        {botData2 && botData2.DbHand}
                                    </div>
                                </div>
                            )}

                            {/* Game board */}
                            <div className='table' style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(11, 5rem)',
                                gridTemplateRows: 'repeat(11, 5rem)',
                                gap: '0.25rem',
                                height: '55rem',
                                flexShrink: 0
                            }}>
                                {renderGameBoard()}
                            </div>

                            {/* Right side (Yellow) bot */}
                            {botAmmount === 'threeBots' && (
                                <div style={{
                                    display: 'flex',
                                    gap: '5px',
                                    alignItems: 'center',
                                    flexShrink: 0,  // Prevent shrinking
                                    transform: 'scale(0.8)'  // Scale down side bots
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexShrink: 0,  // Prevent backtiles from shrinking
                                        minWidth: 'max-content'  // Maintain minimum width based on content
                                    }}>
                                        {botData3 && botData3.DbHand}
                                    </div>
                                    <img
                                        src={yellowAvatarImage.src}
                                        alt="Third Bot Avatar"
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%',
                                            border: '3px solid #1A3636',
                                            flexShrink: 0  // Prevent avatar from shrinking
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Player hand and controls */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '5px',
                            marginTop: '-60px'
                        }}>
                            <div className='Player1'>
                                <p>{playerData.DrawHand}</p>

                                <input className='domino-input' type='number'
                                    value={playerDominoIndex}
                                    onChange={(e) => setPlayerDominoIndex(e.target.value)}
                                    placeholder='Enter domino position' />

                                <button className='game-button' onClick={() => {
                                    if (playerDominoIndex) {
                                        setData({
                                            Domino: playerData.PlayerHand[playerDominoIndex],
                                            DominoDirection: Corner.LEFT
                                        });
                                    }
                                }}>Left Tail</button>
                                <button className='game-button' onClick={() => {
                                    if (playerDominoIndex) {
                                        setData({
                                            Domino: playerData.PlayerHand[playerDominoIndex],
                                            DominoDirection: Corner.RIGHT
                                        });
                                    }
                                }}>Right Tail</button>
                                <button className='game-button' onClick={() => {
                                    if (tableData.TableState.availableDominos <= 0) {
                                        setShowPopup(true);
                                        setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
                                    } else {
                                        setPlayerData({
                                            PlayerHand: playerData.PlayerHand,
                                            DrawHand: playerData.DrawHand,
                                            PlayerInput: true,
                                        });
                                    }
                                }}>Grab a Random Chip</button>
                                <button className='game-button' onClick={() => {
                                    if (tableData.TableState.dominoesOnTable > 0) {
                                        setPassButton(true);
                                    }
                                }}>Pass Turn</button>
                                <button className='game-button' onClick={pauseGame}>Pause Game</button>
                                <BackgroundMusic src={"/BackgroundMusic.mp3"} />
                            </div>

                            {/* Avatar image */}
                            <img
                                src={avatarImage.src}
                                alt="Player Avatar"
                                style={{
                                    display: 'block',
                                    margin: '5px auto',
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    border: '3px solid #1A3636'
                                }}
                            />
                        </div>

                        {/* Add ToastContainer to display toast notifications */}
                        <audio id="dominoPlaceSound" src="/DominoPlacement.wav" preload="auto"></audio>
                    </div>
                ) : (<PauseScreen onResume={resumeGame} />)}
                {showPopup && <Popup message="There are no more tiles to pick up!" />}
            </div>

            {/* Move ToastContainer outside the main game container */}
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
                theme="colored"
                style={{
                    top: '20px',
                    right: '20px',
                    width: 'auto',
                    maxWidth: '400px'
                }}
                toastStyle={{
                    fontSize: '16px',
                    padding: '15px',
                    backgroundColor: '#1A3636',
                    color: 'white'
                }}
            />
        </>
    );

}

export default MainGame