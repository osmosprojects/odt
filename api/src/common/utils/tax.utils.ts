// PHP equivalent: getTaxLabel() — pre-GST vs post-GST labeling based on date
function getTaxLabel(date: Date | string): string {
  const GST_CUTOVER_DATE = new Date('2017-07-01'); // India GST rollout date
  const checkDate = new Date(date);

  if (isNaN(checkDate.getTime())) {
    throw new Error('Invalid date provided to getTaxLabel');
  }

  return checkDate >= GST_CUTOVER_DATE ? 'GST' : 'VAT/Excise';
}