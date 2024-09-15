type DataType = { h: number; l: number; c: number };
type ListType = DataType[];
type ResWilliams9Type = { c: number; williams9: number | null }[];
type ResWilliams18Type = { c: number; williams18: number | null }[];
type ResAllWilliamsType = {
  c: number;
  williams18: number | null;
  williams9: number | null;
}[];

interface WilliamsType {
  init: (
    data: DataType,
    type: number
  ) => {
    dataset: ListType;
    williams: number;
    type: number;
  };
  next: (
    data: DataType,
    preList: {
      dataset: ListType;
      williams: number;
      type: number;
    },
    type: number
  ) => {
    dataset: ListType;
    williams: number;
    type: number;
  };
  getWilliams9: (list: ListType) => ResWilliams9Type;
  getWilliams18: (list: ListType) => ResWilliams18Type;
  getAllWillams(list: ListType): ResAllWilliamsType;
}
export default class Williams implements WilliamsType {
  init(data: DataType, type: number) {
    return { dataset: [data], williams: 0, type };
  }
  next(
    data: DataType,
    preList: { dataset: ListType; williams: number; type: number },
    type: number
  ) {
    preList.dataset.push(data);
    if (preList.dataset.length < type) {
      return {
        dataset: preList.dataset,
        williams: 0,
        type,
      };
    } else {
      if (preList.dataset.length > type) {
        preList.dataset.shift();
      }
      const maxList = preList.dataset.map((item) => item["h"]);
      const minList = preList.dataset.map((item) => item["l"]);
      const max = Math.max(...maxList);
      const min = Math.min(...minList);
      const close = data.c;
      let williams = ((max - close) / (max - min)) * -100;
      williams = Math.round(williams * 100) / 100;

      return { dataset: preList.dataset, williams, type };
    }
  }

  getAllWillams(list: ListType): ResAllWilliamsType {
    const res = [];
    const williams9 = this.getWilliams9(list);
    const williams18 = this.getWilliams18(list);
    for (let i = 0; i < list.length; i++) {
      res[i] = Object.assign(list[i], williams9[i], williams18[i]);
    }
    return res;
  }

  getWilliams9(list: ListType): ResWilliams9Type {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 9) res[i] = { ...list[i], williams9: null };
      else {
        const maxList = list.slice(i - 8, i).map((item) => item["h"]);
        const minList = list.slice(i - 8, i).map((item) => item["l"]);
        const max = Math.max(...maxList);
        const min = Math.min(...minList);
        const close = list[i]["c"];
        const williams9 = ((max - close) / (max - min)) * -100;
        res[i] = { ...list[i], williams9: Math.round(williams9 * 100) / 100 };
      }
    }
    return res;
  }

  getWilliams18(list: ListType): ResWilliams18Type {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      if (i < 18) res[i] = { ...list[i], williams18: null };
      else {
        const maxList = list.slice(i - 17, i).map((item) => item["h"]);
        const minList = list.slice(i - 17, i).map((item) => item["l"]);
        const max = Math.max(...maxList);
        const min = Math.min(...minList);
        const close = list[i]["c"];
        const williams18 = ((max - close) / (max - min)) * -100;
        res[i] = { ...list[i], williams18: Math.round(williams18 * 100) / 100 };
      }
    }
    return res;
  }
}
