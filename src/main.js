import { width, height } from "./contants";
import { getNumberPlayers, myPlayerNumber, getPlayerMove, run } from "./runner";
import bot from "./bot";
import { setNextStep, rl } from "./helpers";

let nextStep = "UP";

const gen = rl(10, 5);

const streamer = false ? () => gen.next().value : () => readline();

run(streamer)(board => {
  nextStep = bot.nextStep(board);
  setNextStep(nextStep);
  console.log(nextStep);
});
