import Obv from "./obv";
import ObvEma from "./obv_ema";
import { data_9904 as data } from "./test_data.test";

describe("ObvEma", () => {
  it("test init", () => {
    const obv = new Obv();
    const obvEma = new ObvEma();
    let obvData = obv.init(data[0]);
    let emaData = obvEma.init(obvData.obv, 5);
    for (let i = 1; i < data.length; i++) {
      const item = data[i];
      obvData = obv.next(item, obvData);
      emaData = obvEma.next(obvData.obv, emaData, 5);
    }
    expect({ obv: obvData.obv, ma: emaData.ma, ema: emaData.ema }).toEqual({
      obv: 504538,
      ma: 494302.2,
      ema: 496758.8736585481,
    });
  });
});
