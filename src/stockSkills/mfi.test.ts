import Mfi, { MfiResType } from './mfi';
import { StockType } from './types';

describe('MFI (Money Flow Index) Algorithm', () => {
  let mfi: Mfi;

  beforeEach(() => {
    mfi = new Mfi();
  });

  // 測試用的股票資料
  const createStockData = (high: number, low: number, close: number, volume: number): StockType => ({
    h: high,
    l: low,
    c: close,
    v: volume,
    o: close, // 開盤價用收盤價代替，這裡不影響MFI計算
    t: Date.now()
  });

  describe('init method', () => {
    it('should initialize with correct default values', () => {
      const stockData = createStockData(100, 95, 98, 1000);
      const result = mfi.init(stockData, 14);

      expect(result).toEqual({
        dataset: [stockData],
        mfi: null,
        type: 14,
        sumPositiveMF: 0,
        sumNegativeMF: 0,
      });
    });

    it('should work with different period types', () => {
      const stockData = createStockData(100, 95, 98, 1000);
      const result = mfi.init(stockData, 5);

      expect(result.type).toBe(5);
      expect(result.dataset).toHaveLength(1);
    });
  });

  describe('next method - insufficient data', () => {
    it('should return null MFI when data is insufficient', () => {
      let result = mfi.init(createStockData(100, 95, 98, 1000), 3);
      
      // 第二個資料點
      result = mfi.next(createStockData(102, 97, 100, 1200), result, 3);
      expect(result.mfi).toBeNull();
      expect(result.dataset).toHaveLength(2);

      // 第三個資料點
      result = mfi.next(createStockData(105, 99, 103, 1500), result, 3);
      expect(result.mfi).toBeNull();
      expect(result.dataset).toHaveLength(3);
    });
  });

  describe('next method - sufficient data', () => {
    it('should calculate MFI correctly when reaching minimum period', () => {
      const period = 3;
      let result = mfi.init(createStockData(100, 95, 98, 1000), period);
      
      // 添加資料直到滿足計算條件
      result = mfi.next(createStockData(102, 97, 100, 1200), result, period); // TP上升
      result = mfi.next(createStockData(105, 99, 103, 1500), result, period); // TP上升  
      result = mfi.next(createStockData(103, 98, 101, 1300), result, period); // TP下降

      expect(result.mfi).not.toBeNull();
      expect(typeof result.mfi).toBe('number');
      expect(result.mfi).toBeGreaterThanOrEqual(0);
      expect(result.mfi).toBeLessThanOrEqual(100);
      expect(result.dataset).toHaveLength(period + 1);
    });

    it('should handle all positive money flows (MFI = 100)', () => {
      const period = 2;
      let result = mfi.init(createStockData(100, 95, 98, 1000), period);
      
      // 所有後續價格都上升
      result = mfi.next(createStockData(102, 97, 100, 1200), result, period);
      result = mfi.next(createStockData(105, 99, 103, 1500), result, period);

      expect(result.mfi).toBe(100);
    });

    it('should maintain sliding window correctly', () => {
      const period = 2;
      let result = mfi.init(createStockData(100, 95, 98, 1000), period);
      
      result = mfi.next(createStockData(102, 97, 100, 1200), result, period);
      result = mfi.next(createStockData(105, 99, 103, 1500), result, period);
      
      // 新增第五個資料點，應該移除第一個
      const oldFirstData = result.dataset[0];
      result = mfi.next(createStockData(103, 98, 101, 1300), result, period);
      
      expect(result.dataset).toHaveLength(period + 1);
      expect(result.dataset[0]).not.toEqual(oldFirstData);
    });
  });

  describe('calculateMFI method', () => {
    it('should return empty array for insufficient data', () => {
      const prices = [
        createStockData(100, 95, 98, 1000),
        createStockData(102, 97, 100, 1200),
      ];
      
      const result = mfi.calculateMFI(prices, 14);
      expect(result).toEqual([]);
    });

    it('should calculate MFI for sufficient data', () => {
      // 創建測試資料：期間為3，需要4個資料點
      const prices = [
        createStockData(100, 95, 98, 1000),   // TP = 97.67
        createStockData(102, 97, 100, 1200),  // TP = 99.67 (上升)
        createStockData(105, 99, 103, 1500),  // TP = 102.33 (上升)
        createStockData(103, 98, 101, 1300),  // TP = 100.67 (下降)
      ];
      
      const result = mfi.calculateMFI(prices, 3);
      
      expect(result).toHaveLength(1); // 只能計算一個MFI值
      expect(result[0]).toBeGreaterThanOrEqual(0);
      expect(result[0]).toBeLessThanOrEqual(100);
    });

    it('should calculate multiple MFI values for longer data series', () => {
      const prices = [];
      // 創建6個資料點，期間為3，應該能計算3個MFI值
      for (let i = 0; i < 6; i++) {
        prices.push(createStockData(
          100 + i * 2, 
          95 + i * 2, 
          98 + i * 2 + (i % 2 === 0 ? 1 : -1), // 交替上下
          1000 + i * 100
        ));
      }
      
      const result = mfi.calculateMFI(prices, 3);
      
      expect(result).toHaveLength(3); // 6 - 3 = 3個MFI值
      result.forEach(mfiValue => {
        expect(mfiValue).toBeGreaterThanOrEqual(0);
        expect(mfiValue).toBeLessThanOrEqual(100);
      });
    });

    it('should handle edge case with no negative money flow', () => {
      // 創建持續上升的價格資料
      const prices = [];
      for (let i = 0; i < 5; i++) {
        prices.push(createStockData(
          100 + i * 5, 
          95 + i * 5, 
          98 + i * 5, 
          1000
        ));
      }
      
      const result = mfi.calculateMFI(prices, 3);
      
      expect(result).toHaveLength(2);
      result.forEach(mfiValue => {
        expect(mfiValue).toBe(100); // 全部正向資金流量
      });
    });

    it('should handle equal typical prices correctly', () => {
      const prices = [
        createStockData(100, 95, 98, 1000),
        createStockData(102, 97, 99, 1200), // TP = 99.33
        createStockData(101, 96, 99, 1500), // TP = 98.67
        createStockData(103, 98, 100, 1300), // TP = 100.33
        createStockData(102, 97, 99, 1100), // TP = 99.33 (相等)
      ];
      
      const result = mfi.calculateMFI(prices, 3);
      
      expect(result).toHaveLength(2);
      result.forEach(mfiValue => {
        expect(mfiValue).toBeGreaterThanOrEqual(0);
        expect(mfiValue).toBeLessThanOrEqual(100);
        expect(Number.isNaN(mfiValue)).toBe(false);
      });
    });
  });

  describe('typical price calculation', () => {
    it('should calculate typical price correctly', () => {
      const stockData = createStockData(105, 95, 100, 1000);
      const mfiInstance = new Mfi();
      
      // 使用反射來測試私有方法（僅用於測試）
      const typicalPrice = (mfiInstance as any).getTypicalPrice(stockData);
      
      expect(typicalPrice).toBeCloseTo((105 + 95 + 100) / 3, 2);
    });
  });

  describe('raw money flow calculation', () => {
    it('should calculate raw money flow correctly', () => {
      const stockData = createStockData(105, 95, 100, 1500);
      const mfiInstance = new Mfi();
      
      const typicalPrice = (105 + 95 + 100) / 3;
      const expectedMF = typicalPrice * 1500;
      
      const rawMF = (mfiInstance as any).getRawMoneyFlow(stockData);
      
      expect(rawMF).toBeCloseTo(expectedMF, 2);
    });
  });

  describe('consistency between methods', () => {
    it('should produce same results using next() and calculateMFI()', () => {
      const prices = [];
      for (let i = 0; i < 8; i++) {
        prices.push(createStockData(
          100 + i * 3, 
          95 + i * 2, 
          98 + i * 2.5, 
          1000 + i * 50
        ));
      }
      
      const period = 3;
      
      // 使用 calculateMFI
      const batchResult = mfi.calculateMFI(prices, period);
      
      // 使用 next 方法逐步計算
      let result = mfi.init(prices[0], period);
      const nextResults: (number | null)[] = [];
      
      for (let i = 1; i < prices.length; i++) {
        result = mfi.next(prices[i], result, period);
        nextResults.push(result.mfi);
      }
      
      // 過濾掉 null 值
      const validNextResults = nextResults.filter(val => val !== null) as number[];
      
      expect(validNextResults).toHaveLength(batchResult.length);
      
      // 比較結果（允許小的浮點誤差）
      for (let i = 0; i < batchResult.length; i++) {
        expect(validNextResults[i]).toBeCloseTo(batchResult[i], 6);
      }
    });
  });
});