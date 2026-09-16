export interface ResultsSubmissionRecord {
  id?: number;
  report_month: string;
  report_year: number;
  faculty: string;
  department: string;
  program: string;
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
