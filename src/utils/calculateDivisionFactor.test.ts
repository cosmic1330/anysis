import calculateDivisionFactor from "./calculateDivisionFactor";

describe("test calculateDivisionFactor methods", () => {
  it("test 435435.13", () => {
    const divisionFactor = calculateDivisionFactor(435435.13);
    expect(divisionFactor).toEqual(100000);
  });

  it("test 0.13", () => {
    const divisionFactor = calculateDivisionFactor(0.13);
    expect(divisionFactor).toEqual(1);
  });
});
