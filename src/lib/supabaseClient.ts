import { createClient } from '@supabase/supabase-js';
import { ResultsSubmissionRecord } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tqvsqfchxgmvjoueduyp.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_OfikpzTmaJ4iypNI76cAKA_7xvhWwtW';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const LOCAL_STORAGE_KEY = 'bcas_results_submission_progress_data_v2';

// Initial sample data with Yes/No boolean checkboxes
export const INITIAL_SAMPLE_RECORDS: ResultsSubmissionRecord[] = [
  {
    id: 1,
    report_month: 'September',
    report_year: 2026,
    faculty: 'Faculty of Computer Science & Information Technology',
    department: 'Computing',
    program: 'BSc (Hons) Computer Science',
    coordinator: 'Dr. A. R. Perera',
    semester: 'Semester 4',
    eligible_batch: 'Batch 21 (2024 Int)',
    progress_submitted: true,
    progress_not_submitted: false,
    relevant_submission_month: 'August 2026',
    delay_submitted: true,
    delay_not_yet_submitted: false,
    remarks: 'Approved by Board of Examiners on 12th Sept',
  },
  {
    id: 2,
    report_month: 'September',
    report_year: 2026,
    faculty: 'Faculty of Computer Science & Information Technology',
    department: 'Computing',
    program: 'HND in Computing & Systems Development',
    coordinator: 'Mr. K. L. Fernando',
    semester: 'Semester 2',
    eligible_batch: 'Batch 23 (2025 Int)',
    progress_submitted: true,
    progress_not_submitted: false,
    relevant_submission_month: 'September 2026',
    delay_submitted: false,
    delay_not_yet_submitted: false,
    remarks: 'All module results submitted on schedule',
  },
  {
    id: 3,
    report_month: 'September',
    report_year: 2026,
    faculty: 'Faculty of Management & Business Studies',
    department: 'Business Management',
    program: 'BBA (Hons) Business Administration',
    coordinator: 'Prof. M. S. Silva',
    semester: 'Semester 6',
    eligible_batch: 'Batch 19 (2023 Int)',
    progress_submitted: false,
    progress_not_submitted: true,
    relevant_submission_month: 'July 2026',
    delay_submitted: true,
    delay_not_yet_submitted: false,
    remarks: 'Pending 1 external examiner moderation report',
  },
  {
    id: 4,
    report_month: 'September',
    report_year: 2026,
    faculty: 'Faculty of Management & Business Studies',
    department: 'Business Management',
    program: 'MBA International Business',
    coordinator: 'Ms. N. D. Jayawardena',
    semester: 'Semester 3',
    eligible_batch: 'MBA Cohort 8',
    progress_submitted: true,
    progress_not_submitted: false,
    relevant_submission_month: 'August 2026',
    delay_submitted: false,
    delay_not_yet_submitted: false,
    remarks: 'Dissertation viva panel scheduled',
  },
  {
    id: 5,
    report_month: 'September',
    report_year: 2026,
    faculty: 'Faculty of Health & Life Sciences',
    department: 'Biomedical Science',
    program: 'BSc (Hons) Biomedical Science',
    coordinator: 'Dr. T. M. Rajapaksha',
    semester: 'Semester 5',
    eligible_batch: 'Batch 18 (2023 Int)',
    progress_submitted: true,
    progress_not_submitted: false,
    relevant_submission_month: 'August 2026',
    delay_submitted: true,
    delay_not_yet_submitted: false,
    remarks: 'Laboratory practical assessments verified',
  },
  {
    id: 6,
    report_month: 'September',
    report_year: 2026,
    faculty: 'Faculty of Engineering & Built Environment',
    department: 'Construction & Built Environment',
    program: 'BSc (Hons) Quantity Surveying',
    coordinator: 'Mr. S. K. De Silva',
    semester: 'Semester 4',
    eligible_batch: 'Batch 14 (2024 Int)',
    progress_submitted: false,
    progress_not_submitted: true,
    relevant_submission_month: 'July 2026',
    delay_submitted: false,
    delay_not_yet_submitted: true,
    remarks: 'Costing module re-sit results pending',
  },
  {
    id: 7,
    report_month: 'September',
    report_year: 2026,
    faculty: 'Faculty of Law & Legal Studies',
    department: 'Law',
    program: 'LLB (Hons) Law',
    coordinator: 'Ms. R. P. Wickramasinghe',
    semester: 'Semester 2',
    eligible_batch: 'Batch 12 (2025 Int)',
    progress_submitted: true,
    progress_not_submitted: false,
    relevant_submission_month: 'September 2026',
    delay_submitted: false,
    delay_not_yet_submitted: false,
    remarks: 'Moot court evaluation completed',
  },
  {
    id: 8,
    report_month: 'September',
    report_year: 2026,
    faculty: 'Faculty of Health & Life Sciences',
    department: 'Nursing',
    program: 'BSc (Hons) Nursing Studies',
    coordinator: 'Dr. H. N. Gunawardena',
    semester: 'Semester 3',
    eligible_batch: 'Batch 9 (2024 Int)',
    progress_submitted: true,
    progress_not_submitted: false,
    relevant_submission_month: 'August 2026',
    delay_submitted: true,
    delay_not_yet_submitted: false,
    remarks: 'Clinical placement logs verified',
  },
  {
    id: 9,
    report_month: 'September',
    report_year: 2026,
    faculty: 'Faculty of Education & Social Sciences',
    department: 'Psychology',
    program: 'BSc (Hons) Applied Psychology',
    coordinator: 'Dr. A. R. Perera',
    semester: 'Semester 1',
    eligible_batch: 'Batch 7 (2026 Int)',
    progress_submitted: true,
    progress_not_submitted: false,
    relevant_submission_month: 'September 2026',
    delay_submitted: false,
    delay_not_yet_submitted: false,
    remarks: 'First semester grades finalized',
  },
  {
    id: 10,
    report_month: 'September',
    report_year: 2026,
    faculty: 'Faculty of Hospitality & Tourism',
    department: 'Hotel Management',
    program: 'HND in Hospitality & Tourism Management',
    coordinator: 'Mr. K. L. Fernando',
    semester: 'Semester 4',
    eligible_batch: 'Batch 10 (2024 Int)',
    progress_submitted: true,
    progress_not_submitted: false,
    relevant_submission_month: 'August 2026',
    delay_submitted: true,
    delay_not_yet_submitted: false,
    remarks: 'Food & Beverage practical passed',
  }
];

function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_ANON_KEY) && SUPABASE_ANON_KEY.length > 10;
}

// Read all records
export async function fetchAllRecords(): Promise<{ data: ResultsSubmissionRecord[]; error: string | null; isFallback: boolean }> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('results_submission_progress')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.warn('Supabase fetch notice, using local storage sync:', error.message);
        return { data: getLocalRecords(), error: null, isFallback: true };
      }

      if (data && data.length > 0) {
        return { data: data as ResultsSubmissionRecord[], error: null, isFallback: false };
      } else {
        return { data: getLocalRecords(), error: null, isFallback: true };
      }
    } catch (err: any) {
      console.warn('Supabase query failed, using local storage:', err.message);
      return { data: getLocalRecords(), error: null, isFallback: true };
    }
  }

  return { data: getLocalRecords(), error: null, isFallback: true };
}

// Add a new record
export async function addRecord(record: Omit<ResultsSubmissionRecord, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: ResultsSubmissionRecord | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('results_submission_progress')
        .insert([record])
        .select()
        .single();

      if (!error && data) {
        return { data: data as ResultsSubmissionRecord, error: null };
      }
    } catch (e: any) {
      console.warn('Supabase insert notice, saving locally:', e.message);
    }
  }

  const local = getLocalRecords();
  const nextId = local.length > 0 ? Math.max(...local.map((r) => r.id || 0)) + 1 : 1;
  const newRecord: ResultsSubmissionRecord = {
    ...record,
    id: nextId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const updated = [newRecord, ...local];
  saveLocalRecords(updated);
  return { data: newRecord, error: null };
}

// Update existing record
export async function updateRecord(id: number, record: Partial<ResultsSubmissionRecord>): Promise<{ data: ResultsSubmissionRecord | null; error: string | null }> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('results_submission_progress')
        .update({ ...record, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return { data: data as ResultsSubmissionRecord, error: null };
      }
    } catch (e: any) {
      console.warn('Supabase update notice, updating locally:', e.message);
    }
  }

  const local = getLocalRecords();
  const index = local.findIndex((r) => r.id === id);
  if (index !== -1) {
    local[index] = {
      ...local[index],
      ...record,
      updated_at: new Date().toISOString(),
    };
    saveLocalRecords(local);
    return { data: local[index], error: null };
  }
  return { data: null, error: 'Record not found' };
}

// Delete a record
export async function deleteRecord(id: number): Promise<{ success: boolean; error: string | null }> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('results_submission_progress')
        .delete()
        .eq('id', id);

      if (!error) {
        return { success: true, error: null };
      }
    } catch (e: any) {
      console.warn('Supabase delete notice:', e.message);
    }
  }

  const local = getLocalRecords();
  const filtered = local.filter((r) => r.id !== id);
  saveLocalRecords(filtered);
  return { success: true, error: null };
}

// Seed sample data into Supabase
export async function seedSupabaseSampleData(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    saveLocalRecords(INITIAL_SAMPLE_RECORDS);
    return { success: true, message: 'Sample data loaded locally.' };
  }

  try {
    const { error } = await supabase
      .from('results_submission_progress')
      .insert(INITIAL_SAMPLE_RECORDS.map(({ id, ...rest }) => rest));

    if (error) {
      return { success: false, message: `Failed to seed Supabase: ${error.message}` };
    }

    return { success: true, message: 'Successfully seeded sample records into Supabase!' };
  } catch (err: any) {
    return { success: false, message: `Seeding error: ${err.message}` };
  }
}

function getLocalRecords(): ResultsSubmissionRecord[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_RECORDS;
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!item) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_RECORDS));
      return INITIAL_SAMPLE_RECORDS;
    }
    return JSON.parse(item);
  } catch {
    return INITIAL_SAMPLE_RECORDS;
  }
}

function saveLocalRecords(records: ResultsSubmissionRecord[]) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }
}
