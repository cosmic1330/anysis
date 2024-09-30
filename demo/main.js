/* eslint @typescript-eslint/no-var-requires: "off" */
const axios = require("axios");
const { Week, Kd } = require("../dist/cjs/index.js");

// 使用示例
const week = new Week();
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
      let weekData = week.init(data[0]);

      for (let i = 1; i < data.length; i++) {
        weekData = week.next(data[i], weekData);
      }

      let kdData = kd.init(weekData.week[0], 9);
      for (let i = 0; i < weekData.week.length; i++) {
        kdData = kd.next(weekData.week[i], kdData, 9);
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
