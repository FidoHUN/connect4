const sock = io(); // This is how we initiate connection. The moment the server sees this, the "connection" event will trigger on the server side.

var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
var cellSize = canvas.height / 8;

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

var turn = 0;
let moved = false;
let firstPlayerWon = false;
let secondPlayerWon = false;
let canMove = true;

function render(board) {
  ctx.strokeStyle = "black";
  ctx.linewidth = 3;

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      var value = board[i][j];
      if (!value) continue;

      switch (value) {
        case 1:
          ctx.fillStyle = "red";
          break;

        case 2:
          ctx.fillStyle = "green";
          break;
      }

      ctx.beginPath();
      ctx.arc(
        (j + 0.5) * cellSize,
        (i + 0.5) * cellSize,
        cellSize / 2 - 5,
        0,
        2 * Math.PI,
        false
      );
      ctx.fill();
      ctx.stroke();
    }
  }
}

function isEmpty(row, column) {
  return board[row - 1][column - 1] === 0;
}

function isInvalidMove(column) {
  if (isEmpty(1, column)) {
    return false;
  }
  return true;
}

function drawBullet(color, column) {
  var bullet;
  switch (color) {
    case "red":
      bullet = 1;
      break;

    case "green":
      bullet = 2;
      break;
  }
  if (isInvalidMove(column)) {
    console.log("Inavalid move...");
  } else {
    turn++;
    for (let i = 8; i > 0; i--) {
      if (isEmpty(i, column)) {
        board[i - 1][column - 1] = bullet;
        break;
      }
    }
  }
}

function winningMove(board) {
  const COLUMN_COUNT = 8;
  const ROW_COUNT = 8;

  // check horizontal win
  for (let c = 0; c < COLUMN_COUNT - 3; c++) {
    for (let r = 0; r < ROW_COUNT; r++) {
      if (
        board[r][c] === 1 &&
        board[r][c + 1] === 1 &&
        board[r][c + 2] === 1 &&
        board[r][c + 3] === 1
      ) {
        firstPlayerWon = true;
        return true;
      }
      if (
        board[r][c] === 2 &&
        board[r][c + 1] === 2 &&
        board[r][c + 2] === 2 &&
        board[r][c + 3] === 2
      ) {
        secondPlayerWon = true;
        return true;
      }
    }
  }
  // check vertical win
  for (let c = 0; c < COLUMN_COUNT; c++) {
    for (let r = 0; r < ROW_COUNT - 3; r++) {
      if (
        board[r][c] === 1 &&
        board[r + 1][c] === 1 &&
        board[r + 2][c] === 1 &&
        board[r + 3][c] === 1
      ) {
        firstPlayerWon = true;
        return true;
      }
      if (
        board[r][c] === 2 &&
        board[r + 1][c] === 2 &&
        board[r + 2][c] === 2 &&
        board[r + 3][c] === 2
      ) {
        secondPlayerWon = true;
        return true;
      }
    }
  }
  // check positive diagonal win
  for (let c = 0; c < COLUMN_COUNT - 3; c++) {
    for (let r = 0; r < ROW_COUNT - 3; r++) {
      if (
        board[r][c] === 1 &&
        board[r + 1][c + 1] === 1 &&
        board[r + 2][c + 2] === 1 &&
        board[r + 3][c + 3] === 1
      ) {
        firstPlayerWon = true;
        return true;
      }
      if (
        board[r][c] === 2 &&
        board[r + 1][c + 1] === 2 &&
        board[r + 2][c + 2] === 2 &&
        board[r + 3][c + 3] === 2
      ) {
        secondPlayerWon = true;
        return true;
      }
    }
  }
  // check negative diagonal win
  for (let c = 0; c < COLUMN_COUNT - 3; c++) {
    for (let r = 3; r < ROW_COUNT; r++) {
      if (
        board[r][c] === 1 &&
        board[r - 1][c + 1] === 1 &&
        board[r - 2][c + 2] === 1 &&
        board[r - 3][c + 3] === 1
      ) {
        firstPlayerWon = true;
        return true;
      }
      if (
        board[r][c] === 2 &&
        board[r - 1][c + 1] === 2 &&
        board[r - 2][c + 2] === 2 &&
        board[r - 3][c + 3] === 2
      ) {
        secondPlayerWon = true;
        return true;
      }
    }
  }
}

function game(e) {
  let clientId = sock.id;
  if (e.pageX > 1 && e.pageX < 49 && !isInvalidMove(1)) {
    if (turn % 2 === 1) {
      drawBullet("red", 1);
    } else {
      drawBullet("green", 1);
    }
    sock.emit("moved", clientId);
  } else if (e.pageX > 51 && e.pageX < 99 && !isInvalidMove(2)) {
    if (turn % 2 === 1) {
      drawBullet("red", 2);
    } else {
      drawBullet("green", 2);
    }
    sock.emit("moved", clientId);
  } else if (e.pageX > 101 && e.pageX < 149 && !isInvalidMove(3)) {
    if (turn % 2 === 1) {
      drawBullet("red", 3);
    } else {
      drawBullet("green", 3);
    }
    sock.emit("moved", clientId);
  } else if (e.pageX > 151 && e.pageX < 199 && !isInvalidMove(4)) {
    if (turn % 2 === 1) {
      drawBullet("red", 4);
    } else {
      drawBullet("green", 4);
    }
    sock.emit("moved", clientId);
  } else if (e.pageX > 201 && e.pageX < 249 && !isInvalidMove(5)) {
    if (turn % 2 === 1) {
      drawBullet("red", 5);
    } else {
      drawBullet("green", 5);
    }
    sock.emit("moved", clientId);
  } else if (e.pageX > 251 && e.pageX < 299 && !isInvalidMove(6)) {
    if (turn % 2 === 1) {
      drawBullet("red", 6);
    } else {
      drawBullet("green", 6);
    }
    sock.emit("moved", clientId);
  } else if (e.pageX > 301 && e.pageX < 349 && !isInvalidMove(7)) {
    if (turn % 2 === 1) {
      drawBullet("red", 7);
    } else {
      drawBullet("green", 7);
    }
    sock.emit("moved", clientId);
  } else if (e.pageX > 351 && e.pageX < 399  && !isInvalidMove(8)) {
    if (turn % 2 === 1) {
      drawBullet("red", 8);
    } else {
      drawBullet("green", 8);
    }
    sock.emit("moved", clientId);
  }
  sock.emit("message", board, turn); // Sending the board state to the server
}

// start the game
firstPlayerWon = false;
secondPlayerWon = false;
// If we get a new board state from the server, we try to render it
sock.on("message", (board, turn) => {
  this.board = board;
  this.turn = turn;
  render(board);

  setTimeout(function () {
    if (winningMove(board)) {
      sock.emit("end");
    }
  }, 100);
});

sock.on("checkPermission", (cantMove) => {
  if(cantMove.length > 0 && cantMove[0] === sock.id){
    document.removeEventListener("click", game);
  }else{
    document.addEventListener("click", game);
  }
});

sock.on("message2", (board,turn) => {
  render(board);
});

sock.on("enableClick", ()=>{
  document.addEventListener("click",game);
});

sock.on("end", () => {
	swal ( "Játék vége!" ,  "" ,  "warning" );
 	let okBtn = document.querySelector(".swal-overlay");
 	okBtn.addEventListener("click", function(){
 		sock.emit("resetBoard");
 	});
});

sock.on("reloadPlayer", ()=>{
  sock.disconnect();
  setTimeout(function(){
    window.location.reload();
  }, 2000);
})

sock.on("reloadSpectator", ()=>{
  sock.disconnect();
  setTimeout(function(){
    window.location.reload();
  }, 4000);
})