import { StockType } from "./types";

type NewStockType = Required<Pick<StockType, "v">> & StockType;

type NewStockListType = NewStockType[];

export type WeekResType = {
  dataset: NewStockListType;
  week: NewStockListType;
};

interface WeekType {
  init: (data: NewStockType) => WeekResType;
  next: (data: NewStockType, preList: WeekResType) => WeekResType;
}

export default class Week implements WeekType {
  init(data: NewStockType): WeekResType {
    return { dataset: [data], week: [] };
  }
  next(data: NewStockType, preList: WeekResType): WeekResType {
    preList.dataset.push(data);
    let index = 0;
    if(preList.dataset.length === 1) return preList;
    
    for (let i = 1; i < preList.dataset.length; i++) {
      const pre_day = new Date(
        preList.dataset[i - 1].t
          .toString()
          .replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
      ).getDay();
      const curr_day = new Date(
        preList.dataset[i].t
          .toString()
          .replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
      ).getDay();
      if (pre_day > curr_day) {
        index = i;
        break;
      }
    }
    // 以index拆分数组
    const week = preList.dataset.slice(0, index);
    const dataset = preList.dataset.slice(index);

    if (week.length > 0) {
      const weekData: NewStockType = {
        o: week[0]["o"],
        c: week[week.length - 1]["c"],
        t: week[week.length - 1]["t"],
        h: Math.max(...week.map((item) => item.h)),
        l: Math.min(...week.map((item) => item.l)),
        v: week.reduce((pre, current) => pre + current.v, 0),
      };
      preList.week.push(weekData);
    }

    preList.dataset = dataset;
    return preList;
  }
}
