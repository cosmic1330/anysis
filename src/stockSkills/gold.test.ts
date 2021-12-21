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
    const allGold = gold.getGold(data);
    expect(allGold).toEqual({
      highestPoint: 164.5,
      highestPointDate: 20211130,
      lowestPoint: 134,
      lowestPointDate: 20211122,
      middle: 149.25,
      strong: 152.85,
      superStrong: 158.67,
      superWeak: 139.83,
      weak: 145.65,
    });
  });
});
