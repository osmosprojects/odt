// PHP equivalent: contract year math used in offer financial calculations
export function computeContractYears(startDate: Date | string, endDate: Date | string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date provided to computeContractYears');
  }

  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  const diffMs = end.getTime() - start.getTime();
  return Math.round((diffMs / msPerYear) * 100) / 100;
}