import React, { useState } from 'react';
import { PersonnelType, EmployeeProfile } from '../types';
import { Award, ArrowLeftRight, Printer, Sparkles, RefreshCw, User, LogIn, LogOut, KeyRound, AlertCircle } from 'lucide-react';

interface IdentitySelectorProps {
  personnelType: PersonnelType;
  setPersonnelType: (type: PersonnelType) => void;
  activeEmployee: EmployeeProfile | null;
  allEmployees: EmployeeProfile[];
  isLoggedIn: boolean;
  onLogin: (empId: string) => void;
  onLogout: () => void;
  onOpenPrintModal: () => void;
  onResetProgress: () => void;
  completedCount: number;
  totalCount: number;
}

export const IdentitySelector: React.FC<IdentitySelectorProps> = ({
  personnelType,
  setPersonnelType,
  activeEmployee,
  allEmployees,
  isLoggedIn,
  onLogin,
  onLogout,
  onOpenPrintModal,
  onResetProgress,
  completedCount,
  totalCount,
}) => {
  const [inputEmpId, setInputEmpId] = useState('');
  const [loginError, setLoginError] = useState('');

  const isExam = personnelType === 'new_exam';
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = inputEmpId.trim().toUpperCase();
    if (!cleanId) return;

    const matched = allEmployees.find(
      (emp) => emp.employeeId.toUpperCase() === cleanId
    );

    if (matched) {
      onLogin(matched.employeeId);
      setInputEmpId('');
      setLoginError('');
    } else {
      setLoginError(`找不到員工代號【${cleanId}】，請確認後重新輸入，或洽人事室建立帳號！`);
    }
  };

  // Case 1: NOT LOGGED IN
  if (!isLoggedIn || !activeEmployee) {
    return (
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-2 border-blue-300 rounded-2xl p-6 sm:p-8 shadow-md mb-6 print:hidden">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-amber-200 flex items-center justify-center mx-auto shadow-sm border border-blue-500">
            <KeyRound className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              新進人員到職專屬登入
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              請輸入人事室為您配發的<strong>「員工代號」</strong>（例如：<code className="bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-mono font-bold">SY11501</code>），登入後即可檢視並記錄專屬的報到進度、繳交證件審查與列印自我檢核表。
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={inputEmpId}
                onChange={(e) => {
                  setInputEmpId(e.target.value);
                  if (loginError) setLoginError('');
                }}
                placeholder="請輸入您的員工代號 (如 SY11501)"
                className="flex-1 px-4 py-2.5 text-sm font-mono border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-600 uppercase bg-white shadow-2xs font-bold"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer border border-blue-700"
              >
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>登入進度</span>
              </button>
            </div>

            {loginError && (
              <div className="text-xs text-rose-700 bg-rose-50 border border-rose-300 p-2.5 rounded-lg flex items-center gap-2 text-left font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}
          </form>

          {/* Contact note without quick-login colleague chips */}
          <div className="pt-3 border-t border-slate-200 text-center">
            <div className="text-xs text-slate-500">
              若尚未取得員工代號或無法登入，請洽本所五樓人事室（人事室分機：19(主任)、61(協辦人員)）由人事同仁協助建檔配發。
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: LOGGED IN AS ACTIVE EMPLOYEE
  return (
    <div className="bg-gradient-to-r from-white via-blue-50/25 to-indigo-50/20 border-2 border-blue-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-6 print:hidden">
      {/* Top: Employee ID, Name, 服務單位, 報到日期 & Logout Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-blue-100">
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider shadow-xs border border-blue-600">
            <User className="w-3.5 h-3.5 text-amber-300" />
            <span>員工代號：{activeEmployee.employeeId}</span>
          </div>

          <div className="text-base font-bold text-slate-900">
            {activeEmployee.name} 同仁
          </div>

          <span className="text-xs text-slate-300">·</span>

          <div className="text-xs text-sky-900 bg-sky-50 border border-sky-300 px-2.5 py-1 rounded-md font-bold">
            服務單位：{activeEmployee.department}
          </div>

          <span className="text-xs text-slate-300">·</span>

          <span className="text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {activeEmployee.personnelType === 'new_exam' ? '考試分發初任人員' : '他機關調任人員'}
          </span>

          <span className="text-xs text-slate-300">·</span>

          <span className="text-xs text-slate-600 font-mono">
            報到日期：{activeEmployee.onboardingDate || '未指定'}
          </span>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors whitespace-nowrap"
          title="登出當前帳號，供其他同仁登入"
        >
          <LogOut className="w-3.5 h-3.5 text-stone-500" />
          <span>登出 / 切換其他代號</span>
        </button>
      </div>

      {/* Middle: Role Switcher & Overall Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Role Switcher Buttons */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              報到身分類別
            </span>
            <span className="text-xs text-stone-400">·</span>
            <span className="text-xs text-stone-500">系統依身分自動過濾所需繳交證件與填表項目</span>
          </div>

          <div className="inline-flex p-1 bg-stone-100 rounded-lg border border-stone-200/80">
            <button
              onClick={() => setPersonnelType('new_exam')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                isExam
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>考試分發初任人員</span>
            </button>

            <button
              onClick={() => setPersonnelType('transfer')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                !isExam
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 text-emerald-300" />
              <span>他機關調任人員</span>
            </button>
          </div>
        </div>

        {/* Right: Progress Summary & Print Action */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">個人到職完成度</span>
              <span className="font-mono tabular-nums font-bold text-stone-900 text-sm">
                {progressPercent}%
              </span>
              <span className="text-stone-400">({completedCount}/{totalCount})</span>
            </div>
            <div className="w-32 bg-stone-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={onOpenPrintModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors whitespace-nowrap"
            title="列印此同仁專屬報到核對單"
          >
            <Printer className="w-4 h-4 text-stone-700" />
            <span>列印個人核對單</span>
          </button>

          <button
            onClick={onResetProgress}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            title="重置個人勾選進度"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Context Notification */}
      <div className="mt-3 pt-3 border-t border-stone-100 flex items-start gap-2 text-xs text-stone-600">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          {isExam ? (
            <span>
              <strong>初任人員重點提示：</strong>請備齊最高學歷畢業證書、戶籍謄本（含配偶及直系親屬）、曾任年資服務證明及客語/英語等證照；並於到職後簽署「公務人員服務誓言」。
            </span>
          ) : (
            <span>
              <strong>調任人員重點提示：</strong>請務必攜帶前服務機關人事單位密封備妥之<strong>「銜補單」</strong>（含公保、健保、退撫儲金、差勤及離職證明），以利公所人事室即時辦理年資與投保銜接。
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
