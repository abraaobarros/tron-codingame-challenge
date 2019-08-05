import { width, height } from "./contants";

export const getNumberPlayers = (linestream = "") => {
  return parseInt(linestream.split(" ")[0]);
};

export const myPlayerNumber = (linestream = "") => {
  return parseInt(linestream.split(" ")[1]);
};

export const getPlayerMove = (linestream = "") =>
  linestream.split(" ").map(coordinate => parseInt(coordinate));

export const setPlayerMove = (X, Y, player) => {
  board[player].push([X, Y]);
  board.occupied = board.occupied.map((item, index) => {
    if (index === X + Y * width) {
      if (board.occupied[index] !== ".") {
        console.error("Essa casa já foi preenchida");
        return player;
      }
      return player;
    }
    return item;
  });
};

export const isOccupied = ([X, Y]) => board.occupied[X + Y * width] !== ".";
var board = {
  0: [],
  1: [],
  2: [],
  3: [],
  me: 0,
  occupied: new Array(width * height).fill("."),
  isOccupied: isOccupied
};

export const printBoard = () => {
  var print = "";
  for (let h = 0; h < height; h++) {
    print += printRow(h);
    print += "\n";
  }
  return print;
};

export const printRow = y => {
  const line = board.occupied.slice(y * width, (y + 1) * width).join("");
  return line;
};

export const run = streamer => nextStep => {
  while (true) {
    const line = streamer();
    board.me = myPlayerNumber(line);
    for (let player = 0; player < getNumberPlayers(line); player++) {
      const [X0, Y0, X1, Y1] = getPlayerMove(streamer());
      setPlayerMove(X0, Y0, player);
      setPlayerMove(X1, Y1, player);
    }
    console.error(printBoard());
    nextStep(board);
  }
};
