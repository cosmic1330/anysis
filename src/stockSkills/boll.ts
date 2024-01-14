type ItemType = { c: number };
type ListType = ItemType[];
type ResBoll = {
  c: number;
  bollMa: number | null;
  bollUb: number | null;
  bollLb: number | null;
}[];

interface BollType {
  init: (data: ItemType) => {
    dataset: ListType;
    bollMa: number | null;
    bollUb: number | null;
    bollLb: number | null;
  };
  next: (
    data: ItemType,
    preList: {
      dataset: ListType;
      bollMa: number | null;
      bollUb: number | null;
      bollLb: number | null;
    },
    type: number
  ) => {
    dataset: ListType;
    bollMa: number | null;
    bollUb: number | null;
    bollLb: number | null;
  };
  getBoll: (list: ListType, type: number) => ResBoll;
}

export default class Boll implements BollType {
  init(data: ItemType): {
    dataset: ListType;
    bollMa: number | null;
    bollUb: number | null;
    bollLb: number | null;
  } {
    return {
      dataset: [data],
      bollMa: null,
      bollUb: null,
      bollLb: null,
    };
  }

  next(
    data: ItemType,
    preList: {
      dataset: ListType;
      bollMa: number | null;
      bollUb: number | null;
      bollLb: number | null;
    },
    type: number
  ) {
    preList.dataset.push(data);

    if (preList.dataset.length < type) {
      return {
        dataset: preList.dataset,
        type,
        bollMa: null,
        bollUb: null,
        bollLb: null,
      };
    } else {
      if (preList.dataset.length > type) {
        preList.dataset.shift();
      }
      const sum: number = preList.dataset.reduce(
        (pre, current) => pre + current.c,
        0
      );
      const bollMa: number = Math.round((sum / type) * 100) / 100;
      const difference = preList.dataset.reduce((pre, current) => {
        return bollMa !== null ? pre + Math.pow(current.c - bollMa, 2) : pre;
      }, 0);
      const std: number = Math.round(Math.sqrt(difference / type) * 100) / 100;

      return {
        dataset: preList.dataset,
        type,
        bollMa,
        bollUb: bollMa + 2 * std,
        bollLb: bollMa - 2 * std,
      };
    }
  }

  getBoll(list: ListType, type: number): ResBoll {
    const res = [];

    for (let i = 0; i < list.length; i++) {
      if (i < type)
        res[i] = {
          ...list[i],
          bollMa: null,
          bollUb: null,
          bollLb: null,
        };
      else {
        // bollMa
        const sumMa: number = list
          .slice(i - (type - 1), i + 1)
          .reduce((pre, current) => pre + current.c, 0);
        console.log("sumMa", sumMa);
        const bollMa: number = Math.round((sumMa / type) * 100) / 100;
        // 標準差
        const difference: number = res
          .slice(i - (type - 1), i + 1)
          .reduce((pre, current) => {
            return bollMa !== null
              ? pre + Math.pow(current.c - bollMa, 2)
              : pre;
          }, 0);
        const std: number =
          Math.round(Math.sqrt(difference / type) * 100) / 100;
        res[i] = {
          ...list[i],
          bollMa,
          bollUb: bollMa + 2 * std,
          bollLb: bollMa - 2 * std,
        };
      }
    }
    return res;
  }
}
