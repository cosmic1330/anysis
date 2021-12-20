/*
  請注意，在 src/index.ts 中，我的導入包含文件擴展名(.js)。
  如果需要支持 Node.js 和構建工具（ex: webpack），則不需要這樣做。 **因為commonJs默認js副檔名**
  但如果要支持 ES 模塊的瀏覽器 ，則需要文件擴展名(.js)。
*/
export { default as simpleRegressionModel } from "./analyze/Regression/simpleRegressoinModel.js";
export {
  movingAverages,
  weightMovingAverages,
  exponentialSmoothing,
} from "./analyze/TimeSeries/R/index.js";
export { calcSeasonalIndicesNoTrend } from "./analyze/TimeSeries/RS/index.js";
export { add } from "./test/add.js";
export { minus } from "./test/minus.js";
export { default as Ma } from "./stockSkills/ma.js";
export { default as Macd } from "./stockSkills/macd.js";
export { default as Rsi } from "./stockSkills/rsi.js";
export { default as Williams } from "./stockSkills/williams.js";
export { default as Gold } from "./stockSkills/gold.js";
