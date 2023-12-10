import { setStartMonthInYear } from "./index";

describe("test setStartMonthInYear", () => {
  it("test 3", () => {
    const res = setStartMonthInYear(3);
    expect(res).toEqual([
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      "January",
      "February",
    ]);
  });
});
