import Williams from "./williams";
import data from "./test_data.test";

describe("test williams methods", () => {
  it("test getWilliams9()", () => {
    const williams = new Williams();
    expect(williams.getWilliams9(data)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      williams9: -79.59,
    });
  });

  it("test getWilliams18()", () => {
    const williams = new Williams();
    expect(williams.getWilliams18(data)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      williams18: -73.77,
    });
  });

  it("test getAllWillams()", () => {
    const williams = new Williams();
    expect(williams.getAllWillams(data)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      williams9: -79.59,
      williams18: -73.77,
    });
  });
});
