'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, Check, X } from 'lucide-react';

interface PasswordPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionLabel?: string;
}

export const ADMIN_DEFAULT_PASSWORD = 'BCAS@2026';

export const PasswordPromptModal: React.FC<PasswordPromptModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionLabel = 'Authorize Access',
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_DEFAULT_PASSWORD) {
      setError(null);
      setPasswordInput('');
      onConfirm();
      onClose();
    } else {
      setError('Incorrect admin password. Authorization denied.');
    }
  };

  const handleClose = () => {
    setPasswordInput('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 text-slate-900">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Admin Password</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Default: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-800">BCAS@2026</code>
              </span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                autoFocus
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setError(null);
                }}
                placeholder="Enter password..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 pl-9 pr-3 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{actionLabel}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
