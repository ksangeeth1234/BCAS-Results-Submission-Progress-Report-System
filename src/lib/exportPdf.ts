import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ResultsSubmissionRecord, formatYesNo, isYes } from './types';
import { DEPARTMENT_COLOR_MAP, DEFAULT_DEPARTMENT_COLOR } from './departments';

export function exportToPdf(
  records: ResultsSubmissionRecord[],
  monthOrPeriodLabel: string,
  year?: number | string
) {
  const periodLabel = year !== undefined && year !== '' ? `${monthOrPeriodLabel} ${year}` : monthOrPeriodLabel;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(10, 37, 64);
  doc.text('BCAS Campus', pageWidth / 2, 14, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(26, 64, 102);
  doc.text(
    'Progression of Results submission to the Board of Examiners Monthly wise',
    pageWidth / 2,
    20,
    { align: 'center' }
  );

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(`Reporting Period: ${periodLabel}`, pageWidth / 2, 25, { align: 'center' });

  const head = [
    [
      { content: '#', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Branch Code', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Faculty', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Department', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Intake', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Program', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Module', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Coordinator', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Semester/s', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Eligible Batch for this month as per Academic Calendar', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Progress', colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Delays for submission', colSpan: 3, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Remarks', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
    ],
    [
      { content: 'Submitted', styles: { halign: 'center', valign: 'middle' } },
      { content: 'Not submitted', styles: { halign: 'center', valign: 'middle' } },
      { content: 'Relevant month to be submitted as per academic calendar', styles: { halign: 'center', valign: 'middle' } },
      { content: 'Submitted', styles: { halign: 'center', valign: 'middle' } },
      { content: 'Not yet submitted', styles: { halign: 'center', valign: 'middle' } },
    ]
  ];

  const grouped: Record<string, ResultsSubmissionRecord[]> = {};
  records.forEach((rec) => {
    const dept = rec.department || 'Other';
    if (!grouped[dept]) grouped[dept] = [];
    grouped[dept].push(rec);
  });

  const body: any[] = [];
  let index = 1;

  Object.entries(grouped).forEach(([deptName, deptRecords]) => {
    const config = DEPARTMENT_COLOR_MAP[deptName] || DEFAULT_DEPARTMENT_COLOR;

    body.push([
      {
        content: `DEPARTMENT: ${deptName.toUpperCase()} (${deptRecords.length} Programs)`,
        colSpan: 16,
        styles: {
          fillColor: config.pdfRgb,
          textColor: [10, 37, 64],
          fontStyle: 'bold',
          halign: 'left',
        },
      },
    ]);

    deptRecords.forEach((r) => {
      body.push({
        raw: r,
        deptConfig: config,
        data: [
          index++,
          r.branch_code || '-',
          r.faculty,
          r.department,
          r.intake || '-',
          r.program,
          r.module || '-',
          r.coordinator,
          r.semester,
          r.eligible_batch,
          formatYesNo(r.progress_submitted),
          formatYesNo(r.progress_not_submitted),
          r.relevant_submission_month || '-',
          formatYesNo(r.delay_submitted),
          formatYesNo(r.delay_not_yet_submitted),
          r.remarks || '-',
        ],
      });
    });

    const subtotal = deptRecords.reduce(
      (acc, r) => ({
        ps: acc.ps + (isYes(r.progress_submitted) ? 1 : 0),
        pns: acc.pns + (isYes(r.progress_not_submitted) ? 1 : 0),
        ds: acc.ds + (isYes(r.delay_submitted) ? 1 : 0),
        dnys: acc.dnys + (isYes(r.delay_not_yet_submitted) ? 1 : 0),
      }),
      { ps: 0, pns: 0, ds: 0, dnys: 0 }
    );

    body.push([
      { content: `Total for ${deptName}:`, colSpan: 10, styles: { halign: 'right', fontStyle: 'bold', fillColor: [226, 232, 240] } },
      { content: `${subtotal.ps}`, styles: { halign: 'center', fontStyle: 'bold', fillColor: [226, 232, 240] } },
      { content: `${subtotal.pns}`, styles: { halign: 'center', fontStyle: 'bold', fillColor: [226, 232, 240] } },
      { content: '-', styles: { halign: 'center', fontStyle: 'bold', fillColor: [226, 232, 240] } },
      { content: `${subtotal.ds}`, styles: { halign: 'center', fontStyle: 'bold', fillColor: [226, 232, 240] } },
      { content: `${subtotal.dnys}`, styles: { halign: 'center', fontStyle: 'bold', fillColor: [226, 232, 240] } },
      { content: '-', styles: { halign: 'center', fontStyle: 'bold', fillColor: [226, 232, 240] } },
    ]);
  });

  autoTable(doc, {
    startY: 28,
    head: head as any,
    body: body.map((b) => (Array.isArray(b) ? b : b.data)),
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7,
      cellPadding: 1.5,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
      textColor: [30, 30, 30],
    },
    headStyles: {
      fillColor: [10, 37, 64],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7,
      halign: 'center',
      valign: 'middle',
    },
    didParseCell: (data) => {
      const rawRow = body[data.row.index];
      if (rawRow && rawRow.deptConfig && data.section === 'body') {
        data.cell.styles.fillColor = rawRow.deptConfig.pdfRgb;
      }
    },
    columnStyles: {
      0: { cellWidth: 5, halign: 'center' },
      1: { cellWidth: 9, halign: 'center' }, // Branch Code
      2: { cellWidth: 16 },
      3: { cellWidth: 16 },
      4: { cellWidth: 14 },
      5: { cellWidth: 20 },
      6: { cellWidth: 16 },
      7: { cellWidth: 15 },
      8: { cellWidth: 12 },
      9: { cellWidth: 16 },
      10: { cellWidth: 11, halign: 'center' },
      11: { cellWidth: 13, halign: 'center' },
      12: { cellWidth: 18, halign: 'center' },
      13: { cellWidth: 11, halign: 'center' },
      14: { cellWidth: 13, halign: 'center' },
      15: { cellWidth: 16 },
    },
    margin: { top: 28, left: 10, right: 10, bottom: 15 },
    didDrawPage: (data) => {
      const str = 'Page ' + doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        str,
        pageWidth - 20,
        doc.internal.pageSize.getHeight() - 8
      );
      doc.text(
        'BCAS Campus - Results Submission Progress System',
        10,
        doc.internal.pageSize.getHeight() - 8
      );
    },
  });

  const cleanFilenameLabel = periodLabel.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`BCAS_Results_Submission_Report_${cleanFilenameLabel}.pdf`);
}
