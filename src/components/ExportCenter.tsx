'use client';

import React from 'react';
import { Download, FileSpreadsheet, FileText, Printer, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { ResultsSubmissionRecord } from '../lib/types';
import { exportToExcel } from '../lib/exportExcel';
import { exportToPdf } from '../lib/exportPdf';
import { OFFICIAL_DEPARTMENTS } from '../lib/departments';

interface ExportCenterProps {
  records: ResultsSubmissionRecord[];
  selectedMonth: string;
  selectedYear: number | string;
  onNavigateReport: () => void;
}

export const ExportCenter: React.FC<ExportCenterProps> = ({
  records,
  selectedMonth,
  selectedYear,
  onNavigateReport,
}) => {
  const filteredRecords = records.filter(
    (r) =>
      (!selectedMonth || r.report_month === selectedMonth) &&
      (!selectedYear || String(r.report_year) === String(selectedYear))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
          <Download className="w-6 h-6 text-blue-600" />
          <span>Report Export Center</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Export the official BCAS Board of Examiners monthly progress report into high-fidelity Excel spreadsheets or print-ready PDF documents.
        </p>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Excel Card */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Microsoft Excel Export</h2>
              <p className="text-xs text-slate-500 mt-1">
                Generates a formatted <code>.xlsx</code> file containing merged multi-level headers, cell borders, and department pastel fills.
              </p>
            </div>

            <ul className="text-xs space-y-2 text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Preserves 10 department pastel colors</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Multi-level merged header layout</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Automatic column width & text wrapping</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => exportToExcel(filteredRecords, selectedMonth, selectedYear)}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs py-3 rounded-xl shadow-md shadow-emerald-700/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Excel (.xlsx)</span>
          </button>
        </div>

        {/* PDF Card */}
        <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Adobe PDF Document</h2>
              <p className="text-xs text-slate-500 mt-1">
                Generates a print-ready A4 Landscape PDF with custom department table headers and footer pagination.
              </p>
            </div>

            <ul className="text-xs space-y-2 text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600" />
                <span>A4 Landscape institutional layout</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600" />
                <span>Repeated page headers for multi-page print</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-rose-600" />
                <span>Department pastel RGB color fills</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => exportToPdf(filteredRecords, selectedMonth, selectedYear)}
            className="w-full flex items-center justify-center space-x-2 bg-rose-700 hover:bg-rose-600 text-white font-semibold text-xs py-3 rounded-xl shadow-md shadow-rose-700/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF (.pdf)</span>
          </button>
        </div>

        {/* Print / Web View Card */}
        <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Printable Web View</h2>
              <p className="text-xs text-slate-500 mt-1">
                Opens the faithful Excel-matching web report view with optimized <code>@media print</code> CSS styling.
              </p>
            </div>

            <ul className="text-xs space-y-2 text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Direct browser print dialog support</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>High resolution screen preview</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Institutional signature block footer</span>
              </li>
            </ul>
          </div>

          <button
            onClick={onNavigateReport}
            className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 rounded-xl shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Open Report View</span>
          </button>
        </div>
      </div>

      {/* Export Preview Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Active Export Scope</span>
        </h3>
        <p className="text-xs text-slate-600">
          The exported report will include <span className="font-bold text-blue-600">{filteredRecords.length} records</span> for{' '}
          <span className="font-bold text-slate-900">{selectedMonth} {selectedYear}</span> across{' '}
          <span className="font-bold text-slate-900">{OFFICIAL_DEPARTMENTS.length} official departments</span>.
        </p>
      </div>
    </div>
  );
};
