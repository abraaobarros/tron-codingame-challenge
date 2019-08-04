import { width, height } from "./contants";
import { getNumberPlayers, myPlayerNumber, getPlayerMove, run } from "./runner";
import bot from "./bot";
import { readline, setNextStep } from "./helpers";

let nextStep = "UP";

const gen = readline(20, 20);

run(() => {
  return gen.next().value;
})(board => {
  nextStep = bot.nextStep(board);
  setNextStep(nextStep);
  console.log(nextStep);
});
