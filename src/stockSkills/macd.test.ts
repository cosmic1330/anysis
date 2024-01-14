import Macd from "./macd";
import data from "./test_data.test";

describe("test macd methods", () => {
  it("test init & next", () => {
    const index = data.length - 1;
    const macd = new Macd();
    const init = macd.init(data[0]);
    let res = init;
    for (let i = 1; i <= index; i++) {
      const item = data[i];
      res = macd.next(item, res);
    }
    expect({
      ema12: 144.02,
      ema26: 142.23,
      dif: 1.79,
      macd: 3.46,
      osc: -1.67,
    }).toEqual({
      ema12: res.ema12,
      ema26: res.ema26,
      dif: res.dif?.[res.dif?.length - 1],
      macd: res.macd,
      osc: res.osc,
    });
  });
  
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
      EMA12: 144.01967137166324, 
      EMA26: 142.2290771028552 
    });
  });
});
