import { width, height } from "./contants";
import { getNumberPlayers, myPlayerNumber, getPlayerMove } from "./runner";

const isBorder = (x, y) => {
  return x === 0 || x === width || y === 0 || y === height;
};

const isOut = (x, y) => {
  return x < 0 || x >= width || y < 0 || y >= height;
};

const next = (path, direction, count = 1) => {
  switch (direction) {
    case "LEFT":
      return [path[0][0] - count, path[0][1]];
    case "RIGHT":
      return [path[0][0] + count, path[0][1]];
    case "UP":
      return [path[0][0], path[0][1] - count];
    case "DOWN":
      return [path[0][0], path[0][1] + count];
  }
};

const turn = (direction, turn) => {
  return d[(getDirection(direction) + turn + 4) % 4];
};

const d = {
  0: "LEFT",
  1: "UP",
  2: "RIGHT",
  3: "DOWN"
};

const getDirection = d => {
  switch (d) {
    case "LEFT":
      return 0;
    case "UP":
      return 1;
    case "RIGHT":
      return 2;
    case "DOWN":
      return 3;
  }
};

const hasOut = path => {
  return path.some(([i, j]) => isOut(i, j));
};

const score = (path, direction, other_path = []) => {
  return hasOut(path) ||
    hasOut([next(path, direction), ...path]) ||
    collide(other_path, next(path, direction)) ||
    collide(other_path, path[0]) ||
    collide(path, next(path, direction))
    ? -1
    : 0;
};

const collide = (path, [k, l]) => {
  return path.some(([i, j]) => i === k && j === l);
};

const firstMove = (a, b) => {
  var minD = 0;
  var minMove = "LEFT";
  ["LEFT", "UP", "DOWN", "RIGHT"].map(item => {
    var va = distance(next([a], item), b);
    if (va > minD) {
      console.error(va);
      minD = va;
      minMove = item;
    }
  });
  return [minMove, turn(minMove, 1)];
};

const init = () => {
  if (!direction) {
    [direction, turnDirection] = firstMove(my_path[0], other_path[0]);
  }
};

const distance = (a, b) => {
  const total = a[0] - b[0] + a[1] - b[1];
  return total;
};
var direction;
var turnDirection;
var my_path = [[1, 1]];
var other_path = [[1, 1]];

while (true) {
  var inputs = readline();
  const N = getNumberPlayers(inputs);
  const P = myPlayerNumber(inputs);
  for (let i = 0; i < N; i++) {
    const [X0, Y0, X1, Y1] = getPlayerMove(readline());
    if (P === i) {
      my_path.unshift([X1, Y1]);
    } else {
      other_path.unshift([X1, Y1]);
      // console.error(other_path)
    }
  }

  init();
  console.error(distance(my_path[0], other_path[0]));

  if (direction === turnDirection) {
    if (score(my_path, turn(direction, 1), other_path) === 0) {
      direction = turn(direction, 1);
    } else {
      direction = turn(direction, -1);
    }
  } else {
    if (score(my_path, direction, other_path) === -1) {
      if (score(my_path, turn(direction, 1), other_path) === 0) {
        direction = turn(direction, 1);
      } else {
        direction = turn(direction, -1);
      }
    }
  }
  console.log(direction);
}
