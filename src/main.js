import { width, height } from "./contants";
import { getNumberPlayers, myPlayerNumber, getPlayerMove, run } from "./runner";
import bot from "./bot";
import { setNextStep } from "./helpers";

let nextStep = "UP";

//const gen = readline(4, 30);

run(() => {
  return readline();
})(board => {
  nextStep = bot.nextStep(board);
  console.log(nextStep);
  setNextStep(nextStep);
});
