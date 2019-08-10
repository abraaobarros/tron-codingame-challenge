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

const clearPlayer = (board, player) => {
  board[player] = [];
  board.occupied = board.occupied.map(i => (i === player ? "." : i));
  return board;
};

const setPlayerMove = (board, X, Y, player) => {
  if (X === -1 && Y === -1) {
    board = clearPlayer(board, player);
    return board;
  }
  board[player].push([X, Y]);
  board.occupied[X + Y * width] = player;

  return board;
};

const isOccupied = board => ([X, Y]) =>
  board.occupied[X + Y * width] !== ".";

const cloneBoard = board => ({
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

const printBoard = board => {
  var print = "";
  for (let h = 0; h < height; h++) {
    print += printRow(board, h);
    print += "\n";
  }
  return print;
};

const printRow = (board, y) => {
  const line = board.occupied.slice(y * width, (y + 1) * width).join("");
  return line;
};

const run = streamer => nextStep => {
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

let _nextStep = "RIGHT";
const setNextStep = nextStep => {
  _nextStep = nextStep;
};

const rl = function*(x, y) {
  while (true) {
    yield "1 0";
    switch (_nextStep) {
      case "UP":
        yield `${x} ${y} ${x} ${--y}`;
        break;
      case "LEFT":
        yield `${x} ${y} ${--x} ${y}`;
        break;
      case "RIGHT":
        yield `${x} ${y} ${++x} ${y}`;
        break;
      case "DOWN":
        yield `${x} ${y} ${x} ${++y}`;
        break;
    }

    if (isOutBoard([x, y])) throw "Saiu da parada";
    sleep(1);
    console.clear();
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

const sleep = time => {
  let c = 0;
  for (var i = 0; i < time * 100000000; i++) {
    c++;
  }
  console.log(c);
};

const isOutBoard = node => {
  return node[0] < 0 || node[1] < 0 || node[0] >= width || node[1] >= height;
};

const willCollide = (board, node) => {
  return isOccupied(board)(node);
};

const floodFill = (board, node, max_stack_size = 700) => {
  let stack = [];
  let visited = cloneBoard(board);
  let count = 0;
  stack.push(node);
  while (stack.length !== 0) {
    let actual = stack.pop();
    visited = setPlayerMove(visited, actual[0], actual[1], 4);
    Object.keys(directions).map(dir => {
      if (canMove(visited, actual, dir)) {
        const next = move(actual, dir);
        stack.push(next);
        visited = setPlayerMove(visited, actual[0], actual[1], 4);
      }
    });
    count++;
  }
  return count;
};

const equal = (nodeA, nodeB) => {
  try {
    return nodeA[0] === nodeB[0] && nodeA[1] === nodeB[1];
  } catch (e) {
    return false;
  }
};

const bfs = (board, start, target, max_stack_size = width * height) => {
  var queue = [];
  var visited = cloneBoard(board);
  queue.push([start]);
  while (queue.length > 0) {
    const path = queue.shift();
    const current = [...path].pop();
    if (equal(current, target)) {
      return path;
    }
    for (var i = 0; i < 4; i++) {
      const dir = Object.keys(directions)[i];
      const next = move(current, dir);
      if (equal(next, target)) {
        return [...path, next];
      }
      if (canMove(visited, current, dir)) {
        queue.push([...path, next]);
        visited = setPlayerMove(visited, next[0], next[1], 4);
      }
    }
    if (queue.length > max_stack_size) {
      return -1;
    }
  }
  return -1;
};

const lastMove = board => {
  return [...board[board.me]].pop();
};

//TODO works just for two bots
const opponentLastMove = board => {
  let possiblePlayers = [0, 1, 2, 3];
  possiblePlayers = possiblePlayers.filter(
    i => i !== board.me && board[i].length > 0
  );
  return [...board[possiblePlayers.pop()]].pop();
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

const sortByFloodFill = (board, list) => {
  const movement = getMovementToTarget(
    board,
    lastMove(board),
    opponentLastMove(board)
  );
  return list.sort((moveA, moveB) => {
    const areaA = floodFill(board, move(lastMove(board), moveA));
    const areaB = floodFill(board, move(lastMove(board), moveB));
    if (areaA === areaB) {
      if (moveA === movement) {
        return -1;
      } else if (moveB === movement) {
        return 1;
      } else {
        return 0;
      }
    }
    return areaA - areaB;
  });
};

const nextStep = board => {
  const next = directions[actualDirection].filter(m =>
    canMove(board, lastMove(board), m)
  );
  actualDirection = sortByFloodFill(board, next).pop();
  return actualDirection;
};

const getMovementToTarget = (board, node, target) => {
  const path = bfs(board, node, target);
  if (!path) return null;
  let possibilities = Object.keys(directions).filter(dir =>
    equal(move(node, dir), path[1])
  );
  return possibilities.pop();
};

var bot = { nextStep };

let nextStep$1 = "UP";

const gen = rl(19, 19);

const streamer =  () => readline();

run(streamer)(board => {
  nextStep$1 = bot.nextStep(board);
  setNextStep(nextStep$1);
  console.log(nextStep$1);
});
