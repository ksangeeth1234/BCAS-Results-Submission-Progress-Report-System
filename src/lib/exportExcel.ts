import { ResultsSubmissionRecord, formatYesNo, isYes } from './types';
import { DEPARTMENT_COLOR_MAP, DEFAULT_DEPARTMENT_COLOR, BRANCH_CODES } from './departments';
/**
 * Sanitizes a string for use as an Excel sheet name (max 31 chars, no illegal chars: \ / ? * [ ] :)
 */
function sanitizeSheetName(name: string): string {
  const sanitized = name.replace(/[\\/?*[\]:]/g, ' ').trim();
  return (sanitized || 'Sheet').substring(0, 31);
}

/**
 * Ensures unique sheet name within the workbook.
 */
function getUniqueSheetName(workbook: any, desiredName: string): string {
  const baseName = sanitizeSheetName(desiredName);
  const existingNames = new Set(
    workbook.worksheets.map((ws: any) => ws.name.toLowerCase())
  );

  if (!existingNames.has(baseName.toLowerCase())) {
    return baseName;
  }

  let counter = 1;
  while (true) {
    const suffix = ` (${counter})`;
    const candidate = baseName.substring(0, 31 - suffix.length) + suffix;
    if (!existingNames.has(candidate.toLowerCase())) {
      return candidate;
    }
    counter++;
  }
}

/**
 * Populates a worksheet with header titles, table structure, department groupings,
 * pastel colors, subtotals, grand totals, and department color legend.
 */
function populateWorksheet(
  worksheet: any,
  records: ResultsSubmissionRecord[],
  periodLabel: string,
  branchSubtitle?: string
) {
  // Page Setup
  worksheet.pageSetup = {
    orientation: 'landscape',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
  };

  // Header Titles
  worksheet.mergeCells('A1:R1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'BCAS Campus';
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF0A2540' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 30;

  worksheet.mergeCells('A2:R2');
  const subTitleCell = worksheet.getCell('A2');
  subTitleCell.value = 'Progression of Results submission to the Board of Examiners Monthly wise';
  subTitleCell.font = { name: 'Arial', size: 12, bold: true, italic: true, color: { argb: 'FF1A4066' } };
  subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(2).height = 24;

  worksheet.mergeCells('A3:R3');
  const dateCell = worksheet.getCell('A3');
  dateCell.value = branchSubtitle
    ? `Reporting Period: ${periodLabel} | Branch: ${branchSubtitle}`
    : `Reporting Period: ${periodLabel}`;
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
  worksheet.getCell('P5').value = 'Given Deadline';

  worksheet.mergeCells('Q5:Q7');
  worksheet.getCell('Q5').value = 'Achieved?';

  worksheet.mergeCells('R5:R7');
  worksheet.getCell('R5').value = 'Remarks';

  // Header Fill
  const headerFill: any = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0A2540' },
  };

  const deadlineHeaderFill: any = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF006064' }, // cyan-dark
  };

  const achievedHeaderFill: any = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF004D40' }, // teal-dark
  };

  const borderStyle: any = {
    top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  };

  for (let r = 5; r <= 7; r++) {
    worksheet.getRow(r).height = 24;
    for (let c = 1; c <= 18; c++) {
      const cell = worksheet.getRow(r).getCell(c);
      let fill = headerFill;
      if (c === 16) fill = deadlineHeaderFill;
      if (c === 17) fill = achievedHeaderFill;
      cell.fill = fill;
      cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
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

  let rowIndex = 1;

  Object.entries(grouped).forEach(([deptName, deptRecords]) => {
    const config = DEPARTMENT_COLOR_MAP[deptName] || DEFAULT_DEPARTMENT_COLOR;
    const bgArgb = 'FF' + config.excelHex;

    // Department Header Banner
    worksheet.mergeCells(`A${currentRow}:R${currentRow}`);
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

      row.getCell(1).value = rowIndex++;
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
      row.getCell(16).value = rec.given_deadline || '-';
      row.getCell(17).value = rec.achieved_or_not !== undefined && rec.achieved_or_not !== null && rec.achieved_or_not !== ''
        ? (isYes(rec.achieved_or_not) ? 'Yes ✓' : 'No ✗')
        : '-';
      row.getCell(18).value = rec.remarks || '-';

      for (let c = 1; c <= 18; c++) {
        const cell = row.getCell(c);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: bgArgb },
        };
        cell.border = borderStyle;
        cell.font = { name: 'Arial', size: 9.5 };

        if ([1, 2, 11, 12, 13, 14, 15, 16, 17].includes(c)) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          if ([11, 12, 14, 15].includes(c) && cell.value === 'Yes') {
            cell.font = { name: 'Arial', size: 9.5, bold: true };
          }
          // Deadline column tinted
          if (c === 16) {
            cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF004D40' } };
          }
          // Achieved column color-coded
          if (c === 17) {
            const achYes = cell.value === 'Yes ✓';
            const achNo = cell.value === 'No ✗';
            if (achYes) {
              cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1B5E20' } };
            } else if (achNo) {
              cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFB71C1C' } };
            }
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
        ach: acc.ach + (isYes(r.achieved_or_not) ? 1 : 0),
      }),
      { ps: 0, pns: 0, ds: 0, dnys: 0, ach: 0 }
    );

    const subRow = worksheet.getRow(currentRow);
    subRow.height = 22;

    worksheet.mergeCells(`A${currentRow}:J${currentRow}`);
    const subLabel = worksheet.getCell(`A${currentRow}`);
    subLabel.value = `Total for ${deptName}:`;
    subLabel.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0A2540' } };
    subLabel.alignment = { horizontal: 'right', vertical: 'middle' };

    subRow.getCell(11).value = deptSubtotal.ps;
    subRow.getCell(12).value = deptSubtotal.pns;
    subRow.getCell(13).value = '-';
    subRow.getCell(14).value = deptSubtotal.ds;
    subRow.getCell(15).value = deptSubtotal.dnys;
    subRow.getCell(16).value = '-';
    subRow.getCell(17).value = `${deptSubtotal.ach} Achieved`;
    subRow.getCell(18).value = '-';

    for (let c = 1; c <= 18; c++) {
      const cell = subRow.getCell(c);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2E8F0' },
      };
      cell.border = borderStyle;
      cell.font = { name: 'Arial', size: 10, bold: true };
      if ([11, 12, 13, 14, 15, 16, 17].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
    }

    currentRow++;
  });

  // Grand Total Row (if more than 1 department)
  if (Object.keys(grouped).length > 1) {
    const grandTotal = records.reduce(
      (acc, r) => ({
        ps: acc.ps + (isYes(r.progress_submitted) ? 1 : 0),
        pns: acc.pns + (isYes(r.progress_not_submitted) ? 1 : 0),
        ds: acc.ds + (isYes(r.delay_submitted) ? 1 : 0),
        dnys: acc.dnys + (isYes(r.delay_not_yet_submitted) ? 1 : 0),
        ach: acc.ach + (isYes(r.achieved_or_not) ? 1 : 0),
      }),
      { ps: 0, pns: 0, ds: 0, dnys: 0, ach: 0 }
    );

    const grandRow = worksheet.getRow(currentRow);
    grandRow.height = 24;

    worksheet.mergeCells(`A${currentRow}:J${currentRow}`);
    const grandLabel = worksheet.getCell(`A${currentRow}`);
    grandLabel.value = `GRAND TOTAL (${records.length} Programs):`;
    grandLabel.font = { name: 'Arial', size: 10.5, bold: true, color: { argb: 'FFFFFFFF' } };
    grandLabel.alignment = { horizontal: 'right', vertical: 'middle' };

    grandRow.getCell(11).value = grandTotal.ps;
    grandRow.getCell(12).value = grandTotal.pns;
    grandRow.getCell(13).value = '-';
    grandRow.getCell(14).value = grandTotal.ds;
    grandRow.getCell(15).value = grandTotal.dnys;
    grandRow.getCell(16).value = '-';
    grandRow.getCell(17).value = `${grandTotal.ach} Achieved`;
    grandRow.getCell(18).value = '-';

    for (let c = 1; c <= 18; c++) {
      const cell = grandRow.getCell(c);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0A2540' },
      };
      cell.border = borderStyle;
      cell.font = { name: 'Arial', size: 10.5, bold: true, color: { argb: 'FFFFFFFF' } };
      if ([11, 12, 13, 14, 15, 16, 17].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
    }

    currentRow++;
  }

  // Column Widths
  worksheet.getColumn(1).width = 6;   // #
  worksheet.getColumn(2).width = 12;  // Branch Code
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
  worksheet.getColumn(16).width = 20; // Given Deadline
  worksheet.getColumn(17).width = 14; // Achieved?
  worksheet.getColumn(18).width = 25; // Remarks

  // ─── Department Color Legend ───────────────────────────────────────────
  currentRow += 1; // blank separator row
  worksheet.getRow(currentRow).height = 10;
  currentRow++;

  // Legend title
  worksheet.mergeCells(`A${currentRow}:R${currentRow}`);
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

    // Left entry (cols A-I)
    const [leftDept] = legendEntries[i];
    const leftConfig = DEPARTMENT_COLOR_MAP[leftDept] || DEFAULT_DEPARTMENT_COLOR;
    const leftArgb = 'FF' + leftConfig.excelHex;

    worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
    const leftCell = worksheet.getCell(`A${currentRow}`);
    leftCell.value = `  ■  ${leftDept}`;
    leftCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: leftArgb } };
    leftCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0A2540' } };
    leftCell.alignment = { horizontal: 'left', vertical: 'middle' };
    leftCell.border = legendBorderStyle;

    // Right entry (cols J-R) – if it exists
    if (i + 1 < legendEntries.length) {
      const [rightDept] = legendEntries[i + 1];
      const rightConfig = DEPARTMENT_COLOR_MAP[rightDept] || DEFAULT_DEPARTMENT_COLOR;
      const rightArgb = 'FF' + rightConfig.excelHex;

      worksheet.mergeCells(`J${currentRow}:R${currentRow}`);
      const rightCell = worksheet.getCell(`J${currentRow}`);
      rightCell.value = `  ■  ${rightDept}`;
      rightCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rightArgb } };
      rightCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0A2540' } };
      rightCell.alignment = { horizontal: 'left', vertical: 'middle' };
      rightCell.border = legendBorderStyle;
    }

    currentRow++;
  }
}

/**
 * Populates a summary analysis sheet with department & program-wise statistics,
 * color-coded by department, broken down by branch.
 */
function populateSummarySheet(
  worksheet: any,
  allRecords: ResultsSubmissionRecord[],
  periodLabel: string,
  branchGroups: Map<string, { code: string; label: string; tabName: string; records: ResultsSubmissionRecord[] }>
) {
  const borderStyle: any = {
    top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  };

  const thickBorder: any = {
    top: { style: 'medium', color: { argb: 'FF0A2540' } },
    left: { style: 'medium', color: { argb: 'FF0A2540' } },
    bottom: { style: 'medium', color: { argb: 'FF0A2540' } },
    right: { style: 'medium', color: { argb: 'FF0A2540' } },
  };

  worksheet.pageSetup = { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 };

  const lastCol = 'J';

  worksheet.mergeCells(`A1:${lastCol}1`);
  const t1 = worksheet.getCell('A1');
  t1.value = 'BCAS Campus — Results Submission Summary Analysis';
  t1.font = { name: 'Arial', size: 15, bold: true, color: { argb: 'FF0A2540' } };
  t1.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 30;

  worksheet.mergeCells(`A2:${lastCol}2`);
  const t2 = worksheet.getCell('A2');
  t2.value = `Reporting Period: ${periodLabel}`;
  t2.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF1A4066' } };
  t2.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(2).height = 22;

  worksheet.mergeCells(`A3:${lastCol}3`);
  const t3 = worksheet.getCell('A3');
  t3.value = 'Department & Program-wise Submission Status | Color-coded by Department';
  t3.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF616161' } };
  t3.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(3).height = 18;

  worksheet.getRow(4).height = 10;

  const headers = [
    'Branch', 'Department', 'Program', 'Total Records',
    'Submitted (Progress)', 'Not Submitted', 'Delay Submitted', 'Not Yet Submitted',
    'Given Deadline', 'Achieved?',
  ];

  const headerRow = worksheet.getRow(5);
  headerRow.height = 26;
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A2540' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = thickBorder;
  });

  let currentRow = 6;

  const branchOrder = Array.from(branchGroups.keys()).sort((a, b) => {
    if (a === 'UNASSIGNED') return 1;
    if (b === 'UNASSIGNED') return -1;
    const iA = BRANCH_CODES.findIndex(br => br.code.toUpperCase() === a);
    const iB = BRANCH_CODES.findIndex(br => br.code.toUpperCase() === b);
    if (iA !== -1 && iB !== -1) return iA - iB;
    if (iA !== -1) return -1;
    if (iB !== -1) return 1;
    return a.localeCompare(b);
  });

  for (const branchKey of branchOrder) {
    const branchGroup = branchGroups.get(branchKey)!;
    const branchRecs = branchGroup.records;
    const branchLabel = branchGroup.label;

    const deptMap: Record<string, ResultsSubmissionRecord[]> = {};
    branchRecs.forEach(r => {
      const d = r.department || 'Other';
      if (!deptMap[d]) deptMap[d] = [];
      deptMap[d].push(r);
    });

    for (const [deptName, deptRecs] of Object.entries(deptMap)) {
      const deptConfig = DEPARTMENT_COLOR_MAP[deptName] || DEFAULT_DEPARTMENT_COLOR;
      const bgArgb = 'FF' + deptConfig.excelHex;

      worksheet.mergeCells(`A${currentRow}:${lastCol}${currentRow}`);
      const banner = worksheet.getCell(`A${currentRow}`);
      banner.value = `  ◆  ${branchLabel}  |  DEPARTMENT: ${deptName.toUpperCase()}  (${deptRecs.length} programs)`;
      banner.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF0A2540' } };
      banner.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } };
      banner.alignment = { horizontal: 'left', vertical: 'middle' };
      banner.border = borderStyle;
      worksheet.getRow(currentRow).height = 22;
      currentRow++;

      const programMap: Record<string, ResultsSubmissionRecord[]> = {};
      deptRecs.forEach(r => {
        const p = r.program || 'Unknown Program';
        if (!programMap[p]) programMap[p] = [];
        programMap[p].push(r);
      });

      for (const [progName, progRecs] of Object.entries(programMap)) {
        const ps = progRecs.filter(r => isYes(r.progress_submitted)).length;
        const pns = progRecs.filter(r => isYes(r.progress_not_submitted)).length;
        const ds = progRecs.filter(r => isYes(r.delay_submitted)).length;
        const dnys = progRecs.filter(r => isYes(r.delay_not_yet_submitted)).length;
        const ach = progRecs.filter(r => isYes(r.achieved_or_not)).length;
        const totalProg = progRecs.length;

        const deadlines = [...new Set(progRecs.map(r => r.given_deadline).filter(Boolean))];
        const deadlineStr = deadlines.length > 0 ? deadlines.join(', ') : '-';

        // Row background: red if nothing submitted, amber if delays, else dept color
        let rowBgArgb = bgArgb;
        if (dnys > 0) rowBgArgb = 'FFFFF3CD';
        if (pns > 0 && ps === 0) rowBgArgb = 'FFFCE4EC';

        const dataRow = worksheet.getRow(currentRow);
        dataRow.height = 20;

        const achStr = deadlines.length === 0
          ? '-'
          : ach === totalProg
            ? `All ${ach}/${totalProg} ✓`
            : ach > 0
              ? `Partial ${ach}/${totalProg}`
              : `None 0/${totalProg} ✗`;

        const vals = [branchLabel, deptName, progName, totalProg, ps, pns, ds, dnys, deadlineStr, achStr];

        vals.forEach((v, i) => {
          const cell = dataRow.getCell(i + 1);
          cell.value = v;
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + rowBgArgb.substring(2) } };
          cell.border = borderStyle;
          cell.font = { name: 'Arial', size: 9.5 };
          cell.alignment = { horizontal: i < 3 ? 'left' : 'center', vertical: 'middle', wrapText: i < 3 };

          if (i === 4 && ps > 0) cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1B5E20' } };
          if (i === 5 && pns > 0) cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFB71C1C' } };
          if (i === 6 && ds > 0) cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFE65100' } };
          if (i === 7 && dnys > 0) cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF6A1B9A' } };
          if (i === 9) {
            const sv = String(v);
            if (sv.includes('✓')) cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1B5E20' } };
            else if (sv.includes('Partial')) cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFE65100' } };
            else if (sv.includes('✗')) cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FFB71C1C' } };
          }
        });

        currentRow++;
      }

      // Department Subtotal
      const deptPs = deptRecs.filter(r => isYes(r.progress_submitted)).length;
      const deptPns = deptRecs.filter(r => isYes(r.progress_not_submitted)).length;
      const deptDs = deptRecs.filter(r => isYes(r.delay_submitted)).length;
      const deptDnys = deptRecs.filter(r => isYes(r.delay_not_yet_submitted)).length;
      const deptAch = deptRecs.filter(r => isYes(r.achieved_or_not)).length;

      const subtotRow = worksheet.getRow(currentRow);
      subtotRow.height = 20;
      worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
      const stLabel = worksheet.getCell(`A${currentRow}`);
      stLabel.value = `  Subtotal — ${deptName}`;
      stLabel.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF0A2540' } };
      stLabel.alignment = { horizontal: 'left', vertical: 'middle' };

      const subtotVals = [deptRecs.length, deptPs, deptPns, deptDs, deptDnys, '-', deptAch > 0 ? `${deptAch}/${deptRecs.length}` : '-'];
      subtotVals.forEach((v, i) => {
        const cell = subtotRow.getCell(4 + i);
        cell.value = v;
        cell.font = { name: 'Arial', size: 9.5, bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = borderStyle;
      });
      for (let c = 1; c <= 3; c++) {
        const cell = subtotRow.getCell(c);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
        cell.border = borderStyle;
      }
      currentRow++;
    }

    // Branch Grand Total
    const bPs = branchRecs.filter(r => isYes(r.progress_submitted)).length;
    const bPns = branchRecs.filter(r => isYes(r.progress_not_submitted)).length;
    const bDs = branchRecs.filter(r => isYes(r.delay_submitted)).length;
    const bDnys = branchRecs.filter(r => isYes(r.delay_not_yet_submitted)).length;
    const bAch = branchRecs.filter(r => isYes(r.achieved_or_not)).length;

    worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
    const branchTotalRow = worksheet.getRow(currentRow);
    branchTotalRow.height = 22;
    const btLabel = worksheet.getCell(`A${currentRow}`);
    btLabel.value = `  BRANCH TOTAL — ${branchLabel}`;
    btLabel.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    btLabel.alignment = { horizontal: 'left', vertical: 'middle' };

    const btVals = [branchRecs.length, bPs, bPns, bDs, bDnys, '-', `${bAch}/${branchRecs.length}`];
    btVals.forEach((v, i) => {
      const cell = branchTotalRow.getCell(4 + i);
      cell.value = v;
      cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A4066' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = thickBorder;
    });
    for (let c = 1; c <= 3; c++) {
      const cell = branchTotalRow.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A4066' } };
      cell.border = thickBorder;
    }
    currentRow++;

    worksheet.getRow(currentRow).height = 8;
    currentRow++;
  }

  // Grand Total
  const gtPs = allRecords.filter(r => isYes(r.progress_submitted)).length;
  const gtPns = allRecords.filter(r => isYes(r.progress_not_submitted)).length;
  const gtDs = allRecords.filter(r => isYes(r.delay_submitted)).length;
  const gtDnys = allRecords.filter(r => isYes(r.delay_not_yet_submitted)).length;
  const gtAch = allRecords.filter(r => isYes(r.achieved_or_not)).length;

  worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
  const gtRow = worksheet.getRow(currentRow);
  gtRow.height = 26;
  const gtLabel = worksheet.getCell(`A${currentRow}`);
  gtLabel.value = `  ★  GRAND TOTAL — ALL BRANCHES (${allRecords.length} Records)`;
  gtLabel.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  gtLabel.alignment = { horizontal: 'left', vertical: 'middle' };

  const gtVals = [allRecords.length, gtPs, gtPns, gtDs, gtDnys, '-', `${gtAch}/${allRecords.length}`];
  gtVals.forEach((v, i) => {
    const cell = gtRow.getCell(4 + i);
    cell.value = v;
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A2540' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = thickBorder;
  });
  for (let c = 1; c <= 3; c++) {
    const cell = gtRow.getCell(c);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A2540' } };
    cell.border = thickBorder;
  }

  // Column Widths
  worksheet.getColumn(1).width = 22;
  worksheet.getColumn(2).width = 22;
  worksheet.getColumn(3).width = 32;
  worksheet.getColumn(4).width = 14;
  worksheet.getColumn(5).width = 18;
  worksheet.getColumn(6).width = 16;
  worksheet.getColumn(7).width = 16;
  worksheet.getColumn(8).width = 18;
  worksheet.getColumn(9).width = 20;
  worksheet.getColumn(10).width = 18;
}

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

    // Group records by branch code
    const branchGroups = new Map<
      string,
      { code: string; label: string; tabName: string; records: ResultsSubmissionRecord[] }
    >();

    records.forEach((rec) => {
      const code = (rec.branch_code || '').trim();
      const upperCode = code.toUpperCase();
      const matched = BRANCH_CODES.find((b) => b.code.toUpperCase() === upperCode);
      const key = upperCode || 'UNASSIGNED';
      const label = matched ? matched.label : (code ? `${code} Branch` : 'Unassigned Branch');
      const tabName = matched ? matched.label : (code ? code : 'Unassigned');

      if (!branchGroups.has(key)) {
        branchGroups.set(key, { code: upperCode, label, tabName, records: [] });
      }
      branchGroups.get(key)!.records.push(rec);
    });

    // 1. Consolidated Tab: "All Branches"
    const allSheetName = getUniqueSheetName(workbook, 'All Branches');
    const allWorksheet = workbook.addWorksheet(allSheetName, {
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
    populateWorksheet(allWorksheet, records, periodLabel, 'All Branches (Consolidated)');

    // 2. Separate Tab for each branch
    // Sort branches: known branches in defined order, then any custom codes, then unassigned
    const sortedBranchKeys = Array.from(branchGroups.keys()).sort((a, b) => {
      if (a === 'UNASSIGNED') return 1;
      if (b === 'UNASSIGNED') return -1;
      const indexA = BRANCH_CODES.findIndex((br) => br.code.toUpperCase() === a);
      const indexB = BRANCH_CODES.findIndex((br) => br.code.toUpperCase() === b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });

    for (const key of sortedBranchKeys) {
      const group = branchGroups.get(key)!;
      const sheetName = getUniqueSheetName(workbook, group.tabName);
      const branchWorksheet = workbook.addWorksheet(sheetName, {
        views: [
          {
            showGridLines: true,
            state: 'frozen',
            xSplit: 0,
            ySplit: 7,
            topLeftCell: 'A8',
            activeCell: 'A8',
          },
        ],
      });
      populateWorksheet(branchWorksheet, group.records, periodLabel, group.label);
    }

    // 3. Summary Analysis Sheet
    const summarySheetName = getUniqueSheetName(workbook, '📊 Summary Analysis');
    const summaryWorksheet = workbook.addWorksheet(summarySheetName, {
      views: [{ showGridLines: true, state: 'frozen', xSplit: 0, ySplit: 5, topLeftCell: 'A6', activeCell: 'A6' }],
    });
    populateSummarySheet(summaryWorksheet, records, periodLabel, branchGroups);

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
  // Group by branch code
  const branchMap: Record<string, { label: string; records: ResultsSubmissionRecord[] }> = {};
  records.forEach((rec) => {
    const code = (rec.branch_code || '').trim().toUpperCase();
    const matched = BRANCH_CODES.find((b) => b.code.toUpperCase() === code);
    const key = code || 'UNASSIGNED';
    const label = matched ? matched.label : (code ? `${code} Branch` : 'Unassigned Branch');
    if (!branchMap[key]) {
      branchMap[key] = { label, records: [] };
    }
    branchMap[key].records.push(rec);
  });

  let tablesHtml = '';

  Object.entries(branchMap).forEach(([, branchData]) => {
    const groupedDept: Record<string, ResultsSubmissionRecord[]> = {};
    branchData.records.forEach((rec) => {
      const dept = rec.department || 'Other';
      if (!groupedDept[dept]) groupedDept[dept] = [];
      groupedDept[dept].push(rec);
    });

    let rowsHtml = '';
    let globalIndex = 1;

    Object.entries(groupedDept).forEach(([deptName, deptRecords]) => {
      const config = DEPARTMENT_COLOR_MAP[deptName] || DEFAULT_DEPARTMENT_COLOR;
      const bgHex = '#' + config.excelHex;

      rowsHtml += `
        <tr style="background-color: ${bgHex}; font-weight: bold;">
          <td colspan="18" style="padding: 8px; border: 1px solid #999;">DEPARTMENT: ${deptName.toUpperCase()} (${deptRecords.length} Programs)</td>
        </tr>
      `;

      deptRecords.forEach((r) => {
        const achStr = r.achieved_or_not !== undefined && r.achieved_or_not !== null && r.achieved_or_not !== ''
          ? (isYes(r.achieved_or_not) ? 'Yes ✓' : 'No ✗') : '-';
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
            <td style="text-align: center; border: 1px solid #ccc; font-weight: bold; color: #004D40;">${r.given_deadline || '-'}</td>
            <td style="text-align: center; border: 1px solid #ccc; font-weight: bold;">${achStr}</td>
            <td style="border: 1px solid #ccc;">${r.remarks || '-'}</td>
          </tr>
        `;
      });
    });

    tablesHtml += `
      <h3 style="margin-top: 30px; color: #0a2540;">BRANCH: ${branchData.label.toUpperCase()} (${branchData.records.length} Records)</h3>
      <table border="1" style="border-collapse: collapse; font-family: Arial; font-size: 11px; margin-bottom: 25px;">
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
            <th rowspan="2" style="background-color:#006064;">Given Deadline</th>
            <th rowspan="2" style="background-color:#004D40;">Achieved?</th>
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
    `;
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
      ${tablesHtml}
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
