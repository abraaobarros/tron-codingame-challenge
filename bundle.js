'use strict';

const height = 20;
const width = 30;

const getNumberPlayers = (linestream = "") => {
  console.log(linestream);
  return parseInt(linestream.split(" ")[0]);
};

const myPlayerNumber = (linestream = "") => {
  console.log(linestream);
  return parseInt(linestream.split(" ")[1]);
};

const getPlayerMove = (linestream = "") =>
  linestream.split(" ").map(coordinate => parseInt(coordinate));

var board = {
  0: [],
  1: [],
  2: [],
  3: [],
  me: 0,
  occupied: new Array(width * height).fill(".")
};

const setPlayerMove = (X, Y, player) => {
  board[player].push([X, Y]);
  board.occupied = board.occupied.map((item, index) => {
    if (index === X + Y * width) {
      return player;
    }
    return item;
  });
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

const nextStep = board => {
  return "UP";
};

var bot = { nextStep };

let _nextStep = "UP";
const setNextStep = nextStep => {
  _nextStep = nextStep;
};

const readline = function*(x, y) {
  while (true) {
    yield "1 0";
    switch (_nextStep) {
      case "UP":
        yield `${x} ${y} ${x} ${y--}`;
        break;
      case "LEFT":
        yield `${x} ${y} ${x--} ${y}`;
        break;
      case "RIGHT":
        yield `${x} ${y} ${x++} ${y}`;
        break;
      case "DOWN":
        yield `${x} ${y} ${x} ${y++}`;
        break;
    }

    if (x < 0 || y < 0 || x > width || y > height) throw "Saiu da parada";

    let c = 0;
    for (var i = 0; i < 100000000; i++) {
      c++;
    }
    console.log(c);
    console.clear();
  }
};

let nextStep$1 = "UP";

const gen = readline(20, 20);

run(() => {
  return gen.next().value;
})(board => {
  nextStep$1 = bot.nextStep(board);
  setNextStep(nextStep$1);
  console.log(nextStep$1);
});
