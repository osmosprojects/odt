import { Injectable } from '@nestjs/common';

@Injectable()
export class OfferManagementService {
  private dofaMatrices = [
    {
      id: 'DOFA-1001',
      matrixName: 'WBC Standard Matrix',
      offerToolType: 'WBC',
      levels: [
        { level: 1, limit: '50,000', fromApproval: 'SKU Master', toApproval: 'Distributor Master' },
        { level: 2, limit: '1,50,000', fromApproval: 'Distributor Master', toApproval: 'Terms Master' },
      ],
      finalDofa: '2,00,000',
      approvalMailName: 'wbc-approval-chain.pdf',
      lastModified: '12/06/2026',
      status: 'Active',
    },
    {
      id: 'DOFA-1002',
      matrixName: 'IWS Regional Matrix',
      offerToolType: 'IWS',
      levels: [
        { level: 1, limit: '25,000', fromApproval: 'Customer Master', toApproval: 'SKU Master' },
        { level: 2, limit: '75,000', fromApproval: 'SKU Master', toApproval: 'Item Master' },
        { level: 3, limit: '1,25,000', fromApproval: 'Item Master', toApproval: 'Offer Master' },
      ],
      finalDofa: '1,50,000',
      approvalMailName: 'ws-planner-approval.pdf',
      lastModified: '28/05/2026',
      status: 'Active',
    },
  ];

  private dollarRates = [
    {
      id: 'USD-2607',
      value: 83.42,
      validFrom: '01/07/2026',
      validTill: '31/07/2026',
      addedDate: '28/06/2026',
      approvalMailName: 'dollar-rate-jul26.pdf',
      status: 'Active',
    },
    {
      id: 'USD-2606',
      value: 83.1,
      validFrom: '01/06/2026',
      validTill: '30/06/2026',
      addedDate: '29/05/2026',
      approvalMailName: 'dollar-rate-jun26.pdf',
      status: 'Expired',
    },
  ];

  getDofaMatrices() {
    return this.dofaMatrices;
  }

  createDofaMatrix(matrix: any) {
    const newMatrix = {
      id: `DOFA-${1000 + this.dofaMatrices.length + 1}`,
      ...matrix,
      lastModified: new Date().toLocaleDateString(),
      status: 'Active',
    };
    this.dofaMatrices.push(newMatrix);
    return newMatrix;
  }

  getDollarRates() {
    return this.dollarRates;
  }

  createDollarRate(rateData: any) {
    const newRate = {
      id: `USD-${2600 + this.dollarRates.length + 1}`,
      value: Number(rateData.value),
      validFrom: rateData.validFrom,
      validTill: rateData.validTill,
      addedDate: new Date().toLocaleDateString(),
      approvalMailName: rateData.approvalMailName || null,
      status: 'Active',
    };
    this.dollarRates.unshift(newRate);
    return newRate;
  }
}
