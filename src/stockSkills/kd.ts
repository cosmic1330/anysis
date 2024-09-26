import { StockListType, StockType } from "./types";

type ResRSV = { c: number; rsv: number; [key: string]: unknown };
type ResKD = {
  c: number;
  rsv: number;
  k: number;
  d: number;
  "k-d": number;
  [key: string]: unknown;
};

export type KdResType = {
  dataset: StockListType;
  rsv: number;
  k: number;
  d: number;
  "k-d": number;
  type: number;
};
interface KdClassType {
  init: (data: StockType, type: number) => KdResType;
  next: (data: StockType, preList: KdResType, type: number) => KdResType;
  getRSV: (list: StockListType) => ResRSV[];
  getKD: (list: StockListType) => ResKD[];
}
export default class Kd implements KdClassType {
  init(data: StockType, type: number): KdResType {
    return {
      dataset: [data],
      rsv: 0,
      k: 0,
      d: 0,
      "k-d": 0,
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
      k = Math.round(k * 100) / 100;
      d = Math.round(d * 100) / 100;
      k_d = Math.round(k_d * 100) / 100;
      return {
        dataset: preList.dataset,
        rsv,
        k,
        d,
        "k-d": k_d,
        type,
      };
    }
  }

  getRSV(list: StockListType): ResRSV[] {
    const res: ResRSV[] = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 8) res[i] = { ...list[i], rsv: 0 };
      else {
        const low = Math.min(...list.slice(i - 8, i + 1).map((item) => item.l));
        const hight = Math.max(
          ...list.slice(i - 8, i + 1).map((item) => item.h)
        );
        const close = list[i].c;
        let rsv = ((close - low) / (hight - low)) * 100;
        rsv = Math.round(rsv * 100) / 100;
        res[i] = { ...list[i], rsv };
      }
    }
    return res;
  }

  getKD(list: StockListType): ResKD[] {
    const res = [];
    let yesterdayK = 50;
    let yesterdayD = 50;
    for (let i = 0; i < list.length; i++) {
      if (i < 8)
        res[i] = {
          ...list[i],
          rsv: 0,
          k: 0,
          d: 0,
          "k-d": 0,
        };
      else {
        const low = Math.min(...list.slice(i - 8, i + 1).map((item) => item.l));
        const hight = Math.max(
          ...list.slice(i - 8, i + 1).map((item) => item.h)
        );
        const close = list[i].c;
        let rsv = ((close - low) / (hight - low)) * 100;
        rsv = Math.round(rsv * 100) / 100;
        let k = (2 / 3) * yesterdayK + (1 / 3) * rsv;
        let d = (2 / 3) * yesterdayD + (1 / 3) * k;
        let k_d = k - d;
        k = Math.round(k * 100) / 100;
        d = Math.round(d * 100) / 100;
        k_d = Math.round(k_d * 100) / 100;
        res[i] = { ...list[i], rsv, k, d, "k-d": k_d };
        yesterdayK = k;
        yesterdayD = d;
      }
    }
    return res;
  }
}
