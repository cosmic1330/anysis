import Kd from "./kd";
import { data_9904 as data } from "./test_data.test";

describe("test kd methods", () => {
  it("test init", () => {
    const index = data.length - 1;
    const kd = new Kd();
    const realData = kd.getKD(data)[index];
    const init = kd.init(data[0]);
    let res = init;
    for (let i = 1; i <= index; i++) {
      const item = data[i];
      res = kd.next(item, res, 9);
    }
    expect({
      dataset:{
        c: realData.c,
        h: realData.h,
        l: realData.l,
      },
      rsv: realData.rsv,
      "k-d": realData["k-d"],
      k: realData.k,
      d: realData.d,
    }).toEqual({
      dataset:{
        c: res.dataset[res.dataset.length - 1].c,
        h: res.dataset[res.dataset.length - 1].h,
        l: res.dataset[res.dataset.length - 1].l,
      },
      rsv: res.rsv,
      "k-d": res["k-d"],
      k: res.k,
      d: res.d,
    });
  });
  it("test getRSV()", () => {
    const kd = new Kd();
    expect(kd.getRSV(data)[data.length - 1]).toEqual({
      o: 26.4,
      l: 34.3,
      h: 34.8,
      c: 34.65,
      v: 12765,
      t: 20230216,
      rsv: 90.63,
    });
  });
  it("test getKD()", () => {
    const kd = new Kd();
    expect(kd.getKD(data)[data.length - 1]).toEqual({
      o: 26.4,
      l: 34.3,
      h: 34.8,
      c: 34.65,
      v: 12765,
      t: 20230216,
      rsv: 90.63,
      k: 64.41,
      d: 45.25,
      "k-d": 19.16,
    });
  });
});
