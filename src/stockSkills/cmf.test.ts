import Cmf from "./cmf";

describe("test Cmf methods", () => {
  it("test CMF calculation with simple data (All Bullish)", () => {
    const cmf = new Cmf();
    const period = 3;

    // Data Case 1: Max positive MF
    // H=10, L=0, C=10 => (10-0)-(10-10) = 10, Multiplier = 10/10 = 1.
    const d1 = { c: 10, h: 10, l: 0, v: 100, o: 5, t: 1 };

    let state = cmf.init(d1);
    // Step 1: length 1 < 3. CMF = 0
    expect(state.cmf).toBe(0);

    state = cmf.next(d1, state, period); // length 2
    expect(state.cmf).toBe(0);

    state = cmf.next(d1, state, period); // length 3. SumMFV = 300, SumV = 300. CMF = 1.
    expect(state.cmf).toBe(1);
  });

  it("test CMF calculation with mixed data", () => {
    const cmf = new Cmf();
    const period = 3;

    // Day 1: Mul=1, V=100 -> MFV=100
    const d1 = { c: 10, h: 10, l: 0, v: 100, o: 5, t: 1 };
    // Day 2: Mul=-1, V=100 -> MFV=-100. (C=0, H=10, L=0 => -10 / 10 = -1)
    const d2 = { c: 0, h: 10, l: 0, v: 100, o: 5, t: 2 };
    // Day 3: Mul=0, V=100 -> MFV=0. (C=5, H=10, L=0 => (5-0)-(10-5)=0)
    const d3 = { c: 5, h: 10, l: 0, v: 100, o: 5, t: 3 };

    let state = cmf.init(d1);
    state = cmf.next(d2, state, period);
    state = cmf.next(d3, state, period);

    // Sum MFV = 100 - 100 + 0 = 0. CMF = 0.
    expect(state.cmf).toBe(0);
  });

  it("test CMF EMA calculation", () => {
    const instance = new Cmf();
    const period = 2;
    const emaPeriod = 3;

    // d1: CMF -> 0 (len 1)
    const d1 = { c: 10, h: 10, l: 0, v: 100, o: 5, t: 1 };
    let state = instance.init(d1);
    // CMF undefined yet (0)
    expect(state.cmf).toBe(0);
    expect(state.ema).toBe(0);

    // d2: CMF -> 1. (len 2). MFV=100+100=200, Vol=200.
    const d2 = { c: 10, h: 10, l: 0, v: 100, o: 5, t: 2 };
    state = instance.next(d2, state, period, emaPeriod);
    expect(state.cmf).toBe(1);
    // EMA calc: cmfList = [1]. len=1 < 3. ema=0.
    expect(state.ema).toBe(0);

    // d3: CMF -> 1. (len 2 shift). MFV=100+100=200.
    const d3 = { c: 10, h: 10, l: 0, v: 100, o: 5, t: 3 };
    state = instance.next(d3, state, period, emaPeriod);
    expect(state.cmf).toBe(1);
    // EMA calc: cmfList = [1, 1]. len=2 < 3. ema=0.
    expect(state.ema).toBe(0);

    // d4: CMF -> 1.
    const d4 = { c: 10, h: 10, l: 0, v: 100, o: 5, t: 4 };
    state = instance.next(d4, state, period, emaPeriod);
    expect(state.cmf).toBe(1);
    // EMA calc: cmfList = [1, 1, 1]. len=3. SMA = 1.
    expect(state.ema).toBe(1);

    // d5: CMF -> 2? No, let's make CMF different.
    // period=2. window [d4, d5].
    // d4: MFV=100, V=100.
    // d5: c=0, h=10, l=0, v=100. mul=-1. MFV=-100.
    // SumMFV = 100 - 100 = 0. CMF = 0.
    const d5 = { c: 0, h: 10, l: 0, v: 100, o: 5, t: 5 };
    state = instance.next(d5, state, period, emaPeriod);
    expect(state.cmf).toBe(0);

    // EMA calc: cmfList was [1, 1, 1]. Pushed 0 -> [1, 1, 1, 0]. Shift -> [1, 1, 0].
    // Wait, implementation:
    // push cmf -> [1, 1, 1, 0]
    // if len > emaPeriod -> shift -> [1, 1, 0]
    // EMA = (0 * 2 + (3-1) * 1) / (3+1) = (0 + 2) / 4 = 0.5.
    expect(state.ema).toBe(0.5);
  });
});
