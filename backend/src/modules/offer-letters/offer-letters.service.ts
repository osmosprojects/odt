import { Injectable } from '@nestjs/common';

@Injectable()
export class OfferLettersService {
  private letters = [
    {
      letterId: 1,
      offerId: 101,
      offerCode: 'OFF-WBC-2026-001',
      customerName: 'Apex Motors Ltd',
      executiveCode: 'EMP1001',
      offerLetterStatus: 'P', // Published
      serialNo: 'OL-2026-0982',
      filePath: '/downloads/letters/OL-2026-0982.pdf',
      createdAt: '2026-07-16T11:00:00Z',
    },
    {
      letterId: 2,
      offerId: 102,
      offerCode: 'OFF-WBC-2026-002',
      customerName: 'Metro Logistics Corp',
      executiveCode: 'EMP1002',
      offerLetterStatus: 'E', // Pending
      serialNo: 'OL-2026-0983',
      filePath: '/downloads/letters/OL-2026-0983.pdf',
      createdAt: '2026-07-18T14:30:00Z',
    },
  ];

  findAll() {
    return this.letters;
  }

  generateLetter(offerId: number) {
    const newLetter = {
      letterId: this.letters.length + 1,
      offerId,
      offerCode: `OFF-WBC-2026-${String(offerId).padStart(3, '0')}`,
      customerName: 'Generated Customer',
      executiveCode: 'EMP1001',
      offerLetterStatus: 'P',
      serialNo: `OL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      filePath: `/downloads/letters/OL-2026-${offerId}.pdf`,
      createdAt: new Date().toISOString(),
    };
    this.letters.unshift(newLetter);
    return {
      message: 'Offer letter PDF generated successfully',
      letter: newLetter,
    };
  }
}
