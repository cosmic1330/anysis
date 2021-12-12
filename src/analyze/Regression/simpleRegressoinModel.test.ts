import simpleRegressoinModel from "./simpleRegressoinModel";
describe("test simple regressoin model methods", () => {
  it("test example", () => {
    const a = [3, 4, 6, 4, 2, 5];
    const b = [6, 8, 9, 5, 4.5, 9.5];
    const res = simpleRegressoinModel(a, b);
    expect(res).toEqual({
      description: "Y=2+1.25X",
      explained: "69.44444444444444%",
      predictModel: expect.any(Function),
    });
    expect(res?.predictModel && res.predictModel(6)).toBe(9.5);
  });
});
