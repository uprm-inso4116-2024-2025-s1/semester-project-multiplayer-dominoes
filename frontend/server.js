// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';

// const app = express();
// const port = 5000;

// // Create HTTP and WebSocket server
// const server = createServer(app);
// const players = {}; // Object to track players by socket ID
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // Allow connections from React app
//     methods: ["GET", "POST"],
//   },
// });

// app.get('/', (req, res) => {
//   res.send('WebSocket server is running!');
// });

// // Handle WebSocket connections
// io.on('connection', (socket) => {
//   console.log("A new client connected, socket ID:", socket.id);

//   // Handle new player registration
//   socket.on('newPlayer', (data) => {
//     console.log(`New client registered: ID ${socket.id}`);
//     players[socket.id] = data;
//     console.log("Current number of players:", Object.keys(players).length);
//     console.log("Players dictionary:", players);

//     // Notify all clients about updated players
//     io.emit('updatePlayers', players);
//   });

//   // Handle client disconnection
//   socket.on('disconnect', () => {
//     console.log(`Goodbye client with ID ${socket.id}`);
//     delete players[socket.id]; // Remove the player from the list
//     console.log("Current number of players:", Object.keys(players).length);

//     // Notify all clients about updated players
//     io.emit('updatePlayers', players);
//   });

//   // Handle client-to-client hello messages
//   socket.on('ClientClientHello', (data) => {
//     console.log("Client-to-client hello received:", data);
//     socket.broadcast.emit('ServerClientHello', data); // Broadcast the hello message
//   });
// });

// // Start the server
// server.listen(port, () => {
//   console.log(`WebSocket server running on http://localhost:${port}`);
// });
// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';

// const app = express();
// const server = createServer(app); // Create an HTTP server
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // Adjust this to match your front-end URL
//     methods: ["GET", "POST"],
//   },
// });

// const port = 5000;

// // WebSocket handling
// io.on("connection", (socket) => {
//   console.log(`Player connected: ${socket.id}`);

//   // Example event handling
//   socket.on("joinRoom", (roomName) => {
//     console.log(`${socket.id} joined room: ${roomName}`);
//     socket.join(roomName); // Join the room
//   });

//   socket.on("playTile", (data) => {
//     console.log(`Tile played by ${socket.id}:`, data);
//     // Broadcast the move to all clients in the room
//     io.in(data.roomName).emit("updateBoard", {
//       tile: data.tile,
//       direction: data.direction,
//     });
//   });

//   socket.on("disconnect", () => {
//     console.log(`Player disconnected: ${socket.id}`);
//   });
// });

// // Start the server
// server.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";

// const app = express();
// const server = createServer(app); // Create an HTTP server
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // Adjust this to match your front-end URL
//     methods: ["GET", "POST"],
//   },
// });

// const port = 5000;

// // WebSocket handling
// io.on("connection", (socket) => {
//   console.log(`Player connected: ${socket.id}`);

//   // Send payload with client ID upon connection
//   const payload = {
//     method: "connect",
//     clientId: socket.id,
//   };
//   socket.emit("connectPayload", payload);

//   // Example event handling for joining a room
//   socket.on("joinRoom", (roomName) => {
//     console.log(`${socket.id} joined room: ${roomName}`);
//     socket.join(roomName); // Join the room
//   });

//   // Example event handling for gameplay
//   socket.on("playTile", (data) => {
//     console.log(`Tile played by ${socket.id}:`, data);
//     // Broadcast the move to all clients in the room
//     io.in(data.roomName).emit("updateBoard", {
//       tile: data.tile,
//       direction: data.direction,
//     });
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log(`Player disconnected: ${socket.id}`);
//   });
// });

// // Start the server
// server.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

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

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Send payload with client ID upon connection
  socket.emit("connectPayload", { method: "connect", clientId: socket.id });

  // Send the current list of rooms to the newly connected player
  socket.emit("roomList", rooms);

  // Handle room creation
  socket.on("createRoom", (room) => {
    rooms.push({
      id: socket.id, // Use socket ID as room ID
      name: room.name,
      gamemode: room.gamemode,
      players: 1, // Room creator is the first player
      maxPlayers: room.maxPlayers,
    });

    console.log(`Room created: ${room.name}`);
    // Broadcast the updated room list to all clients
    io.emit("roomList", rooms);
  });

  // Handle player joining a room
  socket.on("joinRoom", (roomId) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room && room.players < room.maxPlayers) {
      room.players += 1; // Increment player count
      socket.join(roomId); // Join the room
      console.log(`${socket.id} joined room: ${room.name}`);
      io.emit("roomList", rooms); // Broadcast updated room list
    } else {
      socket.emit("error", "Room is full or does not exist.");
    }
  });

  // Handle player disconnect
  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
    // Remove player from rooms
    const index = rooms.findIndex((room) => room.id === socket.id);
    if (index !== -1) {
      rooms.splice(index, 1); // Remove the room
      io.emit("roomList", rooms); // Broadcast updated room list
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
