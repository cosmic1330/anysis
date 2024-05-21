type DataType = { c: number; [key: string]: unknown };
type ListType = DataType[];
type ResMa5 = { c: number; ma5: number | null }[];
type ResMa10 = { c: number; ma10: number | null }[];
type ResMa20 = { c: number; ma20: number | null }[];
type ResMa60 = { c: number; ma60: number | null }[];
type ResMa = { c: number; ma: number | null }[];
type ResAllMa = {
  c: number;
  ma5: number | null;
  ma10: number | null;
  ma20: number | null;
  ma25: number | null;
  ma60: number | null;
}[];

interface MaType {
  init: (
    data: DataType,
    type: number
  ) => {
    dataset: ListType;
    ma: number;
    type: number;
    exclusionValue: { d: number; "d-1": number };
  };
  next: (
    data: DataType,
    preList: {
      dataset: ListType;
      ma: number;
      type: number;
      exclusionValue: { d: number; "d-1": number };
    },
    type: number
  ) => {
    dataset: ListType;
    ma: number;
    type: number;
    exclusionValue: { d: number; "d-1": number };
  };
  getAllMa: (list: ListType) => ResAllMa;
  getMa5: (list: ListType) => ResMa5;
  getMa10: (list: ListType) => ResMa10;
  getMa20: (list: ListType) => ResMa20;
  getMa60: (list: ListType) => ResMa60;
  getMa: (list: ListType, self: number) => ResMa;
}

export default class Ma implements MaType {
  init(data: DataType, type: number) {
    return { dataset: [data], ma: 0, type, exclusionValue: { d: 0, "d-1": 0 } };
  }
  next(
    data: DataType,
    preList: { dataset: ListType; ma: number; type: number },
    type: number
  ) {
    preList.dataset.push(data);
    if (preList.dataset.length < type) {
      return {
        dataset: preList.dataset,
        ma: 0,
        type,
        exclusionValue: { d: 0, "d-1": 0 },
      };
    } else {
      const exclusionValue = { d: preList.dataset[0].c, "d-1": 0 };
      if (preList.dataset.length > type) {
        exclusionValue["d-1"] = exclusionValue.d;
        preList.dataset.shift();
        exclusionValue.d = preList.dataset[0].c;
      }

      const sum = preList.dataset.reduce((pre, current) => pre + current.c, 0);
      const ma = Math.round((sum / type) * 100) / 100;
      return { dataset: preList.dataset, ma, type, exclusionValue };
    }
  }
  getAllMa(list: ListType): ResAllMa {
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

  getMa5(list: ListType): ResMa5 {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 4) res[i] = { ...list[i], ma5: null };
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
      if (i < 9) res[i] = { ...list[i], ma10: null };
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
      if (i < 19) res[i] = { ...list[i], ma20: null };
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

  getMa60(list: ListType): ResMa60 {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 59) res[i] = { ...list[i], ma60: null };
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

  getMa(list: ListType, self: number): ResMa {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < self - 1) res[i] = { ...list[i], ma: null };
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
