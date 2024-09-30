import { StockType } from "./types";

type NewStockType = Required<Pick<StockType, 'v'>> & StockType;

type NewStockListType = NewStockType[];

export type VmaResType = {
  dataset: NewStockListType;
  vma: number;
  type: number;
};

interface VmaType {
  init: (data: NewStockType, type: number) => VmaResType;
  next: (data: NewStockType, preList: VmaResType, type: number) => VmaResType;
}

export default class Vma implements VmaType {
  init(data: NewStockType, type: number) {
    return { dataset: [data], vma: 0, type };
  }
  next(data: NewStockType, preList: VmaResType, type: number) {
    preList.dataset.push(data);
    if (preList.dataset.length < type) {
      return { dataset: preList.dataset, vma: 0, type };
    } else {
      if (preList.dataset.length > type) {
        preList.dataset.shift();
      }
      const sum = preList.dataset.reduce((pre, current) => pre + current.v, 0);
      const vma = Math.round((sum / type) * 100) / 100;
      return { dataset: preList.dataset, vma, type };
    }
  }
}
