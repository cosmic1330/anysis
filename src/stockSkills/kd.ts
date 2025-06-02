import { StockListType, StockType } from "./types";

export type KdResType = {
  dataset: StockListType;
  rsv: number;
  k: number;
  d: number;
  "k-d": number;
  j: number;
  type: number;
};
interface KdClassType {
  init: (data: StockType, type: number) => KdResType;
  next: (data: StockType, preList: KdResType, type: number) => KdResType;
}
export default class Kd implements KdClassType {
  init(data: StockType, type: number): KdResType {
    return {
      dataset: [data],
      rsv: 0,
      k: 0,
      d: 0,
      "k-d": 0,
      j: 0, // J value
      type,
    };
  }

  next(data: StockType, preList: KdResType, type: number): KdResType {
    preList.dataset.push(data);

    if (preList.dataset.length < type) {
      return {
        dataset: preList.dataset,
        rsv: 0,
        k: 0,
        d: 0,
        "k-d": 0,
        j: 0,
        type,
      };
    } else {
      if (preList.dataset.length > type) {
        preList.dataset.shift();
      }
      const low = Math.min(...preList.dataset.map((item) => item.l));
      const hight = Math.max(...preList.dataset.map((item) => item.h));
      const close = data.c;
      let rsv = ((close - low) / (hight - low)) * 100;
      rsv = Math.round(rsv * 100) / 100;
      let k = (2 / 3) * (preList.k ? preList.k : 50) + (1 / 3) * rsv;
      let d = (2 / 3) * (preList.d ? preList.d : 50) + (1 / 3) * k;
      let k_d = k - d;
      let j = 3 * k - 2 * d;
      
      k = Math.round(k * 100) / 100;
      d = Math.round(d * 100) / 100;
      k_d = Math.round(k_d * 100) / 100;
      j = Math.round(j * 100) / 100;
      return {
        dataset: preList.dataset,
        rsv,
        k,
        d,
        "k-d": k_d,
        j,
        type,
      };
    }
  }
}