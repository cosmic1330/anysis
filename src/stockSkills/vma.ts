type DataType = { v: number, [key:string]: unknown};
type ListType = DataType[];
interface VmaType {
  init: (
    data: DataType,
    type: number
  ) => { dataset: ListType; vma: number; type: number };
  next: (
    data: DataType,
    preList: { dataset: ListType; vma: number; type: number },
    type: number
  ) => { dataset: ListType; vma: number; type: number };
}

export default class Vma implements VmaType {
  init(data: DataType, type: number) {
    return { dataset: [data], vma: 0, type };
  }
  next(
    data: DataType,
    preList: { dataset: ListType; vma: number; type: number },
    type: number
  ) {
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
