'use client';

import React from 'react';
import { Building2, PlusCircle, Database, Calendar, Menu, X, FileSpreadsheet, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onOpenAddModal: () => void;
  onOpenSqlModal: () => void;
  selectedMonth: string;
  selectedYear: number | string;
  isFallback: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenAddModal,
  onOpenSqlModal,
  selectedMonth,
  selectedYear,
  isFallback,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg tracking-tight text-white">BCAS CAMPUS</span>
                  <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                    EXAMINATIONS BOARD
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium hidden sm:block">
                  Results Submission Progress Reporting System
                </p>
              </div>
            </div>
          </div>

          {/* Right: Active Period Badge + Quick Actions */}
          <div className="flex items-center space-x-3">
            {/* Active Period Display */}
            <div className="flex items-center space-x-1.5 text-xs font-semibold bg-slate-800 text-blue-200 border border-slate-700 px-3 py-1.5 rounded-lg shadow-inner">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{selectedMonth} {selectedYear}</span>
            </div>

            {/* Add Record Primary Action */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg shadow-md shadow-blue-600/30 hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Record</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
