import simpleRegressoinModel from "../Regression/simpleRegressoinModel";
import Slope from "./index";
describe("test Slope methods", () => {
  it("test 123456", () => {
    const y = [1, 2, 3, 4, 5, 6];
    const slope = Slope(y);
    expect(slope).toEqual(1);
  });

  it("test -123456", () => {
    const y = [-1, -2, -3, -4, -5, -6];
    const slope = Slope(y);
    expect(slope).toEqual(-1);
  });

  it("test 654321", () => {
    const y = [60, 50, 40, 30, 20, 10];
    const slope = Slope(y);
    expect(slope).toEqual(-1);
  });

  it("test 222222", () => {
    const y = [2, 2, 2, 2, 2, 2];
    const slope = Slope(y);
    expect(slope).toEqual(0);
  });

  it("test 1,4,6,8,10,12", () => {
    const y = [1, 4, 6, 8, 10, 12];
    const slope = Slope(y);
    expect(slope).toEqual(2.142857142857143);
  });

  it("test simple regression", () => {
    const y = [50, 30, 10, 60, 70, 40, 100];
    const x = Array.from({ length: y.length }, (_, index) => index);
    const res = simpleRegressoinModel(x, y);
    const new_y = x.map((y) => res.predictModel(y));
    expect(res.description).toEqual("Y=26.785714285714292+8.214285714285714X");
    const slope = Slope(new_y);
    expect(slope).toEqual(0.8214285714285714);
  });
});
