import {
  setStartMonthInYear,
  setStartMonthInYearType,
} from "../../Month/index.js";
export function calcSeasonalIndicesNoTrend(
  monthData: number[],
  annualEstimate: number,
  startMonth = 1
) {
  // error
  if (monthData.length % 12 !== 0) return "data length fail";
  // calc
  const loop = monthData.length / 12;
  const SumArr = [];
  while (SumArr.length < 12) {
    let Sum = 0;
    for (let i = 0; i < loop; i++) {
      Sum += monthData[i * 12 + SumArr.length];
    }
    SumArr.push(Sum / loop);
  }
  const SumAverage = SumArr.reduce((pre, curr) => pre + curr) / 12;
  const seasonalIndexal = SumArr.map((sum) => sum / SumAverage);
  // create Map
  const perMonth = annualEstimate / 12;
  const months = setStartMonthInYear(startMonth);
  const nextYearForecast: { [key: string]: number } = {};
  months.forEach((month, index) => {
    nextYearForecast[month] = perMonth * seasonalIndexal[index];
  });
  return nextYearForecast as setStartMonthInYearType;
}
