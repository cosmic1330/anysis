export type ObvEmaResType = {
  obvList: number[];
  ema: number;
  ma: number;
  type: number;
};

interface ObvEmaType {
  init: (obv: number, type: number) => ObvEmaResType;
  next: (obv: number, preList: ObvEmaResType, type: number) => ObvEmaResType;
}
export default class ObvEma implements ObvEmaType {
  init(obv: number, type: number): ObvEmaResType {
    return {
      obvList: [obv],
      ema: 0,
      ma: 0,
      type,
    };
  }

  next(obv: number, preList: ObvEmaResType, type: number): ObvEmaResType {
    const obvList = preList.obvList;
    obvList.push(obv);
    let ma = 0;
    let ema = 0;
    if (obvList.length === type) {
      const sum = obvList.reduce((pre, current) => pre + current, 0);
      ma = Math.round((sum / type) * 100) / 100;
      ema = ma;
    } else if (obvList.length > type) {
      obvList.shift();
      const sum = obvList.reduce((pre, current) => pre + current, 0);
      ma = Math.round((sum / type) * 100) / 100;
      ema = (obv * 2 + (type - 1) * preList.ema) / (type + 1);
    }

    return {
      obvList,
      ema,
      ma,
      type,
    };
  }
}
