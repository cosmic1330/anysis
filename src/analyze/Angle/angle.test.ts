import Angle from "./index";
describe("test Angle methods", () => {
  it("test (0,0) (1,1)", () => {
    const y = [0, 1];
    const angle = Angle(y);
    expect(angle).toEqual(45);
  });

  it("test (0,0) (1,10)", () => {
    const y = [0, 200];
    const angle = Angle(y);
    expect(angle).toEqual(63.43494882292201);
  });

  it("test (0,0) (1,0)", () => {
    const y = [0, 0];
    const angle = Angle(y);
    expect(angle).toEqual(0);
  });
});
