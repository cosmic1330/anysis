type ListType = { c: number }[];
type ResRsi6Type = { c: number; rsi6: number | null }[];
type ResRsi12Type = { c: number; rsi12: number | null }[];
type ResAllRsiType = { c: number; rsi6: number | null; rsi12: number | null }[];

interface RsiType {
  getRsi6: (list: ListType) => ResRsi6Type;
  getRsi12: (list: ListType) => ResRsi12Type;
  getStartUpAvg: (list: ListType, count: number) => number;
  getStartDownAvg: (list: ListType, count: number) => number;
  getRsi: (UpAvg: number, DownAvg: number) => number;
}
export default class Rsi implements RsiType {
  getAllRsi(list: ListType): ResAllRsiType {
    const res = [];
    const rsi6 = this.getRsi6(list);
    const rsi12 = this.getRsi12(list);
    for (let i = 0; i < list.length; i++) {
      res[i] = Object.assign(list[i], rsi6[i], rsi12[i]);
    }
    return res;
  }

  getRsi6(list: ListType): ResRsi6Type {
    const res = [];
    // 前5筆
    for (let i = 0; i < 5; i++) {
      res[i] = { ...list[i], rsi6: null };
    }

    // 第6筆Rsi
    let beforeUpAvg = this.getStartUpAvg(list, 6);
    let beforeDownAvg = this.getStartDownAvg(list, 6);
    const firstRsi6 = this.getRsi(beforeUpAvg, beforeDownAvg);
    res[5] = { ...list[5], rsi6: firstRsi6 };

    // else
    for (let i = 6; i < list.length; i++) {
      let minusU = 0;
      let minusD = 0;
      const minusC = list[i]["c"] - list[i - 1]["c"];

      if (minusC > 0) {
        minusU = minusC;
      } else {
        minusD = minusC;
      }

      beforeUpAvg = (beforeUpAvg * 5) / 6 + minusU / 6;
      beforeDownAvg = (beforeDownAvg * 5) / 6 + Math.abs(minusD) / 6;
      const rsi6 = this.getRsi(beforeUpAvg, beforeDownAvg);
      res[i] = { ...list[i], rsi6: Math.round(rsi6 * 100) / 100 };
    }
    return res;
  }

  getRsi12(list: ListType): ResRsi12Type {
    const res = [];
    // 前11筆
    for (let i = 0; i < 11; i++) {
      res[i] = { ...list[i], rsi12: null };
    }

    // 第12筆Rsi
    let beforeUpAvg = this.getStartUpAvg(list, 12);
    let beforeDownAvg = this.getStartDownAvg(list, 12);
    const firstRsi12 = this.getRsi(beforeUpAvg, beforeDownAvg);
    res[11] = { ...list[11], rsi12: firstRsi12 };

    // else
    for (let i = 12; i < list.length; i++) {
      let minusU = 0;
      let minusD = 0;
      const minusC = list[i]["c"] - list[i - 1]["c"];

      if (minusC > 0) {
        minusU = minusC;
      } else {
        minusD = minusC;
      }

      beforeUpAvg = (beforeUpAvg * 11) / 12 + minusU / 12;
      beforeDownAvg = (beforeDownAvg * 11) / 12 + Math.abs(minusD) / 12;
      const rsi12 = this.getRsi(beforeUpAvg, beforeDownAvg);
      res[i] = { ...list[i], rsi12: Math.round(rsi12 * 100) / 100 };
    }
    return res;
  }

  getStartUpAvg(list: ListType, count: number): number {
    const start = list.slice(0, 5);
    let sum = 0;
    for (let i = 1; i < start.length; i++) {
      const minus = start[i]["c"] - start[i - 1]["c"];
      if (minus > 0) {
        sum += minus;
      }
    }
    return sum / count;
  }

  getStartDownAvg(list: ListType, count: number): number {
    const start = list.slice(0, 5);
    let sum = 0;
    for (let i = 1; i < start.length; i++) {
      const minus = start[i]["c"] - start[i - 1]["c"];
      if (minus < 0) {
        sum += minus;
      }
    }
    return Math.abs(sum / count);
  }
  getRsi(UpAvg: number, DownAvg: number): number {
    let res = 0;
    if (UpAvg + DownAvg !== 0) {
      res = (UpAvg / (UpAvg + DownAvg)) * 100;
    }
    return res;
  }
}
