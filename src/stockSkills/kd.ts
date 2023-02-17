interface KdType {
  getRSV: (list: ListType) => ResRSV;
  getKD: (list: ListType) => ResKD;
}
type ListType = { c: number; h: number; l: number }[];
type ResRSV = { c: number; rsv?: number }[];
type ResKD = {
  c: number;
  rsv?: number;
  k?: number;
  d?: number;
  "k-d"?: number;
}[];
export default class Kd implements KdType {
  getRSV(list: ListType) {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 8) res[i] = { ...list[i], rsv: undefined };
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

  getKD(list: ListType) {
    const res = [];
    let yesterdayK = 50;
    let yesterdayD = 50;
    for (let i = 0; i < list.length; i++) {
      if (i < 8)
        res[i] = {
          ...list[i],
          rsv: undefined,
          k: undefined,
          d: undefined,
          "k-d": undefined,
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
