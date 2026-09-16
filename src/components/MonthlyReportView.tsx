'use client';

import React, { useState } from 'react';
import { Printer, FileSpreadsheet, FileText, Building2, Sparkles, Lock } from 'lucide-react';
import { ResultsSubmissionRecord, formatYesNo, isYes } from '../lib/types';
import { DEPARTMENT_COLOR_MAP, DEFAULT_DEPARTMENT_COLOR } from '../lib/departments';
import { exportToExcel } from '../lib/exportExcel';
import { exportToPdf } from '../lib/exportPdf';
import { PasswordPromptModal } from './PasswordPromptModal';

interface MonthlyReportViewProps {
  records: ResultsSubmissionRecord[];
  selectedMonth: string;
  selectedYear: number | string;
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  records,
  selectedMonth,
  selectedYear,
}) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'print' | 'excel' | 'pdf' | null>(null);

  const filteredRecords = records.filter(
    (r) =>
      (!selectedMonth || r.report_month === selectedMonth) &&
      (!selectedYear || String(r.report_year) === String(selectedYear))
  );

  const groupedByDept: Record<string, ResultsSubmissionRecord[]> = {};
  filteredRecords.forEach((r) => {
    const dept = r.department || 'Other';
    if (!groupedByDept[dept]) groupedByDept[dept] = [];
    groupedByDept[dept].push(r);
  });

  const handleInitiatePrint = () => {
    setPendingAction('print');
    setIsPasswordModalOpen(true);
  };

  const handleInitiateExcel = () => {
    exportToExcel(filteredRecords, selectedMonth, selectedYear);
  };

  const handleInitiatePdf = () => {
    exportToPdf(filteredRecords, selectedMonth, selectedYear);
  };

  const handleConfirmAuthorization = () => {
    if (pendingAction === 'print') {
      window.print();
    }
    setPendingAction(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Excel Template Faithful View</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Monthly Progress Report</h1>
          <p className="text-xs text-slate-500">
            Official BCAS Board of Examiners progression report layout with department pastel colors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleInitiateExcel}
            className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-md shadow-emerald-700/20 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </button>
          <button
            onClick={handleInitiatePdf}
            className="flex items-center space-x-2 bg-rose-700 hover:bg-rose-600 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-md shadow-rose-700/20 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF (.pdf)</span>
          </button>
          <button
            onClick={handleInitiatePrint}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all border border-slate-700"
            title="Print report (Password Protected)"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Report</span>
            <Lock className="w-3 h-3 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-lg p-6 md:p-8 space-y-6 print:shadow-none print:border-none print:p-0">
        {/* Report Header Title Block */}
        <div className="text-center space-y-2 pb-4 border-b border-slate-200">
          <div className="flex items-center justify-center space-x-2">
            <Building2 className="w-7 h-7 text-slate-900" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              BCAS Campus
            </h1>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-slate-700 italic">
            Progression of Results submission to the Board of Examiners Monthly wise
          </h2>
          <div className="inline-block bg-slate-100 text-slate-800 text-xs font-bold px-4 py-1 rounded-full border border-slate-300">
            Reporting Month: {selectedMonth} {selectedYear}
          </div>
        </div>

        {/* Excel-Matching Grouped Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-900 text-white text-center font-bold">
                <th rowSpan={3} className="border border-slate-500 p-2 min-w-[35px]">#</th>
                <th rowSpan={3} className="border border-slate-500 p-2 min-w-[140px]">Faculty</th>
                <th rowSpan={3} className="border border-slate-500 p-2 min-w-[140px]">Department</th>
                <th rowSpan={3} className="border border-slate-500 p-2 min-w-[170px]">Program</th>
                <th rowSpan={3} className="border border-slate-500 p-2 min-w-[130px]">Coordinator</th>
                <th rowSpan={3} className="border border-slate-500 p-2 min-w-[100px]">Semester/s</th>
                <th rowSpan={3} className="border border-slate-500 p-2 min-w-[150px]">
                  Eligible Batch for this month as per the Academic Calendar
                </th>
                <th colSpan={2} className="border border-slate-500 p-2 bg-slate-800">Progress</th>
                <th colSpan={3} className="border border-slate-500 p-2 bg-slate-850">Delays for submission</th>
              </tr>

              <tr className="bg-slate-800 text-white text-center font-bold">
                <th rowSpan={2} className="border border-slate-500 p-2 min-w-[80px]">Submitted</th>
                <th rowSpan={2} className="border border-slate-500 p-2 min-w-[90px]">Not submitted</th>
                <th colSpan={2} className="border border-slate-500 p-2 bg-slate-750">
                  Relevant month to be submitted as per the academic calendar
                </th>
                <th rowSpan={2} className="border border-slate-500 p-2 min-w-[150px]">Remarks</th>
              </tr>

              <tr className="bg-slate-800 text-white text-center font-bold">
                <th className="border border-slate-500 p-2 min-w-[80px]">Submitted</th>
                <th className="border border-slate-500 p-2 min-w-[100px]">Not yet submitted</th>
              </tr>
            </thead>

            <tbody>
              {Object.keys(groupedByDept).length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-slate-500 font-medium">
                    No results submission records found for {selectedMonth} {selectedYear}.
                  </td>
                </tr>
              ) : (
                Object.entries(groupedByDept).map(([deptName, deptRecords]) => {
                  const deptConfig = DEPARTMENT_COLOR_MAP[deptName] || DEFAULT_DEPARTMENT_COLOR;

                  const subtotal = deptRecords.reduce(
                    (acc, r) => ({
                      ps: acc.ps + (isYes(r.progress_submitted) ? 1 : 0),
                      pns: acc.pns + (isYes(r.progress_not_submitted) ? 1 : 0),
                      ds: acc.ds + (isYes(r.delay_submitted) ? 1 : 0),
                      dnys: acc.dnys + (isYes(r.delay_not_yet_submitted) ? 1 : 0),
                    }),
                    { ps: 0, pns: 0, ds: 0, dnys: 0 }
                  );

                  return (
                    <React.Fragment key={deptName}>
                      <tr className={`${deptConfig.bgColor} font-bold text-slate-900 border-t-2 border-b border-slate-400`}>
                        <td colSpan={12} className="p-2.5 border border-slate-400 bg-white/40">
                          <div className="flex items-center space-x-2">
                            <span className={`w-3 h-3 rounded-full border ${deptConfig.badgeColor}`} />
                            <span className="text-xs uppercase tracking-wide">
                              DEPARTMENT: {deptName}
                            </span>
                            <span className="text-[10px] font-normal text-slate-600">
                              ({deptRecords.length} Programs)
                            </span>
                          </div>
                        </td>
                      </tr>

                      {deptRecords.map((r, rIdx) => {
                        const psYes = isYes(r.progress_submitted);
                        const pnsYes = isYes(r.progress_not_submitted);
                        const dsYes = isYes(r.delay_submitted);
                        const dnysYes = isYes(r.delay_not_yet_submitted);

                        return (
                          <tr
                            key={r.id || rIdx}
                            className={`${deptConfig.bgColor} hover:brightness-95 transition-all text-slate-800`}
                          >
                            <td className="p-2 border border-slate-300 text-center font-bold text-slate-600">
                              {rIdx + 1}
                            </td>
                            <td className="p-2 border border-slate-300">{r.faculty}</td>
                            <td className="p-2 border border-slate-300 font-medium">{r.department}</td>
                            <td className="p-2 border border-slate-300 font-semibold text-slate-900">{r.program}</td>
                            <td className="p-2 border border-slate-300">{r.coordinator}</td>
                            <td className="p-2 border border-slate-300 text-center">{r.semester}</td>
                            <td className="p-2 border border-slate-300">{r.eligible_batch}</td>

                            <td className={`p-2 border border-slate-300 text-center font-bold ${psYes ? 'text-emerald-800 bg-emerald-100/60' : 'text-slate-400'}`}>
                              {psYes ? 'Yes' : 'No'}
                            </td>

                            <td className={`p-2 border border-slate-300 text-center font-bold ${pnsYes ? 'text-rose-800 bg-rose-100/60' : 'text-slate-400'}`}>
                              {pnsYes ? 'Yes' : 'No'}
                            </td>

                            <td className={`p-2 border border-slate-300 text-center font-bold ${dsYes ? 'text-amber-800 bg-amber-100/60' : 'text-slate-400'}`}>
                              {dsYes ? 'Yes' : 'No'}
                            </td>

                            <td className={`p-2 border border-slate-300 text-center font-bold ${dnysYes ? 'text-purple-800 bg-purple-100/60' : 'text-slate-400'}`}>
                              {dnysYes ? 'Yes' : 'No'}
                            </td>

                            <td className="p-2 border border-slate-300 text-xs italic">{r.remarks || '-'}</td>
                          </tr>
                        );
                      })}

                      <tr className="bg-slate-200 font-bold text-slate-900 border-b-2 border-slate-400">
                        <td colSpan={7} className="p-2 border border-slate-400 text-right pr-4 text-xs">
                          Total Yes for {deptName}:
                        </td>
                        <td className="p-2 border border-slate-400 text-center text-emerald-900 font-black">
                          {subtotal.ps} Yes
                        </td>
                        <td className="p-2 border border-slate-400 text-center text-rose-900 font-black">
                          {subtotal.pns} Yes
                        </td>
                        <td className="p-2 border border-slate-400 text-center text-amber-900 font-black">
                          {subtotal.ds} Yes
                        </td>
                        <td className="p-2 border border-slate-400 text-center text-purple-900 font-black">
                          {subtotal.dnys} Yes
                        </td>
                        <td className="p-2 border border-slate-400 text-center">-</td>
                      </tr>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Verification Footer */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-xs text-slate-600 print:pt-4">
          <div className="space-y-8">
            <p className="font-semibold">Prepared By: Program Coordinator</p>
            <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto" />
            <p className="text-[10px] text-slate-400">Signature & Date</p>
          </div>

          <div className="space-y-8">
            <p className="font-semibold">Verified By: Head of Department</p>
            <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto" />
            <p className="text-[10px] text-slate-400">Signature & Date</p>
          </div>

          <div className="space-y-8">
            <p className="font-semibold">Approved By: Board of Examiners</p>
            <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto" />
            <p className="text-[10px] text-slate-400">Signature & Date</p>
          </div>
        </div>
      </div>

      {/* Password Authorization Prompt */}
      <PasswordPromptModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handleConfirmAuthorization}
        title="Admin Password Authorization Required"
        description="Please enter the admin password to authorize printing the official BCAS report."
        actionLabel="Authorize & Print"
      />
    </div>
  );
};
