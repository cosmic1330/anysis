/* eslint @typescript-eslint/no-var-requires: "off" */
const axios = require("axios");
const { Gold } = require("./dist/cjs/index.js");
const gold = new Gold();
const stockId = 2014;

axios
  .get(
    `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stockId}&v=1&callback=`,
    { params: { ID: 123 } }
  )
  .then((res) => {
    let json = res.data.match(/"ta":(\S*),"ex"/)[1];
    let data = JSON.parse(json);
    let goldData = gold.getGold(data);
    console.log(goldData);
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    /* 不論失敗成功皆會執行 */
  });
