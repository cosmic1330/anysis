import Angle from "./index";
describe("test Angle methods", () => {
  it("test (0,0) (1,1)", () => {
    const y = [0, 1];
    const angle = Angle(y);
    expect(angle).toEqual(45);
  });

  it("test [0, 200]", () => {
    const y = [0, 200];
    const angle = Angle(y);
    expect(angle).toEqual(63.43494882292201);
  });

  it("test [0, 0]", () => {
    const y = [0, 0];
    const angle = Angle(y);
    expect(angle).toEqual(0);
  });

  it("test [39.73, 48.15]", () => {
    const y = [39.73, 48.15];
    const angle = Angle(y);
    expect(angle).toEqual(40.09737861178007);
  });

  it("test [15.46, 30.19]", () => {
    const y = [15.46, 30.19];
    const angle = Angle(y);
    expect(angle).toEqual(55.82794164843938);
  });

  it("test [35.64, 37.09]", () => {
    const y = [35.64, 37.09];
    const angle = Angle(y);
    expect(angle).toEqual(8.250387228905515);
  });
});
