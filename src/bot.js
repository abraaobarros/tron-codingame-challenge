import { isOutBoard, move, distance, sleep } from "./helpers";
import { width, height } from "./contants";
import { setPlayerMove, printBoard, cloneBoard, isOccupied } from "./runner";

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
    let possibilities = Object.keys(directions).filter(dir =>
      canMove(board, actual, dir)
    );
    possibilities.map(item => {
      const next = move(actual, item);
      if (!inside(visited, next)) {
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
      if (canMove(visited, current, dir)) {
        const next = move(current, dir);
        queue.push([...path, next]);
        if (equal(next, target)) {
          return [...path, next];
        }
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
  return [20, 10];
  return [...board[board.me === 0 ? 1 : 0]].pop();
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
    const areaA = floodFill(board, move(lastMove(board), moveA));
    const areaB = floodFill(board, move(lastMove(board), moveB));
    return areaA - areaB;
  });

const nextStep = board => {
  const move = getMovementToTarget(
    board,
    lastMove(board),
    opponentLastMove(board)
  );
  if (move) {
    return move;
  }
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
