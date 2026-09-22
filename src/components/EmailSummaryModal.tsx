'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Copy, Check, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { ResultsSubmissionRecord, ReportingPeriodState, isRecordInDateRange, getPeriodLabel } from '../lib/types';
import { OFFICIAL_DEPARTMENTS } from '../lib/departments';

interface EmailSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: ResultsSubmissionRecord[];
  reportingPeriod: ReportingPeriodState;
}

export const EmailSummaryModal: React.FC<EmailSummaryModalProps> = ({
  isOpen,
  onClose,
  records,
  reportingPeriod,
}) => {
  const [copied, setCopied] = useState(false);
  const [emailText, setEmailText] = useState('');

  const periodLabel = getPeriodLabel(reportingPeriod);

  useEffect(() => {
    const filteredRecords = records.filter((r) => isRecordInDateRange(r, reportingPeriod));

    // Group records by department name
    const updatedDeptMap: Record<string, number> = {};
    filteredRecords.forEach((r) => {
      const dept = r.department || 'Other';
      updatedDeptMap[dept] = (updatedDeptMap[dept] || 0) + 1;
    });

    const allDeptNames = OFFICIAL_DEPARTMENTS.map((d) => d.name);
    
    // Departments that have submitted entries
    const updatedDepts = allDeptNames.filter((d) => updatedDeptMap[d] && updatedDeptMap[d] > 0);
    
    // Departments with no entries submitted yet
    const pendingDepts = allDeptNames.filter((d) => !updatedDeptMap[d] || updatedDeptMap[d] === 0);

    const updatedListText =
      updatedDepts.length > 0
        ? updatedDepts.map((d, i) => `${i + 1}. Department of ${d} (${updatedDeptMap[d]} entry/entries)`).join('\n')
        : 'None so far.';

    const pendingListText =
      pendingDepts.length > 0
        ? pendingDepts.map((d, i) => `${i + 1}. Department of ${d}`).join('\n')
        : 'All official departments have updated the system.';

    const text = `Subject: Monthly Results Submission Progress Report Update - ${periodLabel}

Dear Sir,

I hope this email finds you well.

Please find below the current status update regarding the Results Submission Progress to the Board of Examiners for ${periodLabel}:

--------------------------------------------------
🟢 DEPARTMENTS THAT HAVE UPDATED THE SYSTEM (${updatedDepts.length}/${allDeptNames.length}):
--------------------------------------------------
${updatedListText}

--------------------------------------------------
🔴 DEPARTMENTS NOT YET UPDATED / PENDING (${pendingDepts.length}/${allDeptNames.length}):
--------------------------------------------------
${pendingListText}

--------------------------------------------------
Summary Overview:
- Total Official Departments: ${allDeptNames.length}
- Updated: ${updatedDepts.length}
- Pending: ${pendingDepts.length}
- Total Records Filed: ${filteredRecords.length}

The detailed Excel (.xlsx) and PDF progress reports for ${periodLabel} have been updated in the system.

Thank you.

Best regards,
[Your Name / Coordinator]
BCAS Campus`;

    setEmailText(text);
  }, [records, reportingPeriod, isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(emailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center space-x-2">
                <span>Email Summary Generator</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400">
                Generated Department Progress Summary for Mail
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

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600 font-medium">
              Below is the automatically generated summary based on live system data for{' '}
              <span className="font-bold text-slate-900">{periodLabel}</span>.
            </p>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md shadow-blue-600/30 transition-all flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Email Text'}</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={emailText}
              rows={16}
              className="w-full bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 select-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Tip: Click <b>Copy Email Text</b> and paste directly into Outlook, Gmail, or Mail.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
