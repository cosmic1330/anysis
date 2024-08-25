/* eslint @typescript-eslint/no-var-requires: "off" */
const axios = require("axios");
const { Williams } = require("../dist/cjs/index.js");
const williams = new Williams();
function DemoDay(stockId) {
  axios
    .get(
      `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stockId}&v=1&callback=`
    )
    .then((res) => {
      res = res.data.replace(/^\(|\);$/g, "");
      let parse = JSON.parse(res);
      let data = parse.ta;
      let williams9Data = williams.init(data[0], 9);
      let williams18Data = williams.init(data[0], 18);
      for (let i = 1; i < data.length; i++) {
        williams9Data = williams.next(data[i], williams9Data, 9);
        williams18Data = williams.next(data[i], williams18Data, 18);
      }
      console.log(williams9Data);
      console.log(williams18Data);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      console.log("day done");
    });
}

DemoDay("2449");
