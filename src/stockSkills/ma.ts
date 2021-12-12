type ListType = { c: number }[];
type ResMa5 = { c: number; ma5?: number }[];
type ResMa10 = { c: number; ma10?: number }[];
type ResMa20 = { c: number; ma20?: number }[];
type ResBoll = { c: number; ma25?: number; bollUb?: number; bollLb?: number }[];
type ResAllMa = {
  c: number;
  ma5?: number;
  ma10?: number;
  ma20?: number;
  ma25?: number;
  bollUb?: number;
  bollLb?: number;
}[];

interface MaType {
  getAllMa: (list: ListType) => ResAllMa;
  getMa5: (list: ListType) => ResMa5;
  getMa10: (list: ListType) => ResMa10;
  getMa20: (list: ListType) => ResMa20;
  getBoll: (list: ListType) => ResBoll;
}

export default class Ma implements MaType {
  getAllMa(list: ListType): ResAllMa {
    const res = [];
    const responseMa5 = this.getMa5(list);
    const responseMa10 = this.getMa10(list);
    const responseMa20 = this.getMa20(list);
    const responseBoll = this.getBoll(list);
    for (let i = 0; i < list.length; i++) {
      res[i] = Object.assign(
        list[i],
        responseMa5[i],
        responseMa10[i],
        responseMa20[i],
        responseBoll[i]
      );
    }
    return res;
  }

  getMa5(list: ListType): ResMa5 {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 4) res[i] = { ...list[i], ma5: undefined };
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

  getMa10(list: ListType): ResMa10 {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 9) res[i] = { ...list[i], ma10: undefined };
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

  getMa20(list: ListType): ResMa20 {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 19) res[i] = { ...list[i], ma20: undefined };
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

  getBoll(list: ListType): ResBoll {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 24)
        res[i] = {
          ...list[i],
          ma25: undefined,
          bollUb: undefined,
          bollLb: undefined,
        };
      else {
        // ma25
        const sumMa25: number = list
          .slice(i - 24, i + 1)
          .reduce((pre, current) => pre + current.c, 0);
        const ma25: number = Math.round((sumMa25 / 25) * 100) / 100;
        // 標準差
        const sumBase: number = res
          .slice(i - 24, i + 1)
          .reduce((pre, current) => {
            return ma25 !== undefined
              ? pre + Math.pow(current.c - ma25, 2)
              : pre;
          }, 0);
        const base: number = Math.round(Math.sqrt(sumBase / 25) * 100) / 100;
        res[i] = {
          ...list[i],
          ma25,
          bollUb: ma25 + 2 * base,
          bollLb: ma25 - 2 * base,
        };
      }
    }
    return res;
  }
}
