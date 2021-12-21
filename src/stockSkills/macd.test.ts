import Macd from "./macd";
import data from "./test_data.test";

describe("test macd methods", () => {
  it("test getEMA12()", () => {
    const macd = new Macd();
    expect(macd.getEMA12(data)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      EMA12: 144.01967137166324,
    });
  });

  it("test getEMA26()", () => {
    const macd = new Macd();
    expect(macd.getEMA26(data)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      EMA26: 142.2290771028552,
    });
  });

  it("test getDIF()", () => {
    const macd = new Macd();
    const Ema26 = macd.getEMA26(data);
    const Ema12 = macd.getEMA12(data);
    expect(macd.getDIF(data, Ema12, Ema26)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      DIF: 1.7905942688080358,
    });
  });

  it("test getMACD9()", () => {
    const macd = new Macd();
    const Ema26 = macd.getEMA26(data);
    const Ema12 = macd.getEMA12(data);
    const Dif = macd.getDIF(data, Ema12, Ema26);
    expect(macd.getMACD9(data, Dif)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      MACD9: 3.461688641153529,
      OSC: -1.6710943723454932,
    });
  });

  it("test getMACD()", () => {
    const macd = new Macd();
    expect(macd.getMACD(data)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      DIF: 1.7905942688080358,
      MACD9: 3.461688641153529,
      OSC: -1.6710943723454932,
    });
  });
});
