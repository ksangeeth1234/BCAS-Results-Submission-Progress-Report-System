'use client';

import React from 'react';
import {
  LayoutDashboard,
  Table,
  FileSpreadsheet,
  Download,
  Database,
  Calendar,
  Building2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { MONTHS, YEARS } from '../lib/departments';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  totalRecordsCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onOpenSqlModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  totalRecordsCount,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenSqlModal,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'manage', label: 'Manage Records', icon: Table, badge: totalRecordsCount },
    { id: 'report', label: 'Monthly Report', icon: FileSpreadsheet, badge: 'Official' },
    { id: 'export', label: 'Export Reports', icon: Download, badge: 'PDF / Excel' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Reporting Period Quick Selector */}
          <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center space-x-1.5 text-blue-400">
                <Calendar className="w-4 h-4" />
                <span>REPORT PERIOD</span>
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                Active Filter
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
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
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
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
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-500">
          <div className="flex items-center space-x-2 text-slate-400 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>BCAS QA System</span>
          </div>
          <p className="text-[10px] leading-relaxed">
            Board of Examiners monthly results progress & delay monitoring tool.
          </p>
        </div>
      </aside>
    </>
  );
};
