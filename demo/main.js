/* eslint @typescript-eslint/no-var-requires: "off" */
const axios = require("axios");
const {
  Gold,
  SwingExtremesType,
  SwingExtremes,
} = require("../dist/cjs/index.js");

const gold = new Gold();
function DemoDay(stockId) {
  axios
    .get(
      `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stockId}&v=1&callback=`
    )
    .then((res) => {
      res = res.data.replace(/^\(|\);$/g, "");
      let parse = JSON.parse(res);
      let data = parse.ta;
      const sortArray = [];
      const hightPoints = SwingExtremes(data.map((data) => data.h), SwingExtremesType.Peak, 1);
      const lowerPoints = SwingExtremes(data.map((data) => data.l), SwingExtremesType.Trough, 1);
      console.log(hightPoints.map((item) => data[item]));
      sortArray.push(...hightPoints);
      sortArray.push(...lowerPoints);
      sortArray.sort((a, b) => a - b);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      console.log("day done");
    });
}

DemoDay("2449");
