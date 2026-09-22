import { ResultsSubmissionRecord } from './types';

const SUPABASE_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gogfkoylllfybwqluqyi.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_g_KgS_zrVR18tTSRHN2T7g_IOEHTNK_';

// Supabase REST API Endpoint URL
const REST_API_ENDPOINT = `${SUPABASE_BASE_URL.replace(/\/$/, '')}/rest/v1/results_submission_progress`;

// HTTP Headers for Supabase REST API
function getSupabaseHeaders(): Record<string, string> {
  return {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  };
}

// 1. READ ALL RECORDS (GET)
export async function fetchAllRecords(): Promise<{ data: ResultsSubmissionRecord[]; error: string | null; isFallback: boolean }> {
  try {
    const response = await fetch(`${REST_API_ENDPOINT}?select=*&order=id.asc`, {
      method: 'GET',
      headers: getSupabaseHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Supabase REST GET error:', response.status, errText);
      return { data: [], error: `Supabase Error (${response.status}): ${errText}`, isFallback: false };
    }

    const data = await response.json();
    return { data: data as ResultsSubmissionRecord[], error: null, isFallback: false };
  } catch (err: any) {
    console.error('Supabase REST GET exception:', err.message);
    return { data: [], error: err.message, isFallback: false };
  }
}

// 2. ADD A NEW RECORD (POST)
export async function addRecord(record: Omit<ResultsSubmissionRecord, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: ResultsSubmissionRecord | null; error: string | null }> {
  try {
    const payload = {
      ...record,
      branch_code: record.branch_code || '',
      module: record.module || '',
      relevant_submission_month: record.relevant_submission_month || '',
      progress_submitted: Boolean(record.progress_submitted),
      progress_not_submitted: Boolean(record.progress_not_submitted),
      delay_submitted: Boolean(record.delay_submitted),
      delay_not_yet_submitted: Boolean(record.delay_not_yet_submitted),
    };

    const response = await fetch(REST_API_ENDPOINT, {
      method: 'POST',
      headers: getSupabaseHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Supabase REST POST error:', response.status, errText);
      return { data: null, error: `Supabase Error (${response.status}): ${errText}` };
    }

    const data = await response.json();
    const createdRecord = Array.isArray(data) ? data[0] : data;
    return { data: createdRecord as ResultsSubmissionRecord, error: null };
  } catch (err: any) {
    console.error('Supabase REST POST exception:', err.message);
    return { data: null, error: err.message };
  }
}

// 3. UPDATE RECORD (PATCH)
export async function updateRecord(id: number, record: Partial<ResultsSubmissionRecord>): Promise<{ data: ResultsSubmissionRecord | null; error: string | null }> {
  try {
    const payload: any = {
      ...record,
      updated_at: new Date().toISOString(),
    };
    if ('progress_submitted' in record) payload.progress_submitted = Boolean(record.progress_submitted);
    if ('progress_not_submitted' in record) payload.progress_not_submitted = Boolean(record.progress_not_submitted);
    if ('delay_submitted' in record) payload.delay_submitted = Boolean(record.delay_submitted);
    if ('delay_not_yet_submitted' in record) payload.delay_not_yet_submitted = Boolean(record.delay_not_yet_submitted);

    const response = await fetch(`${REST_API_ENDPOINT}?id=eq.${id}`, {
      method: 'PATCH',
      headers: getSupabaseHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Supabase REST PATCH error:', response.status, errText);
      return { data: null, error: `Supabase Error (${response.status}): ${errText}` };
    }

    const data = await response.json();
    const updatedRecord = Array.isArray(data) ? data[0] : data;
    return { data: updatedRecord as ResultsSubmissionRecord, error: null };
  } catch (err: any) {
    console.error('Supabase REST PATCH exception:', err.message);
    return { data: null, error: err.message };
  }
}

// 4. DELETE RECORD (DELETE)
export async function deleteRecord(id: number): Promise<{ success: boolean; error: string | null }> {
  try {
    const response = await fetch(`${REST_API_ENDPOINT}?id=eq.${id}`, {
      method: 'DELETE',
      headers: getSupabaseHeaders(),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Supabase REST DELETE error:', response.status, errText);
      return { success: false, error: `Supabase Error (${response.status}): ${errText}` };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Supabase REST DELETE exception:', err.message);
    return { success: false, error: err.message };
  }
}
