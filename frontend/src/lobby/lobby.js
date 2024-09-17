import React, { useState, useEffect } from 'react';
import './lobby.css';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {

  /*Variable added to navigate between gamestate and lobby */
  const navigate = useNavigate();
  // State to manage the list of rooms and room creation
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Later Implement with the database to do a getAllRooms
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    //dummy daya for rooms 
    //replace with API calls and decide which info the rooms have to show in the interface 
    const fetchedRooms = [
      { id: 1, name: 'Room 1', players: 2, maxPlayers: 4 },
      { id: 2, name: 'Room 2', players: 1, maxPlayers: 4 },
      { id: 3, name: 'Room 3', players: 1, maxPlayers: 4 },
      { id: 4, name: 'Room 4', players: 1, maxPlayers: 4 },
    ];
    //Change this to a fetchedRooms with the GET response 
    setRooms(fetchedRooms);
  };
  //room creating. Missing backend post?
  const handleCreateRoom = async () => {
    if (newRoomName.trim() === '') {
      setErrorMessage('Room name cannot be empty.');
      return;
    }

    // Dummy post 
    //Replace with response, can use stringify on the json response 
    const newRoom = { id: rooms.length + 1, name: newRoomName, players: 1, maxPlayers: 4 };
    setRooms([...rooms, newRoom]);
    setNewRoomName(''); //Clear input if success
  };

  //handle joining 
  const joinRooms = (roomId) => {
    //handleling the update of the players count 
    setRooms(prevRooms => {
      const updatedRooms = prevRooms.map(room => {
        if (room.id === roomId) {
          // Check if the room is not full
          if (room.players < room.maxPlayers) {
            return { ...room, players: room.players + 1 }; // Increment player count
          } else {
            alert('Room is full.');
            return room; // No change if room is full
          }
        }
        return room;
      });
      return updatedRooms;
    });
  };
  return (
  
    <div className="lobby-container">
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
        <button className="createRoom_button" onClick={handleCreateRoom}>Create Room</button>
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
                    <td>{room.players}/{room.maxPlayers}</td>
                    <td>
                      <button onClick={() => joinRooms(room.id)} className="join-button">Join Room</button>
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



export default Lobby