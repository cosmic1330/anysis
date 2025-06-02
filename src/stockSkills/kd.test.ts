import Kd from "./kd";
import { data_9904 as data } from "./test_data.test";

describe("test kd methods", () => {
  it("test init", () => {
    const index = data.length - 1;
    const kd = new Kd();
    const init = kd.init(data[0], 9);
    let res = init;
    for (let i = 1; i <= index; i++) {
      const item = data[i];
      res = kd.next(item, res, 9);
    }
    expect(res.k).toEqual(64.41);
    expect(res.d).toEqual(45.25);
    expect(res.j).toEqual(102.73);
  });
});
