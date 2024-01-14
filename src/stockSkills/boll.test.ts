import Boll from "./boll";
import data from "./test_data.test";

describe("test boll methods", () => {
  it("test init & next", () => {
    const index = data.length - 1;
    const boll = new Boll();
    const init = boll.init(data[0]);
    let res = init;
    for (let i = 1; i <= index; i++) {
      const item = data[i];
      res = boll.next(item, res, 25);
    }
    expect({
      bollMa: res.bollMa,
      bollLb: res.bollLb,
      bollUb: res.bollUb,
    }).toEqual({ bollMa: 142.66, bollLb: 126.69999999999999, bollUb: 158.62 });
  });

  it("test getBoll()", () => {
    const boll = new Boll();
    const res = boll.getBoll(data, 25);
    expect(res[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      bollMa: 142.66,
      bollLb: 126.69999999999999,
      bollUb: 158.62,
    });
  });
});
