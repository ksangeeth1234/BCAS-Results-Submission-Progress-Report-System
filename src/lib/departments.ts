import { DepartmentConfig } from './types';

export const OFFICIAL_DEPARTMENTS: DepartmentConfig[] = [
  {
    name: 'Biomedical Science',
    faculty: 'Faculty of Health & Life Sciences',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    textColor: 'text-blue-900',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    borderColor: 'border-blue-200',
    excelHex: 'E3F2FD',
    pdfRgb: [227, 242, 253],
    accentHex: '#1565C0',
  },
  {
    name: 'Business Management',
    faculty: 'Faculty of Management & Business Studies',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100',
    textColor: 'text-emerald-900',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    borderColor: 'border-emerald-200',
    excelHex: 'E8F5E9',
    pdfRgb: [232, 245, 233],
    accentHex: '#2E7D32',
  },
  {
    name: 'Computing',
    faculty: 'Faculty of Computer Science & Information Technology',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
    textColor: 'text-purple-900',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    borderColor: 'border-purple-200',
    excelHex: 'F3E5F5',
    pdfRgb: [243, 229, 245],
    accentHex: '#7B1FA2',
  },
  {
    name: 'Hotel Management',
    faculty: 'Faculty of Hospitality & Tourism',
    bgColor: 'bg-amber-50 hover:bg-amber-100',
    textColor: 'text-amber-900',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    borderColor: 'border-amber-200',
    excelHex: 'FFF3E0',
    pdfRgb: [255, 243, 224],
    accentHex: '#E65100',
  },
  {
    name: 'Early Childhood Development',
    faculty: 'Faculty of Education & Social Sciences',
    bgColor: 'bg-pink-50 hover:bg-pink-100',
    textColor: 'text-pink-900',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    borderColor: 'border-pink-200',
    excelHex: 'FCE4EC',
    pdfRgb: [252, 228, 236],
    accentHex: '#C2185B',
  },
  {
    name: 'Construction & Built Environment',
    faculty: 'Faculty of Engineering & Built Environment',
    bgColor: 'bg-stone-100 hover:bg-stone-200',
    textColor: 'text-stone-900',
    badgeColor: 'bg-stone-200 text-stone-800 border-stone-300',
    borderColor: 'border-stone-300',
    excelHex: 'EFEBE9',
    pdfRgb: [239, 235, 233],
    accentHex: '#4E342E',
  },
  {
    name: 'Languages',
    faculty: 'Faculty of Languages & Humanities',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100',
    textColor: 'text-yellow-900',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    borderColor: 'border-yellow-200',
    excelHex: 'FFFDE7',
    pdfRgb: [255, 253, 231],
    accentHex: '#F57F17',
  },
  {
    name: 'Law',
    faculty: 'Faculty of Law & Legal Studies',
    bgColor: 'bg-slate-100 hover:bg-slate-200',
    textColor: 'text-slate-900',
    badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
    borderColor: 'border-slate-300',
    excelHex: 'ECEFF1',
    pdfRgb: [236, 239, 241],
    accentHex: '#37474F',
  },
  {
    name: 'Nursing',
    faculty: 'Faculty of Health & Life Sciences',
    bgColor: 'bg-teal-50 hover:bg-teal-100',
    textColor: 'text-teal-900',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    borderColor: 'border-teal-200',
    excelHex: 'E0F2F1',
    pdfRgb: [224, 242, 241],
    accentHex: '#00695C',
  },
  {
    name: 'Psychology',
    faculty: 'Faculty of Education & Social Sciences',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100',
    textColor: 'text-indigo-900',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    borderColor: 'border-indigo-200',
    excelHex: 'EDE7F6',
    pdfRgb: [237, 231, 246],
    accentHex: '#4527A0',
  }
];

export const DEPARTMENT_COLOR_MAP: Record<string, DepartmentConfig> = OFFICIAL_DEPARTMENTS.reduce(
  (acc, dept) => ({ ...acc, [dept.name]: dept }),
  {}
);

export const DEFAULT_DEPARTMENT_COLOR: DepartmentConfig = {
  name: 'General',
  faculty: 'General Academic',
  bgColor: 'bg-gray-50 hover:bg-gray-100',
  textColor: 'text-gray-900',
  badgeColor: 'bg-gray-100 text-gray-800 border-gray-200',
  borderColor: 'border-gray-200',
  excelHex: 'F5F5F5',
  pdfRgb: [245, 245, 245],
  accentHex: '#616161',
};

export const FACULTIES = Array.from(new Set(OFFICIAL_DEPARTMENTS.map((d) => d.faculty)));

export const MONTHS = [
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

export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - 2 + i);

export const SAMPLE_PROGRAMS: Record<string, string[]> = {
  'Biomedical Science': [
    'BSc (Hons) Biomedical Science',
    'HND in Biomedical Science',
    'Diploma in Medical Laboratory Technology',
  ],
  'Business Management': [
    'BBA (Hons) Business Administration',
    'BSc (Hons) International Business',
    'HND in Business Management',
    'MBA International Business',
  ],
  'Computing': [
    'BSc (Hons) Computer Science',
    'BSc (Hons) Software Engineering',
    'HND in Computing & Systems Development',
    'BSc (Hons) Cyber Security',
  ],
  'Hotel Management': [
    'BSc (Hons) International Hospitality Management',
    'HND in Hospitality & Tourism Management',
    'Diploma in Hotel Operations',
  ],
  'Early Childhood Development': [
    'BEd (Hons) Early Childhood Education',
    'Diploma in Early Childhood Care & Education',
    'Certificate in Preschool Education',
  ],
  'Construction & Built Environment': [
    'BSc (Hons) Quantity Surveying',
    'BSc (Hons) Civil Engineering',
    'HND in Construction & Built Environment',
  ],
  'Languages': [
    'BA (Hons) English & Communication',
    'Diploma in Professional English',
    'Certificate in Spoken English',
  ],
  'Law': [
    'LLB (Hons) Law',
    'HND in Law & Legal Studies',
    'Diploma in Business Law',
  ],
  'Nursing': [
    'BSc (Hons) Nursing Studies',
    'Diploma in General Nursing',
    'Certificate in Caregiving',
  ],
  'Psychology': [
    'BSc (Hons) Applied Psychology',
    'HND in Psychology',
    'Diploma in Counselling Psychology',
  ],
};

export const SAMPLE_COORDINATORS = [
  'Dr. A. R. Perera',
  'Prof. M. S. Silva',
  'Mr. K. L. Fernando',
  'Ms. N. D. Jayawardena',
  'Dr. T. M. Rajapaksha',
  'Mr. S. K. De Silva',
  'Ms. R. P. Wickramasinghe',
  'Dr. H. N. Gunawardena',
];

export const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 1 & 2',
  'Semester 3 & 4',
  'Year 1',
  'Year 2',
  'Year 3',
  'Final Semester',
];
