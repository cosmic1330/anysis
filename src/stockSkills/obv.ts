type ItemType = { h: number; l: number; c: number; v: number };
type ResObv = { obv: number; } & ItemType;

interface ObvType {
  init: (data: ItemType, type: number) => {
    dataset: ItemType[];
    obv: number;
    obvList: number[];
    preClose: number;
    obvMa: number;
  };
  next: (
    data: ItemType,
    preList: {
      dataset: ItemType[];
      obv: number;
      obvList: number[];
      preClose: number;
      obvMa: number;
    },
    type: number
  ) => {
    dataset: ItemType[];
    obv: number;
    obvList: number[];
    preClose: number;
    obvMa: number;
  };

  getObv: (list: ItemType[], period: number) => ResObv[];
}
export default class Obv implements ObvType {
  init(data: ItemType, type: number) {
    return {
      dataset: [data],
      obv: data.v,
      obvList: [data.v],
      preClose: data.c,
      obvMa: 0,
    };
  }

  next(
    data: ItemType,
    preList: {
      dataset: ItemType[];
      obv: number;
      obvList: number[];
      preClose: number;
      obvMa: number;
    }, 
    type: number
  ) {
    const currentVolume = data.v;
    const currentClose = data.c;
    // obv
    let obv = preList.obv;
    if (currentClose > preList.preClose) {
      obv += currentVolume;
    } else if (currentClose < preList.preClose) {
      obv -= currentVolume;
    }

    // obv Ma
    const obvList = preList.obvList;
    obvList.push(obv);
    if (obvList.length > type) obvList.shift();
    const sum = obvList.reduce((pre, current) => pre + current, 0);
    const vma = Math.round((sum / type) * 100) / 100;

    return {
      dataset: [...preList.dataset, data],
      obv,
      preClose: currentClose,
      obvList,
      obvMa: vma
    };
  }

  getObv(list: ItemType[]): ResObv[] {
    const res = [];
    let obv = 0;

    for (let i = 0; i < list.length; i++) {
      const currentVolume = list[i].v;
      const currentClose = list[i].c;

      if (i > 0) {
        // obv
        if (currentClose > list[i - 1].c) {
          obv += currentVolume;
        } else if (currentClose < list[i - 1].c) {
          obv -= currentVolume;
        }
      } else {
        obv = currentVolume;
      }
      res[i] = { ...list[i], obv };
    }
    return res;
  }
}
