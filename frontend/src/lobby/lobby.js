import React, { useState, useEffect } from "react";
import "./lobby.css";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { getSocket } from "./socket.js";
const Lobby = () => {
  /*Variable added to navigate between gamestate and lobby */
  const navigate = useNavigate();

  const socket = getSocket();
  // State to manage the list of rooms and room creation
  const [rooms, setRooms] = useState([]);
  const [clientId, setClientId] = useState(null);

  const [newRoomName, setNewRoomName] = useState("");
  const [roomMode, setRoomMode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLobby, setShowLobby] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [showInstruction, setInstruction] = useState(true);
  const [isSoloPlay, setIsSoloPlay] = useState(true);
  const [botdifficulty, setBotlevel] = useState("");
  const [gameMode, setGameMode] = useState("");
  const [botAmmount, setBotAmmount] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [showPrivateJoin, setShowPrivateJoin] = useState(false);
  const [privateRoomCode, setPrivateRoomCode] = useState("");

  const playSound = () => {
    const audio = document.getElementById("lobbyClickSound");
    if (audio) {
      audio.play();
    }
  };

  const playButtonSound = () => {
    const audio = document.getElementById("buttonSound");
    if (audio) audio.play();
  };

  const playSelectionSound = () => {
    const audio = document.getElementById("selectionSound");
    if (audio) audio.play();
  };

  const handleDifficultyChange = (event) => {
    setBotlevel(event.target.value);
    playSelectionSound();
  };
  const handleGameMode = (event) => {
    setGameMode(event.target.value);
    setRoomMode(event.target.value);
    playSelectionSound();
  };
  const handleBotAmmount = (event) => {
    setBotAmmount(event.target.value);
    playSelectionSound();
  };
  const handleDisplay = (solo) => {
    setIsSoloPlay(solo);
    setShowLobby(true);
    setShowOptions(false);
    setErrorMessage("");
    setInstruction(false);
    playButtonSound();
  };

  useEffect(() => {
    const socket = getSocket();
  
    // Listen for server events
    socket.on("connectPayload", (payload) => {
      setClientId(payload.clientId);
      console.log("Client ID received:", payload.clientId);
    });
  
    socket.on("roomList", (updatedRooms) => {
      setRooms(updatedRooms);
      console.log("Updated rooms:", updatedRooms);
    });
  
    socket.on("joinedRoom", (room) => {
      console.log(`Successfully joined room: ${room.name}`);
      navigate(`/${room.id}/multiplayer`, {
        state: {
          roomId: room.id,
          roomName: room.name,
          gameMode: room.gamemode,
        },
      });
    });
  
    socket.once("error", (errorMessage) => {
      console.error("Error:", errorMessage);
      setErrorMessage(errorMessage);
    });
  
    return () => {
      socket.off("connectPayload");
      socket.off("roomList");
      socket.off("joinedRoom");
      socket.off("error");
    };
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
      isPrivate,
    };
  
    socket.emit("createRoom", room, (createdRoom) => {
      if (createdRoom) {
        setNewRoomName("");
        setErrorMessage("");
        console.log("Room created successfully:", createdRoom);
  
        navigate(`/${createdRoom.id}/multiplayer`, {
          state: {
            roomId: createdRoom.id,
            roomName: createdRoom.name,
            gameMode: createdRoom.gamemode,
          },
        });
      } else {
        setErrorMessage("Failed to create the room.");
        console.error("Room creation failed.");
      }
    });
  };
  
  const handleJoinRoom = (roomId) => {
    if (!roomId.trim()) {
      setErrorMessage("Room ID cannot be empty.");
      return;
    }
  
    console.log(`Attempting to join room with ID: ${roomId}`);
    socket.emit("joinRoom", roomId);
  
    socket.once("roomList", (updatedRooms) => {
      const room = updatedRooms.find((r) => r.id === roomId);
      if (room && room.players.includes(socket.id)) {
        console.log(`Successfully joined room: ${room.name}`);
        navigate(`/${room.id}/multiplayer`, {
          state: {
            roomId: room.id,
            roomName: room.name,
            gameMode: room.gamemode,
          },
        });
      } else {
        console.error("Failed to join room.");
        setErrorMessage("Room does not exist or is full.");
      }
    });
  
    socket.once("error", (errorMessage) => {
      console.error("Error joining room:", errorMessage);
      setErrorMessage(errorMessage);
    });
  };
  
  const handleJoinPrivateRoom = () => {
    if (!privateRoomCode.trim()) {
      setErrorMessage("Room code cannot be empty.");
      return;
    }
  
    console.log(`Attempting to join private room with code: ${privateRoomCode}`);
    handleJoinRoom(privateRoomCode); // Reuse handleJoinRoom for private rooms
  };
  
  
  return (
    <div className="selection-box" style={{ display: "block", width: "100%" }}>
      {showInstruction && (
        <p className="instruction-message">
          {" "}
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
              handleDisplay(true);
              playSound();
            }}
          >
            Solo Play
          </button>
          <button
            className="createRoom_button"
            onClick={() => {
              playSound();
              handleDisplay(false);
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
                setInstruction(true);
                playButtonSound();
              }}
            >
              Back
            </p>
            {isSoloPlay && (
              <div className="solo_play">
                <button
                  className="start_button"
                  style={{ height: "70px" }}
                  onClick={() => {
                    handleCreateRoom();
                    playButtonSound();
                    navigate("/game", {
                      state: {
                        gameMode: gameMode,
                        bot: botdifficulty,
                        botNum: botAmmount,
                      },
                    });
                  }}
                  disabled={!gameMode || !botdifficulty}
                >
                  Start Game
                </button>
              </div>
            )}
            {!isSoloPlay && (
              <div className="create_lobby">
              <h2>Create Lobby</h2>
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Enter Room Name"
                className="text-box"
              />
              <button className="createRoom_button" onClick={handleCreateRoom}>
                Create Room
              </button>
              <div className="checkbox-container">
                <label>
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                  />
                  Private Room
                </label>
              </div>
              {errorMessage && <p className="error">{errorMessage}</p>}
            </div>
            )}
          </div>

          <div className="right-column">
            {/* Options for solo players */}
            {isSoloPlay && (
              <div className="bot-selector">
                <h1 className="heading"> Choose Game Mode</h1>
                <form
                  className="bot-difficulty-form"
                  style={{ fontSize: "16px" }}
                >
                  <label>
                    <input
                      onChange={handleGameMode}
                      type="radio"
                      name="gamemode"
                      value="classic"
                    />{" "}
                    Classic
                  </label>
                  <br />
                  <label>
                    <input
                      onChange={handleGameMode}
                      type="radio"
                      name="gamemode"
                      value="allFives"
                    />{" "}
                    All fives
                  </label>
                  <br />
                  <label>
                    <input
                      onChange={handleGameMode}
                      type="radio"
                      name="gamemode"
                      value="drawDominoes"
                    />{" "}
                    Draw Dominoes
                  </label>
                </form>
                <h1 className="heading"> Choose Bot Difficulty</h1>
                <form
                  className="bot-difficulty-form"
                  style={{ fontSize: "16px" }}
                >
                  <label>
                    <input
                      onChange={handleDifficultyChange}
                      type="radio"
                      name="difficulty"
                      value="basic"
                    />{" "}
                    Basic
                  </label>
                  <br />
                  <label>
                    <input
                      onChange={handleDifficultyChange}
                      type="radio"
                      name="difficulty"
                      value="intermediate"
                    />{" "}
                    Intermediate
                  </label>
                  <br />
                  <label>
                    <input
                      onChange={handleDifficultyChange}
                      type="radio"
                      name="difficulty"
                      value="advanced"
                    />{" "}
                    Advanced
                  </label>
                </form>

                <h1 className="heading"> Choose Bot Ammount</h1>
                <form
                  className="bot-difficulty-form"
                  style={{ fontSize: "16px" }}
                >
                  <label>
                    <input
                      onChange={handleBotAmmount}
                      type="radio"
                      name="ammount"
                      value="single"
                    />{" "}
                    One Bot
                  </label>
                  <br />
                  <label>
                    <input
                      onChange={handleBotAmmount}
                      type="radio"
                      name="ammount"
                      value="twoBots"
                    />{" "}
                    Two Bots
                  </label>
                  <br />
                  <label>
                    <input
                      onChange={handleBotAmmount}
                      type="radio"
                      name="ammount"
                      value="threeBots"
                    />{" "}
                    Three Bots
                  </label>
                </form>
              </div>
            )}
{!isSoloPlay && (
  <div className="rooms-list">
    <h2>Available Rooms</h2>
    <button
      className="createRoom_button"
      onClick={() => setShowPrivateJoin((prev) => !prev)}
    >
      {showPrivateJoin ? "Back to Available Rooms" : "Join Private Room"}
    </button>

    {showPrivateJoin ? (
      <div className="private-join">
        <h3>Join Private Room</h3>
        <input
          type="text"
          value={privateRoomCode}
          onChange={(e) => setPrivateRoomCode(e.target.value)}
          placeholder="Enter Room Code"
          className="text-box"
        />
        <button
          className="join-button"
          onClick={() => handleJoinRoom(privateRoomCode)}
        >
          Join Room
        </button>
      </div>
    ) : (
      <>
        {rooms.length > 0 ? (
          <table className="rooms-table">
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Players</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rooms
                .filter((room) => !room.isPrivate) // Only show public rooms
                .map((room) => (
                  <tr key={room.id}>
                    <td>{room.name}</td>
                    <td>
                      {room.playerCount}/{room.maxPlayers}
                    </td>
                    <td>
                      <button
                        onClick={() => handleJoinRoom(room.id)}
                        className="join-button"
                      >
                        Join Room
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p>No rooms available. Create one to get started!</p>
        )}
      </>
    )}
  </div>
)}

          </div>

          <audio
            id="lobbyClickSound"
            src="/DominoesClick.wav"
            preload="auto"
          ></audio>
        </div>
      )}
      <audio id="buttonSound" src="/DominoesClick.wav" preload="auto"></audio>
      <audio id="selectionSound" src="/SelectionSound.wav" preload="auto"></audio>
    </div>
  );
};

export default Lobby;