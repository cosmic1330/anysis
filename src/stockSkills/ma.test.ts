import Ma from "./ma";
import data from "./test_data.test";

describe("test ma methods", () => {
  it("test init & next", () => {
    const index = data.length - 1;
    const ma = new Ma();
    const realData = ma.getMa5(data)[index];
    const init = ma.init(data[0], 5);
    let res = init;
    for (let i = 1; i <= index; i++) {
      const item = data[i];
      res = ma.next(item, res, 5);
    }
    expect(realData.ma5).toEqual(res.ma);
  });

  it("test getMa5()", () => {
    const ma = new Ma();
    expect(ma.getMa5(data)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      ma5: 141.1,
    });
  });

  it("test getMa10()", () => {
    const ma = new Ma();
    expect(ma.getMa10(data)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      ma10: 146.7,
    });
  });

  it("test getMa20()", () => {
    const ma = new Ma();
    expect(ma.getMa20(data)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      ma20: 144.88,
    });
  });

  it("test getMa60()", () => {
    const ma = new Ma();
    expect(ma.getMa60(data)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      ma60: 134.86,
    });
  });

  it("test getMa()", () => {
    const ma = new Ma();
    expect(ma.getMa(data, 20)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      ma: 144.88,
    });
  });

  it("test getAllMa()", () => {
    const ma = new Ma();
    expect(ma.getAllMa(data)[data.length - 1]).toEqual({
      t: 20211214,
      o: 138,
      h: 143,
      l: 138,
      c: 142,
      v: 16841,
      ma5: 141.1,
      ma10: 146.7,
      ma20: 144.88,
      ma60: 134.86,
    });
  });
});
