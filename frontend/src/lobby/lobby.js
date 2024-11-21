// import React, { useState, useEffect } from "react";
// import "./lobby.css";
// import { useNavigate } from "react-router-dom";
// const Lobby = () => {
//   /*Variable added to navigate between gamestate and lobby */
//   const navigate = useNavigate();
//   // State to manage the list of rooms and room creation
//   const [rooms, setRooms] = useState([]);
//   const [newRoomName, setNewRoomName] = useState("");
//   const [roomMode, setRoomMode] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showLobby, setShowLobby] = useState(false);
//   const [showOptions, setShowOptions] = useState(true);
//   const [showInstruction, setInstruction] = useState(true);
//   const [isSoloPlay, setIsSoloPlay] = useState(true);
//   const [botdifficulty, setBotlevel] = useState("");
//   const [gameMode, setGameMode] = useState("");
//   const [botAmmount, setBotAmmount] = useState("");
//   const playSound = () => {
//     const audio = document.getElementById("lobbyClickSound");
//     if (audio) {
//       audio.play();
//     }
//   };
//   const handleDifficultyChange = (event) => {
//     setBotlevel(event.target.value);
//   };
//   const handleGameMode = (event) => {
//     setGameMode(event.target.value);
//     setRoomMode(event.target.value);
//   };
//   const handleBotAmmount = (event) => {
//     setBotAmmount(event.target.value);
//   };
//   const handleDisplay = (solo) => {
//     setIsSoloPlay(solo);
//     setShowLobby(true);
//     setShowOptions(false);
//     setErrorMessage("");
//     setInstruction(false);
//   };
//   // Later Implement with the database to do a getAllRooms
//   useEffect(() => {
//     fetchRooms();
//   }, []);
//   const fetchRooms = async () => {
//     //dummy daya for rooms
//     //replace with API calls and decide which info the rooms have to show in the interface
//     const fetchedRooms = [];
//     //Change this to a fetchedRooms with the GET response
//     setRooms(fetchedRooms);
//   };
//   //room creating. Missing backend post?
//   const handleCreateRoom = async () => {
//     if (newRoomName.trim() === "") {
//       setErrorMessage("Room name cannot be empty.");
//       return;
//     } else if (roomMode === "") {
//       setErrorMessage("Please select a game mode.");
//       return;
//     } else {
//       setErrorMessage("");
//       // Dummy post
//       //Replace with response, can use stringify on the json response
//       const newRoom = {
//         id: rooms.length + 1,
//         name: newRoomName,
//         gamemode: roomMode,
//         players: 1,
//         maxPlayers: 4,
//       };
//       setRooms([...rooms, newRoom]);
//       setNewRoomName(""); //Clear input if success
//       setRoomMode("");
//     }
//   };
//   //handle joining
//   const joinRooms = (roomId) => {
//     setRooms((prevRooms) => {
//       const updatedRooms = prevRooms.map((room) => {
//         if (room.id === roomId) {
//           // Check if the room is not full
//           if (room.players < room.maxPlayers) {
//             return { ...room, players: room.players + 1 }; // Increment player count
//           } else {
//             alert("Room is full.");
//             return room; // No change if room is full
//           }
//         }
//         return room;
//       });
//       return updatedRooms;
//     });
  
//     playSound();
//     navigate("/game", {
//       state: {
//         gameMode: "classic", // Hardcoded game mode
//         bot: "advanced", // Hardcoded bot difficulty
//         botNum: "threeBots", // Hardcoded maximum bot amount
//       },
//     });
//   };
  
//   return (
//     <div className="selection-box" style={{ display: "block", width: "100%" }}>
//       {showInstruction && (
//         <p className="instruction-message">
//           {" "}
//           Choose between playing clever bots in solo play or
//           <br />
//           play with friends by creating a lobby!
//         </p>
//       )}
//       {showOptions && (
//         <div className="options-container">
//           <button
//             className="createRoom_button"
//             onClick={() => {
//               handleDisplay(true);
//               playSound();
//             }}
//           >
//             Solo Play
//           </button>
//           <button
//             className="createRoom_button"
//             onClick={() => {
//               playSound();
//               handleDisplay(false);
//             }}
//           >
//             Multiplayer
//           </button>
//         </div>
//       )}
//       {showLobby && (
//         <div className="lobby-container">
//           <div className="left-column">
//             <p
//               className="back-button"
//               onClick={() => {
//                 setShowLobby(false);
//                 setShowOptions(true);
//                 setInstruction(true);
//               }}
//             >
//               Back
//             </p>
//             {isSoloPlay && (
//               <div className="solo_play">
//                 <button
//                   className="start_button"
//                   style={{ height: "70px" }}
//                   onClick={() => {
//                     handleCreateRoom();
//                     playSound();
//                     navigate("/game", {
//                       state: {
//                         gameMode: gameMode,
//                         bot: botdifficulty,
//                         botNum: botAmmount,
//                       },
//                     });
//                   }}
//                   disabled={!gameMode || !botdifficulty}
//                 >
//                   Start Game
//                 </button>
//               </div>
//             )}
//             {!isSoloPlay && (
//               <div className="create_lobby">
//                 <h2 className="multiplayer-heading">Create Lobby</h2>
//                 <input
//                   type="text"
//                   value={newRoomName}
//                   onChange={(e) => setNewRoomName(e.target.value)}
//                   placeholder="Enter Room Name"
//                   className="text-box"
//                 />
//                 <div
//                   className="game-mode-selection"
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-around",
//                     marginTop: "10px",
//                   }}
//                 >
//                   <label>
//                     <input
//                       type="radio"
//                       name="gamemode"
//                       value="classic"
//                       onChange={handleGameMode}
//                     />{" "}
//                     Classic
//                   </label>
//                   <label>
//                     <input
//                       type="radio"
//                       name="gamemode"
//                       value="allFives"
//                       onChange={handleGameMode}
//                     />{" "}
//                     All Fives
//                   </label>
//                   <label>
//                     <input
//                       type="radio"
//                       name="gamemode"
//                       value="drawDominoes"
//                       onChange={handleGameMode}
//                     />{" "}
//                     Draw Dominoes
//                   </label>
//                 </div>
//                 <button
//                   className="createRoom_button"
//                   onClick={() => {
//                     handleCreateRoom();
//                     playSound();
//                   }}
//                 >
//                   Create Room
//                 </button>
//                 {errorMessage && <p className="error">{errorMessage}</p>}
//               </div>
//             )}
//           </div>
//           <div className="right-column">
//             {/* Options for solo players */}
//             {isSoloPlay && (
//               <div className="bot-selector">
//                 <h1 className="heading"> Choose Game Mode</h1>
//                 <form
//                   className="bot-difficulty-form"
//                   style={{ fontSize: "16px" }}
//                 >
//                   <label>
//                     <input
//                       onChange={handleGameMode}
//                       type="radio"
//                       name="gamemode"
//                       value="classic"
//                     />{" "}
//                     Classic
//                   </label>
//                   <br />
//                   <label>
//                     <input
//                       onChange={handleGameMode}
//                       type="radio"
//                       name="gamemode"
//                       value="allFives"
//                     />{" "}
//                     All fives
//                   </label>
//                   <br />
//                   <label>
//                     <input
//                       onChange={handleGameMode}
//                       type="radio"
//                       name="gamemode"
//                       value="drawDominoes"
//                     />{" "}
//                     Draw Dominoes
//                   </label>
//                 </form>
//                 <h1 className="heading"> Choose Bot Difficulty</h1>
//                 <form
//                   className="bot-difficulty-form"
//                   style={{ fontSize: "16px" }}
//                 >
//                   <label>
//                     <input
//                       onChange={handleDifficultyChange}
//                       type="radio"
//                       name="difficulty"
//                       value="basic"
//                     />{" "}
//                     Basic
//                   </label>
//                   <br />
//                   <label>
//                     <input
//                       onChange={handleDifficultyChange}
//                       type="radio"
//                       name="difficulty"
//                       value="intermediate"
//                     />{" "}
//                     Intermediate
//                   </label>
//                   <br />
//                   <label>
//                     <input
//                       onChange={handleDifficultyChange}
//                       type="radio"
//                       name="difficulty"
//                       value="advanced"
//                     />{" "}
//                     Advanced
//                   </label>
//                 </form>
//                 <h1 className="heading"> Choose Bot Ammount</h1>
//                 <form
//                   className="bot-difficulty-form"
//                   style={{ fontSize: "16px" }}
//                 >
//                   <label>
//                     <input
//                       onChange={handleBotAmmount}
//                       type="radio"
//                       name="ammount"
//                       value="single"
//                     />{" "}
//                     One Bot
//                   </label>
//                   <br />
//                   <label>
//                     <input
//                       onChange={handleBotAmmount}
//                       type="radio"
//                       name="ammount"
//                       value="twoBots"
//                     />{" "}
//                     Two Bots
//                   </label>
//                   <br />
//                   <label>
//                     <input
//                       onChange={handleBotAmmount}
//                       type="radio"
//                       name="ammount"
//                       value="threeBots"
//                     />{" "}
//                     Three Bots
//                   </label>
//                 </form>
//               </div>
//             )}
//             {!isSoloPlay && (
//               <div className="lobby'list">
//                 <h1 className="multiplayer-heading">Available Rooms</h1>
//                 {rooms.length > 0 ? (
//                   <div className="rooms-table-container">
//                     <table className="rooms-table">
//                       <thead>
//                         <tr>
//                           <th>Room Name</th>
//                           <th>Players</th>
//                           <th>GameMode</th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {rooms.map((room) => (
//                           <tr key={room.id}>
//                             <td>{room.name}</td>
//                             <td>
//                               {room.players}/{room.maxPlayers}
//                             </td>
//                             <td>{room.gamemode}</td>
//                             <td>
//                               <button
//                                 onClick={() => {
//                                   joinRooms(room.id);
//                                   playSound();
//                                 }}
//                                 className="join-button"
//                               >
//                                 Join Room
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <p>No rooms available. Create one to get started!</p>
//                 )}
//               </div>
//             )}
//           </div>
//           <audio
//             id="lobbyClickSound"
//             src="/DominoesClick.wav"
//             preload="auto"
//           ></audio>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Lobby;


// // export default Lobby;
// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { v4 as uuidv4 } from "uuid"; // Install this library if not already done: npm install uuid
// import "./lobby.css";

// const Lobby = () => {
//   const [socket, setSocket] = useState(null);
//   const [uuid, setUuid] = useState(uuidv4()); // Generate a unique UUID for the client

//   const handleMultiplayerClick = () => {
//     // Initialize WebSocket connection to the server
//     const newSocket = io("http://localhost:5000");
//     setSocket(newSocket);

//     // Log connection status
//     newSocket.on("connect", () => {
//       console.log("Connected to WebSocket server:", newSocket.id);
//       // Send the UUID to the server
//       newSocket.emit("setUuid", uuid);
//     });

//     // Listen for messages from the server
//     newSocket.on("serverToClient", (data) => {
//       console.log("Message from server:", data);
//       alert(`Message from ${data.uuid}: ${data.message}`);
//     });

//     // Clean up WebSocket connection on disconnection
//     return () => {
//       newSocket.disconnect();
//       console.log("WebSocket disconnected");
//     };
//   };

//   const handleHello = () => {
//     if (socket) {
//       // Emit a message to other clients
//       socket.emit("clientToClient", { uuid, message: "Hello from another client!" });
//     } else {
//       alert("Please connect to Multiplayer first!");
//     }
//   };

//   useEffect(() => {
//     // Clean up WebSocket connection when the component unmounts
//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, [socket]);

//   return (
//     <div className="selection-box">
//       <h1>Lobby Page</h1>
//       <button
//         className="createRoom_button"
//         onClick={handleMultiplayerClick}
//       >
//         Multiplayer
//       </button>
//       <button
//         className="helloButton"
//         onClick={handleHello}
//       >
//         Hello
//       </button>
//     </div>
//   );
// };

// export default Lobby;
import React, { useState, useEffect } from "react";
import "./lobby.css";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const Lobby = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [roomMode, setRoomMode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLobby, setShowLobby] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [showInstruction, setInstruction] = useState(true);
  const [isSoloPlay, setIsSoloPlay] = useState(true);
  const [soloGameMode, setSoloGameMode] = useState("");
  const [botDifficulty, setBotDifficulty] = useState("");
  const [botAmount, setBotAmount] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("updateRooms", (rooms) => {
      setRooms(rooms);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSoloGameMode = (event) => setSoloGameMode(event.target.value);
  const handleBotDifficulty = (event) => setBotDifficulty(event.target.value);
  const handleBotAmount = (event) => setBotAmount(event.target.value);

  const handleMultiplayerGameMode = (event) => setRoomMode(event.target.value);

  const handleDisplay = (solo) => {
    setIsSoloPlay(solo);
    setShowLobby(true);
    setShowOptions(false);
    setErrorMessage("");
    setInstruction(false);
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim() === "") {
      setErrorMessage("Room name cannot be empty.");
      return;
    }
    if (roomMode === "") {
      setErrorMessage("Please select a game mode.");
      return;
    }

    const newRoom = {
      id: Date.now(),
      name: newRoomName,
      gamemode: roomMode,
      players: 1,
      maxPlayers: 4,
    };

    socket.emit("createRoom", newRoom);
    navigate(`/multiplayer/${newRoom.id}`, { state: { room: newRoom } });
  };

  const handleJoinRoom = (roomId) => {
    socket.emit("joinRoom", { roomId, userId: socket.id });
    navigate(`/multiplayer/${roomId}`, { state: { roomId } });
  };

  return (
    <div className="selection-box" style={{ display: "block", width: "100%" }}>
      {showInstruction && (
        <p className="instruction-message">
          Choose between playing clever bots in solo play or
          <br />
          play with friends by creating a lobby!
        </p>
      )}
      {showOptions && (
        <div className="options-container">
          <button
            className="createRoom_button"
            onClick={() => handleDisplay(true)}
          >
            Solo Play
          </button>
          <button
            className="createRoom_button"
            onClick={() => handleDisplay(false)}
          >
            Multiplayer
          </button>
        </div>
      )}
      {showLobby && (
        <div className="lobby-container">
          {isSoloPlay ? (
            <div className="solo_play">
              <h2>Solo Play Settings</h2>
              <label>
                Game Mode:
                <select onChange={handleSoloGameMode}>
                  <option value="">Select</option>
                  <option value="classic">Classic</option>
                  <option value="allFives">All Fives</option>
                  <option value="drawDominoes">Draw Dominoes</option>
                </select>
              </label>
              <label>
                Bot Difficulty:
                <select onChange={handleBotDifficulty}>
                  <option value="">Select</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
              <label>
                Number of Bots:
                <select onChange={handleBotAmount}>
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </label>
              <button
                onClick={() =>
                  navigate("/game", {
                    state: { gameMode: soloGameMode, botDifficulty, botAmount },
                  })
                }
                disabled={!soloGameMode || !botDifficulty || !botAmount}
              >
                Start Game
              </button>
            </div>
          ) : (
            <div className="create_lobby">
              <h2>Create Multiplayer Lobby</h2>
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Enter Room Name"
              />
              <label>
                Game Mode:
                <select onChange={handleMultiplayerGameMode}>
                  <option value="">Select</option>
                  <option value="classic">Classic</option>
                  <option value="allFives">All Fives</option>
                  <option value="drawDominoes">Draw Dominoes</option>
                </select>
              </label>
              <button onClick={handleCreateRoom}>Create Room</button>
              <h3>Available Rooms</h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Players</th>
                    <th>Game Mode</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td>{room.name}</td>
                      <td>
                        {room.players}/{room.maxPlayers}
                      </td>
                      <td>{room.gamemode}</td>
                      <td>
                        <button onClick={() => handleJoinRoom(room.id)}>
                          Join
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Lobby;
