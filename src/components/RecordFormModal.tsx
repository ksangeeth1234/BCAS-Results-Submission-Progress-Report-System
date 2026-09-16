'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Building2, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { ResultsSubmissionRecord, isYes } from '../lib/types';
import {
  OFFICIAL_DEPARTMENTS,
  FACULTIES,
  MONTHS,
  YEARS,
  SAMPLE_PROGRAMS,
  SAMPLE_COORDINATORS,
  SEMESTERS,
} from '../lib/departments';

interface RecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Partial<ResultsSubmissionRecord>) => Promise<void>;
  initialRecord?: ResultsSubmissionRecord | null;
  currentMonth: string;
  currentYear: number;
}

export const RecordFormModal: React.FC<RecordFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRecord,
  currentMonth,
  currentYear,
}) => {
  const [formData, setFormData] = useState<Partial<ResultsSubmissionRecord>>({
    report_month: currentMonth,
    report_year: currentYear,
    faculty: FACULTIES[0] || '',
    department: OFFICIAL_DEPARTMENTS[0].name,
    program: SAMPLE_PROGRAMS[OFFICIAL_DEPARTMENTS[0].name]?.[0] || '',
    coordinator: SAMPLE_COORDINATORS[0],
    semester: SEMESTERS[0],
    eligible_batch: '',
    progress_submitted: true,
    progress_not_submitted: false,
    relevant_submission_month: `${currentMonth} ${currentYear}`,
    delay_submitted: false,
    delay_not_yet_submitted: false,
    remarks: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialRecord) {
      setFormData({
        ...initialRecord,
        progress_submitted: isYes(initialRecord.progress_submitted),
        progress_not_submitted: isYes(initialRecord.progress_not_submitted),
        delay_submitted: isYes(initialRecord.delay_submitted),
        delay_not_yet_submitted: isYes(initialRecord.delay_not_yet_submitted),
      });
    } else {
      setFormData({
        report_month: currentMonth,
        report_year: currentYear,
        faculty: FACULTIES[0] || '',
        department: OFFICIAL_DEPARTMENTS[0].name,
        program: SAMPLE_PROGRAMS[OFFICIAL_DEPARTMENTS[0].name]?.[0] || '',
        coordinator: SAMPLE_COORDINATORS[0],
        semester: SEMESTERS[0],
        eligible_batch: '',
        progress_submitted: true,
        progress_not_submitted: false,
        relevant_submission_month: `${currentMonth} ${currentYear}`,
        delay_submitted: false,
        delay_not_yet_submitted: false,
        remarks: '',
      });
    }
    setErrors({});
  }, [initialRecord, currentMonth, currentYear, isOpen]);

  const handleDepartmentChange = (deptName: string) => {
    const deptConfig = OFFICIAL_DEPARTMENTS.find((d) => d.name === deptName);
    const faculty = deptConfig ? deptConfig.faculty : formData.faculty;
    const defaultProg = SAMPLE_PROGRAMS[deptName]?.[0] || '';

    setFormData((prev) => ({
      ...prev,
      department: deptName,
      faculty,
      program: defaultProg,
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.report_month) newErrors.report_month = 'Report month is required.';
    if (!formData.report_year) newErrors.report_year = 'Report year is required.';
    if (!formData.department) newErrors.department = 'Department is required.';
    if (!formData.program?.trim()) newErrors.program = 'Program name is required.';
    if (!formData.coordinator?.trim()) newErrors.coordinator = 'Coordinator name is required.';
    if (!formData.semester) newErrors.semester = 'Semester is required.';
    if (!formData.eligible_batch?.trim()) newErrors.eligible_batch = 'Eligible batch is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to save record.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {initialRecord ? 'Edit Submission Record' : 'Add New Submission Record'}
              </h2>
              <p className="text-xs text-slate-400">
                BCAS Board of Examiners Monthly Progress Entry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errors.submit && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Section 1: Period & Department */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Reporting Period & Department</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Report Month <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.report_month}
                  onChange={(e) => setFormData({ ...formData, report_month: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-3 text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m} className="text-black">
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Report Year <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.report_year}
                  onChange={(e) => setFormData({ ...formData, report_year: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-3 text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y} className="text-black">
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-3 font-extrabold text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {OFFICIAL_DEPARTMENTS.map((d) => (
                    <option key={d.name} value={d.name} className="text-black font-semibold">
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Faculty <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.faculty || ''}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-3 text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Faculty of Computer Science"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Program <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  list="programs-list"
                  value={formData.program || ''}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-3 text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Select or enter program title"
                />
                <datalist id="programs-list">
                  {(SAMPLE_PROGRAMS[formData.department || ''] || []).map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
                {errors.program && <span className="text-[10px] text-rose-500 mt-0.5">{errors.program}</span>}
              </div>
            </div>
          </div>

          {/* Section 2: Program Details */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Program & Batch Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Coordinator <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  list="coordinators-list"
                  value={formData.coordinator || ''}
                  onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-3 text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Coordinator Name"
                />
                <datalist id="coordinators-list">
                  {SAMPLE_COORDINATORS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {errors.coordinator && <span className="text-[10px] text-rose-500 mt-0.5">{errors.coordinator}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Semester/s <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-3 text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s} className="text-black">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eligible Batch <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.eligible_batch || ''}
                  onChange={(e) => setFormData({ ...formData, eligible_batch: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-3 text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Batch 21 (2024 Int)"
                />
                {errors.eligible_batch && <span className="text-[10px] text-rose-500 mt-0.5">{errors.eligible_batch}</span>}
              </div>
            </div>
          </div>

          {/* Section 3: Progress & Delays Checkboxes */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Results Progress Checkboxes (Yes / No)</span>
            </h3>

            {/* Progress Section */}
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-3">
              <div className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                Progress Status
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-emerald-200 cursor-pointer hover:bg-emerald-50 transition-all">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.progress_submitted)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        progress_submitted: e.target.checked,
                        progress_not_submitted: e.target.checked ? false : formData.progress_not_submitted,
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-black">Progress - Submitted</div>
                    <div className="text-[10px] text-slate-600">
                      Display on report: <span className="font-extrabold text-emerald-800">{formData.progress_submitted ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-rose-200 cursor-pointer hover:bg-rose-50 transition-all">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.progress_not_submitted)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        progress_not_submitted: e.target.checked,
                        progress_submitted: e.target.checked ? false : formData.progress_submitted,
                      })
                    }
                    className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-black">Progress - Not Submitted</div>
                    <div className="text-[10px] text-slate-600">
                      Display on report: <span className="font-extrabold text-rose-800">{formData.progress_not_submitted ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Delays Section */}
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-3">
              <div className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Delays for Submission Status
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Relevant Submission Month (Calendar)
                </label>
                <input
                  type="text"
                  value={formData.relevant_submission_month || ''}
                  onChange={(e) => setFormData({ ...formData, relevant_submission_month: e.target.value })}
                  className="w-full bg-white border border-amber-300 rounded-xl text-xs py-2 px-3 text-black font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="e.g. August 2026"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-amber-200 cursor-pointer hover:bg-amber-50 transition-all">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.delay_submitted)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        delay_submitted: e.target.checked,
                        delay_not_yet_submitted: e.target.checked ? false : formData.delay_not_yet_submitted,
                      })
                    }
                    className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-black">Delays - Submitted</div>
                    <div className="text-[10px] text-slate-600">
                      Display on report: <span className="font-extrabold text-amber-800">{formData.delay_submitted ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-purple-200 cursor-pointer hover:bg-purple-50 transition-all">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.delay_not_yet_submitted)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        delay_not_yet_submitted: e.target.checked,
                        delay_submitted: e.target.checked ? false : formData.delay_submitted,
                      })
                    }
                    className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-black">Delays - Not Yet Submitted</div>
                    <div className="text-[10px] text-slate-600">
                      Display on report: <span className="font-extrabold text-purple-800">{formData.delay_not_yet_submitted ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks</label>
            <textarea
              rows={2}
              value={formData.remarks || ''}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs p-3 text-black font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Approved by BOE or pending moderation"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-md shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : initialRecord ? 'Update Record' : 'Save Submission'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
