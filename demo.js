/* eslint @typescript-eslint/no-var-requires: "off" */
const axios = require("axios");
const { Obv } = require("./dist/cjs/index.js");
const obv = new Obv();
const stockId = 1101;

axios
  .get(
    `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stockId}&v=1&callback=`
  )
  .then((res) => {
    let json = res.data.match(/"ta":(\S*),"ex"/)[1];
    let data = JSON.parse(json);
    let obvData = obv.init(data[0]);
    for (let i = 1; i < data.length; i++) {
      obvData = obv.next(data[i], obvData);
    }
    console.log(obvData);
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    /* 不論失敗成功皆會執行 */
  });
