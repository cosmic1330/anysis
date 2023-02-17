interface KdType {
  getRSV: (list: ListType) => ResRSV;
  getKD: (list: ListType) => ResKD;
}
type ListType = { c: number; h: number; l: number }[];
type ResRSV = { c: number; rsv?: number }[];
type ResKD = { c: number; rsv?: number; k?: number; d?: number; j?: number }[];
export default class Kd implements KdType {
  getRSV(list: ListType) {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 8) res[i] = { ...list[i], rsv: undefined };
      else {
        const low = Math.min(...list.slice(i - 8, i + 1).map((item) => item.l));
        const hight = Math.max(
          ...list.slice(i - 9, i + 1).map((item) => item.h)
        );
        const close = list[i].c;
        const rsv = ((close - low) / (hight - low)) * 100;
        res[i] = { ...list[i], rsv };
      }
    }
    return res;
  }

  getKD(list: ListType) {
    const res = [];
    let yesterdayK = 0;
    let yesterdayD = 0;
    for (let i = 0; i < list.length; i++) {
      if (i < 8)
        res[i] = { ...list[i], rsv: undefined, k: undefined, d: undefined };
      else {
        const low = Math.min(...list.slice(i - 8, i + 1).map((item) => item.l));
        const hight = Math.max(
          ...list.slice(i - 9, i + 1).map((item) => item.h)
        );
        const close = list[i].c;
        const rsv = ((close - low) / (hight - low)) * 100;
        if (i === 8) {
          const k = (2 / 3) * 50 + (1 / 3) * rsv;
          const d = (2 / 3) * 50 + (1 / 3) * k;
          const j = 3 * k - 2 * d;
          res[i] = { ...list[i], rsv, k, d, j };
          yesterdayK = k;
          yesterdayD = d;
        } else {
          const k = (2 / 3) * yesterdayK + (1 / 3) * rsv;
          const d = (2 / 3) * yesterdayD + (1 / 3) * k;
          const j = 3 * k - 2 * d;
          res[i] = { ...list[i], rsv, k, d, j };
          yesterdayK = k;
          yesterdayD = d;
        }
      }
    }
    return res;
  }
}
