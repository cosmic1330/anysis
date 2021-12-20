import dateFormat, { Mode } from "./dateFormat";

describe("test dateFormat methods", () => {
  it("test NumberToString", () => {
    const res = dateFormat(20211209, Mode.NumberToString);
    expect(res).toBe("2021-12-09");
  });

  it("test NumberToTimeStamp", () => {
    const res = dateFormat(20211209, Mode.NumberToTimeStamp);
    expect(res).toBe(1639008000000);
  });

  it("test StringToNumber", () => {
    const res = dateFormat("2021-12-09", Mode.StringToNumber);
    expect(res).toBe(20211209);
  });

  it("test StringToTimeStamp", () => {
    const res = dateFormat("2021-12-09", Mode.StringToTimeStamp);
    expect(res).toBe(1639008000000);
  });

  it("test TimeStampToNumber", () => {
    const res = dateFormat(1639008000000, Mode.TimeStampToNumber);
    expect(res).toBe(20211209);
  });

  it("test TimeStampToString", () => {
    const res = dateFormat(1639008000000, Mode.TimeStampToString);
    expect(res).toBe("2021-12-09");
  });
});
