interface EmaType {
  getStartEma: (list: number[], period: number) => number;
  getEma: (list: number[], period: number) => (number | undefined)[];
}
export default class Ema implements EmaType {
  getStartEma(list: number[], period: number): number {
    if (list.length < period) throw new Error("list.length < period");
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += list[i];
    }
    const initialEMA = sum / period;
    return initialEMA;
  }

  getEma(list: number[], period: number): (number | undefined)[] {
    const res = [];
    let ema = this.getStartEma(list.slice(0, period), period);
    for (let i = 0; i < list.length; i++) {
      if (i < period) {
        res.push(undefined);
        continue;
      }
      ema = (list[i] * 2 + (period - 1) * ema) / (period + 1);
      res.push(ema);
    }
    return res;
  }
}
