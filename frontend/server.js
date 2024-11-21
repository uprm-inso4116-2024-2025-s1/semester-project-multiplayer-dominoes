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
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this to match your front-end URL
    methods: ["GET", "POST"],
  },
});

const port = 5000;

// WebSocket handling
io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Example event handling
  socket.on("joinRoom", (roomName) => {
    console.log(`${socket.id} joined room: ${roomName}`);
    socket.join(roomName); // Join the room
  });

  socket.on("playTile", (data) => {
    console.log(`Tile played by ${socket.id}:`, data);
    // Broadcast the move to all clients in the room
    io.in(data.roomName).emit("updateBoard", {
      tile: data.tile,
      direction: data.direction,
    });
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
