import { Table, Corner, DisplayDirection } from './table.js';
import React, { useState, useEffect, useRef } from 'react';
import DominoBot from './Bot.js';
import IntermediateBot from './intermediateBot.js';
import AdvancedBot from './AdvancedBot.js';
import RuleEngine from './RuleEngine.js';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PauseScreen from './Pause.js';
import AchievementManager from './AchievementManager.js';
import { ToastContainer, toast } from 'react-toastify';  // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';   // Import Toastify CSS
import io from 'socket.io-client';

const tileWidth = 3584 / 28; // Width of each tile (~137.14 pixels)
const tileHeight = 64; // Height of each tile (91 pixels)
const totalTiles = 28; // Total number of tiles (excluding the back tile)
const tileMap = new Map();

const socket = io('http://localhost:5000');

const avatarImage = new Image();
avatarImage.src = '/Red-Avatar.png';  // Assuming this is the player's avatar
const blueAvatarImage = new Image();
blueAvatarImage.src = '/Blue-Avatar.png';
const yellowAvatarImage = new Image();
yellowAvatarImage.src = '/Yellow-Avatar.png';
const greenAvatarImage = new Image();
greenAvatarImage.src = '/Green-Avatar.png';


function Multiplayer() {

const Multiplayer = () => {
  const location = useLocation();
  const { roomId, roomName, gameMode, socketId } = location.state || {};

  useEffect(() => {
    // Join the room when the component mounts
    socket.emit('joinRoom', { roomId, roomName });
  }, [roomId, roomName]);

  return (
    <div className="multiplayer-container">
      <h1>Multiplayer Room: {roomName}</h1>
      <p>Game Mode: {gameMode}</p>
      <p>Your Socket ID: {socketId}</p>
      <p>Room ID: {roomId}</p>
    </div>
  );
};

    const [tileMap, setTileMap] = useState(new Map());
    const [tilesInitialized, setTilesInitialized] = useState(false);
    const [playerScore, setPlayerScore] = useState(0);
    const [botScore, setBotScore] = useState(0);

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

    const gameMode = "classic";
    const botdifficulty = "advanced";
    const botAmmount = "threeBots";

    function createBot(itshand) {
        switch (botdifficulty) {
            case "basic":
                return new DominoBot(tempTableState, itshand);
            case  "intermediate":
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

    if(botAmmount === 'twoBots' || botAmmount === 'threeBots'){
        botHand2 = tempTableState.playerChips();
        bot2 = createBot(botHand2);
    }
    if(botAmmount === 'threeBots'){
        botHand3 = tempTableState.playerChips();
        bot3 = createBot(botHand3);
    }
    useEffect(()=>{
        if(botAmmount === 'twoBots' || botAmmount === 'threeBots'){
            setbotData2({
                BotHand: botHand2,
                DbHand: drawBotChips(botHand2.length),
                BotPlayer: bot2,
                TileCount: botHand2.length
            })
        }
        if(botAmmount === 'threeBots'){
            setbotData3({
                BotHand: botHand3,
                DbHand: drawBotChips(botHand3.length),
                BotPlayer: bot3,
                TileCount: botHand3.length
            })
        }
    },[])


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
    const [showLoseProgressIfLobby, setShowLoseProgressIfLobby] = useState(false);

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

                if (botData.BotPlayer.hand.length === 0) {
                    if(gameMode === 'allFives'){   
                        //add here bot vs player score comparison
                        if(playerScore > botScore){
                            toast.success(`Final Score: ${playerScore} points!`);
                            setShowWinnerOverlay(true);
                            setTimeout(() => setShowWinnerOverlay(false), 3000); // Display winner overlay for 3 seconds
                            return;
                        }
                        else if (playerScore < botScore){
                            toast.success(`Final Score: ${botScore} points!`);
                            setShowLoserOverlay(true);
                            setTimeout(() => setShowLoserOverlay(false), 3000); // Display loser overlay for 3 seconds
                            return;
                        }
                        else{
                            toast.success(`Final Score: TIE`);
                            setShowWinnerOverlay(true);
                            setTimeout(() => setShowWinnerOverlay(false), 3000); // Display winner overlay for 3 seconds
                            return;
                        }
                    } else{
                    setShowLoserOverlay(true);
                    setTimeout(() => setShowLoserOverlay(false), 3000); // Display loser overlay for 3 seconds
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

    useEffect(() => {
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
                

                if (playerData.PlayerHand.length === 0) {
                    if(gameMode === 'allFives'){   
                        if(playerScore > botScore){
                            toast.success(`Final Score: ${playerScore} points!`);
                            achievementManager.checkWinWith5Points(playerScore);
                            setShowWinnerOverlay(true);
                            setTimeout(() => setShowWinnerOverlay(false), 3000); // Display winner overlay for 3 seconds
                            return;
                        }
                        else if (playerScore < botScore){
                            toast.success(`Final Score: ${botScore} points!`);
                            setShowLoserOverlay(true);
                            setTimeout(() => setShowLoserOverlay(false), 3000); // Display loser overlay for 3 seconds
                            return;
                        }
                        else{
                            toast.success(`Final Score: TIE`);
                            setShowWinnerOverlay(true);
                            setTimeout(() => setShowWinnerOverlay(false), 3000); // Display winner overlay for 3 seconds
                            return;
                        }
                    } else if (gameMode === "drawDominoes") {
                        if (botHand.length <= 0 && playerData.PlayerHand.length > 0) {
                            setBotScore(prevScore => prevScore + ruleEngine.getDrawDominoesRules().domino_win_score(playerData.PlayerHand));
                            if (ruleEngine.getDrawDominoesRules().has_won_game_set(botScore)) {
                                // Player has won draw dominoes and game can end.
                                setShowLoserOverlay(true);
                                setTimeout(() => setShowWinnerOverlay(false), 3000);    
                                
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
                                setTimeout(() => setShowWinnerOverlay(false), 3000);    
                                
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
                        setTimeout(() => setShowWinnerOverlay(false), 3000); // Display winner overlay for 3 seconds
                        return;
                    }
                }
                // Bot's turn to play
                setCurrentTurn('bot');

                setTimeout(()=>{
                    botPlayTurn(botData, tableData, setbotData, setTableData);
                },1000)
                if(botAmmount === 'twoBots' || botAmmount === 'threeBots'){
                    setTimeout(()=>{
                        botPlayTurn(botData2, tableData, setbotData2, setTableData);
                    },2000)
                }
                if(botAmmount === 'threeBots'){
                    setTimeout(()=>{
                        botPlayTurn(botData3, tableData, setbotData3, setTableData);
                    },3000)
                }

                setTimeout(()=>{
                    setCurrentTurn('Player');
                },4000)
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
    useEffect(()=>{
        if(passButton){
            setCurrentTurn('bot');
    
            setTimeout(()=>{
                botPlayTurn(botData, tableData, setbotData, setTableData);
            },1000)
            if(botAmmount === 'twoBots' || botAmmount === 'threeBots'){
                setTimeout(()=>{
                    botPlayTurn(botData2, tableData, setbotData2, setTableData);
                },2000)
            }
            if(botAmmount === 'threeBots'){
                setTimeout(()=>{
                    botPlayTurn(botData3, tableData, setbotData3, setTableData);
                },3000)
            }
    
            setTimeout(()=>{
                setCurrentTurn('Player');
            },4000)
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

    function renderDominoImage(domino, domino_was_flipped, domino_direction) {
        if (!domino || domino.length !== 2) return null;
        const tempTileKey = domino[0].toString() + domino[1].toString();
        const tileKey = Array.from(tempTileKey).sort().join('');
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
                            transform: `scale(${domino_was_flipped ? -0.6 : 0.6 }) rotate(${domino_direction === DisplayDirection.HORIZONTAL ? 0 : 90}deg)`,  // Increased from 0.5
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
        setShowLoseProgressIfLobby(true);
    };

    function renderGameBoard() {
        let matrix = tableData.TableState.dominoesMatrix;
        let html = [];
        for (let i = 0; i < matrix.length; i++){
            for(let j = 0; j < matrix[0].length; j++){
                let domino = matrix[i][j]
                if(domino != null){
                    const [val1, val2] = [domino.values[0],domino.values[1]]
                    html.push(<div key = {[i,j]} style={{display:'grid',placeItems: 'center'}}>{renderDominoImage([val1, val2],domino.flipped,domino.displayDirection)}</div>)
                }else{
                    html.push(<div key = {[i,j]} className="gridSquare" style={{display:'grid',placeItems: 'center'}}></div>)
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
        <>
        <div>
            {!isPaused ? (
                <div className='table_game'>
                    {/*Button to switch between gamestate and lobby ui*/}
                    <button
                        onClick={handleLobbyButton}className="lobby-button">Lobby</button>
                        {showLoseProgressIfLobby && (
                            <div className='leave-overlay'>
                                <div className='leave-message'>
                                    <h2>Leaving game will cause you to lose progress</h2>
                                    <button className='leave-button' onClick={() => setShowLoseProgressIfLobby(false)}>
                                        Cancel
                                    </button>
                                    <button className='leave-button' onClick={() => navigate("/lobby")}>
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}
                    {/* Display the scores with inline styling */}
                    {gameMode === 'allFives' && (
                    <div className= 'main-text' style={{
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
                        <p>{currentTurn === 'Player' ? "" : ""}</p>
                    </div>
                    {/* Turn notification overlay */}
                    {showTurnNotification && (
                        <div className="overlay">
                            <img src={'yourTurn.png'} alt="Your Turn" />

                        </div>
                        )}

                        {/*Displays who's turn it is.*/}
                        <div className='turnInfo'>
                            <p>{currentTurn === 'Player' ? "" : ""}</p>
                        </div>
                        {/* Turn notification overlay */}
                        {showTurnNotification && (
                            <div className="overlay">
                                <img src={'yourTurn.png'} alt="Your Turn" />
                            </div>
                        )}

                        {playingDraw && (
                            <div className='main-text' style={{ display: 'flex', justifyContent: 'space-between'}}>
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
                                    if(tableData.TableState.dominoesOnTable > 0){
                                        setPassButton(true);
                                    }
                                }}>Pass Turn</button>
                                <button className='game-button' onClick={pauseGame}>Pause Game</button>
                                <BackgroundMusic src={"/BackgroundMusic.mp3"}/> 
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

export default Multiplayer




// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000'); // Adjust for your backend

// // Utility: Domino Object
// class Domino {
//     constructor(values, coords = null, displayDirection = null) {
//         this.values = values; // Domino values, e.g., [3, 6]
//         this.coords = coords; // Position on the board
//         this.displayDirection = displayDirection; // Orientation
//         this.freeCorners = [...values]; // Available placement numbers
//         this.flipped = false; // Indicates if flipped
//     }

//     removeCorner(number) {
//         const index = this.freeCorners.indexOf(number);
//         if (index > -1) this.freeCorners.splice(index, 1);
//     }
// }

// // Game Board Logic
// class Table {
//     constructor(pathMatrix) {
//         this.pathMatrix = pathMatrix;
//         this.dataMatrix = this.createDataMatrix();
//         this.dominoes = Array.from({ length: 28 }, (_, i) => {
//             const a = Math.floor(i / 7);
//             const b = i % 7;
//             return [a, b];
//         });
//         this.dominoesOnTable = 0;
//         this.leftTail = null;
//         this.rightTail = null;
//         this.playedDominoes = [];
//     }

//     createDataMatrix() {
//         return this.pathMatrix.map(row => row.map(() => null));
//     }

//     grabRandomDomino() {
//         const randomIndex = Math.floor(Math.random() * this.dominoes.length);
//         return this.dominoes.splice(randomIndex, 1)[0];
//     }

//     placeDomino(domino, corner) {
//         if (!this.leftTail && !this.rightTail) {
//             this.leftTail = this.rightTail = new Domino(domino, [5, 5], 'HORIZONTAL');
//             this.dataMatrix[5][5] = this.leftTail;
//             return true;
//         }
//         const tail = corner === 'LEFT' ? this.leftTail : this.rightTail;
//         const newCoords = [tail.coords[0], tail.coords[1] + (corner === 'RIGHT' ? 1 : -1)];
//         const newDomino = new Domino(domino, newCoords, 'HORIZONTAL');

//         if (tail.freeCorners.includes(domino[0]) || tail.freeCorners.includes(domino[1])) {
//             tail.removeCorner(domino[0]);
//             newDomino.removeCorner(domino[0]);
//             this.dataMatrix[newCoords[0]][newCoords[1]] = newDomino;
//             if (corner === 'LEFT') this.leftTail = newDomino;
//             else this.rightTail = newDomino;
//             this.dominoesOnTable++;
//             this.playedDominoes.push(domino);
//             return true;
//         }
//         return false;
//     }
// }

// // Game Component
// const Multiplayer = () => {
//     const [table] = useState(() => new Table(Array(11).fill(Array(11).fill(1))));
//     const [playerHand, setPlayerHand] = useState([]);
//     const [currentTurn, setCurrentTurn] = useState('');
//     const [gameState, setGameState] = useState([]);
//     const [selectedDomino, setSelectedDomino] = useState(null);

//     useEffect(() => {
//         // Initialize the player's hand
//         setPlayerHand(Array.from({ length: 7 }, () => table.grabRandomDomino()));

//         // Socket Listeners
//         socket.on('updateGameState', (state) => setGameState(state));
//         socket.on('setTurn', (turn) => setCurrentTurn(turn));

//         return () => {
//             socket.off('updateGameState');
//             socket.off('setTurn');
//         };
//     }, [table]);

//     const handlePlay = (corner) => {
//         if (currentTurn === socket.id && selectedDomino) {
//             const success = table.placeDomino(selectedDomino, corner);
//             if (success) {
//                 setPlayerHand((hand) => hand.filter((domino) => domino !== selectedDomino));
//                 socket.emit('playDomino', { domino: selectedDomino, corner });
//                 setSelectedDomino(null);
//             }
//         }
//     };

//     const renderBoard = () => {
//         return table.dataMatrix.map((row, y) => (
//             <div key={y} style={{ display: 'flex' }}>
//                 {row.map((cell, x) => (
//                     <div
//                         key={x}
//                         style={{
//                             width: '50px',
//                             height: '50px',
//                             border: '1px solid black',
//                             textAlign: 'center',
//                             lineHeight: '50px',
//                         }}
//                     >
//                         {cell ? `${cell.values[0]}|${cell.values[1]}` : ''}
//                     </div>
//                 ))}
//             </div>
//         ));
//     };

//     return (
//         <div>
//             <h1>Multiplayer Domino Game</h1>
//             <div>
//                 <h2>Board</h2>
//                 {renderBoard()}
//             </div>
//             <div>
//                 <h2>Your Hand</h2>
//                 {playerHand.map((domino, index) => (
//                     <button key={index} onClick={() => setSelectedDomino(domino)}>
//                         {domino[0]}|{domino[1]}
//                     </button>
//                 ))}
//             </div>
//             <div>
//                 <button onClick={() => handlePlay('LEFT')}>Place on Left</button>
//                 <button onClick={() => handlePlay('RIGHT')}>Place on Right</button>
//             </div>
//             <p>
//                 Current Turn: {currentTurn === socket.id ? 'Your Turn' : "Opponent's Turn"}
//             </p>
//         </div>
//     );
// };

// export default Multiplayer;
