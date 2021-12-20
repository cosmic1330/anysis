import {
  movingAverages,
  weightMovingAverages,
  exponentialSmoothing,
  calcSeasonalIndicesNoTrend,
} from "./dist/esm/index.js";

// forecastingModel-R
let c = [10, 12, 13, 16, 19, 23, 26, 30, 28, 18, 16, 14];
let d = [180, 168, 159, 175, 190, 205, 180, 182];
let e = [74, 79, 80, 90, 105, 142, 122];

// forecastingModel-RS
let f = [
  80, 85, 80, 110, 115, 120, 100, 110, 85, 75, 85, 80, 100, 75, 90, 90, 131,
  110, 110, 90, 95, 85, 75, 80,
];

console.log("movingAverages", movingAverages(c, 3));
console.log("weightMovingAverages", weightMovingAverages(c, [3, 2, 1]));
console.log(
  "exponentialSmoothing",
  exponentialSmoothing(d, 0.1, { initialForecast: 175 })
);
console.log("exponentialSmoothing", exponentialSmoothing(e, 0.3));
console.log(
  "calcSeasonalIndicesNoTrend",
  calcSeasonalIndicesNoTrend(f, 1200, 5)
);
