import calculateDivisionFactor from "../../utils/calculateDivisionFactor";
export default function Slope(y: number[]): number {
  // 計算 x 和 y 的平均值
  const y_mean = y.reduce((acc, cur) => acc + cur) / y.length;

  const increment = calculateDivisionFactor(y_mean);
  const x = Array.from({ length: y.length }, (_, index) => index * increment);
  const x_mean = x.reduce((acc, cur) => acc + cur) / x.length;

  // 計算斜率
  const numerator = x.reduce(
    (acc, cur, i) => acc + (cur - x_mean) * (y[i] - y_mean),
    0
  );
  const denominator = x.reduce((acc, cur) => acc + (cur - x_mean) ** 2, 0);
  const slope = numerator / denominator;
  return slope;
}
