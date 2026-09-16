import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ResultsSubmissionRecord, formatYesNo, isYes } from './types';
import { DEPARTMENT_COLOR_MAP, DEFAULT_DEPARTMENT_COLOR } from './departments';

export function exportToPdf(
  records: ResultsSubmissionRecord[],
  month: string,
  year: number | string
) {
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
  doc.text(`Reporting Period: ${month} ${year}`, pageWidth / 2, 25, { align: 'center' });

  const head = [
    [
      { content: '#', rowSpan: 3, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Faculty', rowSpan: 3, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Department', rowSpan: 3, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Program', rowSpan: 3, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Coordinator', rowSpan: 3, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Semester/s', rowSpan: 3, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Eligible Batch for this month as per Academic Calendar', rowSpan: 3, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Progress', colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Delays for submission', colSpan: 3, styles: { halign: 'center', valign: 'middle' } },
    ],
    [
      { content: 'Submitted', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Not submitted', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Relevant month to be submitted as per academic calendar', colSpan: 2, styles: { halign: 'center', valign: 'middle' } },
      { content: 'Remarks', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
    ],
    [
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
        colSpan: 12,
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
          r.faculty,
          r.department,
          r.program,
          r.coordinator,
          r.semester,
          r.eligible_batch,
          formatYesNo(r.progress_submitted),
          formatYesNo(r.progress_not_submitted),
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
      { content: `Total Yes for ${deptName}:`, colSpan: 7, styles: { halign: 'right', fontStyle: 'bold', fillColor: [226, 232, 240] } },
      { content: `${subtotal.ps} Yes`, styles: { halign: 'center', fontStyle: 'bold', fillColor: [226, 232, 240] } },
      { content: `${subtotal.pns} Yes`, styles: { halign: 'center', fontStyle: 'bold', fillColor: [226, 232, 240] } },
      { content: `${subtotal.ds} Yes`, styles: { halign: 'center', fontStyle: 'bold', fillColor: [226, 232, 240] } },
      { content: `${subtotal.dnys} Yes`, styles: { halign: 'center', fontStyle: 'bold', fillColor: [226, 232, 240] } },
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
      fontSize: 8,
      cellPadding: 2,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
      textColor: [30, 30, 30],
    },
    headStyles: {
      fillColor: [10, 37, 64],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
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
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 26 },
      2: { cellWidth: 24 },
      3: { cellWidth: 32 },
      4: { cellWidth: 22 },
      5: { cellWidth: 18 },
      6: { cellWidth: 26 },
      7: { cellWidth: 16, halign: 'center' },
      8: { cellWidth: 18, halign: 'center' },
      9: { cellWidth: 16, halign: 'center' },
      10: { cellWidth: 18, halign: 'center' },
      11: { cellWidth: 28 },
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

  doc.save(`BCAS_Results_Submission_Report_${month}_${year}.pdf`);
}
