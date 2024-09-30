import { StockType } from "../types";

type NewStockType = Required<Pick<StockType, 'v'>> & StockType;

type NewStockListType = NewStockType[];

export type ResType = {
  detail?: NewStockListType;
} & NewStockType;

function addDetail(
  obj: NewStockType,
  list: NewStockListType,
  detail: boolean
): ResType {
  if (detail) return { ...obj, detail: list };
  else return { ...obj };
}

export default function getWeekLine(
  list: NewStockListType,
  detail: boolean
): ResType[] {
  const res: ResType[] = [];
  let collectWeekData: NewStockListType = [];
  list.forEach((item, index) => {
    const year = item["t"]
      .toString()
      .replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
    const day = new Date(year).getDay();
    switch (day) {
      case 0 || 6:
        break;
      case 5: {
        collectWeekData.push(item);
        const obj = {
          o: collectWeekData[0]["o"],
          c: collectWeekData[collectWeekData.length - 1]["c"],
          t: collectWeekData[collectWeekData.length - 1]["t"],
          h: Math.max(...collectWeekData.map((item) => item.h)),
          l: Math.min(...collectWeekData.map((item) => item.l)),
          v: collectWeekData.reduce((pre, current) => pre + current.v, 0),
        };
        res.push(addDetail(obj, collectWeekData, detail));
        collectWeekData = [];
        break;
      }
      case 1:
        if (collectWeekData.length !== 0) {
          const obj = {
            o: collectWeekData[0]["o"],
            c: collectWeekData[collectWeekData.length - 1]["c"],
            t: collectWeekData[collectWeekData.length - 1]["t"],
            h: Math.max(...collectWeekData.map((item) => item.h)),
            l: Math.min(...collectWeekData.map((item) => item.l)),
            v: collectWeekData.reduce((pre, current) => pre + current.v, 0),
          };
          res.push(addDetail(obj, collectWeekData, detail));
        }
        collectWeekData = [];
        collectWeekData.push(item);
        break;
      default:
        collectWeekData.push(item);
        if (list.length - 1 === index) {
          const obj = {
            o: collectWeekData[0]["o"],
            c: collectWeekData[collectWeekData.length - 1]["c"],
            t: collectWeekData[collectWeekData.length - 1]["t"],
            h: Math.max(...collectWeekData.map((item) => item.h)),
            l: Math.min(...collectWeekData.map((item) => item.l)),
            v: collectWeekData.reduce((pre, current) => pre + current.v, 0),
          };
          res.push(addDetail(obj, collectWeekData, detail));
        }
        break;
    }
  });
  return res;
}
