export function movingAverages(arr: number[], periods: number): number[] {
    let response = new Array(periods).fill(0);
    for (let i = periods; i < arr.length; i++) {
      let Sum = 0;
      for (let e = 1; e <= periods; e++) {
        Sum += arr[i - e];
      }
      response.push(Sum / periods);
    }
    return response;
  }
  
  export function weightMovingAverages(
    arr: number[],
    periods: number[]
  ): number[] {
    let response = new Array(periods.length).fill(0);
    let weightSum = periods.reduce((pre, curr) => pre + curr);
    for (let i = periods.length - 1; i < arr.length; i++) {
      let Sum = 0;
      for (let e = 0; e < periods.length; e++) {
        Sum += arr[i - e] * periods[e];
      }
      response.push(Sum / weightSum);
    }
    return response;
  }
  
  type ExponentialSmoothingOptions = {
    initialForecast: number;
  };
  
  export function exponentialSmoothing(
    arr: number[],
    alpha: number,
    options?: Partial<ExponentialSmoothingOptions>
  ) {
    let PreviousForecast = options?.initialForecast || arr[0];
    let forecasts = [PreviousForecast];
    for (let i = 1; i <= arr.length; i++) {
      let Sum = PreviousForecast + alpha * (arr[i - 1] - PreviousForecast);
      PreviousForecast = Sum;
      forecasts.push(Sum);
    }
    return forecasts;
  }
  