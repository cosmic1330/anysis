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
  type: SwingExtremesType,
  level = 1
): Index[] {
  if (type === SwingExtremesType.Peak) {
    const result = [];
    const indexs = findPeaksByGradient(y, level);
    result.push(indexs[0]);
    for (let i = 1; i < indexs.length; i++) {
      if (
        y[indexs[i]] > y[result[result.length - 1]] &&
        y[indexs[i]] > y[result[result.length - 2]]
      ) {
        result[result.length - 1] = indexs[i];
      } else if (
        y[indexs[i + 1]] < y[i] &&
        y[indexs[i]] > y[result[result.length - 1]]
      ) {
        result.pop();
        result.push(indexs[i]);
      } else result.push(indexs[i]);
    }
    return result;
  }
  if (type === SwingExtremesType.Trough) {
    const result = [];
    const indexs = findTroughByGradient(y, level);
    result.push(indexs[0]);
    for (let i = 1; i < indexs.length; i++) {
      if (
        y[indexs[i]] < y[result[result.length - 1]] &&
        y[indexs[i]] < y[result[result.length - 2]]
      ) {
        result[result.length - 1] = indexs[i];
      } else if (
        y[indexs[i + 1]] > y[i] &&
        y[indexs[i]] < y[result[result.length - 1]]
      ) {
        result.pop();
        result.push(indexs[i]);
      } else result.push(indexs[i]);
    }
    return result;
  } else {
    throw new Error("Invalid SwingExtremesType");
  }
}
