/* eslint @typescript-eslint/no-var-requires: "off" */
const axios = require("axios");
const { Obv, Macd, Kd, Boll, Vma } = require("../dist/cjs/index.js");
const obv = new Obv();
const macd = new Macd();
const kd = new Kd();
const boll = new Boll();
const vma = new Vma();
const stockId = 1702;
// week
const { getWeekLine, Ma } = require("../dist/cjs/index.js");
const ma = new Ma();

function DemoDay() {
  axios
    .get(
      `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stockId}&v=1&callback=`
    )
    .then((res) => {
      let json = res.data.match(/"ta":(\S*),"ex"/)[1];
      let data = JSON.parse(json).slice(0, -21);
      let obvData = obv.init(data[0], 5);
      let macdData = macd.init(data[0]);
      let kdData = kd.init(data[0]);
      let bollData = boll.init(data[0]);
      let vmaData = vma.init(data[0], 5);
      let finallyData = [
        {
          ...data[0],
          vma: vmaData.vma,
          ema12: macdData.ema12,
          ema26: macdData.ema26,
          macd: macdData.macd,
          osc: macdData.osc,
          dif: macdData.dif[macdData.dif.length - 1],
          obv: obvData.obv,
          obvMa: obvData.obvMa,
          rsv: kdData.rsv,
          k: kdData.k,
          d: kdData.d,
          "k-d": kdData["k-d"],
          bollMa: bollData.bollMa,
          bollUb: bollData.bollUb,
          bollLb: bollData.bollLb,
        },
      ];

      for (let i = 1; i < data.length; i++) {
        obvData = obv.next(data[i], obvData, 5);
        macdData = macd.next(data[i], macdData);
        kdData = kd.next(data[i], kdData, 9);
        bollData = boll.next(data[i], bollData, 20);
        vmaData = vma.next(data[i], vmaData, 5);
        finallyData.push({
          ...data[i],
          vma: vmaData.vma,
          ema12: macdData.ema12,
          ema26: macdData.ema26,
          macd: macdData.macd,
          osc: macdData.osc,
          dif: macdData.dif[macdData.dif.length - 1],
          obv: obvData.obv,
          obvMa: obvData.obvMa,
          rsv: kdData.rsv,
          k: kdData.k,
          d: kdData.d,
          "k-d": kdData["k-d"],
          bollMa: bollData.bollMa,
          bollUb: bollData.bollUb,
          bollLb: bollData.bollLb,
        });
      }

      console.log(finallyData[finallyData.length - 1]);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      console.log("day done");
    });
}

function DemoWeek() {
  axios
    .get(
      `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stockId}&v=1&callback=`
    )
    .then((res) => {
      let json = res.data.match(/"ta":(\S*),"ex"/)[1];
      let data = JSON.parse(json);
      // week
      let weekLine = getWeekLine(data);
      let weekMaData5 = ma.init(weekLine[0], 5);
      let weekMaData10 = ma.init(weekLine[0], 10);
      let weekMaData20 = ma.init(weekLine[0], 20);
      for (let i = 1; i < weekLine.length; i++) {
        weekMaData5 = ma.next(weekLine[i], weekMaData5, 5);
        weekMaData10 = ma.next(weekLine[i], weekMaData10, 10);
        weekMaData20 = ma.next(weekLine[i], weekMaData20, 20);
      }
      console.log({
        t: weekMaData5.dataset[weekMaData5.dataset.length - 1].t,
        ma5: weekMaData5.ma,
        ma5ExclusionValue: weekMaData5.exclusionValue,
        ma10: weekMaData10.ma,
        ma10ExclusionValue: weekMaData10.exclusionValue,
        ma20: weekMaData20.ma,
        ma20ExclusionValue: weekMaData20.exclusionValue,
      });
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      console.log("week done");
    });
}

// DemoDay();

const showWeek = true;
if (showWeek) {
  DemoWeek();
}
