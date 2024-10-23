import { Table, Corner } from "./table.js";
import React, { useCallback, useState, useEffect } from "react";
import DominoBot from "./Bot.js";
import { fromJSON, toJSON } from "flatted";
import RuleEngine from "./RuleEngine.js";
import { useNavigate, useLocation } from "react-router-dom";
import PauseScreen from "./Pause.js";
import AchievementManager from "./AchievementManager.js";
import { ToastContainer } from "react-toastify";  // Import ToastContainer
import "react-toastify/dist/ReactToastify.css";   // Import Toastify CSS
import IntermediateBot from "./intermediateBot.js";

const tileWidth = 3840 / 28; // Width of each tile (~137.14 pixels)
const tileHeight = 91; // Height of each tile (91 pixels)
const totalTiles = 28; // Total number of tiles (excluding the back tile)
const tileMap = new Map();

function MainGame() {
    const [tileMap, setTileMap] = useState(new Map());
    const [tilesInitialized, setTilesInitialized] = useState(false);

    const backgroundMusic = useRef(null);
    useEffect(() => {
        const audio = backgroundMusic.current;
        audio.volume = 0.2;
        const handleCanPlay = () => {
          audio.play().catch((error) => {
            console.log("Autoplay was prevented, retrying with mute...", error);
            audio.muted = true; // Mute the audio if autoplay is blocked
            audio.play();
          });
        };
        // Play the audio when it's ready
        audio.addEventListener("canplay", handleCanPlay);
        return () => {
          audio.pause(); // Pause the audio when leaving the page
          audio.removeEventListener("canplay", handleCanPlay);
        };
      }, []);


    const tileImage = new Image();
    tileImage.src = "/Dominos-28-Horrizontally.png"; // Adjust this path as needed
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


    const [playerDominoIndex, setPlayerDominoIndex] = useState("");

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
    const player_hand = localStorage.getItem("PlayerHand");
    const player_input = localStorage.getItem("PlayerInput");
    const current_turn = localStorage.getItem("currentTurn");
    const draw_matrix = localStorage.getItem("DrawMatrix");
    const bot_hand = localStorage.getItem("BotHand");
    const player_hand_value = player_hand ? fromJSON(JSON.parse(player_hand)) : initialPlayerHand;
    const player_input_value = player_input ? fromJSON(JSON.parse(player_input)) : false;
    const draw_matrix_value = draw_matrix ? fromJSON(JSON.parse(draw_matrix)) : tempTableState.drawTable().split("\n");
    const current_turn_value = current_turn ? fromJSON(JSON.parse(current_turn)) : "Player";
    const bot_hand_value = bot_hand ? fromJSON(JSON.parse(bot_hand)) : tempTableState.playerChips();

    const [currentTurn, setCurrentTurn] = useState(current_turn_value);

    const achievementManager = new AchievementManager();

    useEffect(() => {
        achievementManager.checkStartWithDoubleSix(player_hand_value);
        achievementManager.checkAllDoublesHand(player_hand_value);
    }, []);


    const [botData, setbotData] = useState({
        BotHand: bot_hand_value,
        DbHand: drawBotChips(bot_hand_value.length),
        BotPlayer: bot,
        TileCount:bot_hand_value.length,
    })

    const [tableData, setTableData] = useState({
        TableState: tempTableState,
        DrawMatrix: draw_matrix_value,
    });
    const [playerData, setPlayerData] = useState({
        PlayerHand: player_hand_value,
        DrawHand: drawChips(player_hand_value),
        PlayerInput: player_input_value,
    });

    const [isPaused, setPaused] = useState(false);

    useEffect(() => {
        console.log("game was saved...")
        localStorage.setItem("PlayerHand", JSON.stringify(toJSON(playerData.PlayerHand)));
        localStorage.setItem("PlayerInput", JSON.stringify(toJSON(playerData.PlayerInput)));
        localStorage.setItem("DrawMatrix", JSON.stringify(toJSON(tableData.DrawMatrix)));
        localStorage.setItem("currentTurn", JSON.stringify(toJSON(currentTurn)));
        localStorage.setItem("BotHand", JSON.stringify(toJSON(botData.BotHand)));
    }, [currentTurn])

    const pauseGame = () => {
        setPaused(true);
    }

    const resumeGame = () => {
        setPaused(false);
    }

    const [showWinnerOverlay, setShowWinnerOverlay] = useState(false);
    const [showLoserOverlay, setShowLoserOverlay] = useState(false);
    const [showTurnNotification, setShowTurnNotification] = useState(false);

    const [showLoseProgressIfLobby, setShowLoseProgressIfLobby] = useState(true);

    const playSound = () => {
        const audio = document.getElementById("dominoPlaceSound");
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
                    DrawMatrix: tableData.TableState.drawTable().split("\n")
                });

                if (botData.BotPlayer.hand.length === 0) {
                    setShowLoserOverlay(true);
                    setTimeout(() => setShowLoserOverlay(false), 3000); // Display loser overlay for 3 seconds
                    return;
                }
                setCurrentTurn("Player");
                playSound();
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
                setCurrentTurn("Player");
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
                    DrawMatrix: tempTableState.drawTable().split("\n"),
                });

                playerData.PlayerHand.splice(playerDominoIndex, 1);

                setPlayerData({
                    PlayerHand: playerData.PlayerHand,
                    DrawHand: drawChips(playerData.PlayerHand),
                    PlayerInput: false,
                });

                setPlayerDominoIndex("");
                playSound();

                // Check win condition for player
                achievementManager.checkWin(playerData.PlayerHand);

                if (playerData.PlayerHand.length === 0) {
                    setShowWinnerOverlay(true);
                    setTimeout(() => setShowWinnerOverlay(false), 3000); // Display winner overlay for 3 seconds
                    return;
                }
                // Bot's turn to play
                setCurrentTurn("bot");
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
                DrawMatrix: tableData.TableState.drawTable().split("\n")
            });
        }
    }, [data, playerData]);

    // For displaying turn notification
    useEffect(() => {
        if (currentTurn === "Player" && !showWinnerOverlay && !showLoserOverlay) {
            setShowTurnNotification(true);
            setTimeout(() => setShowTurnNotification(false), 2000); // Show "Your Turn" notification for 2 seconds
        }
    }, [currentTurn]);

    // Convert a matrix into a string to visualize the player's hand.
    function drawChips(chips) {
        console.log("drawChips called, tilesInitialized:", tilesInitialized, "tileMap size:", tileMap.size);
        if (!tilesInitialized || tileMap.size === 0) {
            console.log("Tiles not initialized or empty tileMap");
            return <div>Loading...</div>;
        }

        const containerStyle = {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
            width: "100%",
            overflowX: "auto"
        };

        const rowStyle = {
            display: "flex",
            gap: "10px",
        };

        const itemStyle = {
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        };

        const numberStyle = {
            marginTop: "5px",
            fontWeight: "bold",
            fontSize: "14px"
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
                                console.log(`Undefined chip at index ${rowIndex * 7 + index}`);
                                return null; // Just return null without setting the popup
                            }
                            const tileKey = chip[0].toString() + chip[1].toString();
                            const tile = tileMap.get(tileKey);
                            const globalIndex = rowIndex * 7 + index;
                            console.log(`Chip ${globalIndex}:`, tileKey, "Tile:", tile);
                            if (tile && tile.image) {
                                return (
                                    <div key={globalIndex} style={itemStyle}>
                                        <img
                                            src={tile.image.src}
                                            style={{
                                                width: `${tile.width}px`,
                                                height: `${tile.height}px`,
                                                objectFit: "none",
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
        const backtileImage = "/backtile.png"; // Adjust this path as needed
        // Use the same scale as in renderDominoImage
        const displayWidth = tileWidth
        const displayHeight = tileHeight

        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {[...Array(tileCount)].map((_, index) => (
                    <div key={index} style={{ margin: "0 2px" }}>
                        <img
                            src={backtileImage}
                            style={{
                                width: `${displayWidth}px`,
                                height: `${displayHeight}px`,
                                objectFit: "cover"
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
                        width: `${tile.width}px`,
                        height: `${tile.height}px`,
                        objectFit: "none",
                        objectPosition: `-${tile.sx}px 0px`,
                        display: "inline-block",
                        verticalAlign: "middle",
                    }}
                    alt={`Domino ${domino[0]}-${domino[1]}`}
                />
            );
        }
        return `[${domino[0]},${domino[1]}]`; // Fallback to text if image not found
    }

    const handleLobbyButton = () => {
        if (showLoseProgressIfLobby) {
            alert("Leaving game will cause you to lose progress.")
            setShowLoseProgressIfLobby(false);
        }
        else {
            navigate("/lobby")
        }
    }

    const resetGame = () => {
        console.log("I'm here!");
        setPlayerData({
            PlayerHand: initialPlayerHand,
            DrawHand: drawChips(initialPlayerHand),
            PlayerInput: false,
        });
        setTableData({
            TableState: tempTableState,
            DrawMatrix: tempTableState.drawTable().split('\n'),
        });
        setCurrentTurn(false);
        setbotData({
            BotHand: botHand,
            DbHand: drawBotChips(botHand.length),
            BotPlayer: bot,
            TileCount: botHand.length
        });
    }

    function renderGameBoard() {
        return tableData.DrawMatrix.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40px" }}>
                {row.split(" ").map((cell, cellIndex) => {
                    if (cell === "===") {
                        return <span key={cellIndex} style={{ width: "40px", display: "inline-block" }}></span>;
                    } else if (cell.startsWith("|")) {
                        const [val1, val2] = cell.slice(1, -1).split("|").map(Number);
                        return <span key={cellIndex}>{renderDominoImage([val1, val2])}</span>;
                    }
                    return null;
                })}
            </div>
        ));
    }

    const [showPopup, setShowPopup] = useState(false);

    function Popup({ message }) {
        return (
            <div style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                backgroundColor: "#f8d7da",
                color: "#721c24",
                padding: "10px 20px",
                borderRadius: "5px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                zIndex: 1000
            }}>
                {message}
            </div>
        );
    }

    return (
        <div>
            <audio id="backgroundMusic" ref={backgroundMusic} loop>
                <source src="/BackgroundMusic.mp3" type="audio/mpeg" />
            </audio>
            {!isPaused ? (
                <div className="table_game">
                    {/*Button to switch between gamestate and lobby ui*/}
                    <button
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            padding: "10px",
                            backgroundColor: "#1A3636",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                        onClick={() => {
                            handleLobbyButton();
                            resetGame();
                        }}>Lobby</button>

                    {/*Displays who's turn it is.*/}
                    <div className="turnInfo">
                        <p>{currentTurn === "Player" ? "It's your turn!" : "Bot is thinking..."}</p>
                    </div>
                    {/* Turn notification overlay */}
                    {showTurnNotification && (
                        <div className="overlay">
                            <img src={"yourTurn.png"} alt="Your Turn" />
                        </div>
                    )}

                    {/* Winner overlay */}
                    {showWinnerOverlay && (
                        <div className="overlay">
                            <img src={"winner.png"} alt="Winner" />
                        </div>
                    )}

                    {/* Loser overlay */}
                    {showLoserOverlay && (
                        <div className="overlay">
                            <img src={"loser.png"} alt="Loser" />
                        </div>
                    )}
                    {/*Shows the placeholder dominoes for the bot.*/}
                    <div className="BotInfo">
                        <p>{botData.DbHand}</p>
                    </div>

                    <div className="table">
                        {renderGameBoard()}
                    </div>
                    <div className="input_chips">
                        <div className="Player1">
                            <p>{playerData.DrawHand}</p>

                            <input type="number"
                                value={playerDominoIndex}
                                onChange={(e) => setPlayerDominoIndex(e.target.value)}
                                placeholder="Enter the position of a domino" />

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
                                if (tableData.TableState.availableDominos === 0) {
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
                    <audio id="dominoPlaceSound" src="/DominoPlacement.wav" preload="auto"></audio>

                    {/* Button and UI for navigating and game controls */}
                </div>
                //Continues the popup message for when the player has no more tiles to pick up after the game has been paused. 
            ) : (<PauseScreen onResume={resumeGame} />)}
            {showPopup && <Popup message="There are no more tiles to pick up!" />}  
        </div>
    );

}

export default MainGame