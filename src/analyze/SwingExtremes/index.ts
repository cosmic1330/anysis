export enum SwingExtremesType {
  Peak = "Peak",
  Trough = "Trough",
}

type Index = number;

export function findPeaksByGradient(prices: number[]): Index[] {
  const peaks = [];
  for (let i = 1; i < prices.length - 1; i++) {
    const prevGradient = prices[i] - prices[i - 1];
    const nextGradient = prices[i + 1] - prices[i];
    if (prevGradient > 0 && nextGradient < 0) {
      peaks.push(i);
    }
  }
  return peaks;
}

export function findTroughByGradient(prices: number[]): Index[] {
  const peaks = [];
  for (let i = 1; i < prices.length - 1; i++) {
    const prevGradient = prices[i] - prices[i - 1];
    const nextGradient = prices[i + 1] - prices[i];
    if (prevGradient < 0 && nextGradient > 0) {
      peaks.push(i);
    }
  }
  return peaks;
}

export function SwingExtremes(y: number[], type: SwingExtremesType): Index[] {
  if (type === SwingExtremesType.Peak) {
    const result = [];
    const indexs = findPeaksByGradient(y);
    result.push(indexs[0]);
    for (let i = 1; i < indexs.length; i++) {
      if (y[indexs[i]] > y[result[result.length - 1]]) {
        result[result.length - 1] = indexs[i];
      } else {
        result.push(indexs[i]);
      }
    }
    return result;
  }
  if (type === SwingExtremesType.Trough) {
    const result = [];
    const indexs = findTroughByGradient(y);
    result.push(indexs[0]);
    for (let i = 1; i < indexs.length; i++) {
      if (y[indexs[i]] < y[result[result.length - 1]]) {
        result[result.length - 1] = indexs[i];
      } else {
        result.push(indexs[i]);
      }
    }
    return result;
  } else {
    throw new Error("Invalid SwingExtremesType");
  }
}
