export type setStartMonthInYearType = {
  January: unknown;
  February: unknown;
  March: unknown;
  April: unknown;
  May: unknown;
  June: unknown;
  July: unknown;
  August: unknown;
  September: unknown;
  October: unknown;
  November: unknown;
  December: unknown;
};

export function setStartMonthInYear(startMonth: number): string[] {
  const base = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const end = base.slice(0, startMonth - 1);
  const start = base.slice(startMonth - 1);
  const response = start.concat(end);
  return response;
}
