export default function calculateDivisionFactor(originalNumber: number) {
  // 去除小數點
  originalNumber = Math.floor(originalNumber);
  // 轉換正數
  originalNumber = Math.abs(originalNumber);
  // 將原始數字轉換為字符串以便計算其長度
  const originalNumberStr = originalNumber.toString();

  // 計算原始數字的位數
  const numberOfDigits = originalNumberStr.length;

  // 計算需要除以的數量，即 10 的位數次方
  const divisionFactor = Math.pow(10, numberOfDigits - 1);

  return divisionFactor;
}
