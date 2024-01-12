import Ema from "./ema";
import data from "./test_data.test";

describe("test ema methods", () => {
  it("test getEma5()", () => {
    const ema = new Ema();
    const res = ema.getEma(data.map((item) => item.c), 5);
    expect(res[data.length - 1]).toEqual(141.83482746491333);
  });
});
