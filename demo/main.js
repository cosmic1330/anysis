/* eslint @typescript-eslint/no-var-requires: "off" */
const axios = require("axios");
const {
  Rsi,
} = require("../dist/cjs/index.js");


// 使用示例
const rsi = new Rsi();
function DemoDay(stockId) {
  axios
    .get(
      `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stockId}&v=1&callback=`
    )
    .then((res) => {
      res = res.data.replace(/^\(|\);$/g, "");
      let parse = JSON.parse(res);
      let data = parse.ta;
      const rsis = rsi.calculateRSI(data, 5);
      let rsi5Data = rsi.init(data[0],5);
      for (let i = 1; i < data.length; i++) {
        rsi5Data = rsi.next(data[i], rsi5Data, 5);
      }
      console.log("rsi", rsis[rsis.length - 2]);
      console.log("rsi", rsi5Data);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      console.log("day done");
    });
}

DemoDay("2385");
