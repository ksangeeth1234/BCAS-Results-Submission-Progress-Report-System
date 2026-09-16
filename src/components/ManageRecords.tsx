'use client';

import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  Edit2,
  Trash2,
  PlusCircle,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { ResultsSubmissionRecord, FilterState, isYes } from '../lib/types';
import {
  OFFICIAL_DEPARTMENTS,
  FACULTIES,
  MONTHS,
  YEARS,
  DEPARTMENT_COLOR_MAP,
  DEFAULT_DEPARTMENT_COLOR,
  SEMESTERS,
} from '../lib/departments';
import { PasswordPromptModal } from './PasswordPromptModal';

interface ManageRecordsProps {
  records: ResultsSubmissionRecord[];
  onOpenAddModal: () => void;
  onEditRecord: (record: ResultsSubmissionRecord) => void;
  onDeleteRecord: (id: number) => Promise<void>;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const ManageRecords: React.FC<ManageRecordsProps> = ({
  records,
  onOpenAddModal,
  onEditRecord,
  onDeleteRecord,
  filterState,
  setFilterState,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredRecords = records.filter((r) => {
    if (filterState.report_month && r.report_month !== filterState.report_month) return false;
    if (filterState.report_year && String(r.report_year) !== String(filterState.report_year))
      return false;
    if (filterState.faculty && r.faculty !== filterState.faculty) return false;
    if (filterState.department && r.department !== filterState.department) return false;
    if (
      filterState.program &&
      !r.program.toLowerCase().includes(filterState.program.toLowerCase())
    )
      return false;
    if (
      filterState.coordinator &&
      !r.coordinator.toLowerCase().includes(filterState.coordinator.toLowerCase())
    )
      return false;
    if (filterState.semester && r.semester !== filterState.semester) return false;

    if (filterState.search_query.trim()) {
      const q = filterState.search_query.toLowerCase();
      const match =
        r.program.toLowerCase().includes(q) ||
        r.coordinator.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.eligible_batch.toLowerCase().includes(q) ||
        (r.remarks && r.remarks.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetFilters = () => {
    setFilterState({
      report_month: '',
      report_year: '',
      faculty: '',
      department: '',
      program: '',
      coordinator: '',
      semester: '',
      search_query: '',
    });
    setCurrentPage(1);
  };

  const handleInitiateDelete = (id: number) => {
    setDeletingId(id);
    setIsPasswordModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingId !== null) {
      await onDeleteRecord(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              <span>Manage Submission Records</span>
            </h1>
            <p className="text-xs text-slate-500">
              View, edit, filter, and delete Board of Examiners monthly submission entries.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md shadow-blue-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Record</span>
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={filterState.search_query}
                onChange={(e) => {
                  setFilterState({ ...filterState, search_query: e.target.value });
                  setCurrentPage(1);
                }}
                placeholder="Search program, batch..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 pl-9 pr-3 text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Month</label>
            <select
              value={filterState.report_month}
              onChange={(e) => {
                setFilterState({ ...filterState, report_month: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-2 text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" className="text-black">All Months</option>
              {MONTHS.map((m) => (
                <option key={m} value={m} className="text-black">
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Year</label>
            <select
              value={filterState.report_year}
              onChange={(e) => {
                setFilterState({ ...filterState, report_year: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-2 text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" className="text-black">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y} className="text-black">
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              Department (10)
            </label>
            <select
              value={filterState.department}
              onChange={(e) => {
                setFilterState({ ...filterState, department: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-2 font-extrabold text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" className="text-black">All Departments</option>
              {OFFICIAL_DEPARTMENTS.map((d) => (
                <option key={d.name} value={d.name} className="text-black font-semibold">
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Faculty</label>
            <select
              value={filterState.faculty}
              onChange={(e) => {
                setFilterState({ ...filterState, faculty: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-2 text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" className="text-black">All Faculties</option>
              {FACULTIES.map((f) => (
                <option key={f} value={f} className="text-black">
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">Semester</label>
            <select
              value={filterState.semester}
              onChange={(e) => {
                setFilterState({ ...filterState, semester: e.target.value });
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-2 text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" className="text-black">All Semesters</option>
              {SEMESTERS.map((s) => (
                <option key={s} value={s} className="text-black">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold border-b border-slate-800">
                <th className="p-3.5 text-center">#</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Program</th>
                <th className="p-3.5">Coordinator</th>
                <th className="p-3.5">Semester</th>
                <th className="p-3.5">Eligible Batch</th>
                <th className="p-3.5 text-center bg-emerald-950/60 text-emerald-300">
                  Prog. Sub.
                </th>
                <th className="p-3.5 text-center bg-rose-950/60 text-rose-300">Prog. Not Sub.</th>
                <th className="p-3.5 text-center bg-amber-950/60 text-amber-300">Delay Sub.</th>
                <th className="p-3.5 text-center bg-purple-950/60 text-purple-300">
                  Delay Not Sub.
                </th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-400">
                    No matching records found. Try adjusting your filters or search terms.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r, idx) => {
                  const deptConfig = DEPARTMENT_COLOR_MAP[r.department] || DEFAULT_DEPARTMENT_COLOR;
                  const rowNum = (currentPage - 1) * pageSize + idx + 1;

                  const psYes = isYes(r.progress_submitted);
                  const pnsYes = isYes(r.progress_not_submitted);
                  const dsYes = isYes(r.delay_submitted);
                  const dnysYes = isYes(r.delay_not_yet_submitted);

                  return (
                    <tr
                      key={r.id || idx}
                      className={`hover:bg-slate-50 transition-colors ${deptConfig.bgColor}`}
                    >
                      <td className="p-3 text-center font-bold text-slate-500">{rowNum}</td>
                      <td className="p-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border ${deptConfig.badgeColor}`}
                        >
                          {r.department}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-900 max-w-[200px] truncate" title={r.program}>
                        {r.program}
                      </td>
                      <td className="p-3 text-slate-600">{r.coordinator}</td>
                      <td className="p-3 text-slate-600 font-medium">{r.semester}</td>
                      <td className="p-3 text-slate-700">{r.eligible_batch}</td>

                      <td className={`p-3 text-center font-bold ${psYes ? 'text-emerald-700 bg-emerald-100/50' : 'text-slate-400'}`}>
                        {psYes ? 'Yes' : 'No'}
                      </td>

                      <td className={`p-3 text-center font-bold ${pnsYes ? 'text-rose-700 bg-rose-100/50' : 'text-slate-400'}`}>
                        {pnsYes ? 'Yes' : 'No'}
                      </td>

                      <td className={`p-3 text-center font-bold ${dsYes ? 'text-amber-700 bg-amber-100/50' : 'text-slate-400'}`}>
                        {dsYes ? 'Yes' : 'No'}
                      </td>

                      <td className={`p-3 text-center font-bold ${dnysYes ? 'text-purple-700 bg-purple-100/50' : 'text-slate-400'}`}>
                        {dnysYes ? 'Yes' : 'No'}
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => onEditRecord(r)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-100 transition-all"
                            title="Edit record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleInitiateDelete(r.id || 0)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-all flex items-center space-x-1"
                            title="Delete record (Password required)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <Lock className="w-2.5 h-2.5 text-rose-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <span className="font-bold">{filteredRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="font-bold">{Math.min(currentPage * pageSize, filteredRecords.length)}</span> of{' '}
            <span className="font-bold">{filteredRecords.length}</span> records
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <PasswordPromptModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Admin Authorization Required to Delete Record"
        description="Please enter the admin password to permanently delete this submission record."
        actionLabel="Confirm & Delete"
      />
    </div>
  );
};
