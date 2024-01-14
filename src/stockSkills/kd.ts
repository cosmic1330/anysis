interface KdType {
  getRSV: (list: ListType) => ResRSV;
  getKD: (list: ListType) => ResKD;
}
type DataType = { c: number; h: number; l: number };
type ListType = DataType[];
type ResRSV = { c: number; rsv: number | null }[];
type ResKD = {
  c: number;
  rsv: number | null;
  k: number | null;
  d: number | null;
  "k-d": number | null;
}[];
export default class Kd implements KdType {
  init(data: DataType): {
    dataset: ListType;
    rsv: number | null;
    k: number | null;
    d: number | null;
    "k-d": number | null;
  } {
    return {
      dataset: [data],
      rsv: null,
      k: null,
      d: null,
      "k-d": null,
    };
  }

  next(
    data: DataType,
    preList: {
      dataset: ListType;
      rsv: number | null;
      k: number | null;
      d: number | null;
      "k-d": number | null;
    },
    type: number
  ) {
    preList.dataset.push(data);

    if (preList.dataset.length < type) {
      return {
        dataset: preList.dataset,
        rsv: null,
        k: null,
        d: null,
        "k-d": null,
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
      };
    }
  }

  getRSV(list: ListType) {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 8) res[i] = { ...list[i], rsv: null };
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
          rsv: null,
          k: null,
          d: null,
          "k-d": null,
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
