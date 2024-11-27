import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    // Initialize the socket only once
    socket = io("http://localhost:5000", {
      reconnection: true, // Enable reconnection if needed
    });
    console.log("Socket.IO connection established");
  }
  return socket;
};
