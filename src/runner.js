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
  occupied: new Array(width * height).fill(".")
};

export const setPlayerMove = (X, Y, player) => {
  board.occupied = board.occupied.map((item, index) => {
    if (index === X + Y * height) {
      return player;
    }
    return item;
  });
};

export const printBoard = () => {
  var print = board.occupied.reduce(
    (ant, atu) =>
      ant.split("\n").join("").length % width !== 0
        ? ant + atu
        : ant + "\n" + atu,
    ""
  );
  return print;
};

export const run = streamer => nextStep => {
  while (true) {
    const line = streamer();
    for (let player = 0; player < getNumberPlayers(line); player++) {
      const [X0, Y0, X1, Y1] = getPlayerMove(streamer());
      board[player].push([X1, X0]);
    }
    console.log(nextStep());
  }
};
