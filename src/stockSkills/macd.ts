type ItemType = { h: number; l: number; c: number };
type ResEMA12Type = { h: number; l: number; c: number; EMA12?: number }[];
type ResEMA26Type = { h: number; l: number; c: number; EMA26?: number }[];
type ResDifType = { h: number; l: number; c: number; DIF?: number }[];
type ResMacd9Type = {
  h: number;
  l: number;
  c: number;
  MACD9?: number;
  OSC?: number;
}[];
type ResAllMacdType = {
  h: number;
  l: number;
  c: number;
  EMA12?: number;
  EMA26?: number;
  DIF?: number;
  MACD9?: number;
  OSC?: number;
}[];

interface MacdType {
  init: (data: ItemType) => {
    dataset: ItemType[];
    ema12?: number;
    ema26?: number;
    dif: number[];
    macd?: number;
    osc?: number;
  };
  next: (
    data: ItemType,
    preList: {
      dataset: ItemType[];
      ema12?: number;
      ema26?: number;
      dif: number[];
      macd?: number;
      osc?: number;
    }
  ) => {
    dataset: ItemType[];
    ema12?: number;
    ema26?: number;
    dif: number[];
    macd?: number;
    osc?: number;
  };
  getMACD: (list: ItemType[]) => ResAllMacdType;
  getDI: (item: ItemType) => number;
  getStartEMA: (list: ItemType[]) => number;
  getEMA12: (list: ItemType[]) => ResEMA12Type;
  getEMA26: (list: ItemType[]) => ResEMA26Type;
  getDIF: (
    list: ItemType[],
    ResEMA12: ResEMA12Type,
    ResEMA26: ResEMA26Type
  ) => ResDifType;
  getMACD9: (list: ItemType[], DIF: ResDifType) => ResMacd9Type;
}
export default class MACD implements MacdType {
  init(data: ItemType): {
    dataset: ItemType[];
    ema12?: number;
    ema26?: number;
    dif: number[];
    macd?: number;
    osc?: number;
  } {
    return {
      dataset: [data],
      ema12: undefined,
      ema26: undefined,
      dif: [],
      macd: undefined,
      osc: undefined,
    };
  }

  next(
    data: ItemType,
    preList: {
      dataset: ItemType[];
      ema12?: number;
      ema26?: number;
      dif: number[];
      macd?: number;
      osc?: number;
    }
  ) {
    preList.dataset.push(data);
    if (preList.dataset.length > 34) preList.dataset.shift();
    // EMA12
    let ema12 = undefined;
    if (preList.dataset.length === 12) {
      ema12 = this.getStartEMA(preList.dataset);
      ema12 = (ema12 * 11) / 13 + (this.getDI(data) * 2) / 13;
      ema12 = Math.round(ema12 * 100) / 100;
    } else if (preList.dataset.length > 12 && preList.ema12) {
      ema12 = (preList.ema12 * 11) / 13 + (this.getDI(data) * 2) / 13;
      ema12 = Math.round(ema12 * 100) / 100;
    }

    // EMA26
    let ema26 = undefined;
    if (preList.dataset.length === 26) {
      ema26 = this.getStartEMA(preList.dataset);
      ema26 = (ema26 * 25) / 27 + (this.getDI(data) * 2) / 27;
      ema26 = Math.round(ema26 * 100) / 100;
    } else if (preList.dataset.length > 26 && preList.ema26) {
      ema26 = (preList.ema26 * 25) / 27 + (this.getDI(data) * 2) / 27;
      ema26 = Math.round(ema26 * 100) / 100;
    }

    // DIF
    let dif = undefined;
    if (ema12 && ema26) {
      dif = ema12 - ema26;
      dif = Math.round(dif * 100) / 100;
      preList.dif?.push(dif);
      if (preList.dif.length > 9) preList.dif?.shift();
    }

    // MACD & OSC
    let macd = undefined;
    let osc = undefined;
    if (preList.dif.length === 9) {
      if (preList.macd === undefined) {
        macd = preList.dif.reduce(
          (accumulator, currentValue) => accumulator + currentValue
        );
        for (let i = 0; i < 9; i++) {
          const item = preList.dif[i];
          macd = macd + ((item - macd) * 2) / 10;
          macd = Math.round(macd * 100) / 100;
          osc = item - macd;
          osc = Math.round(osc * 100) / 100;
        }
      } else {
        macd = preList.macd + (((dif as number) - preList.macd) * 2) / 10;
        macd = Math.round(macd * 100) / 100;
        const item = preList.dif[preList.dif.length - 1];
        osc = item - macd;
        osc = Math.round(osc * 100) / 100;
      }
    }

    return {
      dataset: preList.dataset,
      ema12,
      ema26,
      dif: preList.dif,
      macd: macd,
      osc: osc,
    };
  }

  getMACD(list: ItemType[]): ResAllMacdType {
    // 首筆RSI
    const res = [];
    const EMA12 = this.getEMA12(list);
    const EMA26 = this.getEMA26(list);
    const DIF = this.getDIF(list, EMA12, EMA26);
    const MACD9 = this.getMACD9(list, DIF);
    for (let i = 0; i < list.length; i++) {
      res[i] = Object.assign(list[i], DIF[i], MACD9[i]);
    }
    return res;
  }
  getDI(item: ItemType): number {
    return (item["h"] + item["l"] + 2 * item["c"]) / 4;
  }

  getStartEMA(arr: ItemType[]): number {
    let sum = 0;
    arr.forEach((item: ItemType) => {
      const DI = this.getDI(item);
      sum += DI;
    });
    return sum / arr.length;
  }

  getEMA12(list: ItemType[]): ResEMA12Type {
    const start = list.slice(0, 11);
    let beforeEMA12 = this.getStartEMA(start);
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 12) res[i] = { ...list[i], EMA12: undefined };
      else {
        beforeEMA12 = (beforeEMA12 * 11) / 13 + (this.getDI(list[i]) * 2) / 13;
        res[i] = { ...list[i], EMA12: beforeEMA12 };
      }
    }
    return res;
  }

  getEMA26(list: ItemType[]): ResEMA26Type {
    const start = list.slice(0, 25);
    let beforeEMA26 = this.getStartEMA(start);
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 26) res[i] = { ...list[i], EMA26: undefined };
      else {
        beforeEMA26 = (beforeEMA26 * 25) / 27 + (this.getDI(list[i]) * 2) / 27;
        res[i] = { ...list[i], EMA26: beforeEMA26 };
      }
    }
    return res;
  }

  getDIF(
    list: ItemType[],
    ResEMA12: ResEMA12Type,
    ResEMA26: ResEMA26Type
  ): ResDifType {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 26) res[i] = { ...list[i], DIF: undefined };
      else {
        const EMA12 = ResEMA12?.[i]?.["EMA12"] && ResEMA12[i]["EMA12"];
        const EMA26 = ResEMA26?.[i]?.["EMA26"] && ResEMA26[i]["EMA26"];
        const DIF = <number>EMA12 - <number>EMA26;
        res[i] = { ...list[i], DIF };
      }
    }
    return res;
  }

  getMACD9(list: ItemType[], DIF: ResDifType): ResMacd9Type {
    const res = [];
    let beforeMACD9 = 0;
    for (let i = 0; i < list.length; i++) {
      if (i < 26) res[i] = { ...list[i], MACD9: undefined, OSC: undefined };
      else if (i === 26) {
        const MACD9 = DIF.slice(26, 34)
          .map((item) => (item?.DIF ? item["DIF"] : 0))
          .reduce((accumulator, currentValue) => accumulator + currentValue);
        const OSC = (DIF[i]["DIF"] as number) - MACD9;
        res[26] = { ...list[i], MACD9, OSC };
        beforeMACD9 = MACD9;
      } else {
        const MACD9 =
          beforeMACD9 + (((DIF[i]["DIF"] as number) - beforeMACD9) * 2) / 10;
        const OSC = (DIF[i]["DIF"] as number) - MACD9;
        res[i] = { ...list[i], MACD9, OSC };
        beforeMACD9 = MACD9;
      }
    }
    return res;
  }
}
