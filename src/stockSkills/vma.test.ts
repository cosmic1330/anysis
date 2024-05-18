import data from "./test_data.test";
import Vma from "./vma";

describe("test vma methods", () => {
  it("test init & next", () => {
    const index = data.length - 1;
    const vma = new Vma();
    const init = vma.init(data[0], 5);
    let res = init;
    for (let i = 1; i <= index; i++) {
      const item = data[i];
      res = vma.next(item, res, 5);
    }
    expect(res.vma).toEqual(12251.6);
  });
});
