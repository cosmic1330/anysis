import { StockListType, StockType } from "./types";

type NewStockType = Required<Pick<StockType, 'v'>> & StockType;

type NewStockListType = NewStockType[];

type ResObv = { obv: number } & NewStockType;

export type ObvResType = {
  dataset: StockListType;
  obv: number;
  preClose: number;
};

interface ObvType {
  init: (data: NewStockType) => ObvResType;
  next: (data: NewStockType, preList: ObvResType) => ObvResType;
  getObv: (list: NewStockListType, period: number) => ResObv[];
}
export default class Obv implements ObvType {
  init(data: NewStockType): ObvResType {
    return {
      dataset: [data],
      obv: data.v,
      preClose: data.c,
    };
  }

  next(data: NewStockType, preList: ObvResType): ObvResType {
    const currentVolume = data.v;
    const currentClose = data.c;
    // obv
    let obv = preList.obv;
    if (currentClose > preList.preClose) {
      obv += currentVolume;
    } else if (currentClose < preList.preClose) {
      obv -= currentVolume;
    }

    return {
      dataset: [...preList.dataset, data],
      obv,
      preClose: currentClose,
    };
  }

  getObv(list: NewStockListType): ResObv[] {
    const res = [];
    let obv = 0;

    for (let i = 0; i < list.length; i++) {
      const currentVolume = list[i].v;
      const currentClose = list[i].c;

      if (i > 0) {
        // obv
        if (currentClose > list[i - 1].c) {
          obv += currentVolume;
        } else if (currentClose < list[i - 1].c) {
          obv -= currentVolume;
        }
      } else {
        obv = currentVolume;
      }
      res[i] = { ...list[i], obv };
    }
    return res;
  }
}
