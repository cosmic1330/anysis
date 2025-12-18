import Dmi from "./dmi";
import data from "./test_data.test";

describe("test dmi methods", () => {
  it("test init & next", () => {
    const dmi = new Dmi();
    const period = 14;
    // Calculate all values using loop
    const results = dmi.calculateDmiValues(data, period);
    const lastResult = results[results.length - 1];

    // Verify consistency
    // Re-run step-by-step
    let state = dmi.init(data[0], period);
    for (let i = 1; i < data.length; i++) {
      state = dmi.next(data[i], state, period);
    }

    expect(state.pDi).toEqual(lastResult.pDi);
    expect(state.mDi).toEqual(lastResult.mDi);
    expect(state.adx).toEqual(lastResult.adx);
  });

  it("test values consistency (basic sanity)", () => {
    // Generate a simple synthetic dataset where Trend is obvious
    // Upward trend -> +DI should be high, -DI low
    const upTrendData = [];
    for (let i = 0; i < 50; i++) {
      upTrendData.push({
        c: 10 + i,
        h: 11 + i,
        l: 9 + i,
        o: 10 + i,
        v: 1000,
        t: 20210101 + i,
      });
    }

    const dmi = new Dmi();
    const res = dmi.calculateDmiValues(upTrendData, 14);
    const last = res[res.length - 1];

    // +DI should be dominant
    expect(last.pDi).toBeGreaterThan(last.mDi);
    // ADX should be high (strong trend)
    expect(last.adx).toBeGreaterThan(20);
  });

  it("test flat trend", () => {
    // Flat data
    const flatData = [];
    for (let i = 0; i < 50; i++) {
      flatData.push({
        c: 10,
        h: 11,
        l: 9,
        o: 10,
        v: 1000,
        t: 20210101 + i,
      });
    }
    const dmi = new Dmi();
    const res = dmi.calculateDmiValues(flatData, 14);
    const last = res[res.length - 1];

    // No directional movement
    // h-ph = 0, pl-l = 0.
    // +DM = 0, -DM = 0.
    // +DI = 0, -DI = 0.
    // ADX = 0?
    // DX = 0.

    expect(last.pDi).toEqual(0);
    expect(last.mDi).toEqual(0);
    // ADX might be 0 or close to 0
    expect(last.adx).toEqual(0);
  });
});
