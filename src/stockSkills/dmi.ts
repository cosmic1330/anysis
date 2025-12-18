import { StockListType, StockType } from "./types";

export type DmiResType = {
  dataset: StockListType;
  pDi: number;
  mDi: number;
  adx: number; // smoothed ADX
  type: number;
  // Internal state
  smoothTr: number;
  smoothPdm: number;
  smoothMdm: number;
  dxBuffer: number[];
  smoothAdx: number; // internal tracking for ADX smoothing if needed distinct from result
};

export default class Dmi {
  init(data: StockType, type: number): DmiResType {
    return {
      dataset: [data],
      pDi: 0,
      mDi: 0,
      adx: 0,
      type,
      smoothTr: 0,
      smoothPdm: 0,
      smoothMdm: 0,
      dxBuffer: [],
      smoothAdx: 0,
    };
  }

  next(data: StockType, preList: DmiResType, type: number): DmiResType {
    preList.dataset.push(data);

    // Need type + 1 data points to have 'type' periods of change
    if (preList.dataset.length < type + 1) {
      return {
        ...preList,
        pDi: 0,
        mDi: 0,
        adx: 0,
      };
    } else {
      let currentTr = 0;
      let currentPdm = 0;
      let currentMdm = 0;

      // Logic to get TR, +DM, -DM for the NEWEST data point
      // We need the newest point and the one before it.
      // If we are in the initialization phase (length === type + 1), we process the whole window.
      // If we are in the incremental phase (length > type + 1), we just process the last step.

      let newSmoothTr = preList.smoothTr;
      let newSmoothPdm = preList.smoothPdm;
      let newSmoothMdm = preList.smoothMdm;

      if (preList.dataset.length === type + 1) {
        // Initialization: Calculate sum of first N periods (using N+1 data points)
        let sumTr = 0;
        let sumPdm = 0;
        let sumMdm = 0;

        for (let i = 1; i <= type; i++) {
          const curr = preList.dataset[i];
          const prev = preList.dataset[i - 1];

          // TR
          const hl = curr.h - curr.l;
          const hpc = Math.abs(curr.h - prev.c);
          const lpc = Math.abs(curr.l - prev.c);
          const tr = Math.max(hl, hpc, lpc);

          // DM
          const hph = curr.h - prev.h;
          const pll = prev.l - curr.l;

          let pdm = 0;
          let mdm = 0;

          if (hph > pll && hph > 0) {
            pdm = hph;
          }
          if (pll > hph && pll > 0) {
            mdm = pll;
          }

          sumTr += tr;
          sumPdm += pdm;
          sumMdm += mdm;
        }

        // Wilder's first value is often just the Sum.
        // But to make it consistent with the "Average" view for the formula:
        // NextAvg = (PrevAvg * (N-1) + Curr) / N
        // The first "PrevAvg" acts as the seed. The seed is usually the Simple Average.
        // So we divide by type.
        newSmoothTr = sumTr; // Some sources say keep Sum. But standard indicators often normalize to Average range.
        // Let's check RSI implementation. RSI divides by type: gains / type.
        // So we will divide by type to get the Average TR/DM.
        // Wait! DMI standard often keeps the SUM for the first value?
        // Wilder's book: "+DM14 is the sum of the +DM for the last 14 days".
        // Then subsequent: "+DM14_today = +DM14_yesterday - (+DM14_yesterday/14) + +DM_today".
        // This formula maintains the "Sum" magnitude (approx 14x the average).
        // BUT, RSI implementation uses Average magnitude (0-100 range inputs usually lead to small AvgGain).
        // Let's stick to the RSI pattern: Average.
        // Formula: (Avg * (N-1) + Curr) / N. This maintains "Average" magnitude.
        // If we used Sum logic: (Sum - Sum/N + Curr) = Sum * (1 - 1/N) + Curr.
        // These are mathematically consistent in shape, just scaled by N.
        // DI calculation is (Pdm / Tr) * 100. The scale cancels out!
        // So using Average is safer for preventing overflow and easier to debug (per-day values).
        newSmoothTr = sumTr / type;
        newSmoothPdm = sumPdm / type;
        newSmoothMdm = sumMdm / type;
      } else {
        // Shift if needed to keep dataset size manageable, though strictly we only need last 2 points
        // reusing rsi pattern:
        if (preList.dataset.length > type + 1) {
          preList.dataset.shift();
        }

        const curr = preList.dataset[preList.dataset.length - 1];
        const prev = preList.dataset[preList.dataset.length - 2];

        // TR
        const hl = curr.h - curr.l;
        const hpc = Math.abs(curr.h - prev.c);
        const lpc = Math.abs(curr.l - prev.c);
        const tr = Math.max(hl, hpc, lpc);

        // DM
        const hph = curr.h - prev.h;
        const pll = prev.l - curr.l;
        let pdm = 0;
        let mdm = 0;
        if (hph > pll && hph > 0) pdm = hph;
        if (pll > hph && pll > 0) mdm = pll;

        // Wilder's Smoothing (Average form)
        newSmoothTr = (preList.smoothTr * (type - 1) + tr) / type;
        newSmoothPdm = (preList.smoothPdm * (type - 1) + pdm) / type;
        newSmoothMdm = (preList.smoothMdm * (type - 1) + mdm) / type;
      }

      // Calculate DI
      // Avoid division by zero
      const pDi = newSmoothTr === 0 ? 0 : (newSmoothPdm / newSmoothTr) * 100;
      const mDi = newSmoothTr === 0 ? 0 : (newSmoothMdm / newSmoothTr) * 100;

      // Calculate DX
      const diDiff = Math.abs(pDi - mDi);
      const diSum = pDi + mDi;
      const dx = diSum === 0 ? 0 : (diDiff / diSum) * 100;

      // ADX Logic
      const dxBuffer = [...preList.dxBuffer];
      let adx = preList.adx;
      let newSmoothAdx = preList.smoothAdx;

      if (dxBuffer.length < type) {
        dxBuffer.push(dx);
        // Special case: if we Just reached 'type' count, we can calc initial ADX
        if (dxBuffer.length === type) {
          // First ADX is average of the DX buffer?
          // "ADX is the 14-day smoothed average of DX".
          // First value is simple average of previous 14 DX values.
          const sumDx = dxBuffer.reduce((a, b) => a + b, 0);
          newSmoothAdx = sumDx / type;
          adx = newSmoothAdx;
        } else {
          // Not enough data for ADX yet
          adx = 0;
        }
      } else {
        // We already have ADX initialized, so we smooth it
        // Note: we don't need to keep growing dxBuffer indefinitely.
        // We just needed it for startup.
        // Update ADX using Wilder's smoothing
        newSmoothAdx = (preList.smoothAdx * (type - 1) + dx) / type;
        adx = newSmoothAdx;
      }

      return {
        ...preList,
        pDi, // +DI
        mDi, // -DI
        adx, // ADX
        smoothTr: newSmoothTr,
        smoothPdm: newSmoothPdm,
        smoothMdm: newSmoothMdm,
        dxBuffer,
        smoothAdx: newSmoothAdx,
      };
    }
  }

  // Helper to get formatted results similar to ma.ts
  calculateDmiValues(list: StockListType, period = 14) {
    const res = [];
    let state = this.init(list[0], period);
    // First point (index 0) has 0 DMI
    res.push({ ...list[0], pDi: 0, mDi: 0, adx: 0 });

    for (let i = 1; i < list.length; i++) {
      state = this.next(list[i], state, period);
      res.push({
        ...list[i],
        pDi: state.pDi,
        mDi: state.mDi,
        adx: state.adx,
      });
    }
    return res;
  }
}
