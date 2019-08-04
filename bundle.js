'use strict';

const height = 20;
const width = 30;

const getNumberPlayers = (linestream = "") => {
  return parseInt(linestream.split(" ")[0]);
};

const getPlayerMove = (linestream = "") =>
  linestream.split(" ").map(coordinate => parseInt(coordinate));

var board = {
  0: [],
  1: [],
  2: [],
  3: [],
  occupied: new Array(width * height).fill(".")
};

const setPlayerMove = (X, Y, player) => {
  board[player].push([X, Y]);
  board.occupied = board.occupied.map((item, index) => {
    if (index === X + Y * width) {
      return player;
    }
    return item;
  });
};

const printBoard = () => {
  var print = "";
  for (let h = 0; h < height; h++) {
    print += printRow(h);
    print += "\n";
  }
  return print;
};

const printRow = y => {
  const line = board.occupied.slice(y * width, (y + 1) * width).join("");
  return line;
};

const run = streamer => nextStep => {
  while (true) {
    const line = streamer();
    for (let player = 0; player < getNumberPlayers(line); player++) {
      const [X0, Y0, X1, Y1] = getPlayerMove(streamer());
      setPlayerMove(X0, Y0, player);
      setPlayerMove(X1, Y1, player);
    }
    console.error(printBoard());
    console.log(nextStep(board));
  }
};

run(() => {
  return readline();
})(() => "UP");
