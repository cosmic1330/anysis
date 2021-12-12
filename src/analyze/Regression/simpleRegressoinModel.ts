type RegressionType = {
  xBar: number;
  yBar: number;
  xArray: number[];
  yArray: number[];
  b1: number;
  predictRegressionModel: (xValue: number) => number;
};

type RegressionResponseType = {
  description: string;
  predictModel: (xValue: number) => number;
  explained: string;
};

function average(arr: number[]) {
  const total = arr.reduce((prev, curr) => prev + curr);
  const xBar = total / arr.length;
  return xBar;
}

function calcB1({
  xBar,
  yBar,
  xArray,
  yArray,
}: Pick<RegressionType, "xBar" | "yBar" | "xArray" | "yArray">) {
  let i = 0;
  let denominator = 0;
  let numerator = 0;
  while (i < xArray.length) {
    denominator += (xArray[i] - xBar) * (yArray[i] - yBar);
    numerator += Math.pow(xArray[i] - xBar, 2);
    i++;
  }
  return denominator / numerator;
}

function calcB0({
  xBar,
  yBar,
  b1,
}: Pick<RegressionType, "xBar" | "yBar" | "b1">): number {
  return yBar - b1 * xBar;
}

function calcSSR({
  yBar,
  predictRegressionModel,
  xArray,
}: Pick<RegressionType, "predictRegressionModel" | "yBar" | "xArray">) {
  const Sum = xArray.reduce((prev, curr) => {
    return prev + Math.pow(predictRegressionModel(curr) - yBar, 2);
  }, 0);
  return Sum;
}

function calcSSE({
  predictRegressionModel,
  yArray,
  xArray,
}: Pick<RegressionType, "predictRegressionModel" | "yArray" | "xArray">) {
  let Sum = 0;
  for (let i = 0; i < xArray.length; i++) {
    const X = xArray[i];
    const Y = yArray[i];
    Sum += Math.pow(Y - predictRegressionModel(X), 2);
  }
  return Sum;
}

/**
 * xArray = independent
 * yArray = dependent
 * response: Y = b0 + b1X
 */
export default function simpleRegressionModel(
  xArray: number[],
  yArray: number[]
): RegressionResponseType {
  if (xArray.length !== yArray.length)
    return {
      description: "xArray length is different about yArray length",
      predictModel: () => NaN,
      explained: "0%",
    };

  const xBar = average(xArray);
  const yBar = average(yArray);
  const b1 = calcB1({ xBar, yBar, xArray, yArray });
  const b0 = calcB0({ xBar, yBar, b1 });
  const predictRegressionModel = (xValue: number): number => {
    return b0 + b1 * xValue;
  };
  const SSR = calcSSR({
    yBar,
    predictRegressionModel,
    xArray,
  });
  const SSE = calcSSE({
    predictRegressionModel,
    yArray,
    xArray,
  });
  const SST = SSR + SSE;
  const rPower = (SSR / SST) * 100 + "%";
  const response = {
    description: `Y=${b0}+${b1}X`,
    predictModel: predictRegressionModel,
    explained: rPower,
  };
  return response;
}
