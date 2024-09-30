export enum Mode {
  NumberToString = 1, // ex:20210801 --> 2021-08-01
  NumberToTimeStamp = 2, // ex:20210801 --> 時間戳記
  StringToTimeStamp = 3, // ex:2021-08-01 --> 時間戳記
  TimeStampToString = 4, // ex:時間戳記 --> 2021-08-01
  TimeStampToNumber = 5, // ex:時間戳記 --> 20210801
  StringToNumber = 6, // ex:2021-08-01 --> 20210801
}

type DateFormatInput<M extends Mode> = M extends
  | Mode.NumberToString
  | Mode.NumberToTimeStamp
  | Mode.TimeStampToString
  | Mode.TimeStampToNumber
  ? number
  : M extends Mode.StringToTimeStamp | Mode.StringToNumber
  ? string
  : never;

type DateFormatOutput<M extends Mode> = M extends
  | Mode.NumberToString
  | Mode.TimeStampToString
  ? string
  : M extends
      | Mode.NumberToTimeStamp
      | Mode.StringToTimeStamp
      | Mode.TimeStampToNumber
      | Mode.StringToNumber
  ? number
  : never;

function dateFormat<M extends Mode>(
  date: DateFormatInput<M>,
  mode: M
): DateFormatOutput<M> {
  switch (mode) {
    case Mode.NumberToString: {
      const input = String(date).padStart(8, "0");
      return `${input.slice(0, 4)}-${input.slice(4, 6)}-${input.slice(
        6,
        8
      )}` as DateFormatOutput<M>;
    }
    case Mode.NumberToTimeStamp: {
      const input = String(date).padStart(8, "0");
      const stringDate = `${input.slice(0, 4)}-${input.slice(
        4,
        6
      )}-${input.slice(6, 8)}`;
      return new Date(stringDate).getTime() as DateFormatOutput<M>;
    }
    case Mode.StringToTimeStamp: {
      const res = Date.parse(date as string);
      return res as DateFormatOutput<M>;
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
      return res as DateFormatOutput<M>;
    }
    case Mode.TimeStampToNumber: {
      const newDate = new Date(date);
      const yy = newDate.getFullYear();
      const mm = String(newDate.getMonth() + 1).padStart(2, "0");
      const dd = String(newDate.getDate()).padStart(2, "0");
      return parseInt(`${yy}${mm}${dd}`, 10) as DateFormatOutput<M>;
    }
    case Mode.StringToNumber: {
      const res = (date as string).replace(/-/g, "");
      return parseInt(res) as DateFormatOutput<M>;
    }
    default:
      throw new Error("请设置正确的模式");
  }
}

export default dateFormat;
