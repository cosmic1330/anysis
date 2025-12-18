import { beforeEach, describe, expect, it } from "vitest";
import Ichimoku from "./ichimoku";
import { StockType } from "./types"; // 引用原本的型別定義

// 輔助函式：快速產生測試用的假資料
const createStock = (
  idx: number,
  override?: Partial<StockType>
): StockType & { v: number; h: number; l: number; c: number } => {
  return {
    t: idx, // 時間戳記 (用 index 代替)
    o: 100,
    c: 100, // 收盤價預設 100
    h: 100, // 最高價
    l: 100, // 最低價
    v: 1000,
    ...override, // 允許覆蓋特定欄位
  };
};

describe("Ichimoku Algo", () => {
  let ichimoku: Ichimoku;

  beforeEach(() => {
    ichimoku = new Ichimoku();
  });

  describe("init", () => {
    it("should initialize with correct structure", () => {
      const data = createStock(0, { c: 150 });
      const res = ichimoku.init(data);

      expect(res.dataset).toHaveLength(1);
      expect(res.dataset[0]).toEqual(data);

      // 第一筆資料，除了 chikou (收盤價) 外，其他應為 null
      expect(res.ichimoku.chikou).toBe(150);
      expect(res.ichimoku.tenkan).toBeNull();
      expect(res.ichimoku.kijun).toBeNull();
      expect(res.ichimoku.senkouA).toBeNull();
      expect(res.ichimoku.senkouB).toBeNull();
    });
  });

  describe("next & Logic Calculation", () => {
    it("should accumulate dataset correctly", () => {
      let res = ichimoku.init(createStock(0));
      res = ichimoku.next(createStock(1), res);
      res = ichimoku.next(createStock(2), res);

      expect(res.dataset).toHaveLength(3);
      expect(res.dataset[2].t).toBe(2);
    });

    it("should calculate Tenkan-sen (9 periods) correctly", () => {
      // 策略：建立 8 筆資料，確認 Tenkan 為 null
      // 再加第 9 筆，確認 Tenkan 有值
      // 設定數據：High 逐漸增加 (10~90)，Low 保持 0
      // 預期結果：(MaxHigh(90) + MinLow(0)) / 2 = 45

      let res = ichimoku.init(createStock(0, { h: 10, l: 0 }));

      // 加入第 2 到第 8 筆 (共 8 筆)
      for (let i = 1; i < 8; i++) {
        res = ichimoku.next(createStock(i, { h: (i + 1) * 10, l: 0 }), res);
        expect(res.ichimoku.tenkan).toBeNull(); // 資料不足 9 筆
      }

      // 加入第 9 筆
      res = ichimoku.next(createStock(8, { h: 90, l: 0 }), res);

      // 驗證
      expect(res.dataset).toHaveLength(9);
      expect(res.ichimoku.tenkan).toBe(45); // (90 + 0) / 2
    });

    it("should calculate Kijun-sen (26 periods) correctly", () => {
      // 策略：直接灌入 25 筆資料
      // 第 1 筆 Low = 10，第 26 筆 High = 110，中間平穩
      // Kijun = (110 + 10) / 2 = 60

      let res = ichimoku.init(createStock(0, { h: 50, l: 10 })); // 最低點在 index 0

      // 填補中間資料 (index 1 ~ 24)
      for (let i = 1; i < 25; i++) {
        res = ichimoku.next(createStock(i, { h: 50, l: 50 }), res);
        expect(res.ichimoku.kijun).toBeNull(); // 資料不足 26 筆
      }

      // 加入第 26 筆 (index 25)
      res = ichimoku.next(createStock(25, { h: 110, l: 50 }), res); // 最高點在 index 25

      expect(res.dataset).toHaveLength(26);
      expect(res.ichimoku.kijun).toBe(60); // (110 + 10) / 2
    });

    it("should calculate Senkou Span A correctly", () => {
      // Senkou A = (Tenkan + Kijun) / 2
      // 我們需要至少 26 筆資料讓 Kijun 有值 (此時 Tenkan 也有值)

      let res = ichimoku.init(createStock(0));

      // 我們設計一個場景：
      // 過去 9 天 (Tenkan window): Max=20, Min=10 -> Tenkan = 15
      // 過去 26 天 (Kijun window): Max=30, Min=0 -> Kijun = 15
      // 預期 Senkou A = (15 + 15) / 2 = 15

      // 先塞入前段資料
      for (let i = 1; i < 26; i++) {
        // 為了方便控制，我們讓最後一筆資料決定極值
        // 這裡隨便塞，只要最後一筆能控制範圍即可，因為我們邏輯是找區間最大最小
        // 但為了確保 Kijun 區間的 Min 是 0，我們在 index 0 設 l=0
        // 為了確保 Kijun 區間的 Max 是 30，我們在 index 0 設 h=30 (如果它是最大)

        // 簡單化：讓資料全部平躺，最後一瞬間拉高拉低
        // 這裡不用迴圈邏輯太複雜，直接用輔助函式慢慢疊
        res = ichimoku.next(createStock(i), res);
      }

      // 重新建立一個乾淨的測試流程，比較好控制數學
      // Reset
      res = ichimoku.init(createStock(0, { h: 100, l: 100 }));

      // 填充 24 筆 (共 25 筆)
      for (let i = 1; i < 25; i++) {
        res = ichimoku.next(createStock(i, { h: 100, l: 100 }), res);
      }

      // 第 26 筆 (Index 25) 進來，決定生死
      // Kijun 看過去 26 筆 (idx 0~25)
      // Tenkan 看過去 9 筆 (idx 17~25)

      // 設定目標：
      // Tenkan: Max=110, Min=90 => Avg=100
      // Kijun: Max=120, Min=80 => Avg=100
      // SenkouA => 100

      // 修改 dataset 裡的值 (模擬真實波動)
      // 讓 index 0 (很久以前) 有個極低值 80 (影響 Kijun 不影響 Tenkan)
      // 讓 index 0 有個極高值 120 (影響 Kijun 不影響 Tenkan)
      // 注意：上面的 init 和 next 已經把資料寫死為 100 了，這在單元測試有點難搞
      // 所以我們用更簡單的方法：在 next 過程中精準控制

      // --- 重來：精準控制版 ---
      const ichi = new Ichimoku();
      let r = ichi.init(createStock(0, { h: 120, l: 80 })); // Kijun Range: H=120, L=80

      // 填滿中間 16 筆 (Index 1~16)，數值平穩不影響極值，且不讓 Tenkan 抓到
      for (let i = 1; i <= 16; i++) {
        r = ichi.next(createStock(i, { h: 100, l: 100 }), r);
      }

      // 接下來 8 筆 (Index 17~24)，準備進入 Tenkan 範圍
      // 我們讓 Tenkan 範圍 (包含下一筆 index 25) 為 H=110, L=90
      for (let i = 17; i <= 24; i++) {
        r = ichi.next(createStock(i, { h: 110, l: 90 }), r);
      }

      // 第 26 筆 (Index 25)
      r = ichi.next(createStock(25, { h: 110, l: 90 }), r);

      // 驗證 Tenkan (看 index 17~25)
      // MaxH = 110, MinL = 90 => 100
      expect(r.ichimoku.tenkan).toBe(100);

      // 驗證 Kijun (看 index 0~25)
      // MaxH = 120 (from index 0), MinL = 80 (from index 0) => 100
      expect(r.ichimoku.kijun).toBe(100);

      // 驗證 Senkou A
      expect(r.ichimoku.senkouA).toBe(100);
    });

    it("should calculate Senkou Span B (52 periods) correctly", () => {
      let res = ichimoku.init(createStock(0, { h: 200, l: 0 })); // 極值在最開始

      // 填到 50 筆
      for (let i = 1; i < 51; i++) {
        res = ichimoku.next(createStock(i, { h: 100, l: 100 }), res);
        expect(res.ichimoku.senkouB).toBeNull();
      }

      // 第 52 筆
      res = ichimoku.next(createStock(51, { h: 100, l: 100 }), res);

      // 52 期間 (0~51): Max=200, Min=0 => 100
      expect(res.ichimoku.senkouB).toBe(100);
    });

    it("should handle Chikou Span (just close price)", () => {
      let res = ichimoku.init(createStock(0, { c: 555 }));
      expect(res.ichimoku.chikou).toBe(555);

      res = ichimoku.next(createStock(1, { c: 888 }), res);
      expect(res.ichimoku.chikou).toBe(888);
    });
  });
});
