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
