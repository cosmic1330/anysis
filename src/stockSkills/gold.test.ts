import Gold from "./gold";
import data from "./test_data.test";

describe("test Gold methods", () => {
  it("test findHighPoint()", () => {
    const gold = new Gold();
    const hightPoints = gold.findHighPoint(data);
    expect(hightPoints["20211130"]).toEqual({
      c: 155.5,
      h: 164.5,
      l: 155,
      o: 158,
      t: 20211130,
      v: 83112,
    });
  });

  it("test findLowPoint()", () => {
    const gold = new Gold();
    const lowPoints = gold.findLowPoint(data);
    expect(lowPoints["20211122"]).toEqual({
      t: 20211122,
      o: 135,
      h: 140,
      l: 134,
      c: 137.5,
      v: 9864,
    });
  });

  it("test getGold(", () => {
    const gold = new Gold();
    const allGold = gold.getGold(139, 89.1);
    expect(allGold).toEqual({
      lowestPoint: 89.1,
      highestPoint: 139,
      superStrong: 129.47,
      strong: 119.94,
      middle: 114.05,
      weak: 108.16,
      superWeak: 98.63,
    });
  });
});
