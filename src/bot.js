import { isOutBoard, move, distance } from "./helpers";
import { width } from "./contants";

const willCollide = (board, node) => {
  return board.isOccupied(node);
};

export const inside = (list, node) =>
  list.filter(n => n[0] + n[1] * width === node[0] + node[1] * width).length !==
  0;

const floodFill = (board, node, max_queue_size = 700) => {
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

//TODO works just for two bots
const opponentLastMove = board => {
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

let actualDirection = null;

const chooseBetterDirection = (board, moveA, moveB) => {
  if (!opponentLastMove(board)) return 0;
  const distA = distance(move(lastMove(board), moveA), opponentLastMove(board));
  const distB = distance(move(lastMove(board), moveB), opponentLastMove(board));
  return distB - distA;
};

const sortByFloodFill = (board, list) =>
  list.sort((moveA, moveB) => {
    const areaA = floodFill(board, move(lastMove(board), moveA));
    const areaB = floodFill(board, move(lastMove(board), moveB));
    if (areaA === areaB) {
      return chooseBetterDirection(board, moveA, moveB);
    }
    return areaA - areaB;
  });

const nextStep = board => {
  if (!actualDirection) {
    actualDirection = "LEFT";
    return actualDirection;
  }
  const next = directions[actualDirection].filter(m =>
    canMove(board, lastMove(board), m)
  );
  actualDirection = sortByFloodFill(board, next).pop();
  return actualDirection;
};

export default { nextStep };
