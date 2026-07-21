// PHP equivalent: contract year math used in offer financial calculations
function computeContractYears(startDate: Date | string, endDate: Date | string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date provided to computeContractYears');
  }

  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
  const diffMs = end.getTime() - start.getTime();
  return Math.round((diffMs / msPerYear) * 100) / 100;
}

console.log(computeContractYears('2024-01-01', '2026-01-01')); // expect ~2.0
console.log(computeContractYears('2024-01-01', '2024-07-01')); // expect ~0.5
console.log(computeContractYears('2024-06-15', '2027-06-15')); // expect ~3.0