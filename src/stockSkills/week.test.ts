import { StockType } from "./types";
import Week from "./week";

describe("Week", () => {
  let week: Week;

  beforeEach(() => {
    week = new Week();
  });

  describe("init", () => {
    it("應該正確初始化數據", () => {
      const data: StockType & { v: number } = {
        o: 100,
        c: 101,
        h: 102,
        l: 99,
        t: 20230501,
        v: 1000,
      };
      const result = week.init(data);
      expect(result).toEqual({ dataset: [data], week: [] });
    });
  });

  describe("next", () => {
    it("應該正確處理非週末的數據", () => {
      const initialData: StockType & { v: number } = {
        o: 100,
        c: 101,
        h: 102,
        l: 99,
        t: 20230501,
        v: 1000,
      };
      const nextData: StockType & { v: number } = {
        o: 101,
        c: 102,
        h: 103,
        l: 100,
        t: 20230502,
        v: 1100,
      };
      const initialResult = week.init(initialData);
      const result = week.next(nextData, initialResult);
      expect(result.dataset).toHaveLength(2);
      expect(result.week).toHaveLength(0);
    });

    it("應該在週五時生成週數據", () => {
      const initialData: StockType & { v: number } = {
        o: 100,
        c: 101,
        h: 102,
        l: 99,
        t: 20230501,
        v: 1000,
      };
      let result = week.init(initialData);
      for (let i = 1; i <= 9; i++) {
        const nextData: StockType & { v: number } = {
          o: 100 + i,
          c: 101 + i,
          h: 102 + i,
          l: 99 + i,
          t: 20230501 + i,
          v: 1000 + i * 100,
        };
        result = week.next(nextData, result);
      }
      expect(result.dataset).toHaveLength(4);
      expect(result.week).toHaveLength(1);
      expect(result.week[0]).toEqual({
        o: 100,
        c: 106,
        t: 20230506,
        h: 107,
        l: 99,
        v: 7500,
      });
    });

    it("應該忽略週末數據", () => {
      const initialData: StockType & { v: number } = {
        o: 100,
        c: 101,
        h: 102,
        l: 99,
        t: 20230505,
        v: 1000,
      };
      const weekendData: StockType & { v: number } = {
        o: 101,
        c: 102,
        h: 103,
        l: 100,
        t: 20230506,
        v: 1100,
      };
      const initialResult = week.init(initialData);
      const result = week.next(weekendData, initialResult);
      expect(result).toEqual(initialResult);
    });

    it("應該在新的一週開始時重置數據集", () => {
      const fridayData: StockType & { v: number } = {
        o: 100,
        c: 101,
        h: 102,
        l: 99,
        t: 20230505,
        v: 1000,
      };
      const mondayData: StockType & { v: number } = {
        o: 101,
        c: 102,
        h: 103,
        l: 100,
        t: 20230508,
        v: 1100,
      };
      let result = week.init(fridayData);
      result = week.next(mondayData, result);
      expect(result.dataset).toHaveLength(1);
      expect(result.dataset[0]).toEqual(mondayData);
    });
  });
});
