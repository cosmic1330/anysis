import Kd from "./kd";
import { data_9904 as data } from "./test_data.test";

describe("test kd methods", () => {
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
  it("test getRSV()", () => {
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
      'k-d': 19.16
    });
  });
});
