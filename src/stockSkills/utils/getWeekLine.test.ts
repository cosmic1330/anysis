import getWeekLine from "./getWeekLine";

import data from "../test_data.test";

describe("test getWeekLine methods", () => {
  it("test getWeekLine(data, false) no detail", () => {
    const weekLine = getWeekLine(data, false);
    expect(weekLine[weekLine.length - 2]).toEqual({
      c: 140,
      h: 156,
      l: 137,
      o: 155,
      t: 20211210,
    });
  });
});
