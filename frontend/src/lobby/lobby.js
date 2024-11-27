// // import React, { useState, useEffect } from "react";
// // import "./lobby.css";
// // import { useNavigate } from "react-router-dom";
// // import io from "socket.io-client";

// // const Lobby = () => {
// //   const navigate = useNavigate();

// //   // State variables
// //   const [socket, setSocket] = useState(null);
// //   const [clientId, setClientId] = useState(null);
// //   const [rooms, setRooms] = useState([]);
// //   const [newRoomName, setNewRoomName] = useState("");
// //   const [roomMode, setRoomMode] = useState("");
// //   const [errorMessage, setErrorMessage] = useState("");
// //   const [showLobby, setShowLobby] = useState(false);
// //   const [showOptions, setShowOptions] = useState(true);
// //   const [showInstruction, setInstruction] = useState(true);
// //   const [isSoloPlay, setIsSoloPlay] = useState(true);
// //   const [botdifficulty, setBotlevel] = useState("");
// //   const [gameMode, setGameMode] = useState("");
// //   const [botAmmount, setBotAmmount] = useState("");

// //   // Play sound
// //   const playSound = () => {
// //     const audio = document.getElementById("lobbyClickSound");
// //     if (audio) {
// //       audio.play();
// //     }
// //   };

// //   // Initialize WebSocket connection on component mount
// //   useEffect(() => {
// //     const newSocket = io("http://localhost:5000");
// //     setSocket(newSocket);

// //     // Handle server's payload with client ID
// //     newSocket.on("connectPayload", (payload) => {
// //       console.log("Received payload from server:", payload);
// //       setClientId(payload.clientId);
// //     });

// //     // Clean up on component unmount
// //     return () => {
// //       newSocket.disconnect();
// //       console.log("WebSocket connection closed");
// //     };
// //   }, []);

// //   // UI Interaction Handlers
// //   const handleDifficultyChange = (event) => setBotlevel(event.target.value);
// //   const handleGameMode = (event) => {
// //     setGameMode(event.target.value);
// //     setRoomMode(event.target.value);
// //   };
// //   const handleBotAmmount = (event) => setBotAmmount(event.target.value);

// //   const handleDisplay = (solo) => {
// //     setIsSoloPlay(solo);
// //     setShowLobby(true);
// //     setShowOptions(false);
// //     setErrorMessage("");
// //     setInstruction(false);
// //   };

// //   // Fetch Rooms (placeholder for future backend integration)
// //   const fetchRooms = async () => {
// //     const fetchedRooms = []; // Replace with actual API response
// //     setRooms(fetchedRooms);
// //   };

// //   // Room Creation
// //   const handleCreateRoom = () => {
// //     if (newRoomName.trim() === "") {
// //       setErrorMessage("Room name cannot be empty.");
// //       return;
// //     }

// //     const newRoom = {
// //       id: rooms.length + 1,
// //       name: newRoomName,
// //       gamemode: "classic",
// //       players: 1,
// //       maxPlayers: 4,
// //     };
// //     setRooms([...rooms, newRoom]);
// //     setNewRoomName("");
// //     setErrorMessage("");
// //   };

// //   // Join Room
// //   const joinRooms = (roomId) => {
// //     const room = rooms.find((room) => room.id === roomId);
// //     if (room) {
// //       if (room.players < room.maxPlayers) {
// //         setRooms((prevRooms) =>
// //           prevRooms.map((r) =>
// //             r.id === roomId ? { ...r, players: r.players + 1 } : r
// //           )
// //         );
// //         playSound();
// //         navigate("/multiplayer", {
// //           state: {
// //             roomId: room.id,
// //             roomName: room.name,
// //             gameMode: room.gamemode,
// //           },
// //         });
// //       } else {
// //         alert("Room is full.");
// //       }
// //     }
// //   };

// //   return (
// //     <div className="selection-box" style={{ display: "block", width: "100%" }}>
// //       {showInstruction && (
// //         <p className="instruction-message">
// //           Choose between playing clever bots in solo play or
// //           <br />
// //           play with friends by creating a lobby!
// //         </p>
// //       )}
// //       {showOptions && (
// //         <div className="options-container">
// //           <button
// //             className="createRoom_button"
// //             onClick={() => {
// //               handleDisplay(true);
// //               playSound();
// //             }}
// //           >
// //             Solo Play
// //           </button>
// //           <button
// //             className="createRoom_button"
// //             onClick={() => {
// //               playSound();
// //               handleDisplay(false);
// //             }}
// //           >
// //             Multiplayer
// //           </button>
// //         </div>
// //       )}
// //       {showLobby && (
// //         <div className="lobby-container">
// //           <div className="left-column">
// //             <p
// //               className="back-button"
// //               onClick={() => {
// //                 setShowLobby(false);
// //                 setShowOptions(true);
// //                 setInstruction(true);
// //               }}
// //             >
// //               Back
// //             </p>
// //             {isSoloPlay && (
// //               <div className="solo_play">
// //                 <button
// //                   className="start_button"
// //                   onClick={() => {
// //                     handleCreateRoom();
// //                     playSound();
// //                     navigate("/game", {
// //                       state: {
// //                         gameMode: gameMode,
// //                         bot: botdifficulty,
// //                         botNum: botAmmount,
// //                       },
// //                     });
// //                   }}
// //                   disabled={!gameMode || !botdifficulty}
// //                 >
// //                   Start Game
// //                 </button>
// //               </div>
// //             )}
// //             {!isSoloPlay && (
// //               <div className="create_lobby">
// //                 <h2>Create Lobby</h2>
// //                 <input
// //                   type="text"
// //                   value={newRoomName}
// //                   onChange={(e) => setNewRoomName(e.target.value)}
// //                   placeholder="Enter Room Name"
// //                 />
// //                 <button
// //                   className="createRoom_button"
// //                   onClick={() => {
// //                     handleCreateRoom();
// //                     playSound();
// //                   }}
// //                 >
// //                   Create Room
// //                 </button>
// //                 {errorMessage && <p className="error">{errorMessage}</p>}
// //               </div>
// //             )}
// //           </div>
// //           <div className="right-column">
// //             {!isSoloPlay && (
// //               <div className="rooms-list">
// //                 <h1>Available Rooms</h1>
// //                 {rooms.length > 0 ? (
// //                   <table className="rooms-table">
// //                     <thead>
// //                       <tr>
// //                         <th>Room Name</th>
// //                         <th>Players</th>
// //                         <th>GameMode</th>
// //                         <th>Action</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {rooms.map((room) => (
// //                         <tr key={room.id}>
// //                           <td>{room.name}</td>
// //                           <td>
// //                             {room.players}/{room.maxPlayers}
// //                           </td>
// //                           <td>{room.gamemode}</td>
// //                           <td>
// //                             <button
// //                               onClick={() => {
// //                                 joinRooms(room.id);
// //                                 playSound();
// //                               }}
// //                               className="join-button"
// //                             >
// //                               Join Room
// //                             </button>
// //                           </td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </table>
// //                 ) : (
// //                   <p>No rooms available. Create one to get started!</p>
// //                 )}
// //               </div>
// //             )}
// //           </div>
// //           <audio
// //             id="lobbyClickSound"
// //             src="/DominoesClick.wav"
// //             preload="auto"
// //           ></audio>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Lobby;


// // // export default Lobby;
// // // import React, { useEffect, useState } from "react";
// // // import { io } from "socket.io-client";
// // // import { v4 as uuidv4 } from "uuid"; // Install this library if not already done: npm install uuid
// // // import "./lobby.css";

// // // const Lobby = () => {
// // //   const [socket, setSocket] = useState(null);
// // //   const [uuid, setUuid] = useState(uuidv4()); // Generate a unique UUID for the client

// // //   const handleMultiplayerClick = () => {
// // //     // Initialize WebSocket connection to the server
// // //     const newSocket = io("http://localhost:5000");
// // //     setSocket(newSocket);

// // //     // Log connection status
// // //     newSocket.on("connect", () => {
// // //       console.log("Connected to WebSocket server:", newSocket.id);
// // //       // Send the UUID to the server
// // //       newSocket.emit("setUuid", uuid);
// // //     });

// // //     // Listen for messages from the server
// // //     newSocket.on("serverToClient", (data) => {
// // //       console.log("Message from server:", data);
// // //       alert(`Message from ${data.uuid}: ${data.message}`);
// // //     });

// // //     // Clean up WebSocket connection on disconnection
// // //     return () => {
// // //       newSocket.disconnect();
// // //       console.log("WebSocket disconnected");
// // //     };
// // //   };

// // //   const handleHello = () => {
// // //     if (socket) {
// // //       // Emit a message to other clients
// // //       socket.emit("clientToClient", { uuid, message: "Hello from another client!" });
// // //     } else {
// // //       alert("Please connect to Multiplayer first!");
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     // Clean up WebSocket connection when the component unmounts
// // //     return () => {
// // //       if (socket) {
// // //         socket.disconnect();
// // //       }
// // //     };
// // //   }, [socket]);

// // //   return (
// // //     <div className="selection-box">
// // //       <h1>Lobby Page</h1>
// // //       <button
// // //         className="createRoom_button"
// // //         onClick={handleMultiplayerClick}
// // //       >
// // //         Multiplayer
// // //       </button>
// // //       <button
// // //         className="helloButton"
// // //         onClick={handleHello}
// // //       >
// // //         Hello
// // //       </button>
// // //     </div>
// // //   );
// // // };

// // // export default Lobby;
// // // import React, { useState, useEffect } from "react";
// // // import "./lobby.css";
// // // import { useNavigate } from "react-router-dom";
// // // import { io } from "socket.io-client";

// // // const Lobby = () => {
// // //   const navigate = useNavigate();
// // //   const [socket, setSocket] = useState(null);
// // //   const [rooms, setRooms] = useState([]);
// // //   const [newRoomName, setNewRoomName] = useState("");
// // //   const [roomMode, setRoomMode] = useState("");
// // //   const [errorMessage, setErrorMessage] = useState("");
// // //   const [showLobby, setShowLobby] = useState(false);
// // //   const [showOptions, setShowOptions] = useState(true);
// // //   const [showInstruction, setInstruction] = useState(true);
// // //   const [isSoloPlay, setIsSoloPlay] = useState(true);
// // //   const [soloGameMode, setSoloGameMode] = useState("");
// // //   const [botDifficulty, setBotDifficulty] = useState("");
// // //   const [botAmount, setBotAmount] = useState("");

// // //   useEffect(() => {
// // //     const newSocket = io("http://localhost:5000");
// // //     setSocket(newSocket);

// // //     newSocket.on("updateRooms", (rooms) => {
// // //       setRooms(rooms);
// // //     });

// // //     return () => {
// // //       newSocket.disconnect();
// // //     };
// // //   }, []);

// // //   const handleSoloGameMode = (event) => setSoloGameMode(event.target.value);
// // //   const handleBotDifficulty = (event) => setBotDifficulty(event.target.value);
// // //   const handleBotAmount = (event) => setBotAmount(event.target.value);

// // //   const handleMultiplayerGameMode = (event) => setRoomMode(event.target.value);

// // //   const handleDisplay = (solo) => {
// // //     setIsSoloPlay(solo);
// // //     setShowLobby(true);
// // //     setShowOptions(false);
// // //     setErrorMessage("");
// // //     setInstruction(false);
// // //   };

// // //   const handleCreateRoom = () => {
// // //     if (newRoomName.trim() === "") {
// // //       setErrorMessage("Room name cannot be empty.");
// // //       return;
// // //     }
// // //     if (roomMode === "") {
// // //       setErrorMessage("Please select a game mode.");
// // //       return;
// // //     }

// // //     const newRoom = {
// // //       id: Date.now(),
// // //       name: newRoomName,
// // //       gamemode: roomMode,
// // //       players: 1,
// // //       maxPlayers: 4,
// // //     };

// // //     socket.emit("createRoom", newRoom);
// // //     navigate(`/multiplayer/${newRoom.id}`, { state: { room: newRoom } });
// // //   };

// // //   const handleJoinRoom = (roomId) => {
// // //     socket.emit("joinRoom", { roomId, userId: socket.id });
// // //     navigate(`/multiplayer/${roomId}`, { state: { roomId } });
// // //   };

// // //   return (
// // //     <div className="selection-box" style={{ display: "block", width: "100%" }}>
// // //       {showInstruction && (
// // //         <p className="instruction-message">
// // //           Choose between playing clever bots in solo play or
// // //           <br />
// // //           play with friends by creating a lobby!
// // //         </p>
// // //       )}
// // //       {showOptions && (
// // //         <div className="options-container">
// // //           <button
// // //             className="createRoom_button"
// // //             onClick={() => handleDisplay(true)}
// // //           >
// // //             Solo Play
// // //           </button>
// // //           <button
// // //             className="createRoom_button"
// // //             onClick={() => handleDisplay(false)}
// // //           >
// // //             Multiplayer
// // //           </button>
// // //         </div>
// // //       )}
// // //       {showLobby && (
// // //         <div className="lobby-container">
// // //           {isSoloPlay ? (
// // //             <div className="solo_play">
// // //               <h2>Solo Play Settings</h2>
// // //               <label>
// // //                 Game Mode:
// // //                 <select onChange={handleSoloGameMode}>
// // //                   <option value="">Select</option>
// // //                   <option value="classic">Classic</option>
// // //                   <option value="allFives">All Fives</option>
// // //                   <option value="drawDominoes">Draw Dominoes</option>
// // //                 </select>
// // //               </label>
// // //               <label>
// // //                 Bot Difficulty:
// // //                 <select onChange={handleBotDifficulty}>
// // //                   <option value="">Select</option>
// // //                   <option value="easy">Easy</option>
// // //                   <option value="medium">Medium</option>
// // //                   <option value="hard">Hard</option>
// // //                 </select>
// // //               </label>
// // //               <label>
// // //                 Number of Bots:
// // //                 <select onChange={handleBotAmount}>
// // //                   <option value="">Select</option>
// // //                   <option value="1">1</option>
// // //                   <option value="2">2</option>
// // //                   <option value="3">3</option>
// // //                 </select>
// // //               </label>
// // //               <button
// // //                 onClick={() =>
// // //                   navigate("/game", {
// // //                     state: { gameMode: soloGameMode, botDifficulty, botAmount },
// // //                   })
// // //                 }
// // //                 disabled={!soloGameMode || !botDifficulty || !botAmount}
// // //               >
// // //                 Start Game
// // //               </button>
// // //             </div>
// // //           ) : (
// // //             <div className="create_lobby">
// // //               <h2>Create Multiplayer Lobby</h2>
// // //               <input
// // //                 type="text"
// // //                 value={newRoomName}
// // //                 onChange={(e) => setNewRoomName(e.target.value)}
// // //                 placeholder="Enter Room Name"
// // //               />
// // //               <label>
// // //                 Game Mode:
// // //                 <select onChange={handleMultiplayerGameMode}>
// // //                   <option value="">Select</option>
// // //                   <option value="classic">Classic</option>
// // //                   <option value="allFives">All Fives</option>
// // //                   <option value="drawDominoes">Draw Dominoes</option>
// // //                 </select>
// // //               </label>
// // //               <button onClick={handleCreateRoom}>Create Room</button>
// // //               <h3>Available Rooms</h3>
// // //               <table>
// // //                 <thead>
// // //                   <tr>
// // //                     <th>Name</th>
// // //                     <th>Players</th>
// // //                     <th>Game Mode</th>
// // //                     <th>Action</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {rooms.map((room) => (
// // //                     <tr key={room.id}>
// // //                       <td>{room.name}</td>
// // //                       <td>
// // //                         {room.players}/{room.maxPlayers}
// // //                       </td>
// // //                       <td>{room.gamemode}</td>
// // //                       <td>
// // //                         <button onClick={() => handleJoinRoom(room.id)}>
// // //                           Join
// // //                         </button>
// // //                       </td>
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </table>
// // //             </div>
// // //           )}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Lobby;
// // import React, { useState, useEffect } from "react";
// // import "./lobby.css";
// // import { useNavigate } from "react-router-dom";
// // import io from "socket.io-client";

// // let socket;

// // const Lobby = () => {
// //   const navigate = useNavigate();
// //   const [rooms, setRooms] = useState([]);
// //   const [clientId, setClientId] = useState(null);
// //   const [newRoomName, setNewRoomName] = useState("");
// //   const [errorMessage, setErrorMessage] = useState("");
// //   const [showLobby, setShowLobby] = useState(false);
// //   const [showOptions, setShowOptions] = useState(true);

// //   useEffect(() => {
// //     if (!socket) {
// //       socket = io("http://localhost:5000");
// //       console.log("WebSocket connection established");

// //       socket.on("connectPayload", (payload) => {
// //         setClientId(payload.clientId);
// //         console.log("Received client ID:", payload.clientId);
// //       });

// //       socket.on("roomList", (updatedRooms) => {
// //         setRooms(updatedRooms);
// //         console.log("Updated rooms:", updatedRooms);
// //       });
// //     }
// //   }, []);

// //   const handleCreateRoom = () => {
// //     if (!newRoomName.trim()) {
// //       setErrorMessage("Room name cannot be empty.");
// //       return;
// //     }

// //     const room = {
// //       name: newRoomName,
// //       gamemode: "classic", // Default game mode
// //       maxPlayers: 4,
// //     };

// //     socket.emit("createRoom", room); // Notify server about new room
// //     setNewRoomName("");
// //     setErrorMessage("");
// //   };

// //   const joinRooms = (roomId) => {
// //     socket.emit("joinRoom", roomId); // Notify server about joining the room
// //     const room = rooms.find((r) => r.id === roomId);
// //     if (room) {
// //       navigate("/multiplayer", {
// //         state: {
// //           roomId: room.id,
// //           roomName: room.name,
// //           gameMode: room.gamemode,
// //         },
// //       });
// //     }
// //   };

// //   return (
// //     <div className="selection-box" style={{ display: "block", width: "100%" }}>
// //       {showOptions && (
// //         <div className="options-container">
// //           <button
// //             className="createRoom_button"
// //             onClick={() => setShowLobby(true)}
// //           >
// //             Multiplayer
// //           </button>
// //         </div>
// //       )}
// //       {showLobby && (
// //         <div className="lobby-container">
// //           <div className="create-lobby">
// //             <h2>Create Lobby</h2>
// //             <input
// //               type="text"
// //               value={newRoomName}
// //               onChange={(e) => setNewRoomName(e.target.value)}
// //               placeholder="Enter Room Name"
// //             />
// //             <button className="createRoom_button" onClick={handleCreateRoom}>
// //               Create Room
// //             </button>
// //             {errorMessage && <p className="error">{errorMessage}</p>}
// //           </div>
// //           <div className="rooms-list">
// //             <h2>Available Rooms</h2>
// //             {rooms.length > 0 ? (
// //               <ul>
// //                 {rooms.map((room) => (
// //                   <li key={room.id}>
// //                     <p>
// //                       {room.name} ({room.players}/{room.maxPlayers})
// //                     </p>
// //                     <button onClick={() => joinRooms(room.id)}>Join</button>
// //                   </li>
// //                 ))}
// //               </ul>
// //             ) : (
// //               <p>No rooms available. Create one to get started!</p>
// //             )}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Lobby;
// import React, { useState, useEffect } from "react";
// import "./lobby.css";
// import { useNavigate } from "react-router-dom";
// import io from "socket.io-client";

// let socket;

// const Lobby = () => {
//   const navigate = useNavigate();
//   const [rooms, setRooms] = useState([]);
//   const [clientId, setClientId] = useState(null);
//   const [newRoomName, setNewRoomName] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showLobby, setShowLobby] = useState(false);
//   const [showOptions, setShowOptions] = useState(true);
//   const [showInstruction, setShowInstruction] = useState(true);
//   const [isSoloPlay, setIsSoloPlay] = useState(false);
//   const [botDifficulty, setBotDifficulty] = useState("");
//   const [gameMode, setGameMode] = useState("");
//   const [botAmount, setBotAmount] = useState("");

//   useEffect(() => {
//     if (!socket) {
//       socket = io("http://localhost:5000");
//       console.log("WebSocket connection established");

//       socket.on("connectPayload", (payload) => {
//         setClientId(payload.clientId);
//         console.log("Received client ID:", payload.clientId);
//       });

//       socket.on("roomList", (updatedRooms) => {
//         setRooms(updatedRooms);
//         console.log("Updated rooms:", updatedRooms);
//       });
//     }
//   }, []);

//   const handleCreateRoom = () => {
//     if (!newRoomName.trim()) {
//       setErrorMessage("Room name cannot be empty.");
//       return;
//     }

//     const room = {
//       name: newRoomName,
//       gamemode: "classic", // Default game mode
//       maxPlayers: 4,
//     };

//     socket.emit("createRoom", room); // Notify server about new room
//     setNewRoomName("");
//     setErrorMessage("");
//   };

//   const joinRooms = (roomId) => {
//     socket.emit("joinRoom", roomId); // Notify server about joining the room
//     const room = rooms.find((r) => r.id === roomId);
//     if (room) {
//       navigate("/multiplayer", {
//         state: {
//           roomId: room.id,
//           roomName: room.name,
//           gameMode: room.gamemode,
//         },
//       });
//     }
//   };

//   const handleStartSoloGame = () => {
//     if (!gameMode || !botDifficulty || !botAmount) {
//       setErrorMessage("Please select all options before starting.");
//       return;
//     }

//     navigate("/game", {
//       state: {
//         gameMode,
//         botDifficulty,
//         botAmount,
//       },
//     });
//   };

//   return (
//     <div className="selection-box" style={{ display: "block", width: "100%" }}>
//       {showInstruction && (
//         <p className="instruction-message">
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
//               setIsSoloPlay(true);
//               setShowLobby(true);
//               setShowOptions(false);
//               setErrorMessage("");
//               setShowInstruction(false);
//             }}
//           >
//             Solo Play
//           </button>
//           <button
//             className="createRoom_button"
//             onClick={() => {
//               setIsSoloPlay(false);
//               setShowLobby(true);
//               setShowOptions(false);
//               setErrorMessage("");
//               setShowInstruction(false);
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
//                 setShowInstruction(true);
//               }}
//             >
//               Back
//             </p>
//             {isSoloPlay && (
//               <div className="solo-options">
//                 <h2>Solo Play Options</h2>
//                 <div className="dropdowns">
//                   <label>
//                     Game Mode:
//                     <select
//                       value={gameMode}
//                       onChange={(e) => setGameMode(e.target.value)}
//                     >
//                       <option value="">Select</option>
//                       <option value="classic">Classic</option>
//                       <option value="allFives">All Fives</option>
//                     </select>
//                   </label>
//                   <label>
//                     Bot Difficulty:
//                     <select
//                       value={botDifficulty}
//                       onChange={(e) => setBotDifficulty(e.target.value)}
//                     >
//                       <option value="">Select</option>
//                       <option value="basic">Basic</option>
//                       <option value="intermediate">Intermediate</option>
//                       <option value="advanced">Advanced</option>
//                     </select>
//                   </label>
//                   <label>
//                     Number of Bots:
//                     <select
//                       value={botAmount}
//                       onChange={(e) => setBotAmount(e.target.value)}
//                     >
//                       <option value="">Select</option>
//                       <option value="1">1 Bot</option>
//                       <option value="2">2 Bots</option>
//                       <option value="3">3 Bots</option>
//                     </select>
//                   </label>
//                 </div>
//                 <button className="start_button" onClick={handleStartSoloGame}>
//                   Start Game
//                 </button>
//                 {errorMessage && <p className="error">{errorMessage}</p>}
//               </div>
//             )}
//             {!isSoloPlay && (
//               <div className="create-lobby">
//                 <h2>Create Lobby</h2>
//                 <input
//                   type="text"
//                   value={newRoomName}
//                   onChange={(e) => setNewRoomName(e.target.value)}
//                   placeholder="Enter Room Name"
//                 />
//                 <button className="createRoom_button" onClick={handleCreateRoom}>
//                   Create Room
//                 </button>
//                 {errorMessage && <p className="error">{errorMessage}</p>}
//               </div>
//             )}
//           </div>
//           <div className="right-column">
//             {!isSoloPlay && (
//               <div className="rooms-list">
//                 <h2>Available Rooms</h2>
//                 {rooms.length > 0 ? (
//                   <ul>
//                     {rooms.map((room) => (
//                       <li key={room.id}>
//                         <p>
//                           {room.name} ({room.players}/{room.maxPlayers})
//                         </p>
//                         <button className="join-button" onClick={() => joinRooms(room.id)}>Join</button>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No rooms available. Create one to get started!</p>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Lobby;
import React, { useState, useEffect } from "react";
import "./lobby.css";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

let socket;

const Lobby = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [clientId, setClientId] = useState(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLobby, setShowLobby] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);
  const [isSoloPlay, setIsSoloPlay] = useState(false);
  const [botDifficulty, setBotDifficulty] = useState("");
  const [gameMode, setGameMode] = useState("");
  const [botAmount, setBotAmount] = useState("");

  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:5000");
      console.log("WebSocket connection established");

      socket.on("connectPayload", (payload) => {
        setClientId(payload.clientId);
        console.log("Received client ID:", payload.clientId);
      });

      socket.on("roomList", (updatedRooms) => {
        setRooms(updatedRooms);
        console.log("Updated rooms:", updatedRooms);
      });
    }
  }, []);

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) {
      setErrorMessage("Room name cannot be empty.");
      return;
    }

    const room = {
      name: newRoomName,
      gamemode: "classic", // Default game mode
      maxPlayers: 4,
    };

    socket.emit("createRoom", room); // Notify server about new room
    setNewRoomName("");
    setErrorMessage("");
  };

  const joinRooms = (roomId) => {
    socket.emit("joinRoom", roomId); // Notify server about joining the room
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      navigate("/multiplayer", {
        state: {
          roomId: room.id,
          roomName: room.name,
          gameMode: room.gamemode,
        },
      });
    }
  };

  const handleStartSoloGame = () => {
    if (!gameMode || !botDifficulty || !botAmount) {
      setErrorMessage("Please select all options before starting.");
      return;
    }

    navigate("/game", {
      state: {
        gameMode,
        botDifficulty,
        botAmount,
      },
    });
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
            onClick={() => {
              setIsSoloPlay(true);
              setShowLobby(true);
              setShowOptions(false);
              setErrorMessage("");
              setShowInstruction(false);
            }}
          >
            Solo Play
          </button>
          <button
            className="createRoom_button"
            onClick={() => {
              setIsSoloPlay(false);
              setShowLobby(true);
              setShowOptions(false);
              setErrorMessage("");
              setShowInstruction(false);
            }}
          >
            Multiplayer
          </button>
        </div>
      )}
      {showLobby && (
        <div className="lobby-container">
          <div className="left-column">
            <p
              className="back-button"
              onClick={() => {
                setShowLobby(false);
                setShowOptions(true);
                setShowInstruction(true);
              }}
            >
              Back
            </p>
            {!isSoloPlay && (
              <div className="create-lobby">
                <h2>Create Lobby</h2>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter Room Name"
                />
                <button className="createRoom_button" onClick={handleCreateRoom}>
                  Create Room
                </button>
                {errorMessage && <p className="error">{errorMessage}</p>}
              </div>
            )}
          </div>
          <div className="right-column">
            {isSoloPlay && (
              <div className="solo-options">
                <h2>Solo Play Options</h2>
                <div className="dropdowns">
                  <label>
                    Game Mode:
                    <select
                      value={gameMode}
                      onChange={(e) => setGameMode(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="classic">Classic</option>
                      <option value="allFives">All Fives</option>
                      <option value="drawDominoes">Draw Dominoes</option>
                    </select>
                  </label>
                  <label>
                    Bot Difficulty:
                    <select
                      value={botDifficulty}
                      onChange={(e) => setBotDifficulty(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="basic">Basic</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </label>
                  <label>
                    Number of Bots:
                    <select
                      value={botAmount}
                      onChange={(e) => setBotAmount(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="1">1 Bot</option>
                      <option value="2">2 Bots</option>
                      <option value="3">3 Bots</option>
                    </select>
                  </label>
                </div>
                <button className="start_button" onClick={handleStartSoloGame}>
                  Start Game
                </button>
                {errorMessage && <p className="error">{errorMessage}</p>}
              </div>
            )}
            {!isSoloPlay && (
              <div className="rooms-list">
                <h2>Available Rooms</h2>
                {rooms.length > 0 ? (
                  <ul>
                    {rooms.map((room) => (
                      <li key={room.id}>
                        <p>
                          {room.name} ({room.players}/{room.maxPlayers})
                        </p>
                        <button className="join-button" onClick={() => joinRooms(room.id)}>Join</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No rooms available. Create one to get started!</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Lobby;