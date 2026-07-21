import * as ExcelJS from 'exceljs';

export interface ReportColumn {
  header: string;
  key: string;
  width?: number;
}

export async function generateExcelReport(
  sheetName: string,
  columns: ReportColumn[],
  rows: Record<string, any>[],
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width ?? 20,
  }));

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    cell.border = {
      top: { style: 'thin' }, left: { style: 'thin' },
      bottom: { style: 'thin' }, right: { style: 'thin' },
    };
  });

  rows.forEach((row) => worksheet.addRow(row));

  const data = await workbook.xlsx.writeBuffer();
  return Buffer.from(data); 
}