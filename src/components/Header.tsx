import React, { useState } from 'react';
import { ActiveTab, ViewMode } from '../types';
import { Building2, ShieldCheck, UserCheck, CheckSquare, FileText, Landmark, KeySquare, HardDrive, Lock, LogOut, X, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
}) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const DEFAULT_ADMIN_PASSWORD = 'nick620504';

  const navTabs: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    activeClasses: string;
    hoverClasses: string;
  }[] = [
    {
      id: 'checklist',
      label: '報到清單',
      icon: <CheckSquare className="w-4 h-4" />,
      activeClasses: 'bg-blue-600 text-white border-blue-700 shadow-xs font-bold',
      hoverClasses: 'hover:bg-blue-50 hover:text-blue-700 text-slate-700',
    },
    {
      id: 'documents',
      label: '繳交證件',
      icon: <ShieldCheck className="w-4 h-4" />,
      activeClasses: 'bg-emerald-600 text-white border-emerald-700 shadow-xs font-bold',
      hoverClasses: 'hover:bg-emerald-50 hover:text-emerald-700 text-slate-700',
    },
    {
      id: 'forms',
      label: '表單下載',
      icon: <FileText className="w-4 h-4" />,
      activeClasses: 'bg-sky-600 text-white border-sky-700 shadow-xs font-bold',
      hoverClasses: 'hover:bg-sky-50 hover:text-sky-700 text-slate-700',
    },
    {
      id: 'facilities',
      label: '環境導覽',
      icon: <Building2 className="w-4 h-4" />,
      activeClasses: 'bg-amber-600 text-white border-amber-700 shadow-xs font-bold',
      hoverClasses: 'hover:bg-amber-50 hover:text-amber-800 text-slate-700',
    },
    {
      id: 'banking',
      label: '農會與國旅卡',
      icon: <Landmark className="w-4 h-4" />,
      activeClasses: 'bg-purple-600 text-white border-purple-700 shadow-xs font-bold',
      hoverClasses: 'hover:bg-purple-50 hover:text-purple-700 text-slate-700',
    },
    {
      id: 'mydata',
      label: 'MyData具結',
      icon: <KeySquare className="w-4 h-4" />,
      activeClasses: 'bg-teal-600 text-white border-teal-700 shadow-xs font-bold',
      hoverClasses: 'hover:bg-teal-50 hover:text-teal-700 text-slate-700',
    },
    {
      id: 'zdrive',
      label: 'Z:\\1.人事室 專區',
      icon: <HardDrive className="w-4 h-4" />,
      activeClasses: 'bg-rose-600 text-white border-rose-700 shadow-xs font-bold',
      hoverClasses: 'hover:bg-rose-50 hover:text-rose-700 text-slate-700',
    },
  ];

  const handleToggleAdminClick = () => {
    if (viewMode === 'admin') {
      // Exit admin mode back to newcomer view
      setViewMode('newcomer');
    } else {
      // Require password before entering admin mode
      setPasswordInput('');
      setShowPassword(false);
      setErrorMessage('');
      setShowPasswordModal(true);
    }
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === DEFAULT_ADMIN_PASSWORD) {
      setViewMode('admin');
      setShowPasswordModal(false);
      setErrorMessage('');
    } else {
      setErrorMessage('密碼錯誤，請確認後重新輸入！');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4 lg:gap-8">
            {/* Zone 1: Brand Wordmark */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-800 text-amber-300 flex items-center justify-center font-bold text-sm shadow-xs border border-blue-600">
                三義
              </div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('checklist');
                }}
                className="text-base sm:text-lg font-bold tracking-tight text-slate-900 hover:text-blue-700 transition-colors whitespace-nowrap"
              >
                三義鄉公所新進人員指引系統
              </a>
            </div>

            {/* Zone 2: Navigation Links (Color-coded for each functional area) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs xl:text-sm rounded-lg border transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? `${tab.activeClasses}`
                        : `border-transparent ${tab.hoverClasses}`
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Mode Switcher Action (with Password Protection) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleToggleAdminClick}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-xs ${
                  viewMode === 'admin'
                    ? 'bg-amber-500 border-amber-600 text-stone-950 ring-2 ring-amber-300 hover:bg-amber-400'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
                title={viewMode === 'admin' ? '點擊退出人事後台' : '點擊以密碼進入人事後台'}
              >
                {viewMode === 'admin' ? (
                  <>
                    <LogOut className="w-3.5 h-3.5 text-stone-950 stroke-[2.5]" />
                    <span>退出人事後台</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                    <span>切換人事後台</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Sub-Navigation Bar */}
          <div className="lg:hidden flex items-center gap-1.5 py-2 overflow-x-auto border-t border-slate-100 scrollbar-none">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border whitespace-nowrap shrink-0 transition-all ${
                    isActive
                      ? `${tab.activeClasses}`
                      : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Admin Password Verification Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900">人事管理後台驗證</h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyPassword} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  請輸入人事後台管理密碼：
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoFocus
                    required
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="請輸入後台密碼"
                    className="w-full px-3 py-2 pr-10 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 rounded transition-colors focus:outline-none"
                    title={showPassword ? '隱藏密碼' : '顯示密碼'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-stone-600" />
                    ) : (
                      <Eye className="w-4 h-4 text-stone-400" />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow-xs transition-colors"
                >
                  確認進入
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
