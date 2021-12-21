import Rsi from "./rsi";
import data from "./test_data.test";

describe("test rsi methods", () => {
  it("test getRsi6()", () => {
    const rsi = new Rsi();
    expect(rsi.getRsi6(data)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      rsi6: 45.12,
    });
  });

  it("test getRsi12()", () => {
    const rsi = new Rsi();
    expect(rsi.getRsi12(data)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      rsi12: 49.47,
    });
  });
});
