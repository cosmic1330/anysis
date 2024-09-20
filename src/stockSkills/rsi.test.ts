import Rsi from "./rsi";
import data from "./test_data.test";

describe("test rsi methods", () => {

  it("test init & next", () => {
    const rsi = new Rsi();
    let result = rsi.init(data[0], 5);
    for (let i = 1; i < data.length; i++) {
      result = rsi.next(data[i], result, 5);
    }
    expect(result?.rsi).toEqual(44.72040034947733);
  });
  it("test calculateRSI()", () => {
    const rsi = new Rsi();
    const result = rsi.calculateRSI(data, 5);
    expect(result?.[result?.length - 1]).toEqual(44.72040034947733);
  });
});
