import { width, height } from "./contants";

export const getNumberPlayers = (linestream = "") => {
  return parseInt(linestream.split(" ")[0]);
};

export const myPlayerNumber = (linestream = "") => {
  return parseInt(linestream.split(" ")[1]);
};

export const getPlayerMove = (linestream = "") =>
  linestream.split(" ").map(coordinate => parseInt(coordinate));

export const clearPlayer = (board, player) => {
  board[player] = [];
  board.occupied = board.occupied.map(i => (i === player ? "." : i));
  return board;
};

export const setPlayerMove = (board, X, Y, player) => {
  if (X === -1 && Y === -1) {
    board = clearPlayer(board, player);
    return board;
  }
  board[player].push([X, Y]);
  board.occupied[X + Y * width] = player;

  return board;
};

export const isOccupied = board => ([X, Y]) =>
  board.occupied[X + Y * width] !== ".";

export const cloneBoard = board => ({
  ...board,
  occupied: [...board.occupied]
});
var board = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  me: 0,
  occupied: new Array(width * height).fill(".")
};

export const printBoard = board => {
  var print = "";
  for (let h = 0; h < height; h++) {
    print += printRow(board, h);
    print += "\n";
  }
  return print;
};

export const printRow = (board, y) => {
  const line = board.occupied.slice(y * width, (y + 1) * width).join("");
  return line;
};

export const run = streamer => nextStep => {
  while (true) {
    const line = streamer();
    board.me = myPlayerNumber(line);
    for (let player = 0; player < getNumberPlayers(line); player++) {
      const [X0, Y0, X1, Y1] = getPlayerMove(streamer());
      board = setPlayerMove(board, X0, Y0, player);
      board = setPlayerMove(board, X1, Y1, player);
    }
    nextStep(board);
    console.error(printBoard(board));
  }
};
