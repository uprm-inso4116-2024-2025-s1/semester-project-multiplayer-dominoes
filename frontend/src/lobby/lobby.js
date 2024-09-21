import React, { useState, useEffect } from 'react';
import './lobby.css';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Lobby = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSocketOpen, setIsSocketOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messageQueue, setMessageQueue] = useState([]);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const MAX_RECONNECT_ATTEMPTS = 5;

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
          console.log('WebSocket connection established.');
          setIsSocketOpen(true);
          setReconnectAttempts(0);

          // Send queued messages
          messageQueue.forEach((message) => {
            ws.send(message);
          });
          setMessageQueue([]); // Clear the queue once messages are sent
        };

        ws.onmessage = (message) => {
          console.log('Received message from server:', message.data);
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed.');
          setIsSocketOpen(false);

          // Attempt to reconnect if the WebSocket closes unexpectedly
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            setTimeout(() => {
              console.log(`Reconnecting... Attempt ${reconnectAttempts + 1}`);
              setReconnectAttempts(reconnectAttempts + 1);
              connectWebSocket(); // Try reconnecting
            }, 1000 * (reconnectAttempts + 1)); // Increase delay for each attempt
          } else {
            console.error('Max reconnection attempts reached.');
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error: ', error);
          setIsSocketOpen(false);
        };

        setSocket(ws);
      } catch (error) {
        console.error('Error initializing WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      socket?.close(); // Close the WebSocket connection when the component unmounts
    };
  }, [messageQueue, reconnectAttempts]);

  const fetchRooms = async () => {
    const fetchedRooms = [
      { id: uuidv4(), name: 'Room 1', players: 2, maxPlayers: 4 },
      { id: uuidv4(), name: 'Room 2', players: 1, maxPlayers: 4 },
    ];
    setRooms(fetchedRooms);
  };

  const handleCreateRoom = async () => {
    if (newRoomName.trim() === '') {
      setErrorMessage('Room name cannot be empty.');
      return;
    }

    const roomId = uuidv4();
    const newRoom = { id: roomId, name: newRoomName, players: 1, maxPlayers: 4 };

    setRooms([...rooms, newRoom]);

    const message = JSON.stringify({ type: 'create_room', roomId, roomName: newRoomName });

    if (isSocketOpen) {
      socket.send(message);
    } else {
      setMessageQueue([...messageQueue, message]);
    }

    setNewRoomName('');
    setErrorMessage('');
  };

  const joinRooms = (roomId) => {
    setRooms((prevRooms) => {
      const updatedRooms = prevRooms.map((room) => {
        if (room.id === roomId) {
          if (room.players < room.maxPlayers) {
            const updatedRoom = { ...room, players: room.players + 1 };

            const message = JSON.stringify({ type: 'join_room', roomId });
            if (isSocketOpen) {
              socket.send(message);
            } else {
              setMessageQueue([...messageQueue, message]);
            }

            // Navigate to the game state with the room ID in the URL
            navigate(`/game/${roomId}`);
            return updatedRoom;
          } else {
            alert('Room is full.');
            return room;
          }
        }
        return room;
      });
      return updatedRooms;
    });
  };

  return (
    <div className="lobby-container">
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
          cursor: 'pointer',
        }}
        onClick={() => navigate('/game')}
      >
        GameState
      </button>

      <div className="left-column">
        <h2 className="heading">Create Lobby</h2>
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
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>

      <div className="right-column">
        <h1 className="heading">Available Rooms</h1>
        {rooms.length > 0 ? (
          <div className="rooms-table-container">
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>Room Name</th>
                  <th>Players</th>
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
                    <td>
                      <button onClick={() => joinRooms(room.id)} className="join-button">
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
    </div>
  );
};

export default Lobby;
