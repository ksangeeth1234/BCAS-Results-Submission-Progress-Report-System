'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Printer, CheckCircle2, ShieldCheck, Sparkles, Mail } from 'lucide-react';
import { ResultsSubmissionRecord, ReportingPeriodState, isRecordInDateRange, getPeriodLabel } from '../lib/types';
import { exportToExcel } from '../lib/exportExcel';
import { exportToPdf } from '../lib/exportPdf';
import { OFFICIAL_DEPARTMENTS } from '../lib/departments';
import { DateRangeSelector } from './DateRangeSelector';
import { EmailSummaryModal } from './EmailSummaryModal';

interface ExportCenterProps {
  records: ResultsSubmissionRecord[];
  reportingPeriod: ReportingPeriodState;
  setReportingPeriod: (period: ReportingPeriodState) => void;
  onNavigateReport: () => void;
}

export const ExportCenter: React.FC<ExportCenterProps> = ({
  records,
  reportingPeriod,
  setReportingPeriod,
  onNavigateReport,
}) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const filteredRecords = records.filter((r) => isRecordInDateRange(r, reportingPeriod));
  const periodLabel = getPeriodLabel(reportingPeriod);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Download className="w-6 h-6 text-blue-600" />
            <span>Report Export Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Export the official BCAS Board of Examiners progress report into Excel, PDF, printable views, or generate email summaries for Sir.
          </p>
        </div>

        {/* Quick Date Range Control Bar */}
        <div className="w-full lg:w-auto">
          <DateRangeSelector period={reportingPeriod} onChange={setReportingPeriod} compact={true} />
        </div>
      </div>

      {/* Export Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Email Summary Card */}
        <div className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Email Draft Generator</h2>
              <p className="text-xs text-slate-500 mt-1">
                Generates a ready-to-copy email message showing updated vs pending departments to send to Sir.
              </p>
            </div>

            <ul className="text-xs space-y-2 text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Lists departments updated & pending</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>One-click copy to clipboard</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Formatted for email clients</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <Mail className="w-4 h-4" />
            <span>Generate Email Text</span>
          </button>
        </div>

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
            onClick={() => exportToExcel(filteredRecords, periodLabel)}
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
            onClick={() => exportToPdf(filteredRecords, periodLabel)}
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
          <span className="font-bold text-slate-900">{periodLabel}</span> across{' '}
          <span className="font-bold text-slate-900">{OFFICIAL_DEPARTMENTS.length} official departments</span>.
        </p>
      </div>

      <EmailSummaryModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        records={records}
        reportingPeriod={reportingPeriod}
      />
    </div>
  );
};


