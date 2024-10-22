export enum SwingExtremesType {
  Peak = "Peak",
  Trough = "Trough",
}

type Index = number;

export function findPeaksByGradient(prices: number[], level = 1): Index[] {
  const peaks = [];
  for (let i = 1; i < prices.length - 1; i++) {
    if (level === 1) {
      const prevGradient = prices[i] - prices[i - 1];
      const nextGradient = prices[i + 1] - prices[i];
      if (prevGradient > 0 && nextGradient < 0) {
        peaks.push(i);
      }
    } else if (level === 2) {
      const prevGradient = prices[i] - prices[i - 1];
      const prev2Gradient = prices[i] - prices[i - 2];
      const nextGradient = prices[i + 1] - prices[i];
      const next2Gradient = prices[i + 2] - prices[i];
      if (
        prevGradient > 0 &&
        prev2Gradient > 0 &&
        nextGradient < 0 &&
        next2Gradient < 0
      ) {
        peaks.push(i);
      }
    }
  }
  return peaks;
}

export function findTroughByGradient(prices: number[], level = 1): Index[] {
  const troughs = [];
  for (let i = 1; i < prices.length - 1; i++) {
    if (level === 1) {
      const prevGradient = prices[i] - prices[i - 1];
      const nextGradient = prices[i + 1] - prices[i];
      if (prevGradient < 0 && nextGradient > 0) {
        troughs.push(i);
      }
    } else if (level === 2) {
      const prevGradient = prices[i] - prices[i - 1];
      const prev2Gradient = prices[i] - prices[i - 2];
      const nextGradient = prices[i + 1] - prices[i];
      const next2Gradient = prices[i + 2] - prices[i];
      if (
        prevGradient < 0 &&
        prev2Gradient < 0 &&
        nextGradient > 0 &&
        next2Gradient > 0
      ) {
        troughs.push(i);
      }
    }
  }
  return troughs;
}

export function SwingExtremes(
  y: number[],
  level = 1
): { index: Index; type: SwingExtremesType }[] {
  try {
    const peaks = findPeaksByGradient(y, level);
    const peakObjs = peaks.map((index) => ({
      index,
      type: SwingExtremesType.Peak,
    }));
    const troughs = findTroughByGradient(y, level);
    const troughObjs = troughs.map((index) => ({
      index,
      type: SwingExtremesType.Trough,
    }));
    const merge = peakObjs.concat(troughObjs);
    return merge.sort((a, b) => a.index - b.index);
  } catch (err) {
    console.error(err);
    return [];
  }
}
