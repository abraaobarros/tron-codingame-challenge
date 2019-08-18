import { isOutBoard, move, distance, sleep } from "./helpers";
import { width, height } from "./contants";
import { setPlayerMove, printBoard, cloneBoard, isOccupied } from "./runner";

const directions = {
  UP: ["RIGHT", "LEFT", "UP"],
  DOWN: ["RIGHT", "DOWN", "LEFT"],
  RIGHT: ["DOWN", "UP", "RIGHT"],
  LEFT: ["DOWN", "LEFT", "UP"]
};

let actualDirection = "LEFT";

const willCollide = (board, node) => {
  return isOccupied(board)(node);
};

export const inside = (board, node) => isOccupied(board)(node);

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

export const flatCoordinate = node => node[0] + node[1] * width;

export const toNode = flat => [flat % width, (flat - (flat % width)) / width];

export const equal = (nodeA, nodeB) => {
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

export default { nextStep };
