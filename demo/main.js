/* eslint @typescript-eslint/no-var-requires: "off" */
const axios = require("axios");
const {
  Rsi,
  Obv,
  findPeaksByGradient,
  findTroughByGradient,
} = require("../dist/cjs/index.js");

// 使用示例
const rsi = new Rsi();
const obv = new Obv();
function DemoDay(stockId) {
  axios
    .get(
      `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stockId}&v=1&callback=`
    )
    .then((res) => {
      res = res.data.replace(/^\(|\);$/g, "");
      let parse = JSON.parse(res);
      let data = parse.ta;
      let obvData = obv.getObv(data);
      obvData = obvData.map((item) => item.obv);
      const peak = findPeaksByGradient(obvData, 1);
      const peakIndex =peak[peak.length-1]
      const peak2Index =peak[peak.length-2]
      console.log(data[peakIndex].t, data[peakIndex].c);
      console.log(data[peak2Index].t, data[peak2Index].c);

      const trough = findTroughByGradient(obvData, 1);
      const troughIndex =trough[trough.length-1]
      const trough2Index =trough[trough.length-2]
      console.log(data[troughIndex].t, data[troughIndex].c);
      console.log(data[trough2Index].t, data[trough2Index].c);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      console.log("day done");
    });
}

DemoDay("2385");
