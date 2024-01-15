import isJSON from "./isJson";

describe("test isJSON methods", () => {
  it("test {}", () => {
    const text = "{}";
    const json = isJSON(text);
    expect(json).toEqual(true);
  });

  it("test [{}]", () => {
    const text = "[{}]";
    const json = isJSON(text);
    expect(json).toEqual(true);
  });
  
  it("test [{}]);", () => {
    const text = "[{}]);";
    const json = isJSON(text);
    expect(json).toEqual(false);
  });
});
