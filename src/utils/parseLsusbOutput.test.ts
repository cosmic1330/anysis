import parseLsusbOutput from "./parseLsusbOutput";

describe("test parseLsusbOutput methods", () => {
  it("test case1", () => {
    const lsusbOutput = `
  Bus 001 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub
  Bus 001 Device 003: ID 0c45:64ad Microdia 
  `;
    const arr = parseLsusbOutput(lsusbOutput);
    expect(arr).toEqual([
      {
        bus: "001",
        device: "002",
        id: "8087:0024",
        description: "Intel Corp. Integrated Rate Matching Hub",
      },
      {
        bus: "001",
        device: "003",
        id: "0c45:64ad",
        description: "Microdia",
      },
    ]);
  });
});
