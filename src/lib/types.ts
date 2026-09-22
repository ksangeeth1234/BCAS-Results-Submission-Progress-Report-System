export interface ResultsSubmissionRecord {
  id?: number;
  report_month: string;
  report_year: number;
  branch_code?: string; // AC - Kalmunei | CC - Colombo | KC - Kandy | JAC - Jaffna
  faculty: string;
  department: string;
  program: string;
  module: string;
  coordinator: string;
  semester: string;
  eligible_batch: string;
  progress_submitted: boolean | number | string; // Boolean true/false or 'Yes'/'No'
  progress_not_submitted: boolean | number | string;
  relevant_submission_month: string;
  delay_submitted: boolean | number | string;
  delay_not_yet_submitted: boolean | number | string;
  remarks: string;
  created_at?: string;
  updated_at?: string;
}

export interface FilterState {
  report_month: string;
  report_year: number | string;
  faculty: string;
  department: string;
  program: string;
  coordinator: string;
  semester: string;
  search_query: string;
}

export interface DepartmentConfig {
  name: string;
  faculty: string;
  bgColor: string; // Tailwind class
  textColor: string; // Tailwind text class
  badgeColor: string; // Tailwind badge style
  borderColor: string; // Tailwind border
  excelHex: string; // Hex for ExcelJS fill (e.g., 'E3F2FD')
  pdfRgb: [number, number, number]; // RGB for jsPDF fill
  accentHex: string;
}

export interface DashboardStats {
  totalRecords: number;
  totalBatches: number;
  totalProgressSubmitted: number;
  totalProgressNotSubmitted: number;
  totalDelaySubmitted: number;
  totalDelayNotYetSubmitted: number;
}

export type DateRangeMode = 'single' | 'range';

export interface ReportingPeriodState {
  mode: DateRangeMode;
  selectedMonth: string;
  selectedYear: number | string;
  fromMonth: string;
  fromYear: number | string;
  toMonth: string;
  toYear: number | string;
  fromDate?: string;
  toDate?: string;
}

const ALL_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function getMonthIndex(monthName: string): number {
  if (!monthName) return 0;
  const idx = ALL_MONTHS.findIndex((m) => m.toLowerCase() === monthName.trim().toLowerCase());
  return idx >= 0 ? idx : 0;
}

export function getPeriodLabel(period: ReportingPeriodState): string {
  if (period.mode === 'single') {
    return `${period.selectedMonth} ${period.selectedYear}`;
  }
  if (period.fromDate && period.toDate) {
    return `${period.fromDate} to ${period.toDate}`;
  }
  return `${period.fromMonth} ${period.fromYear} to ${period.toMonth} ${period.toYear}`;
}

export function isRecordInDateRange(r: ResultsSubmissionRecord, period: ReportingPeriodState): boolean {
  if (period.mode === 'single') {
    const monthMatch = !period.selectedMonth || period.selectedMonth === 'All' || r.report_month === period.selectedMonth;
    const yearMatch = !period.selectedYear || period.selectedYear === 'All' || String(r.report_year) === String(period.selectedYear);
    return monthMatch && yearMatch;
  }

  // Date Range Mode: Month-Year range calculation
  const rMonthIdx = getMonthIndex(r.report_month);
  const rPeriodVal = (Number(r.report_year) || 0) * 12 + rMonthIdx;

  const fromMonthIdx = getMonthIndex(period.fromMonth);
  const fromPeriodVal = (Number(period.fromYear) || 0) * 12 + fromMonthIdx;

  const toMonthIdx = getMonthIndex(period.toMonth);
  const toPeriodVal = (Number(period.toYear) || 0) * 12 + toMonthIdx;

  let matchesCreatedAt = true;
  if (period.fromDate && period.toDate && r.created_at) {
    const recTime = new Date(r.created_at).getTime();
    const fTime = new Date(period.fromDate).getTime();
    const tTime = new Date(period.toDate + 'T23:59:59').getTime();
    if (!isNaN(recTime) && !isNaN(fTime) && !isNaN(tTime)) {
      matchesCreatedAt = recTime >= fTime && recTime <= tTime;
    }
  }

  const matchesMonthYearRange = rPeriodVal >= fromPeriodVal && rPeriodVal <= toPeriodVal;

  return matchesMonthYearRange && matchesCreatedAt;
}

// Helper to normalize yes/no value display
export function formatYesNo(val: boolean | number | string | undefined | null): string {
  if (val === true || val === 1 || String(val).toLowerCase() === 'yes' || String(val).toLowerCase() === 'true') {
    return 'Yes';
  }
  if (val === false || val === 0 || String(val).toLowerCase() === 'no' || String(val).toLowerCase() === 'false') {
    return 'No';
  }
  return 'No';
}

export function isYes(val: boolean | number | string | undefined | null): boolean {
  return formatYesNo(val) === 'Yes';
}

