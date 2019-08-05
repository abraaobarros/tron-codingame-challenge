import { inside } from "../src/bot";
import { distance } from "../src/helpers";

describe("Testing bot", () => {
  it("Teste inside", () => {
    expect(inside([[0, 0]], [0, 0])).toBe(true);
    expect(inside([[0, 0]], [0, 1])).toBe(false);
  });

  it("Testing distance between two points", () => {
    expect(distance([0, 0], [0, 0])).toEqual(0);
  });
});
