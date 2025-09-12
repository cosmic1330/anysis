import { StockListType, StockType } from "./types";

export type MfiResType = {
  dataset: StockListType;
  mfi: number | null; // 改為可能為 null
  type: number;
  sumPositiveMF: number;
  sumNegativeMF: number;
};

export default class Mfi {
  // 計算典型價格 (Typical Price)
  private getTypicalPrice(data: StockType): number {
    return (data.h + data.l + data.c) / 3;
  }

  // 計算原始資金流量 (Raw Money Flow)
  private getRawMoneyFlow(data: StockType): number {
    return this.getTypicalPrice(data) * data.v;
  }

  init(data: StockType, type: number): MfiResType {
    return {
      dataset: [data],
      mfi: null, // 初始不輸出 MFI
      type,
      sumPositiveMF: 0,
      sumNegativeMF: 0,
    };
  }

  next(data: StockType, preList: MfiResType, type: number): MfiResType {
    preList.dataset.push(data);
    
    // 資料不足，不計算 MFI
    if (preList.dataset.length < type + 1) {
      return {
        ...preList,
        mfi: null,
        type,
        sumPositiveMF: 0,
        sumNegativeMF: 0,
      };
    }
    
    let sumPositiveMF = preList.sumPositiveMF;
    let sumNegativeMF = preList.sumNegativeMF;
    
    if (preList.dataset.length === type + 1) {
      // 第一次達到計算條件，初始化計算
      sumPositiveMF = 0;
      sumNegativeMF = 0;
      
      for (let i = 1; i <= type; i++) {
        const currentTP = this.getTypicalPrice(preList.dataset[i]);
        const prevTP = this.getTypicalPrice(preList.dataset[i - 1]);
        const rawMF = this.getRawMoneyFlow(preList.dataset[i]);
        
        if (currentTP > prevTP) {
          sumPositiveMF += rawMF;
        } else if (currentTP < prevTP) {
          sumNegativeMF += rawMF;
        }
      }
    } else {
      // 增量更新：移除最舊的影響，加上最新的影響
      
      // 移除最舊的資料影響
      const oldestTP = this.getTypicalPrice(preList.dataset[0]);
      const secondOldestTP = this.getTypicalPrice(preList.dataset[1]);
      const oldestRawMF = this.getRawMoneyFlow(preList.dataset[1]);
      
      if (secondOldestTP > oldestTP) {
        sumPositiveMF -= oldestRawMF;
      } else if (secondOldestTP < oldestTP) {
        sumNegativeMF -= oldestRawMF;
      }
      
      // 移除最舊的資料
      preList.dataset.shift();
      
      // 加上最新的資料影響
      const newTP = this.getTypicalPrice(preList.dataset[preList.dataset.length - 1]);
      const prevTP = this.getTypicalPrice(preList.dataset[preList.dataset.length - 2]);
      const newRawMF = this.getRawMoneyFlow(preList.dataset[preList.dataset.length - 1]);
      
      if (newTP > prevTP) {
        sumPositiveMF += newRawMF;
      } else if (newTP < prevTP) {
        sumNegativeMF += newRawMF;
      }
    }

    // 計算 MFI
    let mfi: number;
    if (sumNegativeMF === 0) {
      mfi = 100;
    } else {
      const moneyFlowRatio = sumPositiveMF / sumNegativeMF;
      mfi = 100 - (100 / (1 + moneyFlowRatio));
    }

    return { 
      dataset: preList.dataset, 
      type, 
      mfi, 
      sumPositiveMF, 
      sumNegativeMF 
    };
  }

  calculateMFI(prices: StockListType, period = 14): number[] {
    if (prices.length < period + 1) {
      return [];
    }

    const mfis: number[] = [];
    
    // 從 period 開始，確保有足夠的資料進行比較
    for (let endIdx = period; endIdx < prices.length; endIdx++) {
      let sumPositiveMF = 0;
      let sumNegativeMF = 0;
      
      // 計算 period 個交易日的資金流量
      // 從 endIdx - period + 1 到 endIdx，共 period 個資料點
      // 但比較是從 endIdx - period + 2 開始（因為要跟前一天比）
      for (let i = endIdx - period + 1; i <= endIdx; i++) {
        // 確保 i-1 >= 0，避免溢位
        if (i === 0) continue;
        
        const currentTP = this.getTypicalPrice(prices[i]);
        const prevTP = this.getTypicalPrice(prices[i - 1]);
        const rawMF = this.getRawMoneyFlow(prices[i]);
        
        if (currentTP > prevTP) {
          sumPositiveMF += rawMF;
        } else if (currentTP < prevTP) {
          sumNegativeMF += rawMF;
        }
      }
      
      // 計算 MFI
      if (sumNegativeMF === 0) {
        mfis.push(100);
      } else {
        const moneyFlowRatio = sumPositiveMF / sumNegativeMF;
        const mfi = 100 - (100 / (1 + moneyFlowRatio));
        mfis.push(mfi);
      }
    }

    return mfis;
  }
}