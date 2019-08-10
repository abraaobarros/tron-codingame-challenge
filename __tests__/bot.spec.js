import { inside, toNode, flatCoordinate, equal } from "../src/bot";
import { distance } from "../src/helpers";

describe("Testing bot", () => {
  it("Teste inside", () => {
    expect(toNode(130)).toEqual([10, 4]);
    expect(flatCoordinate([10, 4])).toEqual(130);
    expect(flatCoordinate(toNode(130))).toEqual(130);
    expect(equal(toNode(130), [10, 4])).toBe(true);
  });

  it("Testing distance between two points", () => {
    expect(distance([0, 0], [0, 0])).toEqual(0);
  });
});
