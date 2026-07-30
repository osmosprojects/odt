import { FormData, SkuRow } from "./types";
import { determineDofaLevel } from "./mockApproval";

export interface CommercialMetrics {
  totalVolume: number;
  totalIncentives: number;
  focValue: number;
  focValuePerLtr: number;
  totalRecommendedMixIncentive: number;
  totalActualMixIncentive: number;
  averageSkuRebate: number;
  averageGmpl: number;
  gmplPct: number;
  dofaLevel: string;
  dofaApprover: string;
  completionPct: number;
  dollarValue: number;
}

export function calculateCommercials(formData: FormData): CommercialMetrics {
  // 1. Total Volume
  const totalVolume = formData.selectedSkus.reduce((sum, sku) => sum + (sku.contractVolume || 0), 0);

  // 2. FOC Value (Calculated based on Base T.O./Ltr as shown in legacy PHP screenshot: FOC Vol * Base T.O.)
  const focValue = formData.selectedSkus.reduce((sum, sku) => {
    const baseTO = sku.baseTO || (sku.cogs * 1.45); // Fallback if not specified
    return sum + ((sku.focVolume || 0) * baseTO);
  }, 0);

  const focValuePerLtr = totalVolume > 0 ? (focValue / totalVolume) : 0;

  // 3. Recommended & Actual Mix Incentives
  const totalRecommendedMixIncentive = formData.selectedSkus.reduce(
    (sum, sku) => sum + ((sku.recMixIncentive || 0) * (sku.contractVolume || 0)), 0
  );

  const totalActualMixIncentive = formData.selectedSkus.reduce(
    (sum, sku) => sum + ((sku.mixIncentive || 0) * (sku.contractVolume || 0)), 0
  );

  // 4. Average SKU Level Rebate
  const totalSkuRebateAmt = formData.selectedSkus.reduce(
    (sum, sku) => sum + ((sku.skuRebate || 0) * (sku.contractVolume || 0)), 0
  );
  const averageSkuRebate = totalVolume > 0 ? (totalSkuRebateAmt / totalVolume) : 0;

  // 5. SKU-level Incentives (Sum of rebates, actual mix incentives, and product incentives)
  const skuIncentives = formData.selectedSkus.reduce((sum, sku) => {
    const vol = sku.contractVolume || 0;
    const rebateAmt = (sku.skuRebate || 0) * vol;
    const mixAmt = (sku.mixIncentive || 0) * vol;
    const prodAmt = (sku.productTargetIncentive || 0) * vol;
    return sum + rebateAmt + mixAmt + prodAmt;
  }, 0);

  // 6. Total Incentives
  // Total Incentives = SKU-level Incentives + Customer-level Target Incentive + Sign-on Bonus + Additional Input + Others
  const customerIncentives = 
    Number(formData.targetIncentive || 0) + 
    Number(formData.signOnBonus || 0) + 
    Number(formData.additionalInput || 0) + 
    Number(formData.others || 0);

  const totalIncentives = skuIncentives + customerIncentives;

  // 7. Dollar Value
  // Dollar Value = Total Incentives + FOC Value + Total Additional Loan (from Investment)
  const dollarValue = totalIncentives + focValue + Number(formData.totalAdditionalLoan || 0);

  // 8. GMPL % & Average GMPL
  // Base Selling Price = COGS * 1.45
  // Gross Revenue = Sum of (Base Selling Price * contractVolume)
  // Total Cost = Sum of (COGS * contractVolume) + FOC Value + customer-level investments
  // Net Revenue = Gross Revenue - SKU Incentives
  // Gross Margin = Net Revenue - Total Cost
  // GMPL % = (Gross Margin / Net Revenue) * 100
  let grossRevenue = 0;
  let totalCogs = 0;
  formData.selectedSkus.forEach((sku) => {
    const vol = sku.contractVolume || 0;
    const basePrice = (sku.cogs || 0) * 1.45;
    grossRevenue += basePrice * vol;
    totalCogs += (sku.cogs || 0) * vol;
  });

  const netRevenue = grossRevenue - skuIncentives;
  const totalCost = totalCogs + focValue + customerIncentives;

  let gmplPct = 25.5; // Default fallback
  if (netRevenue > 0) {
    const grossMargin = netRevenue - totalCost;
    gmplPct = (grossMargin / netRevenue) * 100;
  }

  // Cap GMPL % between a realistic range for lubricants (e.g. 5% to 45%)
  if (gmplPct > 45) gmplPct = 45;
  if (gmplPct < 5) gmplPct = 5;
  gmplPct = Math.round(gmplPct * 10) / 10;

  // Average GMPL (Rs/Ltr) = (Net Revenue - Total Cost) / Total Volume
  let averageGmpl = 0;
  if (totalVolume > 0) {
    averageGmpl = (netRevenue - totalCost) / totalVolume;
  }
  if (averageGmpl > 50) averageGmpl = 50;
  if (averageGmpl < 0) averageGmpl = 0;
  averageGmpl = Math.round(averageGmpl * 100) / 100;

  // 9. DOFA Level
  const { level: dofaLevel, approver: dofaApprover } = determineDofaLevel(totalVolume, gmplPct);

  // 10. Completion Percentage
  let completionPct = 0;
  if (formData.selectedCustomer) completionPct += 20;
  if (formData.offerStream && formData.offerCreationType && formData.dollarValue > 0) completionPct += 20;
  if (formData.investmentType && formData.investmentTerm) completionPct += 20;
  if (formData.selectedSkus.length > 0) completionPct += 20;
  if (formData.whyInvest && formData.risksToVolume && formData.mitigationToRisk) completionPct += 20;

  return {
    totalVolume,
    totalIncentives,
    focValue,
    focValuePerLtr,
    totalRecommendedMixIncentive,
    totalActualMixIncentive,
    averageSkuRebate,
    averageGmpl,
    gmplPct,
    dofaLevel,
    dofaApprover,
    completionPct,
    dollarValue
  };
}
