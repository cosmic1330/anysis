import { StockType } from "./types";

type NewStockType = Required<Pick<StockType, 'v'>> & StockType;

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
    const year = data.t
      .toString()
      .replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
    const day = new Date(year).getDay();
    if (day === 6 || day === 0)
      return { dataset: preList.dataset, week: preList.week };

    preList.dataset.push(data);
    if (day === 5) {
      const week: NewStockType = {
        o: preList.dataset[0]["o"],
        c: preList.dataset[preList.dataset.length - 1]["c"],
        t: preList.dataset[preList.dataset.length - 1]["t"],
        h: Math.max(...preList.dataset.map((item) => item.h)),
        l: Math.min(...preList.dataset.map((item) => item.l)),
        v: preList.dataset.reduce((pre, current) => pre + current.v, 0),
      };
      return { dataset: preList.dataset, week: [...preList.week, week] };
    } else {
      if (day === 1) {
        preList.dataset = [data];
      }
      return { dataset: preList.dataset, week: preList.week };
    }
  }
}
