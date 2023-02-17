import Kd from "./kd";
import data from "./test_data.test";

describe("test kd methods", () => {
  it("test getRSV()", () => {
    const kd = new Kd();
    expect(kd.getRSV(data)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      rsv: 19.607843137254903,
    });
  });
  it("test getRSV()", () => {
    const kd = new Kd();
    expect(kd.getKD(data)[data.length - 1]).toEqual({
      c: 142,
      o: 138,
      t: 20211214,
      v: 16841,
      h: 143,
      l: 138,
      rsv: 19.607843137254903,
      k: 17.953685125345164,
      d: 27.200715022358978,
      j: -0.5403746686824604,
    });
  });
});
