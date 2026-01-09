import { StockListType, StockType } from "./types";

export type CmfResType = {
  dataset: StockListType;
  cmf: number;
  ema: number; // EMA of CMF
  cmfList: number[]; // For EMA seed calculation
};

export default class Cmf {
  init(data: StockType): CmfResType {
    return {
      dataset: [data],
      cmf: 0,
      ema: 0,
      cmfList: [],
    };
  }

  next(
    data: StockType,
    preList: CmfResType,
    period: number = 20,
    emaPeriod: number = 10
  ): CmfResType {
    preList.dataset.push(data);

    if (preList.dataset.length > period) {
      preList.dataset.shift();
    }

    let cmf = 0;

    // Calculate CMF
    if (preList.dataset.length === period) {
      let sumMfVol = 0;
      let sumVol = 0;

      for (let i = 0; i < preList.dataset.length; i++) {
        const item = preList.dataset[i];
        const h = item.h;
        let l = item.l;
        const c = item.c;
        const v = item.v;

        if (h === l) {
          sumVol += v;
          continue;
        }

        const multiplier = (c - l - (h - c)) / (h - l);
        const mfVol = multiplier * v;

        sumMfVol += mfVol;
        sumVol += v;
      }

      if (sumVol !== 0) {
        cmf = sumMfVol / sumVol;
      }
    }

    // Calculate EMA of CMF
    let ema = preList.ema;
    let cmfList = [...preList.cmfList];

    // Use current 'cmf' only if we had enough data for it (dataset.length === period)
    if (preList.dataset.length === period) {
      cmfList.push(cmf);
    }

    if (cmfList.length === emaPeriod) {
      // First time we have enough data to calculate EMA (SMA seed)
      const sum = cmfList.reduce((pre, current) => pre + current, 0);
      ema = sum / emaPeriod;
    } else if (cmfList.length > emaPeriod) {
      cmfList.shift();
      // EMA formula: (Current * 2 + (period - 1) * PreviousEMA) / (period + 1)
      ema = (cmf * 2 + (emaPeriod - 1) * preList.ema) / (emaPeriod + 1);
    }

    return {
      dataset: preList.dataset,
      cmf,
      ema,
      cmfList,
    };
  }
}
