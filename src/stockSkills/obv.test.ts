import Obv from "./obv";
import { data_9904 as data } from "./test_data.test";

describe("test obv methods", () => {
  it("test init", () => {
    const obv = new Obv();
    const init = obv.init(data[0], 5);
    let res = init;
    for (let i = 1; i < data.length; i++) {
      const item = data[i];
      res = obv.next(item, res, 5);
    }
    expect({ obv: res.obv, obvMa: res.obvMa }).toEqual({ obv: 504538 , obvMa: 494302.2});
  });

  it("test getObv()", () => {
    const kd = new Obv();
    expect(kd.getObv(data)[data.length - 1].obv).toEqual(504538);
  });
});
