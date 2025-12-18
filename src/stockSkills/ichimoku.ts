import { StockListType, StockType } from "./types";

type NewStockType = Required<Pick<StockType, "v" | "h" | "l" | "c">> &
  StockType;

export type IchimokuValType = {
  tenkan: number | null;
  kijun: number | null;
  senkouA: number | null;
  senkouB: number | null;
  chikou: number | null;
};

export type IchimokuResType = {
  // 這裡改為唯讀，提醒使用者不要隨意修改，但我們內部會用 push 優化
  dataset: Readonly<StockListType>;
  ichimoku: IchimokuValType;
};

interface IchimokuType {
  init: (data: NewStockType) => IchimokuResType;
  next: (data: NewStockType, preList: IchimokuResType) => IchimokuResType;
}

export default class Ichimoku implements IchimokuType {
  init(data: NewStockType): IchimokuResType {
    const dataset = [data];
    return {
      dataset, // 這裡回傳 array reference
      ichimoku: this.calcIchimoku(dataset, dataset.length - 1),
    };
  }

  /**
   * 優化說明：
   * 如果 preList.dataset 是一個可變陣列，我們直接 push 以達到最佳效能 O(1)。
   * 如果你的框架 (如 React state) 強制要求 immutable，則需要改回 [...prev, data] 的寫法。
   * 下面的寫法假設可以 Mutation (這在 Class 內部運算或 Backend 處理很常見)。
   */
  next(data: NewStockType, preList: IchimokuResType): IchimokuResType {
    // 強制轉型以進行 push (避免 typescript 報錯 readonly)
    const mutableDataset = preList.dataset as StockListType;
    mutableDataset.push(data);

    // 只需要計算最後一筆
    const currentResult = this.calcIchimoku(
      mutableDataset,
      mutableDataset.length - 1
    );

    return {
      dataset: mutableDataset,
      ichimoku: currentResult,
    };
  }

  // 核心計算邏輯
  private calcIchimoku(dataList: StockListType, i: number): IchimokuValType {
    const currentData = dataList[i];

    // 優化：直接傳入 index 與 list，不產生新陣列
    const tenkanVal = this.getMidPrice(dataList, i, 9);
    const kijunVal = this.getMidPrice(dataList, i, 26);
    const senkouBVal = this.getMidPrice(dataList, i, 52);

    let senkouAVal: number | null = null;
    if (tenkanVal !== null && kijunVal !== null) {
      senkouAVal = (tenkanVal + kijunVal) / 2;
    }

    return {
      tenkan: tenkanVal,
      kijun: kijunVal,
      senkouA: senkouAVal,
      senkouB: senkouBVal,
      chikou: currentData.c,
    };
  }

  /**
   * 優化：
   * 1. 移除 .slice()，避免產生 Garbage Collection。
   * 2. 使用反向迴圈 (i--)，通常在 JS 引擎中微幅快一點，且語意上是「從現在往回看」。
   */
  private getMidPrice(
    list: StockListType,
    currentIndex: number,
    periods: number
  ): number | null {
    if (currentIndex < periods - 1) {
      return null;
    }

    // 計算視窗的起始 index
    const start = currentIndex - (periods - 1);

    // 初始化最大最小
    // 小技巧：直接拿第一個值當初始值，避免 Infinity 的比較
    let maxH = list[start].h;
    let minL = list[start].l;

    // 從 start + 1 開始遍歷到 currentIndex
    for (let j = start + 1; j <= currentIndex; j++) {
      const { h, l } = list[j];
      if (h > maxH) maxH = h;
      if (l < minL) minL = l;
    }

    return (maxH + minL) / 2;
  }
}
