import PDFDocument from 'pdfkit';

export interface PdfColumn {
  header: string;
  key: string;
  width: number;
}

export function generatePdfReport(
  title: string,
  columns: PdfColumn[],
  rows: Record<string, any>[],
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const startX = doc.page.margins.left;
    let currentY = doc.page.margins.top;

    // Title
    doc.fontSize(16).font('Helvetica-Bold').text(title, startX, currentY, {
      width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
      align: 'center',
    });
    currentY += 30;

    // Pre-compute each column's fixed x-position
    const colPositions: number[] = [];
    let runningX = startX;
    columns.forEach((col) => {
      colPositions.push(runningX);
      runningX += col.width;
    });

    // Header row
    doc.fontSize(10).font('Helvetica-Bold');
    columns.forEach((col, i) => {
      doc.text(col.header, colPositions[i], currentY, { width: col.width, align: 'left' });
    });
    currentY += 20;

    // Data rows
    doc.font('Helvetica');
    rows.forEach((row) => {
      columns.forEach((col, i) => {
        const value = row[col.key] ?? '';
        doc.text(String(value), colPositions[i], currentY, { width: col.width, align: 'left' });
      });
      currentY += 20; 
    });

    doc.end();
  });
}