type DataType = { c: number; [key: string]: unknown };
type ListType = DataType[];

export default class Rsi {
  init(data: DataType, type: number) {
    return {
      dataset: [data],
      rsi: 0,
      type,
      avgGain: 0,
      avgLoss: 0,
    };
  }

  next(
    data: DataType,
    preList: {
      dataset: ListType;
      rsi: number;
      type: number;
      avgGain: number;
      avgLoss: number;
    },
    type: number
  ) {
    preList.dataset.push(data);
    if (preList.dataset.length < type + 1) {
      return {
        ...preList,
        rsi: 0,
        type,
        avgGain: 0,
        avgLoss: 0,
      };
    } else {
      // 计算初始增益和损失
      let avgGain = 0;
      let avgLoss = 0;
      if (preList.dataset.length === type + 1) {
        let gains = 0;
        let losses = 0;
        for (let i = 1; i <= type; i++) {
          const change = preList.dataset[i].c - preList.dataset[i - 1].c;
          if (change > 0) {
            gains += change;
          } else {
            losses -= change;
          }
        }
        avgGain = gains / type;
        avgLoss = losses / type;
      } else if (preList.dataset.length > type + 1) {
        preList.dataset.shift();

        // 更新平均增益和平均损失
        const change =
          preList.dataset[preList.dataset.length - 1].c -
          preList.dataset[preList.dataset.length - 2].c;
        avgGain =
          (preList.avgGain * (type - 1) + (change > 0 ? change : 0)) / type;
        avgLoss =
          (preList.avgLoss * (type - 1) + (change < 0 ? -change : 0)) / type;
      }

      // 计算RSI
      const rs = avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);

      return { ...preList, type, rsi, avgGain, avgLoss };
    }
  }

  calculateRSI(prices: ListType, period = 5) {
    if (prices.length < period + 1) {
      return [];
    }

    // 计算价格变化
    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i].c - prices[i - 1].c);
    }

    // 计算增益和损失
    let gains = 0;
    let losses = 0;
    for (let i = 0; i < period; i++) {
      if (changes[i] > 0) {
        gains += changes[i];
      } else {
        losses -= changes[i];
      }
    }

    // 计算初始平均增益和平均损失
    let avgGain = gains / period;
    let avgLoss = losses / period;

    // 计算RSI
    const rsis = [];
    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);
    rsis.push(rsi);
    for (let i = period; i < changes.length; i++) {
      // 更新平均增益和平均损失
      const change = changes[i];
      avgGain = (avgGain * (period - 1) + (change > 0 ? change : 0)) / period;
      avgLoss = (avgLoss * (period - 1) + (change < 0 ? -change : 0)) / period;

      const rs = avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);
      rsis.push(rsi);
    }

    return rsis;
  }
}
