/* eslint @typescript-eslint/no-var-requires: "off" */
const axios = require("axios");
const { Ma } = require("./dist/cjs/index.js");
const ma = new Ma();
const stockId = 1101;

axios
  .get(
    `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stockId}&v=1&callback=`
  )
  .then((res) => {
    let json = res.data.match(/"ta":(\S*),"ex"/)[1];
    let data = JSON.parse(json);
    let maData = ma.init(data[0], 20);
    for (let i = 1; i < data.length; i++) {
      maData = ma.next(data[i], maData, 20);
    }
    console.log(maData);
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    /* 不論失敗成功皆會執行 */
  });
