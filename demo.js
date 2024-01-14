/* eslint @typescript-eslint/no-var-requires: "off" */
const axios = require("axios");
const { Obv, Macd, Kd, Boll } = require("./dist/cjs/index.js");
const obv = new Obv();
const macd = new Macd();
const kd = new Kd();
const boll = new Boll();
const stockId = 1702;

axios
  .get(
    `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stockId}&v=1&callback=`
  )
  .then((res) => {
    let json = res.data.match(/"ta":(\S*),"ex"/)[1];
    let data = JSON.parse(json);
    let obvData = obv.init(data[0]);
    let macdData = macd.init(data[0]);
    let kdData = kd.init(data[0]);
    let bollData = boll.init(data[0]);
    let finallyData = [{
      ...data[0],
      ema12: macdData.ema12,
      ema26: macdData.ema26,
      macd: macdData.macd,
      osc: macdData.osc,
      dif: macdData.dif[macdData.dif.length - 1],
      obv: obvData.obv,
      rsv: kdData.rsv,
      k: kdData.k,
      d: kdData.d,
      'k-d': kdData['k-d'],
      bollMa: bollData.bollMa,
      bollUb: bollData.bollUb,
      bollLb: bollData.bollLb
    }];

    for (let i = 1; i < data.length; i++) {
      obvData = obv.next(data[i], obvData);
      macdData = macd.next(data[i], macdData);
      kdData = kd.next(data[i], kdData, 9);
      bollData = boll.next(data[i], bollData, 20);
      finallyData.push({
        ...data[i],
        ema12: macdData.ema12,
        ema26: macdData.ema26,
        macd: macdData.macd,
        osc: macdData.osc,
        dif: macdData.dif[macdData.dif.length - 1],
        obv: obvData.obv,
        rsv: kdData.rsv,
        k: kdData.k,
        d: kdData.d,
        'k-d': kdData['k-d'],
        bollMa: bollData.bollMa,
        bollUb: bollData.bollUb,
        bollLb: bollData.bollLb
      });
    }

    console.log(finallyData[finallyData.length - 1]);
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    /* 不論失敗成功皆會執行 */
  });
