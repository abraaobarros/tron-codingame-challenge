import { height, width } from "./contants";

let _nextStep = "UP";
export const setNextStep = nextStep => {
  _nextStep = nextStep;
};

export const readline = function*(x, y) {
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
