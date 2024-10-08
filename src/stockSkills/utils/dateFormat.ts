export enum Mode {
  NumberToString = 1, // ex:20210801 --> 2021-08-01
  NumberToTimeStamp = 2, // ex:20210801 --> 時間戳記
  StringToTimeStamp = 3, // ex:2021-08-01 --> 時間戳記
  TimeStampToString = 4, // ex:時間戳記 --> 2021-08-01
  TimeStampToNumber = 5, // ex:時間戳記 --> 20210801
  StringToNumber = 6, // ex:2021-08-01 --> 20210801
}

// 函数重载签名
function dateFormat(date: number, mode: Mode.NumberToString): string;
function dateFormat(date: number, mode: Mode.NumberToTimeStamp): number;
function dateFormat(date: string, mode: Mode.StringToTimeStamp): number;
function dateFormat(date: number, mode: Mode.TimeStampToString): string;
function dateFormat(date: number, mode: Mode.TimeStampToNumber): number;
function dateFormat(date: string, mode: Mode.StringToNumber): number;

function dateFormat(date: number | string, mode: Mode): number | string {
  switch (mode) {
    case Mode.NumberToString: {
      const input = date.toString();
      const res =
        input.slice(0, 4) + "-" + input.slice(4, 6) + "-" + input.slice(6, 8);
      return res;
    }
    case Mode.NumberToTimeStamp: {
      const input = date.toString();
      const stringDate =
        input.slice(0, 4) + "-" + input.slice(4, 6) + "-" + input.slice(6, 8);
      const res = Date.parse(stringDate);
      return res;
    }
    case Mode.StringToTimeStamp: {
      const res = Date.parse(date as string);
      return res;
    }
    case Mode.TimeStampToString: {
      const newDate = new Date(date);
      const yy = newDate.getFullYear();
      const mm =
        newDate.getMonth() + 1 < 10
          ? "0" + (newDate.getMonth() + 1)
          : newDate.getMonth() + 1;
      const dd =
        newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
      const res = yy + "-" + mm + "-" + dd;
      return res;
    }
    case Mode.TimeStampToNumber: {
      const newDate = new Date(date);
      const yy = newDate.getFullYear();
      const mm =
        newDate.getMonth() + 1 < 10
          ? "0" + (newDate.getMonth() + 1)
          : newDate.getMonth() + 1;
      const dd =
        newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
      const res = `${yy}${mm}${dd}`;
      return parseInt(res);
    }
    case Mode.StringToNumber: {
      const res = (date as string).replace(/-/g, '');
      return parseInt(res);
    }
    default:
      throw new Error("请设置正确的模式");
  }
}

export default dateFormat;
