'use strict';

const height = 20;
const width = 30;

const getNumberPlayers = (linestream = "") => {
  return parseInt(linestream.split(" ")[0]);
};

const myPlayerNumber = (linestream = "") => {
  return parseInt(linestream.split(" ")[1]);
};

const getPlayerMove = (linestream = "") =>
  linestream.split(" ").map(coordinate => parseInt(coordinate));

const setPlayerMove = (X, Y, player) => {
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

const isOccupied = ([X, Y]) => board.occupied[X + Y * width] !== ".";
var board = {
  0: [],
  1: [],
  2: [],
  3: [],
  me: 0,
  occupied: new Array(width * height).fill("."),
  isOccupied: isOccupied
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

const move = ([x, y], step) => {
  switch (step) {
    case "UP":
      return [x, y - 1];
    case "LEFT":
      return [x - 1, y];
    case "RIGHT":
      return [x + 1, y];
    case "DOWN":
      return [x, y + 1];
  }
  return [x, y];
};

const isOutBoard = node => {
  return node[0] < 0 || node[1] < 0 || node[0] >= width || node[1] >= height;
};

const willCollide = (board, node) => {
  return board.isOccupied(node);
};

const inside = (list, node) =>
  list.filter(n => n[0] + n[1] * width === node[0] + node[1] * width).length !==
  0;

const floodFill = (board, node, max_queue_size = 1000) => {
  let queue = [];
  let visited = [];
  queue.push(node);
  while (queue.length !== 0) {
    let actual = queue.pop();
    let possibilities = Object.keys(directions).filter(dir =>
      canMove(board, actual, dir)
    );
    possibilities.map(item => {
      const next = move(actual, item);
      if (!inside(visited, next)) {
        queue.push(next);
      }
    });
    visited.push(actual);
    if (visited.length > max_queue_size) {
      return max_queue_size;
    }
  }
  return visited.length;
};

const lastMove = board => {
  return [...board[board.me]].pop();
};

const canMove = (board, node, direction) => {
  return (
    !isOutBoard(move(node, direction)) &&
    !willCollide(board, move(node, direction))
  );
};

const directions = {
  UP: ["RIGHT", "LEFT", "UP"],
  DOWN: ["RIGHT", "DOWN", "LEFT"],
  RIGHT: ["DOWN", "UP", "RIGHT"],
  LEFT: ["DOWN", "LEFT", "UP"]
};

let actualDirection = "LEFT";

const sortByFloodFill = (board, list) =>
  list.sort((moveA, moveB) => {
    return (
      floodFill(board, move(lastMove(board), moveA)) -
      floodFill(board, move(lastMove(board), moveB))
    );
  });

const nextStep = board => {
  const next = directions[actualDirection].filter(m =>
    canMove(board, lastMove(board), m)
  );
  actualDirection = sortByFloodFill(board, next).pop();
  return actualDirection;
};

var bot = { nextStep };

let nextStep$1 = "UP";

//const gen = readline(4, 30);

run(() => {
  return readline();
})(board => {
  nextStep$1 = bot.nextStep(board);
  console.log(nextStep$1);
});
