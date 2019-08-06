import { isOutBoard, move, distance, sleep } from "./helpers";
import { width } from "./contants";
import { setPlayerMove, printBoard, cloneBoard, isOccupied } from "./runner";

const willCollide = (board, node) => {
  return isOccupied(board)(node);
};

export const inside = (board, node) => isOccupied(board)(node);
  

const floodFill = (board, node, max_stack_size = 700) => {
  let stack = [];
  let visited = cloneBoard(board)
  let count = 0
  stack.push(node);
  while (stack.length !== 0) {
    // console.clear()
    let actual = stack.pop();
    visited = setPlayerMove(visited, actual[0], actual[1], 4)
    let possibilities = Object.keys(directions).filter(dir =>
      canMove(board, actual, dir)
    );
    possibilities.map(item => {
      const next = move(actual, item);
      if (!inside(visited, next)) {
        stack.push(next);
      }
    });
    count++
  }
  return count;
};

const flatCoordinate = (node) => node[0]+node[1]*width
/**
 * 
 * @param {Number} flat 
 */
const toNode = (flat) => [flat % width, (flat - (flat % width))/width]

const bfs = (board, start, target, max_stack_size = 10000) => {
  var queue = []
  var visited = cloneBoard(board)
  queue.push([flatCoordinate(start)])
  while(queue.length){
    const path = queue.shift()
    const last = [...path].pop()
    if (flatCoordinate(target)=== last){
      return path
    }
    let possibilities = Object.keys(directions).filter(dir =>
      canMove(visited, toNode(last), dir)
    );
    
    possibilities.map(item => {
      const lastNode = toNode(last)
      const next = move([lastNode[0], lastNode[1]], item);
      if (!inside(visited, next) && !path.includes(flatCoordinate(next))) {
        queue.push([...path, flatCoordinate(next)])
      }
    });
    visited = setPlayerMove(visited, toNode(last)[0], toNode(last)[1], 4)
    if (queue.length > max_stack_size ){
      return -1
    }
    
  }
  return -1
}


const equal = (nodeA, nodeB) => {
  return nodeA[0] === nodeB[0] && nodeA[1] === nodeB[1]
}

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

let actualDirection = "LEFT";

const sortByFloodFill = (board, list) =>
  list.sort((moveA, moveB) => {
    const areaA = floodFill(board, move(lastMove(board), moveA));
    const areaB = floodFill(board, move(lastMove(board), moveB));
    return areaA - areaB;
  });

const nextStep = board => {
  const move = getMovementToTarget(board,lastMove(board), opponentLastMove(board))
  if(move){
    return move
  }
  const next = directions[actualDirection].filter(m =>
    canMove(board, lastMove(board), m)
  );
  actualDirection = sortByFloodFill(board, next).pop();
  return actualDirection;
};

const getMovementToTarget = (board, node, target) => {
  const path = bfs(board, node, target)
  let possibilities = Object.keys(directions).filter(dir =>
    flatCoordinate(move(node, dir)) === path[1]
  );
  return possibilities.pop()
}

export default { nextStep };
