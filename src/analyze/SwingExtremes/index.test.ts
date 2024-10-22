import {
  findPeaksByGradient,
  findTroughByGradient,
  SwingExtremes,
  SwingExtremesType,
} from "./index";

describe("test SwingExtremes", () => {
  let prices: number[];

  beforeEach(() => {
    prices = [10, 12, 11, 13, 15, 14, 16, 10, 8, 9, 11, 7, 5, 8, 4, 5];
    //         0,  1,  2,  3,  4,  5,  6,  7, 8, 9, 10,11,12,13,14,15
  });

  it("test findPeaksByGradient", () => {
    const res = findPeaksByGradient(prices);
    expect(res).toEqual([1, 4, 6, 10, 13]);
  });

  it("test findTroughByGradient", () => {
    const res = findTroughByGradient(prices);
    expect(res).toEqual([2, 5, 8, 12, 14]);
  });

  it("test SwingExtremes Peak", () => {
    const arr = SwingExtremes(prices);
    const res = arr.filter((x) => x.type === SwingExtremesType.Peak);
    expect(res).toEqual(
      [
        { index: 1, type: "Peak" },
        { index: 4, type: "Peak" },
        { index: 6, type: "Peak" },
        { index: 10, type: "Peak" },
        { index: 13, type: "Peak" },
      ]
    );
  });

  it("test SwingExtremes Trough", () => {
    const arr = SwingExtremes(prices);
    const res = arr.filter((x) => x.type === SwingExtremesType.Trough);
    expect(res).toEqual([
      { index: 2, type: "Trough" },
      { index: 5, type: "Trough" },
      { index: 8, type: "Trough" },
      { index: 12, type: "Trough" },
      { index: 14, type: "Trough" },
    ]);
  });
});
