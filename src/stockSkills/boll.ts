import { StockListType, StockType } from "./types";


export type BollResType = {
  dataset: StockListType;
  bollMa: number;
  bollUb: number;
  bollLb: number;
};

interface BollClassType {
  init: (data: StockType) => BollResType;
  next: (
    data: StockType,
    preList: BollResType,
    type: number
  ) => BollResType;
  getBoll: (list: StockListType, type: number) => {
  [key: string]: unknown;
  bollMa: number;
  bollUb: number;
  bollLb: number;
}[];
}

export default class Boll implements BollClassType {
  init(data: StockType): BollResType {
    return {
      dataset: [data],
      bollMa: 0,
      bollUb: 0,
      bollLb: 0,
    };
  }

  next(data: StockType, preList: BollResType, type: number) {
    preList.dataset.push(data);

    if (preList.dataset.length < type) {
      return {
        dataset: preList.dataset,
        type,
        bollMa: 0,
        bollUb: 0,
        bollLb: 0,
      };
    } else {
      if (preList.dataset.length > type) {
        preList.dataset.shift();
      }
      const sum: number = preList.dataset.reduce(
        (pre, current) => pre + current.c,
        0
      );
      const bollMa: number = Math.round((sum / type) * 100) / 100;
      const difference = preList.dataset.reduce((pre, current) => {
        return bollMa !== 0 ? pre + Math.pow(current.c - bollMa, 2) : pre;
      }, 0);
      const std: number = Math.round(Math.sqrt(difference / type) * 100) / 100;

      return {
        dataset: preList.dataset,
        type,
        bollMa,
        bollUb: bollMa + 2 * std,
        bollLb: bollMa - 2 * std,
      };
    }
  }

  getBoll(list: StockListType, type: number): {
  [key: string]: unknown;
  bollMa: number;
  bollUb: number;
  bollLb: number;
}[] {
    const res = [];

    for (let i = 0; i < list.length; i++) {
      if (i < type)
        res[i] = {
          ...list[i],
          bollMa: 0,
          bollUb: 0,
          bollLb: 0,
        };
      else {
        // bollMa
        const sumMa: number = list
          .slice(i - (type - 1), i + 1)
          .reduce((pre, current) => pre + current.c, 0);
        const bollMa: number = Math.round((sumMa / type) * 100) / 100;
        // 標準差
        const difference: number = res
          .slice(i - (type - 1), i + 1)
          .reduce((pre, current) => {
            return bollMa !== 0 ? pre + Math.pow(current.c - bollMa, 2) : pre;
          }, 0);
        const std: number =
          Math.round(Math.sqrt(difference / type) * 100) / 100;
        res[i] = {
          ...list[i],
          bollMa,
          bollUb: bollMa + 2 * std,
          bollLb: bollMa - 2 * std,
        };
      }
    }
    return res;
  }
}
