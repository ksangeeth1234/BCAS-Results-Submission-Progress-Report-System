import ExcelJS from 'exceljs';
import { ResultsSubmissionRecord, formatYesNo, isYes } from './types';
import { DEPARTMENT_COLOR_MAP, DEFAULT_DEPARTMENT_COLOR } from './departments';

export async function exportToExcel(
  records: ResultsSubmissionRecord[],
  month: string,
  year: number | string
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'BCAS Campus Reporting System';
  workbook.created = new Date();

  const sheetName = `${month.substring(0, 3)} ${year} Progress Report`;
  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ showGridLines: true }],
  });

  // Page Setup
  worksheet.pageSetup = {
    orientation: 'landscape',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };

  // Header Titles
  worksheet.mergeCells('A1:L1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'BCAS Campus';
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF0A2540' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 30;

  worksheet.mergeCells('A2:L2');
  const subTitleCell = worksheet.getCell('A2');
  subTitleCell.value = 'Progression of Results submission to the Board of Examiners Monthly wise';
  subTitleCell.font = { name: 'Arial', size: 12, bold: true, italic: true, color: { argb: 'FF1A4066' } };
  subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(2).height = 24;

  worksheet.mergeCells('A3:L3');
  const dateCell = worksheet.getCell('A3');
  dateCell.value = `Reporting Period: ${month} ${year}`;
  dateCell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF333333' } };
  dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(3).height = 20;

  // Empty row
  worksheet.getRow(4).height = 10;

  // Table Headers (Rows 5, 6, 7)
  const mainHeaders = [
    { col: 'A', name: '#' },
    { col: 'B', name: 'Faculty' },
    { col: 'C', name: 'Department' },
    { col: 'D', name: 'Program' },
    { col: 'E', name: 'Coordinator' },
    { col: 'F', name: 'Semester/s' },
    { col: 'G', name: 'Eligible Batch for this month as per the Academic Calendar' },
  ];

  mainHeaders.forEach(({ col, name }) => {
    worksheet.mergeCells(`${col}5:${col}7`);
    const cell = worksheet.getCell(`${col}5`);
    cell.value = name;
  });

  // Grouped Header: Progress (H5:I5)
  worksheet.mergeCells('H5:I5');
  const progressHeader = worksheet.getCell('H5');
  progressHeader.value = 'Progress';

  worksheet.mergeCells('H6:H7');
  worksheet.getCell('H6').value = 'Submitted';
  worksheet.mergeCells('I6:I7');
  worksheet.getCell('I6').value = 'Not submitted';

  // Grouped Header: Delays for submission (J5:L5)
  worksheet.mergeCells('J5:L5');
  const delayHeader = worksheet.getCell('J5');
  delayHeader.value = 'Delays for submission';

  // Row 6 under Delays: Relevant month... (J6:K6)
  worksheet.mergeCells('J6:K6');
  worksheet.getCell('J6').value = 'Relevant month to be submitted as per the academic calendar';

  worksheet.getCell('J7').value = 'Submitted';
  worksheet.getCell('K7').value = 'Not yet submitted';

  worksheet.mergeCells('L5:L7');
  worksheet.getCell('L5').value = 'Remarks';

  // Header Fill
  const headerFill: ExcelJS.Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0A2540' },
  };

  const borderStyle: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  };

  for (let r = 5; r <= 7; r++) {
    worksheet.getRow(r).height = 24;
    for (let c = 1; c <= 12; c++) {
      const cell = worksheet.getRow(r).getCell(c);
      cell.fill = headerFill;
      cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      };
    }
  }

  // Populate Data by Department
  let currentRow = 8;

  const grouped: Record<string, ResultsSubmissionRecord[]> = {};
  records.forEach((rec) => {
    const dept = rec.department || 'Other';
    if (!grouped[dept]) grouped[dept] = [];
    grouped[dept].push(rec);
  });

  let globalIndex = 1;

  Object.entries(grouped).forEach(([deptName, deptRecords]) => {
    const config = DEPARTMENT_COLOR_MAP[deptName] || DEFAULT_DEPARTMENT_COLOR;
    const bgArgb = 'FF' + config.excelHex;

    // Department Header Banner
    worksheet.mergeCells(`A${currentRow}:L${currentRow}`);
    const deptBanner = worksheet.getCell(`A${currentRow}`);
    deptBanner.value = `DEPARTMENT: ${deptName.toUpperCase()} (${deptRecords.length} Programs)`;
    deptBanner.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF0A2540' } };
    deptBanner.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bgArgb },
    };
    deptBanner.alignment = { horizontal: 'left', vertical: 'middle' };
    deptBanner.border = borderStyle;
    worksheet.getRow(currentRow).height = 24;
    currentRow++;

    // Data rows
    deptRecords.forEach((rec) => {
      const row = worksheet.getRow(currentRow);
      row.height = 22;

      row.getCell(1).value = globalIndex++;
      row.getCell(2).value = rec.faculty;
      row.getCell(3).value = rec.department;
      row.getCell(4).value = rec.program;
      row.getCell(5).value = rec.coordinator;
      row.getCell(6).value = rec.semester;
      row.getCell(7).value = rec.eligible_batch;
      row.getCell(8).value = formatYesNo(rec.progress_submitted);
      row.getCell(9).value = formatYesNo(rec.progress_not_submitted);
      row.getCell(10).value = formatYesNo(rec.delay_submitted);
      row.getCell(11).value = formatYesNo(rec.delay_not_yet_submitted);
      row.getCell(12).value = rec.remarks || '-';

      for (let c = 1; c <= 12; c++) {
        const cell = row.getCell(c);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: bgArgb },
        };
        cell.border = borderStyle;
        cell.font = { name: 'Arial', size: 9.5 };

        if ([1, 8, 9, 10, 11].includes(c)) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          if ([8, 9, 10, 11].includes(c) && cell.value === 'Yes') {
            cell.font = { name: 'Arial', size: 9.5, bold: true };
          }
        } else {
          cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
        }
      }

      currentRow++;
    });

    // Subtotal Row
    const deptSubtotal = deptRecords.reduce(
      (acc, r) => ({
        ps: acc.ps + (isYes(r.progress_submitted) ? 1 : 0),
        pns: acc.pns + (isYes(r.progress_not_submitted) ? 1 : 0),
        ds: acc.ds + (isYes(r.delay_submitted) ? 1 : 0),
        dnys: acc.dnys + (isYes(r.delay_not_yet_submitted) ? 1 : 0),
      }),
      { ps: 0, pns: 0, ds: 0, dnys: 0 }
    );

    const subRow = worksheet.getRow(currentRow);
    subRow.height = 22;

    worksheet.mergeCells(`A${currentRow}:G${currentRow}`);
    const subLabel = worksheet.getCell(`A${currentRow}`);
    subLabel.value = `Total Yes for ${deptName}:`;
    subLabel.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0A2540' } };
    subLabel.alignment = { horizontal: 'right', vertical: 'middle' };

    subRow.getCell(8).value = `${deptSubtotal.ps} Yes`;
    subRow.getCell(9).value = `${deptSubtotal.pns} Yes`;
    subRow.getCell(10).value = `${deptSubtotal.ds} Yes`;
    subRow.getCell(11).value = `${deptSubtotal.dnys} Yes`;
    subRow.getCell(12).value = '-';

    for (let c = 1; c <= 12; c++) {
      const cell = subRow.getCell(c);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2E8F0' },
      };
      cell.border = borderStyle;
      cell.font = { name: 'Arial', size: 10, bold: true };
      if ([8, 9, 10, 11].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
    }

    currentRow++;
  });

  // Column Widths
  worksheet.getColumn(1).width = 6;
  worksheet.getColumn(2).width = 25;
  worksheet.getColumn(3).width = 24;
  worksheet.getColumn(4).width = 28;
  worksheet.getColumn(5).width = 20;
  worksheet.getColumn(6).width = 16;
  worksheet.getColumn(7).width = 22;
  worksheet.getColumn(8).width = 14;
  worksheet.getColumn(9).width = 16;
  worksheet.getColumn(10).width = 14;
  worksheet.getColumn(11).width = 18;
  worksheet.getColumn(12).width = 25;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `BCAS_Results_Submission_Report_${month}_${year}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
