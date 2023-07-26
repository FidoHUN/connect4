const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socketio(server);

let cantMove = [];

var currentBoard = [
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
  const userCount = io.engine.clientsCount;
  if(userCount > 2){
    sock.join("spectator");
  }else{
    sock.join("player");
  }
  console.log(userCount)
  io.to("spectator").emit("message2", currentBoard,turn);

  io.to("player").emit("checkPermission", cantMove);

  // If we recieve the board state from a client
  sock.on("message", (board, turn) => {
    currentBoard = board;
  	io.to("player").emit("message", currentBoard, turn);
    io.to("spectator").emit("message2", currentBoard,turn);
    if(sock.rooms.has("spectator")){
      turn++;
    }
    // Sending the board state to every client who is connected
    io.to("player").emit("checkPermission", cantMove);
  });
  

  sock.on("end", () => {
    io.to("player").emit("end");
  });

  sock.on("moved", (clientId) => {
    cantMove = [];
    cantMove.push(clientId);
  });

  sock.on("resetBoard", ()=>{
    currentBoard = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    io.to("player").emit("reloadPlayer");
    io.to("spectator").emit("reloadSpectator");
    console.log("----------------");
  });
});

server.on("error", (err) => {
  console.log("Some error occured!", err);
});

server.listen(3000, () => {
  console.log("Application is running on port 3000...");
});
