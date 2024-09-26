import { StockListType, StockType } from "./types";

export type EmaResType = {
  dataset: StockListType;
  ema: number;
  type: number;
};
interface EmaClassType {
  init: (data: StockType, type: number) => EmaResType;
  next: (data: StockType, preList: EmaResType, type: number) => EmaResType;
  getStartEma: (list: number[], period: number) => number;
  getEma: (list: number[], period: number) => (number | null)[];
}
export default class Ema implements EmaClassType {
  init(data: StockType, type: number): EmaResType {
    return { dataset: [data], ema: 0, type };
  }
  next(data: StockType, preList: EmaResType, type: number): EmaResType {
    preList.dataset.push(data);
    if (preList.dataset.length < type) {
      return {
        dataset: preList.dataset,
        ema: 0,
        type,
      };
    } else if (preList.dataset.length === type) {
      const sum = preList.dataset.reduce((pre, current) => pre + current.c, 0);
      return {
        dataset: preList.dataset,
        ema: sum / type,
        type,
      };
    } else {
      if (preList.dataset.length > type) {
        preList.dataset.shift();
      }
      const ema = (data.c * 2 + (type - 1) * preList.ema) / (type + 1);
      return { dataset: preList.dataset, ema, type };
    }
  }
  getStartEma(list: number[], period: number): number {
    if (list.length < period) throw new Error("list.length < period");
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += list[i];
    }
    const initialEMA = sum / period;
    return initialEMA;
  }

  getEma(list: number[], period: number): (number | null)[] {
    const res = [];
    let ema = this.getStartEma(list.slice(0, period), period);
    for (let i = 0; i < list.length; i++) {
      if (i < period) {
        res.push(null);
        continue;
      }
      ema = (list[i] * 2 + (period - 1) * ema) / (period + 1);
      res.push(ema);
    }
    return res;
  }
}
