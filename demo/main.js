/* eslint @typescript-eslint/no-var-requires: "off" */
const axios = require("axios");
const { Kd } = require("../dist/cjs/index.js");

// 使用示例
const kd = new Kd();
function DemoDay(stockId) {
  axios
    .get(
      `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stockId}&v=1&callback=`
    )
    .then((res) => {
      res = res.data.replace(/^\(|\);$/g, "");
      let parse = JSON.parse(res);
      let data = parse.ta;

      let kdData = kd.init(data[0], 9);
      for (let i = 1; i < data.length; i++) {
        kdData = kd.next(data[i], kdData, 9);
      }
      console.log(kdData);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      console.log("day done");
    });
}

DemoDay("2385");
