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
    const y = [6, 5, 4, 3, 2, 1];
    const slope = Slope(y);
    expect(slope).toEqual(-1);
  });

  it("test 222222", () => {
    const y = [2, 2, 2, 2, 2, 2];
    const slope = Slope(y);
    expect(slope).toEqual(0);
  });


  it("test 1,4,6,8,10,12", () => {
    const y = [1,4,6,8,10,12];
    const slope = Slope(y);
    expect(slope).toEqual(2.142857142857143);
  });
});
