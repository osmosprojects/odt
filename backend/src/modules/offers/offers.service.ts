import { Injectable, NotFoundException } from '@nestjs/common';

export interface CreateOfferDto {
  customerCode: string;
  customerName: string;
  stream: string;
  channel: string;
  territoryCode?: string;
  startDate: string;
  endDate: string;
  totalVolumeCommitment: string;
  totalTradeLoan: string;
  creditTermDays: string;
  tradingCreditLimit: string;
  skuItems?: Array<{
    skuCode: string;
    skuName: string;
    volumeLitres: number;
    rebatePerLitre: number;
  }>;
}

@Injectable()
export class OffersService {
  private offersMock = [
    {
      offerId: 101,
      offerCode: 'OFF-WBC-2026-001',
      customerCode: 'CUST-8092',
      customerName: 'Apex Motors Ltd',
      stream: 'B2B',
      channel: 'HD',
      territoryCode: 'TERR_NORTH_01',
      startDate: '2026-07-01',
      endDate: '2027-06-30',
      totalVolumeCommitment: '120,000 Ltr',
      totalTradeLoan: '₹ 5,00,000',
      creditTermDays: '45 Days',
      tradingCreditLimit: '₹ 25,00,000',
      offerStatus: 'P', // Pending
      closureStatus: 'NA',
      approvalFlow: {
        currentLevel: 'L2',
        rtmStatus: 'A',
        l1Status: 'A',
        l2Status: 'P',
        l3Status: 'P',
        cmStatus: 'P',
      },
      createdAt: '2026-07-15T10:30:00Z',
    },
    {
      offerId: 102,
      offerCode: 'OFF-WBC-2026-002',
      customerCode: 'CUST-8093',
      customerName: 'Metro Logistics Corp',
      stream: 'B2B',
      channel: 'CVO',
      territoryCode: 'TERR_WEST_02',
      startDate: '2026-06-01',
      endDate: '2027-05-31',
      totalVolumeCommitment: '85,000 Ltr',
      totalTradeLoan: '₹ 3,50,000',
      creditTermDays: '30 Days',
      tradingCreditLimit: '₹ 15,00,000',
      offerStatus: 'A', // Approved
      closureStatus: 'P',
      approvalFlow: {
        currentLevel: 'APPROVED',
        rtmStatus: 'A',
        l1Status: 'A',
        l2Status: 'A',
        l3Status: 'A',
        cmStatus: 'A',
      },
      createdAt: '2026-06-10T14:20:00Z',
    },
  ];

  findAll(query?: any) {
    let filtered = [...this.offersMock];
    if (query?.status) {
      filtered = filtered.filter((o) => o.offerStatus === query.status);
    }
    if (query?.stream) {
      filtered = filtered.filter((o) => o.stream === query.stream);
    }
    if (query?.channel) {
      filtered = filtered.filter((o) => o.channel === query.channel);
    }
    return {
      total: filtered.length,
      data: filtered,
    };
  }

  getPipelineS2() {
    return {
      stage: 'Pipeline Stage 2 (DOFA & Financial Evaluation)',
      activeOffersCount: this.offersMock.length,
      offers: this.offersMock.map((o) => ({
        offerId: o.offerId,
        offerCode: o.offerCode,
        customerName: o.customerName,
        currentApprover: o.approvalFlow.currentLevel,
        totalVolume: o.totalVolumeCommitment,
        totalLoan: o.totalTradeLoan,
        status: o.offerStatus,
      })),
    };
  }

  findOne(id: number) {
    const offer = this.offersMock.find((o) => o.offerId === Number(id));
    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }
    return offer;
  }

  create(dto: CreateOfferDto) {
    const newOffer = {
      offerId: this.offersMock.length + 101,
      offerCode: `OFF-WBC-2026-${String(this.offersMock.length + 1).padStart(3, '0')}`,
      customerCode: dto.customerCode,
      customerName: dto.customerName,
      stream: dto.stream || 'B2B',
      channel: dto.channel || 'HD',
      territoryCode: dto.territoryCode || 'TERR_NORTH_01',
      startDate: dto.startDate,
      endDate: dto.endDate,
      totalVolumeCommitment: dto.totalVolumeCommitment,
      totalTradeLoan: dto.totalTradeLoan,
      creditTermDays: dto.creditTermDays,
      tradingCreditLimit: dto.tradingCreditLimit,
      offerStatus: 'D', // Draft
      closureStatus: 'NA',
      approvalFlow: {
        currentLevel: 'DRAFT',
        rtmStatus: 'P',
        l1Status: 'P',
        l2Status: 'P',
        l3Status: 'P',
        cmStatus: 'P',
      },
      createdAt: new Date().toISOString(),
    };

    this.offersMock.push(newOffer);
    return {
      message: 'Offer created successfully as draft',
      offer: newOffer,
    };
  }

  submitForApproval(id: number) {
    const offer = this.findOne(id);
    offer.offerStatus = 'P'; // Pending
    offer.approvalFlow.currentLevel = 'RTM';
    return {
      message: `Offer ${offer.offerCode} submitted for RTM / DOFA approval`,
      offer,
    };
  }

  approveOfferLevel(id: number, level: string, comments?: string) {
    const offer = this.findOne(id);
    if (level === 'rtm') offer.approvalFlow.rtmStatus = 'A';
    if (level === 'l1') offer.approvalFlow.l1Status = 'A';
    if (level === 'l2') offer.approvalFlow.l2Status = 'A';
    if (level === 'l3') offer.approvalFlow.l3Status = 'A';
    if (level === 'cm') {
      offer.approvalFlow.cmStatus = 'A';
      offer.offerStatus = 'A'; // Fully Approved
      offer.approvalFlow.currentLevel = 'APPROVED';
    } else {
      offer.approvalFlow.currentLevel = `L${Number(level.replace('l', '')) + 1 || 1}`;
    }

    return {
      message: `Offer level ${level.toUpperCase()} approved successfully`,
      offer,
    };
  }

  rejectOffer(id: number, reason: string) {
    const offer = this.findOne(id);
    offer.offerStatus = 'R'; // Rejected
    offer.approvalFlow.currentLevel = 'REJECTED';
    return {
      message: `Offer ${offer.offerCode} has been rejected`,
      reason,
      offer,
    };
  }

  cancelOffer(id: number, reason: string) {
    const offer = this.findOne(id);
    offer.offerStatus = 'C'; // Cancelled
    offer.approvalFlow.currentLevel = 'CANCELLED';
    return {
      message: `Offer ${offer.offerCode} has been cancelled`,
      reason,
      offer,
    };
  }

  extendOffer(id: number, extensionData: { extensionMonths: number; newEndDate: string; remarks?: string }) {
    const offer = this.findOne(id);
    offer.endDate = extensionData.newEndDate;
    return {
      message: `Offer ${offer.offerCode} extended until ${extensionData.newEndDate}`,
      extensionDetails: extensionData,
      offer,
    };
  }

  submitClosure(id: number, closureData: any) {
    const offer = this.findOne(id);
    offer.closureStatus = 'P'; // Pending Closure Approval
    return {
      message: `Closure request created for offer ${offer.offerCode}`,
      closureDetails: closureData,
    };
  }
}
