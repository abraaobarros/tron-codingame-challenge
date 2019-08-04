import { width, height } from "./contants";

export const getNumberPlayers = (linestream = "") => {
  return parseInt(linestream.split(" ")[0]);
};

export const myPlayerNumber = (linestream = "") => {
  return parseInt(linestream.split(" ")[1]);
};

export const getPlayerMove = (linestream = "") =>
  linestream.split(" ").map(coordinate => parseInt(coordinate));

var board = {
  0: [],
  1: [],
  2: [],
  3: [],
  occupied: new Array(width * height).fill(0)
};

export const getOccupied = () => {
  return board.occupied;
};

export const printBoard = () => {
  var print = "";
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      print += board.occupied[w * h];
    }
    print += "\n";
  }
  return print;
};

export const run = streamer => nextStep => {
  while (true) {
    const line = streamer();
    for (let player = 0; player < getNumberPlayers(line); player++) {
      const [X0, Y0, X1, Y1] = getPlayerMove(streamer());
      board[player].push([X1, X0]);
    }
  }
};
