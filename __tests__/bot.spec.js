import { inside } from "../src/bot";

describe("Testing bot", () => {
  it("Teste inside", () => {
    expect(inside([[0, 0]], [0, 0])).toBe(true);
    expect(inside([[0, 0]], [0, 1])).toBe(false);
  });
});
