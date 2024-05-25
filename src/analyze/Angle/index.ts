import calculateDivisionFactor from "../../utils/calculateDivisionFactor";

export default function TwoPointAngle(y: number[]): number {
  if (y.length != 2) return 0;
  // 計算 x 和 y 的平均值
  const increment = calculateDivisionFactor(y[1]);
  const x = Array.from({ length: y.length }, (_, index) => index * increment);
  const m = (y[1] - y[0]) / (x[1] - x[0]);
  // 計算角度（弧度）
  const thetaRadians = Math.atan(m); // 轉換角度為度
  const thetaDegrees = thetaRadians * (180 / Math.PI);
  return thetaDegrees;
}
