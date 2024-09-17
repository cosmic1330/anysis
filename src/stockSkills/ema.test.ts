import Ema from "./ema";
import data from "./test_data.test";

describe("test ema methods", () => {
  it("test init & next", () => {
    const index = data.length - 1;
    const ema = new Ema();
    const init = ema.init(data[0], 5);
    let res = init;
    for (let i = 1; i <= index; i++) {
      const item = data[i];
      res = ema.next(item, res, 5);
    }
    expect(res.ema).toEqual(141.83482746491333);
  });

  it("test getEma5()", () => {
    const ema = new Ema();
    const res = ema.getEma(data.map((item) => item.c), 5);
    expect(res[data.length - 1]).toEqual(141.83482746491333);
  });
});
