type ItemType = { c: number; [key: string]: unknown };
type ListType = ItemType[];
interface EmaType {
  init: (
    data: ItemType,
    type: number
  ) => {
    dataset: ListType;
    ema: number;
    type: number;
  };
  next: (
    data: ItemType,
    preList: {
      dataset: ListType;
      ema: number;
      type: number;
    },
    type: number
  ) => {
    dataset: ListType;
    ema: number;
    type: number;
  };
  getStartEma: (list: number[], period: number) => number;
  getEma: (list: number[], period: number) => (number | null)[];
}
export default class Ema implements EmaType {
  init(
    data: ItemType,
    type: number
  ): {
    dataset: ListType;
    ema: number;
    type: number;
  } {
    return { dataset: [data], ema: 0, type };
  }
  next(
    data: ItemType,
    preList: {
      dataset: ListType;
      ema: number;
    },
    type: number
  ): {
    dataset: ListType;
    ema: number;
    type: number;
  } {
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
