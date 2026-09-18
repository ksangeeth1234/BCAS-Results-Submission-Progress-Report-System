'use client';

import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { ReportingPeriodState, getPeriodLabel } from '../lib/types';
import { MONTHS, YEARS } from '../lib/departments';

interface DateRangeSelectorProps {
  period: ReportingPeriodState;
  onChange: (updatedPeriod: ReportingPeriodState) => void;
  compact?: boolean;
  className?: string;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  period,
  onChange,
  compact = false,
  className = '',
}) => {
  const handleModeChange = (newMode: 'single' | 'range') => {
    onChange({
      ...period,
      mode: newMode,
    });
  };

  if (compact) {
    return (
      <div className={`flex flex-wrap items-center gap-2 bg-slate-800/90 text-white p-2 rounded-xl border border-slate-700/80 shadow-sm text-xs ${className}`}>
        {/* Mode Switcher Buttons */}
        <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700">
          <button
            type="button"
            onClick={() => handleModeChange('single')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              period.mode === 'single'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Single Month
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('range')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              period.mode === 'range'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Date Range (From - To)
          </button>
        </div>

        {/* Inputs depending on mode */}
        {period.mode === 'single' ? (
          <div className="flex items-center gap-1.5">
            <select
              value={period.selectedMonth}
              onChange={(e) => onChange({ ...period, selectedMonth: e.target.value })}
              className="bg-slate-900 text-white border border-slate-700 rounded-lg text-xs py-1 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={period.selectedYear}
              onChange={(e) => onChange({ ...period, selectedYear: Number(e.target.value) })}
              className="bg-slate-900 text-white border border-slate-700 rounded-lg text-xs py-1 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {/* From */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700 text-[11px]">
              <span className="text-slate-400 font-semibold px-1">From:</span>
              <select
                value={period.fromMonth}
                onChange={(e) => onChange({ ...period, fromMonth: e.target.value })}
                className="bg-slate-950 text-white border border-slate-800 rounded text-xs py-0.5 px-1.5 focus:outline-none"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={period.fromYear}
                onChange={(e) => onChange({ ...period, fromYear: Number(e.target.value) })}
                className="bg-slate-950 text-white border border-slate-800 rounded text-xs py-0.5 px-1.5 focus:outline-none"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />

            {/* To */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700 text-[11px]">
              <span className="text-slate-400 font-semibold px-1">To:</span>
              <select
                value={period.toMonth}
                onChange={(e) => onChange({ ...period, toMonth: e.target.value })}
                className="bg-slate-950 text-white border border-slate-800 rounded text-xs py-0.5 px-1.5 focus:outline-none"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={period.toYear}
                onChange={(e) => onChange({ ...period, toYear: Number(e.target.value) })}
                className="bg-slate-950 text-white border border-slate-800 rounded text-xs py-0.5 px-1.5 focus:outline-none"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Sidebar / Card View
  return (
    <div className={`bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60 shadow-sm space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
        <span className="flex items-center space-x-1.5 text-blue-400">
          <Calendar className="w-4 h-4" />
          <span>REPORT PERIOD</span>
        </span>
        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold">
          {period.mode === 'single' ? 'Single Month' : 'Date Range'}
        </span>
      </div>

      {/* Mode Selector Segmented Tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-lg border border-slate-700/70 text-xs">
        <button
          type="button"
          onClick={() => handleModeChange('single')}
          className={`py-1 rounded-md text-[11px] font-bold transition-all ${
            period.mode === 'single'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Single Month
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('range')}
          className={`py-1 rounded-md text-[11px] font-bold transition-all ${
            period.mode === 'range'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Date Range (From-To)
        </button>
      </div>

      {/* Controls */}
      {period.mode === 'single' ? (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Month</label>
            <select
              value={period.selectedMonth}
              onChange={(e) => onChange({ ...period, selectedMonth: e.target.value })}
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg text-xs py-1.5 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Year</label>
            <select
              value={period.selectedYear}
              onChange={(e) => onChange({ ...period, selectedYear: Number(e.target.value) })}
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg text-xs py-1.5 px-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {/* FROM SECTION */}
          <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700/80 space-y-1">
            <span className="text-[10px] font-bold uppercase text-blue-400 block tracking-wider">From Period</span>
            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={period.fromMonth}
                onChange={(e) => onChange({ ...period, fromMonth: e.target.value })}
                className="bg-slate-950 text-white border border-slate-700 rounded text-xs py-1 px-1.5 focus:outline-none"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={period.fromYear}
                onChange={(e) => onChange({ ...period, fromYear: Number(e.target.value) })}
                className="bg-slate-950 text-white border border-slate-700 rounded text-xs py-1 px-1.5 focus:outline-none"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TO SECTION */}
          <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700/80 space-y-1">
            <span className="text-[10px] font-bold uppercase text-blue-400 block tracking-wider">To Period</span>
            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={period.toMonth}
                onChange={(e) => onChange({ ...period, toMonth: e.target.value })}
                className="bg-slate-950 text-white border border-slate-700 rounded text-xs py-1 px-1.5 focus:outline-none"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={period.toYear}
                onChange={(e) => onChange({ ...period, toYear: Number(e.target.value) })}
                className="bg-slate-950 text-white border border-slate-700 rounded text-xs py-1 px-1.5 focus:outline-none"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Calendar Date Range Inputs */}
          <div className="pt-1 border-t border-slate-700/50 space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400 block">Exact Date Range (Optional):</span>
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="text-[10px] text-slate-500 block">From Date</label>
                <input
                  type="date"
                  value={period.fromDate || ''}
                  onChange={(e) => onChange({ ...period, fromDate: e.target.value })}
                  className="w-full bg-slate-950 text-white border border-slate-700 rounded text-[11px] py-1 px-1 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">To Date</label>
                <input
                  type="date"
                  value={period.toDate || ''}
                  onChange={(e) => onChange({ ...period, toDate: e.target.value })}
                  className="w-full bg-slate-950 text-white border border-slate-700 rounded text-[11px] py-1 px-1 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Range Display Banner */}
      <div className="bg-blue-950/60 border border-blue-800/60 rounded-lg p-2 text-center text-[11px]">
        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Active Scope</span>
        <span className="font-extrabold text-blue-300">{getPeriodLabel(period)}</span>
      </div>
    </div>
  );
};
