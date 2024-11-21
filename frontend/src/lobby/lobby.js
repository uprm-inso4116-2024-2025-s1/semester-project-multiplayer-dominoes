import React, { useState, useEffect } from "react";
import "./lobby.css";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  /*Variable added to navigate between gamestate and lobby */
  const navigate = useNavigate();
  // State to manage the list of rooms and room creation
  const [rooms, setRooms] = useState([]);
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

  const playSound = () => {
    const audio = document.getElementById("lobbyClickSound");
    if (audio) {
      audio.play();
    }
  };
  const handleDifficultyChange = (event) => {
    setBotlevel(event.target.value);
  };
  const handleGameMode = (event) => {
    setGameMode(event.target.value);
    setRoomMode(event.target.value);
  };
  const handleBotAmmount = (event) => {
    setBotAmmount(event.target.value);
  };
  const handleDisplay = (solo) => {
    setIsSoloPlay(solo);
    setShowLobby(true);
    setShowOptions(false);
    setErrorMessage("");
    setInstruction(false);
  };

  // Later Implement with the database to do a getAllRooms
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    //dummy daya for rooms
    //replace with API calls and decide which info the rooms have to show in the interface
    const fetchedRooms = [];
    //Change this to a fetchedRooms with the GET response
    setRooms(fetchedRooms);
  };
  //room creating. Missing backend post?
  const handleCreateRoom = async () => {
    if (newRoomName.trim() === "") {
      setErrorMessage("Room name cannot be empty.");
      return;
    } else if (roomMode === "") {
      setErrorMessage("Please select a game mode.");
      return;
    } else {
      setErrorMessage("");

      // Dummy post
      //Replace with response, can use stringify on the json response
      const newRoom = {
        id: rooms.length + 1,
        name: newRoomName,
        gamemode: roomMode,
        players: 1,
        maxPlayers: 4,
      };
      setRooms([...rooms, newRoom]);
      setNewRoomName(""); //Clear input if success
      setRoomMode("");
    }
  };

  //handle joining
  const joinRooms = (roomId) => {
    //handleling the update of the players count
    setRooms((prevRooms) => {
      const updatedRooms = prevRooms.map((room) => {
        if (room.id === roomId) {
          // Check if the room is not full
          if (room.players < room.maxPlayers) {
            return { ...room, players: room.players + 1 }; // Increment player count
          } else {
            alert("Room is full.");
            return room; // No change if room is full
          }
        }
        return room;
      });
      return updatedRooms;
    });
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
                    playSound();
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
                <h2 className="multiplayer-heading">Create Lobby</h2>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter Room Name"
                  className="text-box"
                />
                <div
                  className="game-mode-selection"
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    marginTop: "10px",
                  }}
                >
                  <label>
                    <input
                      type="radio"
                      name="gamemode"
                      value="classic"
                      onChange={handleGameMode}
                    />{" "}
                    Classic
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gamemode"
                      value="allFives"
                      onChange={handleGameMode}
                    />{" "}
                    All Fives
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gamemode"
                      value="drawDominoes"
                      onChange={handleGameMode}
                    />{" "}
                    Draw Dominoes
                  </label>
                </div>
                <button
                  className="createRoom_button"
                  onClick={() => {
                    handleCreateRoom();
                    playSound();
                  }}
                >
                  Create Room
                </button>
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
              <div className="lobby'list">
                <h1 className="multiplayer-heading">Available Rooms</h1>
                {rooms.length > 0 ? (
                  <div className="rooms-table-container">
                    <table className="rooms-table">
                      <thead>
                        <tr>
                          <th>Room Name</th>
                          <th>Players</th>
                          <th>GameMode</th>
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
                              <button
                                onClick={() => {
                                  joinRooms(room.id);
                                  playSound();
                                  navigate("/game", {
                                    state: {
                                      gameMode: gameMode,
                                      bot: "multiplayer",
                                    },
                                  });
                                }}
                                className="join-button"
                              >
                                Join Room
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No rooms available. Create one to get started!</p>
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
    </div>
  );
};

export default Lobby;
