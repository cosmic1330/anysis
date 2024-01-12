type ItemType = { h: number; l: number; c: number; v: number };
type ResObv = { obv: number } & ItemType;

interface ObvType {
  init: (data: ItemType) => {
    dataset: ItemType[];
    obv: number;
    preClose: number;
  };
  next: (
    data: ItemType,
    preList: {
      dataset: ItemType[];
      obv: number;
      preClose: number;
    }
  ) => {
    dataset: ItemType[];
    obv: number;
    preClose: number;
  };

  getObv: (list: ItemType[], period: number) => ResObv[];
}
export default class Obv implements ObvType {
  init(data: ItemType): {
    dataset: ItemType[];
    obv: number;
    preClose: number;
  } {
    return {
      dataset: [data],
      obv: data.v,
      preClose: data.c,
    };
  }

  next(
    data: ItemType,
    preList: {
      dataset: ItemType[];
      obv: number;
      preClose: number;
    }
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

    return {
      dataset: [...preList.dataset, data],
      obv,
      preClose: currentClose,
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
      }else {
        obv = currentVolume;
      }
      res[i] = { ...list[i], obv };
    }
    return res;
  }
}
