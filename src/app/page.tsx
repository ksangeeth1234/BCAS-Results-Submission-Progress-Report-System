'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Dashboard } from '../components/Dashboard';
import { ManageRecords } from '../components/ManageRecords';
import { RecordFormModal } from '../components/RecordFormModal';
import { MonthlyReportView } from '../components/MonthlyReportView';
import { ExportCenter } from '../components/ExportCenter';
import { SqlSetupModal } from '../components/SqlSetupModal';
import { ResultsSubmissionRecord, FilterState } from '../lib/types';
import {
  fetchAllRecords,
  addRecord,
  updateRecord,
  deleteRecord,
} from '../lib/supabaseClient';
import { CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';

export default function Home() {
  const [records, setRecords] = useState<ResultsSubmissionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [selectedMonth, setSelectedMonth] = useState<string>('September');
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Modals & UI state
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<ResultsSubmissionRecord | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Toast notification state
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters state for Manage Records
  const [filterState, setFilterState] = useState<FilterState>({
    report_month: 'September',
    report_year: 2026,
    faculty: '',
    department: '',
    program: '',
    coordinator: '',
    semester: '',
    search_query: '',
  });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error, isFallback: fallback } = await fetchAllRecords();
      if (error) {
        showToast('error', `Data loading issue: ${error}`);
      }
      setRecords(data || []);
      setIsFallback(fallback);
    } catch (err: any) {
      showToast('error', `Failed to load records: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Keep filter state month & year synced when sidebar changed
  useEffect(() => {
    setFilterState((prev) => ({
      ...prev,
      report_month: selectedMonth,
      report_year: selectedYear,
    }));
  }, [selectedMonth, selectedYear]);

  // Handle Record Save (Create or Update)
  const handleSaveRecord = async (recordData: Partial<ResultsSubmissionRecord>) => {
    if (editingRecord && editingRecord.id) {
      // Update
      const { data, error } = await updateRecord(editingRecord.id, recordData);
      if (error) {
        showToast('error', `Failed to update record: ${error}`);
        throw new Error(error);
      }
      showToast('success', 'Record updated successfully!');
    } else {
      // Create
      const { data, error } = await addRecord(
        recordData as Omit<ResultsSubmissionRecord, 'id' | 'created_at' | 'updated_at'>
      );
      if (error) {
        showToast('error', `Failed to add record: ${error}`);
        throw new Error(error);
      }
      showToast('success', 'New submission record created successfully!');
    }
    await loadData();
    setEditingRecord(null);
  };

  // Handle Record Delete
  const handleDeleteRecord = async (id: number) => {
    const { success, error } = await deleteRecord(id);
    if (!success || error) {
      showToast('error', `Delete failed: ${error}`);
    } else {
      showToast('success', 'Record deleted successfully.');
      await loadData();
    }
  };

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (rec: ResultsSubmissionRecord) => {
    setEditingRecord(rec);
    setIsFormModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header Bar */}
      <Header
        activeTab={activeTab}
        onOpenAddModal={handleOpenAdd}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        isFallback={isFallback}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          totalRecordsCount={records.length}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onOpenSqlModal={() => setIsSqlModalOpen(true)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0 bg-slate-100 text-slate-900 rounded-tl-3xl shadow-inner min-h-[calc(100vh-4rem)]">
          {/* Toast Notification */}
          {toast && (
            <div
              className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold animate-in slide-in-from-bottom-5 ${
                toast.type === 'success'
                  ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
                  : 'bg-rose-900 text-rose-100 border-rose-700'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              )}
              <span>{toast.message}</span>
              <button
                onClick={() => setToast(null)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-500">
                Loading BCAS submission progress data...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  records={records}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenAddModal={handleOpenAdd}
                />
              )}

              {activeTab === 'manage' && (
                <ManageRecords
                  records={records}
                  onOpenAddModal={handleOpenAdd}
                  onEditRecord={handleOpenEdit}
                  onDeleteRecord={handleDeleteRecord}
                  filterState={filterState}
                  setFilterState={setFilterState}
                />
              )}

              {activeTab === 'report' && (
                <MonthlyReportView
                  records={records}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              )}

              {activeTab === 'export' && (
                <ExportCenter
                  records={records}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  onNavigateReport={() => setActiveTab('report')}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Record Add/Edit Form Modal */}
      <RecordFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveRecord}
        initialRecord={editingRecord}
        currentMonth={selectedMonth}
        currentYear={selectedYear}
      />

      {/* Supabase SQL Setup Modal */}
      <SqlSetupModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
        onRefreshData={loadData}
      />
    </div>
  );
}
