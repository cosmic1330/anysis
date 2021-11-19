type RegressionType = {
    Xbar: number;
    Ybar: number;
    Xarray: number[];
    Yarray: number[];
    b1: number;
    regressionModelFunc: (Xvalue: number) => number;
  };
  
  type RegressionResponseType = {
    description: string;
    model?: (Xvalue: number) => number;
    explained?: string;
  };
  
  function average(arr: number[]) {
    let total = arr.reduce((prev, curr) => prev + curr);
    let Xbar = total / arr.length;
    return Xbar;
  }
  
  function calcB1({
    Xbar,
    Ybar,
    Xarray,
    Yarray
  }: Pick<RegressionType, "Xbar" | "Ybar" | "Xarray" | "Yarray">) {
    let i = 0;
    let denominator = 0;
    let numerator = 0;
    while (i < Xarray.length) {
      denominator += (Xarray[i] - Xbar) * (Yarray[i] - Ybar);
      numerator += Math.pow(Xarray[i] - Xbar, 2);
      i++;
    }
    return denominator / numerator;
  }
  
  function calcB0({
    Xbar,
    Ybar,
    b1
  }: Pick<RegressionType, "Xbar" | "Ybar" | "b1">): number {
    return Ybar - b1 * Xbar;
  }
  
  function calcSSR({
    Ybar,
    regressionModelFunc,
    Xarray
  }: Pick<RegressionType, "regressionModelFunc" | "Ybar" | "Xarray">) {
    let Sum = Xarray.reduce((prev, curr) => {
      return prev + Math.pow(regressionModelFunc(curr) - Ybar, 2);
    }, 0);
    return Sum;
  }
  
  function calcSSE({
    regressionModelFunc,
    Yarray,
    Xarray
  }: Pick<RegressionType, "regressionModelFunc" | "Yarray" | "Xarray">) {
    let Sum = 0;
    for (let i = 0; i < Xarray.length; i++) {
      const X = Xarray[i];
      const Y = Yarray[i];
      Sum += Math.pow(Y - regressionModelFunc(X), 2);
    }
    return Sum;
  }
  
  /**
   * Xarray = independent
   * Yarray = dependent
   * response: Y = b0 + b1X
   */
  export default function simpleRegressoinModel(
    Xarray: number[],
    Yarray: number[]
  ): RegressionResponseType {
    if (Xarray.length !== Yarray.length)
      return {
        description: "Xarray length is different about Yarray length"
      };
    let Xbar = average(Xarray);
    let Ybar = average(Yarray);
    let b1 = calcB1({ Xbar, Ybar, Xarray, Yarray });
    let b0 = calcB0({ Xbar, Ybar, b1 });
    let regressionModelFunc = (Xvalue: number): number => {
      return b0 + b1 * Xvalue;
    };
    let SSR = calcSSR({
      Ybar,
      regressionModelFunc,
      Xarray
    });
    let SSE = calcSSE({
      regressionModelFunc,
      Yarray,
      Xarray
    });
    let SST = SSR + SSE;
    let rPower = (SSR / SST) * 100 + "%";
    let response = {
      description: `Y=${b0}+${b1}X`,
      model: regressionModelFunc,
      explained: rPower
    };
    return response;
  }
  