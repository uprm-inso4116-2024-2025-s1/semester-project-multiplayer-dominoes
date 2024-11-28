
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const port = 5000;

// Room list
const rooms = [];
// Helper function to generate unique room IDs
const generateRoomId = () => Math.random().toString(36).substr(2, 9);

// Socket.io logic
io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Handle room creation
  socket.on("createRoom", (roomData, callback) => {
    const roomId = generateRoomId();
    const newRoom = {
      id: roomId,
      name: roomData.name,
      gamemode: roomData.gamemode,
      maxPlayers: roomData.maxPlayers,
      isPrivate: roomData.isPrivate,
      players: [socket.id], // Add creator to the room
    };

    rooms.push(newRoom); // Add room to the rooms array
    console.log(`Room created: ${JSON.stringify(newRoom)}`);

    // Join the creator to the room
    socket.join(roomId);
    // Emit updated room list to all clients (excluding private rooms)
    io.emit("roomList", rooms.filter((room) => !room.isPrivate));
    // Respond to the creator with room details
    if (callback) callback(newRoom);


  });


  // Handle player joining a room
  socket.on("joinRoom", (roomId) => {
    console.log("Rooms available:", rooms);
    console.log("Room ID requested:", roomId);
  
    // Find the room by ID
    const room = rooms.find((r) => r.id === roomId);
  
    if (!room) {
      socket.emit("error", "Room does not exist.");
      return;
    }
  
    if (room.players.length >= room.maxPlayers) {
      socket.emit("error", "Room is full.");
      return;
    }
  
    // Add the player to the room
    room.players.push(socket.id);
    socket.join(roomId);
      // Broadcast updated room list (excluding private rooms for public listing)
      io.emit("roomList", rooms.filter((r) => !r.isPrivate));
    console.log(`Player ${socket.id} joined room: ${room.name}`);
  
    // Emit the joinedRoom event to the joining player
    socket.emit("joinedRoom", room);
  

  });
  

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
  
    rooms.forEach((room) => {
      const playerIndex = room.players.indexOf(socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
      }
    });
  
    // Remove empty rooms
    const nonEmptyRooms = rooms.filter((room) => room.players.length > 0);
    rooms.length = 0; // Clear and refill the array
    rooms.push(...nonEmptyRooms);
  
    // Broadcast updated room list
    io.emit("roomList", rooms.filter((room) => !room.isPrivate));
  });
  
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
