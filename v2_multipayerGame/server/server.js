const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socketio(server);

var board = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

var turn = 1;

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

io.on("connection", (sock) => {
  console.log("A user is connected!");

  // send the initial board state to every client
  io.emit("message", board, turn);

  // If we recieve the board state from a client
  sock.on("message", (board, turn) => {
  	sock.broadcast.emit("message", board, turn);
    // Sending the board state to every client who is connected
  });

  sock.on("end", () => {
    io.emit("end");
  });

  sock.on("reload", ()=>{
  	io.emit("reload");
  })

  sock.on("dissconnect", () => {
    console.log("A user is disconnected");
  });
});

server.on("error", (err) => {
  console.log("Some error occured!", err);
});

server.listen(3000, () => {
  console.log("Application is running on port 3000...");
});
