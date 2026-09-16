'use client';

import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  FileCheck2,
  FileText,
  Calendar,
  ArrowUpRight,
  PlusCircle,
} from 'lucide-react';
import { ResultsSubmissionRecord, DashboardStats, isYes } from '../lib/types';
import { OFFICIAL_DEPARTMENTS } from '../lib/departments';

interface DashboardProps {
  records: ResultsSubmissionRecord[];
  selectedMonth: string;
  selectedYear: number | string;
  onNavigateTab: (tab: string) => void;
  onOpenAddModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  records,
  selectedMonth,
  selectedYear,
  onNavigateTab,
  onOpenAddModal,
}) => {
  const stats: DashboardStats = records.reduce(
    (acc, r) => ({
      totalRecords: acc.totalRecords + 1,
      totalBatches: acc.totalBatches + (r.eligible_batch ? 1 : 0),
      totalProgressSubmitted: acc.totalProgressSubmitted + (isYes(r.progress_submitted) ? 1 : 0),
      totalProgressNotSubmitted: acc.totalProgressNotSubmitted + (isYes(r.progress_not_submitted) ? 1 : 0),
      totalDelaySubmitted: acc.totalDelaySubmitted + (isYes(r.delay_submitted) ? 1 : 0),
      totalDelayNotYetSubmitted: acc.totalDelayNotYetSubmitted + (isYes(r.delay_not_yet_submitted) ? 1 : 0),
    }),
    {
      totalRecords: 0,
      totalBatches: 0,
      totalProgressSubmitted: 0,
      totalProgressNotSubmitted: 0,
      totalDelaySubmitted: 0,
      totalDelayNotYetSubmitted: 0,
    }
  );

  const deptCounts = OFFICIAL_DEPARTMENTS.map((dept) => {
    const deptRecords = records.filter((r) => r.department === dept.name);
    const submitted = deptRecords.reduce((s, r) => s + (isYes(r.progress_submitted) ? 1 : 0), 0);
    const notSubmitted = deptRecords.reduce((s, r) => s + (isYes(r.progress_not_submitted) ? 1 : 0), 0);
    return {
      dept,
      count: deptRecords.length,
      submitted,
      notSubmitted,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Calendar className="w-4 h-4" />
              <span>Report Month: {selectedMonth} {selectedYear}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Board of Examiners Progress Dashboard
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Overview of results submission progression across all 10 BCAS academic departments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('report')}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>View Official Report</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Add Submission</span>
            </button>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 6 Key Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Records</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalRecords}</div>
          <div className="text-[11px] text-slate-500 mt-1">Submitted programs</div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Eligible Batches</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalBatches}</div>
          <div className="text-[11px] text-slate-500 mt-1">Active monthly batches</div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200/60 bg-emerald-50/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Progress - Submitted</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{stats.totalProgressSubmitted} Yes</div>
          <div className="text-[11px] text-emerald-600 mt-1">On-time module submissions</div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-4 border border-rose-200/60 bg-rose-50/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Progress - Not Sub.</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-700">{stats.totalProgressNotSubmitted} Yes</div>
          <div className="text-[11px] text-rose-600 mt-1">Modules pending submission</div>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200/60 bg-amber-50/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Delay - Submitted</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-700">{stats.totalDelaySubmitted} Yes</div>
          <div className="text-[11px] text-amber-600 mt-1">Resolved delayed items</div>
        </div>

        {/* Card 6 */}
        <div className="bg-white rounded-2xl p-4 border border-purple-200/60 bg-purple-50/10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-purple-800 uppercase tracking-wider">Delay - Pending</span>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-700">{stats.totalDelayNotYetSubmitted} Yes</div>
          <div className="text-[11px] text-purple-600 mt-1">Outstanding delayed items</div>
        </div>
      </div>

      {/* Department Breakdown Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Department Progress Breakdown</span>
            </h2>
            <p className="text-xs text-slate-500">
              Submission status by official BCAS academic department with designated pastel color schemes.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('manage')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>Manage All Records</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {deptCounts.map(({ dept, count, submitted, notSubmitted }) => {
            return (
              <div
                key={dept.name}
                className={`rounded-xl p-4 border ${dept.borderColor} ${dept.bgColor} transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${dept.badgeColor}`}>
                    {dept.name}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">{count} Rec</span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Submitted:</span>
                    <span className="font-bold text-emerald-700">{submitted} Yes</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Not Submitted:</span>
                    <span className="font-bold text-rose-700">{notSubmitted} Yes</span>
                  </div>

                  <div className="w-full bg-white/60 h-2 rounded-full overflow-hidden border border-slate-200 mt-2">
                    <div
                      className="bg-emerald-500 h-full transition-all"
                      style={{
                        width: `${
                          submitted + notSubmitted > 0
                            ? Math.round((submitted / (submitted + notSubmitted)) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
