export function moneyFormatIndia(amount: number): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const [integerPart, decimalPart = '00'] = absAmount.toFixed(2).split('.');

  let formatted = integerPart;
  if (integerPart.length > 3) {
    const lastThree = integerPart.slice(-3);
    const rest = integerPart.slice(0, -3);
    const groupedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    formatted = `${groupedRest},${lastThree}`;
  }

  return `${isNegative ? '-' : ''}₹${formatted}.${decimalPart}`;
}
