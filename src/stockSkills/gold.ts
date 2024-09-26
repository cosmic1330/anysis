import type { ResType } from "./utils/getWeekLine";
import getWeekLine from "./utils/getWeekLine.js";
import { StockListType } from "./types";
import { StockType } from "./types";

export type GetGoldResType = {
  lowestPoint: number;
  highestPoint: number;
  superStrong: number;
  strong: number;
  middle: number;
  weak: number;
  superWeak: number;
};
export type FindHightestResType = {
  [key: string]: StockType;
};
export type FindLowestResType = {
  [key: string]: StockType;
};

interface GoldClassType {
  findHighPoint: (list: StockListType) => FindHightestResType;
  findLowPoint: (list: StockListType) => FindLowestResType;
  getGold: (highestPoint: number, lowestPoint: number) => GetGoldResType;
}

export default class Gold implements GoldClassType {
  findHighPoint(list: StockListType): FindHightestResType {
    const weekLine = getWeekLine(list, true);
    const hightPoints: FindHightestResType = {};
    for (let i = 0; i < weekLine.length; i++) {
      let hightPoint: ResType | undefined = undefined;
      switch (i) {
        case 0:
          {
            const h1 = weekLine[i].h;
            const h2 = weekLine[i + 1].h;
            const h3 = weekLine[i + 2].h;
            if (h1 > h2 && h1 > h3) hightPoint = weekLine[i];
          }
          break;
        case 1:
          {
            const h1 = weekLine[i - 1].h;
            const h2 = weekLine[i].h;
            const h3 = weekLine[i + 1].h;
            const h4 = weekLine[i + 2].h;
            if (h2 > h1 && h2 > h3 && h2 > h4) hightPoint = weekLine[i];
          }
          break;
        case weekLine.length - 3:
          {
            const h1 = weekLine[i - 2].h;
            const h2 = weekLine[i - 1].h;
            const h3 = weekLine[i].h;
            const h4 = weekLine[i + 1].h;
            const h5 = weekLine[i + 2].h;
            if (h3 > h1 && h3 > h2 && h3 > h4 && h3 > h5)
              hightPoint = weekLine[i];
          }
          break;
        case weekLine.length - 2:
          {
            const h1 = weekLine[i - 2].h;
            const h2 = weekLine[i - 1].h;
            const h3 = weekLine[i].h;
            const h4 = weekLine[i + 1].h;
            if (h3 > h1 && h3 > h2 && h3 > h4) hightPoint = weekLine[i];
          }
          break;
        case weekLine.length - 1:
          {
            const h1 = weekLine[i - 2].h;
            const h2 = weekLine[i - 1].h;
            const h3 = weekLine[i].h;
            if (h3 > h2 && h3 > h1) hightPoint = weekLine[i];
          }
          break;
        default:
          {
            const h1 = weekLine[i - 2].h;
            const h2 = weekLine[i - 1].h;
            const h3 = weekLine[i].h;
            const h4 = weekLine[i + 1].h;
            const h5 = weekLine[i + 2].h;
            const h6 = weekLine[i + 3].h;
            if (h3 > h2 && h3 > h4 && h3 > h5 && h3 > h6)
              hightPoint = weekLine[i];
            if (h3 > h1 && h3 > h2 && h3 > h4 && h3 > h5)
              hightPoint = weekLine[i];
          }
          break;
      }
      if (hightPoint && hightPoint["detail"]) {
        const h = hightPoint.h;
        const theHight = hightPoint.detail.find((item) => item.h === h);
        delete hightPoint.detail;
        if (theHight) hightPoints[theHight?.t] = theHight;
      }
    }
    return hightPoints;
  }

  findLowPoint(list: StockListType): FindLowestResType {
    const weekLine = getWeekLine(list, true);
    const lowPoints: FindLowestResType = {};
    for (let i = 0; i < weekLine.length; i++) {
      let lowPoint: ResType | undefined = undefined;
      switch (i) {
        case 0:
          {
            const l1 = weekLine[i].l;
            const l2 = weekLine[i + 1].l;
            const l3 = weekLine[i + 2].l;
            if (l1 < l2 && l1 < l3) lowPoint = weekLine[i];
          }
          break;
        case 1:
          {
            const l1 = weekLine[i - 1].l;
            const l2 = weekLine[i].l;
            const l3 = weekLine[i + 1].l;
            const l4 = weekLine[i + 2].l;
            if (l2 < l1 && l2 < l3 && l2 < l4) lowPoint = weekLine[i];
          }
          break;
        case weekLine.length - 3:
          {
            const l1 = weekLine[i - 2].l;
            const l2 = weekLine[i - 1].l;
            const l3 = weekLine[i].l;
            const l4 = weekLine[i + 1].l;
            const l5 = weekLine[i + 2].l;
            if (l3 < l1 && l3 < l2 && l3 < l4 && l3 < l5)
              lowPoint = weekLine[i];
          }
          break;
        case weekLine.length - 2:
          {
            const l1 = weekLine[i - 2].l;
            const l2 = weekLine[i - 1].l;
            const l3 = weekLine[i].l;
            const l4 = weekLine[i + 1].l;
            if (l3 < l1 && l3 < l2 && l3 < l4) lowPoint = weekLine[i];
          }
          break;
        case weekLine.length - 1:
          {
            const l1 = weekLine[i - 2].l;
            const l2 = weekLine[i - 1].l;
            const l3 = weekLine[i].l;
            if (l3 < l2 && l3 < l1) lowPoint = weekLine[i];
          }
          break;
        default:
          {
            const l1 = weekLine[i - 2].l;
            const l2 = weekLine[i - 1].l;
            const l3 = weekLine[i].l;
            const l4 = weekLine[i + 1].l;
            const l5 = weekLine[i + 2].l;
            const l6 = weekLine[i + 3].l;
            if (l3 < l2 && l3 < l4 && l3 < l5 && l3 < l6)
              lowPoint = weekLine[i];
            if (l3 < l1 && l3 < l2 && l3 < l4 && l3 < l5)
              lowPoint = weekLine[i];
          }
          break;
      }
      if (lowPoint && lowPoint["detail"]) {
        const l = lowPoint.l;
        const theLow = lowPoint.detail.find((item) => item.l === l);
        delete lowPoint.detail;
        if (theLow) lowPoints[theLow?.t] = theLow;
      }
    }
    return lowPoints;
  }

  getGold(highestPoint: number, lowestPoint: number): GetGoldResType {
    const res: GetGoldResType = {
      lowestPoint,
      highestPoint,
      superStrong:
        Math.round(
          (highestPoint - (highestPoint - lowestPoint) * 0.191) * 100
        ) / 100,
      strong:
        Math.round(
          (highestPoint - (highestPoint - lowestPoint) * 0.382) * 100
        ) / 100,
      middle:
        Math.round((highestPoint - (highestPoint - lowestPoint) * 0.5) * 100) /
        100,
      weak:
        Math.round(
          (highestPoint - (highestPoint - lowestPoint) * 0.618) * 100
        ) / 100,
      superWeak:
        Math.round(
          (highestPoint - (highestPoint - lowestPoint) * 0.809) * 100
        ) / 100,
    };
    return res;
  }
}
