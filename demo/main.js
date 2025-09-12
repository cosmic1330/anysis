/* eslint @typescript-eslint/no-var-requires: "off" */
const axios = require("axios");
const { Mfi } = require("../dist/cjs/index.js");

// 使用示例
const mfi = new Mfi();
function DemoDay(stockId) {
  axios
    .get(
      `https://tw.stock.yahoo.com/_td-stock/api/resource/FinanceChartService.ApacLibraCharts;period=d;symbols=[%22${stockId}%22]`
    )
    .then((res) => {
      const json = res.data;
      const opens = json[0].chart.indicators.quote[0].open;
      const closes = json[0].chart.indicators.quote[0].close;
      const highs = json[0].chart.indicators.quote[0].high;
      const lows = json[0].chart.indicators.quote[0].low;
      const volumes = json[0].chart.indicators.quote[0].volume;
      const ts = json[0].chart.timestamp.map((item) => {
        const date = new Date(item * 1000);
        const formatDateTime = () => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          const seconds = String(date.getSeconds()).padStart(2, "0");
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };
        return formatDateTime();
      });

      const response = [];
      for (let i = 0; i < opens.length; i++) {
        if (opens[i] !== null) {
          response.push({
            t: ts[i],
            o: opens[i],
            c: closes[i],
            h: highs[i],
            l: lows[i],
            v: volumes[i],
          });
        }
      }


      let mfiData = mfi.init(response[0], 14);
      for (let i = 1; i < response.length; i++) {
        mfiData = mfi.next(response[i], mfiData, 14);
      }
      console.log(mfiData);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      console.log("day done");
    });
}

DemoDay("1618");
