import {
  getNumberPlayers,
  myPlayerNumber,
  getPlayerMove,
  printBoard,
  setPlayerMove
} from "../src/runner";

describe("Runner main", () => {
  it("Testing basic functions runner", () => {
    expect(getNumberPlayers("1 2")).toBe(1);
    expect(myPlayerNumber("1 2")).toBe(2);
    expect(getPlayerMove("2 1 2 3")).toEqual([2, 1, 2, 3]);
  });

  it("Add elements to Board", () => {
    console.log(printBoard());
    expect(setPlayerMove(0, 0, 1));
    expect(setPlayerMove(3, 3, 1));
    console.log(printBoard());
  });

  it("Printing board", () => {
    setPlayerMove(25, 15, 0);
    setPlayerMove(25, 14, 0);
    setPlayerMove(25, 13, 0);
    setPlayerMove(25, 12, 0);
    setPlayerMove(25, 11, 0);
    setPlayerMove(25, 10, 0);
    setPlayerMove(25, 9, 0);
    setPlayerMove(25, 8, 0);
    setPlayerMove(25, 7, 0);
    setPlayerMove(25, 6, 0);
    setPlayerMove(25, 5, 0);
    setPlayerMove(25, 4, 0);
    setPlayerMove(25, 3, 0);
    setPlayerMove(25, 2, 0);
    setPlayerMove(25, 1, 0);
    setPlayerMove(25, 0, 0);
    console.log(printBoard());
  });
});
