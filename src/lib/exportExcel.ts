import { ResultsSubmissionRecord, formatYesNo, isYes } from './types';
import { DEPARTMENT_COLOR_MAP, DEFAULT_DEPARTMENT_COLOR } from './departments';

export async function exportToExcel(
  records: ResultsSubmissionRecord[],
  monthOrPeriodLabel: string,
  year?: number | string
) {
  const periodLabel = year !== undefined && year !== '' ? `${monthOrPeriodLabel} ${year}` : monthOrPeriodLabel;

  try {
    // Dynamic import to prevent SSR & Node stream module conflicts
    const ExcelModule = await import('exceljs');
    const ExcelJS = ExcelModule.default || ExcelModule;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'BCAS Campus Reporting System';
    workbook.created = new Date();

    const cleanName = periodLabel.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 25);
    const sheetName = `${cleanName} Progress Report`;
    const worksheet = workbook.addWorksheet(sheetName, {
      views: [
        {
          showGridLines: true,
          state: 'frozen',
          xSplit: 0,
          ySplit: 7, // Freeze the first 7 rows (title + header rows)
          topLeftCell: 'A8',
          activeCell: 'A8',
        },
      ],
    });

    // Page Setup
    worksheet.pageSetup = {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    };

    // Header Titles
    worksheet.mergeCells('A1:P1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'BCAS Campus';
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF0A2540' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 30;

    worksheet.mergeCells('A2:P2');
    const subTitleCell = worksheet.getCell('A2');
    subTitleCell.value = 'Progression of Results submission to the Board of Examiners Monthly wise';
    subTitleCell.font = { name: 'Arial', size: 12, bold: true, italic: true, color: { argb: 'FF1A4066' } };
    subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(2).height = 24;

    worksheet.mergeCells('A3:P3');
    const dateCell = worksheet.getCell('A3');
    dateCell.value = `Reporting Period: ${periodLabel}`;
    dateCell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF333333' } };
    dateCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(3).height = 20;

    // Empty row
    worksheet.getRow(4).height = 10;

    // Table Headers (Rows 5, 6, 7)
    const mainHeaders = [
      { col: 'A', name: '#' },
      { col: 'B', name: 'Branch Code' },
      { col: 'C', name: 'Faculty' },
      { col: 'D', name: 'Department' },
      { col: 'E', name: 'Intake' },
      { col: 'F', name: 'Program' },
      { col: 'G', name: 'Module' },
      { col: 'H', name: 'Coordinator' },
      { col: 'I', name: 'Semester/s' },
      { col: 'J', name: 'Eligible Batch for this month as per the Academic Calendar' },
    ];

    mainHeaders.forEach(({ col, name }) => {
      worksheet.mergeCells(`${col}5:${col}7`);
      const cell = worksheet.getCell(`${col}5`);
      cell.value = name;
    });

    // Grouped Header: Progress (K5:L5)
    worksheet.mergeCells('K5:L5');
    const progressHeader = worksheet.getCell('K5');
    progressHeader.value = 'Progress';

    worksheet.mergeCells('K6:K7');
    worksheet.getCell('K6').value = 'Submitted';
    worksheet.mergeCells('L6:L7');
    worksheet.getCell('L6').value = 'Not submitted';

    // Grouped Header: Delays for submission (M5:O5)
    worksheet.mergeCells('M5:O5');
    const delayHeader = worksheet.getCell('M5');
    delayHeader.value = 'Delays for submission';

    // Row 6 under Delays: Relevant month, Submitted, Not yet submitted
    worksheet.mergeCells('M6:M7');
    worksheet.getCell('M6').value = 'Relevant month to be submitted as per the academic calendar';

    worksheet.mergeCells('N6:N7');
    worksheet.getCell('N6').value = 'Submitted';

    worksheet.mergeCells('O6:O7');
    worksheet.getCell('O6').value = 'Not yet submitted';

    worksheet.mergeCells('P5:P7');
    worksheet.getCell('P5').value = 'Remarks';

    // Header Fill
    const headerFill: any = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0A2540' },
    };

    const borderStyle: any = {
      top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    };

    for (let r = 5; r <= 7; r++) {
      worksheet.getRow(r).height = 24;
      for (let c = 1; c <= 16; c++) {
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
      worksheet.mergeCells(`A${currentRow}:P${currentRow}`);
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
        row.getCell(2).value = rec.branch_code || '-';
        row.getCell(3).value = rec.faculty;
        row.getCell(4).value = rec.department;
        row.getCell(5).value = rec.intake || '-';
        row.getCell(6).value = rec.program;
        row.getCell(7).value = rec.module || '-';
        row.getCell(8).value = rec.coordinator;
        row.getCell(9).value = rec.semester;
        row.getCell(10).value = rec.eligible_batch;
        row.getCell(11).value = formatYesNo(rec.progress_submitted);
        row.getCell(12).value = formatYesNo(rec.progress_not_submitted);
        row.getCell(13).value = rec.relevant_submission_month || '-';
        row.getCell(14).value = formatYesNo(rec.delay_submitted);
        row.getCell(15).value = formatYesNo(rec.delay_not_yet_submitted);
        row.getCell(16).value = rec.remarks || '-';

        for (let c = 1; c <= 16; c++) {
          const cell = row.getCell(c);
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: bgArgb },
          };
          cell.border = borderStyle;
          cell.font = { name: 'Arial', size: 9.5 };

          if ([1, 2, 11, 12, 13, 14, 15].includes(c)) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            if ([11, 12, 14, 15].includes(c) && cell.value === 'Yes') {
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

      worksheet.mergeCells(`A${currentRow}:J${currentRow}`);
      const subLabel = worksheet.getCell(`A${currentRow}`);
      subLabel.value = `Total Yes for ${deptName}:`;
      subLabel.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0A2540' } };
      subLabel.alignment = { horizontal: 'right', vertical: 'middle' };

      subRow.getCell(11).value = `${deptSubtotal.ps} Yes`;
      subRow.getCell(12).value = `${deptSubtotal.pns} Yes`;
      subRow.getCell(13).value = '-';
      subRow.getCell(14).value = `${deptSubtotal.ds} Yes`;
      subRow.getCell(15).value = `${deptSubtotal.dnys} Yes`;
      subRow.getCell(16).value = '-';

      for (let c = 1; c <= 16; c++) {
        const cell = subRow.getCell(c);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE2E8F0' },
        };
        cell.border = borderStyle;
        cell.font = { name: 'Arial', size: 10, bold: true };
        if ([11, 12, 13, 14, 15].includes(c)) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }
      }

      currentRow++;
    });

    // Column Widths
    worksheet.getColumn(1).width = 6;   // #
    worksheet.getColumn(2).width = 10;  // Branch Code
    worksheet.getColumn(3).width = 24;  // Faculty
    worksheet.getColumn(4).width = 22;  // Department
    worksheet.getColumn(5).width = 18;  // Intake
    worksheet.getColumn(6).width = 26;  // Program
    worksheet.getColumn(7).width = 24;  // Module
    worksheet.getColumn(8).width = 20;  // Coordinator
    worksheet.getColumn(9).width = 16;  // Semester
    worksheet.getColumn(10).width = 22; // Eligible Batch
    worksheet.getColumn(11).width = 14; // Submitted
    worksheet.getColumn(12).width = 16; // Not submitted
    worksheet.getColumn(13).width = 22; // Relevant month
    worksheet.getColumn(14).width = 14; // Delay Sub
    worksheet.getColumn(15).width = 18; // Delay Not Sub
    worksheet.getColumn(16).width = 25; // Remarks

    // ─── Department Color Legend ───────────────────────────────────────────
    currentRow += 1; // blank separator row
    worksheet.getRow(currentRow).height = 10;
    currentRow++;

    // Legend title
    worksheet.mergeCells(`A${currentRow}:P${currentRow}`);
    const legendTitle = worksheet.getCell(`A${currentRow}`);
    legendTitle.value = 'DEPARTMENT COLOR LEGEND';
    legendTitle.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    legendTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A2540' } };
    legendTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    legendTitle.border = {
      top: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
    };
    worksheet.getRow(currentRow).height = 22;
    currentRow++;

    // Two-column layout for legend entries
    const legendEntries = Object.entries(grouped);
    const legendBorderStyle: any = {
      top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    };

    for (let i = 0; i < legendEntries.length; i += 2) {
      worksheet.getRow(currentRow).height = 20;

      // Left entry (cols A-H)
      const [leftDept] = legendEntries[i];
      const leftConfig = DEPARTMENT_COLOR_MAP[leftDept] || DEFAULT_DEPARTMENT_COLOR;
      const leftArgb = 'FF' + leftConfig.excelHex;

      worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
      const leftCell = worksheet.getCell(`A${currentRow}`);
      leftCell.value = `  ■  ${leftDept}`;
      leftCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: leftArgb } };
      leftCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0A2540' } };
      leftCell.alignment = { horizontal: 'left', vertical: 'middle' };
      leftCell.border = legendBorderStyle;

      // Right entry (cols I-P) – if it exists
      if (i + 1 < legendEntries.length) {
        const [rightDept] = legendEntries[i + 1];
        const rightConfig = DEPARTMENT_COLOR_MAP[rightDept] || DEFAULT_DEPARTMENT_COLOR;
        const rightArgb = 'FF' + rightConfig.excelHex;

        worksheet.mergeCells(`I${currentRow}:P${currentRow}`);
        const rightCell = worksheet.getCell(`I${currentRow}`);
        rightCell.value = `  ■  ${rightDept}`;
        rightCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rightArgb } };
        rightCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0A2540' } };
        rightCell.alignment = { horizontal: 'left', vertical: 'middle' };
        rightCell.border = legendBorderStyle;
      }

      currentRow++;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const cleanFilenameLabel = periodLabel.replace(/[^a-zA-Z0-9]/g, '_');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `BCAS_Results_Submission_Report_${cleanFilenameLabel}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: any) {
    console.warn('ExcelJS export warning, triggering HTML Spreadsheet download fallback:', error);
    exportToExcelHtmlFallback(records, periodLabel);
  }
}

// Fallback HTML Spreadsheet Exporter (Guaranteed compatibility in all browsers)
function exportToExcelHtmlFallback(
  records: ResultsSubmissionRecord[],
  periodLabel: string
) {
  const grouped: Record<string, ResultsSubmissionRecord[]> = {};
  records.forEach((rec) => {
    const dept = rec.department || 'Other';
    if (!grouped[dept]) grouped[dept] = [];
    grouped[dept].push(rec);
  });

  let rowsHtml = '';
  let globalIndex = 1;

  Object.entries(grouped).forEach(([deptName, deptRecords]) => {
    const config = DEPARTMENT_COLOR_MAP[deptName] || DEFAULT_DEPARTMENT_COLOR;
    const bgHex = '#' + config.excelHex;

    rowsHtml += `
      <tr style="background-color: ${bgHex}; font-weight: bold;">
        <td colspan="15" style="padding: 8px; border: 1px solid #999;">DEPARTMENT: ${deptName.toUpperCase()} (${deptRecords.length} Programs)</td>
      </tr>
    `;

    deptRecords.forEach((r) => {
      rowsHtml += `
        <tr style="background-color: ${bgHex};">
          <td style="text-align: center; border: 1px solid #ccc;">${globalIndex++}</td>
          <td style="text-align: center; border: 1px solid #ccc;">${r.branch_code || '-'}</td>
          <td style="border: 1px solid #ccc;">${r.faculty}</td>
          <td style="border: 1px solid #ccc;">${r.department}</td>
          <td style="border: 1px solid #ccc;">${r.intake || '-'}</td>
          <td style="border: 1px solid #ccc; font-weight: bold;">${r.program}</td>
          <td style="border: 1px solid #ccc;">${r.module || '-'}</td>
          <td style="border: 1px solid #ccc;">${r.coordinator}</td>
          <td style="text-align: center; border: 1px solid #ccc;">${r.semester}</td>
          <td style="border: 1px solid #ccc;">${r.eligible_batch}</td>
          <td style="text-align: center; border: 1px solid #ccc; font-weight: bold;">${formatYesNo(r.progress_submitted)}</td>
          <td style="text-align: center; border: 1px solid #ccc; font-weight: bold;">${formatYesNo(r.progress_not_submitted)}</td>
          <td style="text-align: center; border: 1px solid #ccc; font-weight: bold;">${r.relevant_submission_month || '-'}</td>
          <td style="text-align: center; border: 1px solid #ccc; font-weight: bold;">${formatYesNo(r.delay_submitted)}</td>
          <td style="text-align: center; border: 1px solid #ccc; font-weight: bold;">${formatYesNo(r.delay_not_yet_submitted)}</td>
          <td style="border: 1px solid #ccc;">${r.remarks || '-'}</td>
        </tr>
      `;
    });
  });

  const tableTemplate = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>BCAS Report</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
    </head>
    <body>
      <h2 style="text-align: center;">BCAS Campus</h2>
      <h3 style="text-align: center;">Progression of Results submission to the Board of Examiners Monthly wise</h3>
      <p style="text-align: center; font-weight: bold;">Reporting Period: ${periodLabel}</p>
      <table border="1" style="border-collapse: collapse; font-family: Arial; font-size: 11px;">
        <thead>
          <tr style="background-color: #0a2540; color: #ffffff; text-align: center; font-weight: bold;">
            <th rowspan="2">#</th>
            <th rowspan="2">Branch</th>
            <th rowspan="2">Faculty</th>
            <th rowspan="2">Department</th>
            <th rowspan="2">Intake</th>
            <th rowspan="2">Program</th>
            <th rowspan="2">Module</th>
            <th rowspan="2">Coordinator</th>
            <th rowspan="2">Semester/s</th>
            <th rowspan="2">Eligible Batch for this month as per Academic Calendar</th>
            <th colspan="2">Progress</th>
            <th colspan="3">Delays for submission</th>
            <th rowspan="2">Remarks</th>
          </tr>
          <tr style="background-color: #1a4066; color: #ffffff; text-align: center; font-weight: bold;">
            <th>Submitted</th>
            <th>Not submitted</th>
            <th>Relevant month to be submitted as per academic calendar</th>
            <th>Submitted</th>
            <th>Not yet submitted</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([tableTemplate], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  });

  const cleanFilenameLabel = periodLabel.replace(/[^a-zA-Z0-9]/g, '_');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `BCAS_Results_Submission_Report_${cleanFilenameLabel}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
