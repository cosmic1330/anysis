import { StockListType, StockType } from "./types";
export type MaResType = {
  dataset: StockListType;
  ma: number;
  type: number;
  exclusionValue: { "d+1": number; d: number; "d-1": number };
};

type ResMa5 = { c: number; ma5: number }[];
type ResMa10 = { c: number; ma10: number }[];
type ResMa20 = { c: number; ma20: number }[];
type ResMa60 = { c: number; ma60: number }[];
type ResMa = { c: number; ma: number }[];
type ResAllMa = {
  c: number;
  ma5: number;
  ma10: number;
  ma20: number;
  ma25: number;
  ma60: number;
}[];

interface MaType {
  init: (data: StockType, type: number) => MaResType;
  next: (data: StockType, preList: MaResType, type: number) => MaResType;
  getAllMa: (list: StockListType) => ResAllMa;
  getMa5: (list: StockListType) => ResMa5;
  getMa10: (list: StockListType) => ResMa10;
  getMa20: (list: StockListType) => ResMa20;
  getMa60: (list: StockListType) => ResMa60;
  getMa: (list: StockListType, self: number) => ResMa;
}

export default class Ma implements MaType {
  init(data: StockType, type: number) {
    return {
      dataset: [data],
      ma: 0,
      type,
      exclusionValue: { "d+1": 0, d: 0, "d-1": 0 },
    };
  }
  next(
    data: StockType,
    preList: { dataset: StockListType; ma: number; type: number },
    type: number
  ) {
    preList.dataset.push(data);
    if (preList.dataset.length < type) {
      return {
        dataset: preList.dataset,
        ma: 0,
        type,
        exclusionValue: { "d+1": 0, d: 0, "d-1": 0 },
      };
    } else {
      const exclusionValue = {
        "d+1": preList.dataset[1].c,
        d: preList.dataset[0].c,
        "d-1": 0,
      };
      if (preList.dataset.length > type) {
        exclusionValue["d-1"] = exclusionValue.d;
        preList.dataset.shift();
        exclusionValue["d+1"] = preList.dataset[1].c;
        exclusionValue.d = preList.dataset[0].c;
      }

      const sum = preList.dataset.reduce((pre, current) => pre + current.c, 0);
      const ma = Math.round((sum / type) * 100) / 100;
      return { dataset: preList.dataset, ma, type, exclusionValue };
    }
  }
  getAllMa(list: StockListType): ResAllMa {
    const res = [];
    const responseMa5 = this.getMa5(list);
    const responseMa10 = this.getMa10(list);
    const responseMa20 = this.getMa20(list);
    const responseMa60 = this.getMa60(list);
    for (let i = 0; i < list.length; i++) {
      res[i] = Object.assign(
        list[i],
        responseMa5[i],
        responseMa10[i],
        responseMa20[i],
        responseMa60[i]
      );
    }
    return res;
  }

  getMa5(list: StockListType): ResMa5 {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 4) res[i] = { ...list[i], ma5: 0 };
      else {
        const sum = list
          .slice(i - 4, i + 1)
          .reduce((pre, current) => pre + current.c, 0);
        const ma5 = Math.round((sum / 5) * 100) / 100;
        res[i] = { ...list[i], ma5 };
      }
    }
    return res;
  }

  getMa10(list: StockListType): ResMa10 {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 9) res[i] = { ...list[i], ma10: 0 };
      else {
        const sum = list
          .slice(i - 9, i + 1)
          .reduce((pre, current) => pre + current.c, 0);
        const ma10 = Math.round((sum / 10) * 100) / 100;
        res[i] = { ...list[i], ma10 };
      }
    }
    return res;
  }

  getMa20(list: StockListType): ResMa20 {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 19) res[i] = { ...list[i], ma20: 0 };
      else {
        const sum = list
          .slice(i - 19, i + 1)
          .reduce((pre, current) => pre + current.c, 0);
        const ma20 = Math.round((sum / 20) * 100) / 100;
        res[i] = { ...list[i], ma20 };
      }
    }
    return res;
  }

  getMa60(list: StockListType): ResMa60 {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 59) res[i] = { ...list[i], ma60: 0 };
      else {
        const sum = list
          .slice(i - 59, i + 1)
          .reduce((pre, current) => pre + current.c, 0);
        const ma60 = Math.round((sum / 60) * 100) / 100;
        res[i] = { ...list[i], ma60 };
      }
    }
    return res;
  }

  getMa(list: StockListType, self: number): ResMa {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < self - 1) res[i] = { ...list[i], ma: 0 };
      else {
        const sum = list
          .slice(i - (self - 1), i + 1)
          .reduce((pre, current) => pre + current.c, 0);
        const ma = Math.round((sum / self) * 100) / 100;
        res[i] = { ...list[i], ma };
      }
    }
    return res;
  }
}
