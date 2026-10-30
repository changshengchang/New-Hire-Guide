import React, { useState } from 'react';
import { Landmark, CreditCard, CheckCircle2, Circle, AlertCircle, Copy, Check, MapPin, ShieldCheck, ArrowLeft, KeyRound, FileCheck2 } from 'lucide-react';

interface BankingAndCardViewProps {
  onNavigateTab: (tab: any) => void;
}

export const BankingAndCardView: React.FC<BankingAndCardViewProps> = ({ onNavigateTab }) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Check state for opening requirements
  const [hasIdCards, setHasIdCards] = useState(false);
  const [hasOrderDoc, setHasOrderDoc] = useState(false);
  const [hasSeal, setHasSeal] = useState(false);
  const [hasCash, setHasCash] = useState(false);
  const [hasAccountBookCopy, setHasAccountBookCopy] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner - Purple Theme */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50/40 to-white border-2 border-purple-300 rounded-2xl p-5 sm:p-6 shadow-xs">
        {/* Back Button Row */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-purple-100">
          <button
            type="button"
            onClick={() => onNavigateTab('checklist')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-lg border-2 border-blue-900 shadow-md hover:shadow-lg transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5] transition-transform group-hover:-translate-x-0.5" />
            <span>回上頁（報到檢核清單）</span>
          </button>
          <span className="text-xs font-medium text-purple-800 bg-purple-100/80 px-2.5 py-1 rounded-md border border-purple-200">
            人事室分機：19(主任)、61(協辦人員)
          </span>
        </div>

        <div className="flex items-center gap-2 text-purple-700 text-xs font-bold mb-1">
          <Landmark className="w-4 h-4 text-purple-600" />
          <span>金融服務 · 國旅福利 · 自然人憑證</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          三義鄉農會開戶、玉山國旅卡及自然人憑證申辦指引
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          公所各項公務薪資由三義鄉農會統一撥付，特約國旅卡為玉山銀行發行；並特別提醒新進人員務必申請<strong>「自然人憑證」</strong>，以利公文辦理及登入行政院人事行政總處 (ECPA) 人事服務網之用。
        </p>
      </div>

      {/* Grid: 2 Primary Sections (Farmers' Assoc & Travel Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Card 1: Sanyi Farmers' Association Payroll Account Opening */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                指定薪資轉帳金融機構
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                三義鄉農會信用部開戶須知
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
          </div>

          {/* Core Instruction Alert */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <AlertCircle className="w-4 h-4" />
              <span>開戶核心規定（必備項目）</span>
            </div>
            <p className="leading-relaxed">
              請持<strong>雙證件</strong>及<strong>派令（或人事室核發之報到單）</strong>至三義鄉農會辦理開戶，並請備妥<strong>開戶現金至少 1,000 元</strong>。
            </p>
          </div>

          {/* Interactive Checklist for Going to Farmers' Assoc */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
              臨櫃前自檢核清單（5 大必備）：
            </span>

            <div
              onClick={() => setHasIdCards(!hasIdCards)}
              className="flex items-start gap-2.5 p-3 rounded-lg border border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
            >
              {hasIdCards ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-stone-300 mt-0.5 shrink-0" />
              )}
              <div className="text-xs">
                <span className="font-semibold text-stone-800">1. 雙證件正本：</span>
                <span className="text-stone-600"> 國民身分證 ＋ 第二身分證明文件（健保卡或駕照）。</span>
              </div>
            </div>

            <div
              onClick={() => setHasOrderDoc(!hasOrderDoc)}
              className="flex items-start gap-2.5 p-3 rounded-lg border border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
            >
              {hasOrderDoc ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-stone-300 mt-0.5 shrink-0" />
              )}
              <div className="text-xs">
                <span className="font-semibold text-stone-800">2. 到職證明文件：</span>
                <span className="text-stone-600"> 機關派令正本、人事到職通知書或報到單（佐證任職公所薪資轉帳）。</span>
              </div>
            </div>

            <div
              onClick={() => setHasSeal(!hasSeal)}
              className="flex items-start gap-2.5 p-3 rounded-lg border border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
            >
              {hasSeal ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-stone-300 mt-0.5 shrink-0" />
              )}
              <div className="text-xs">
                <span className="font-semibold text-stone-800">3. 原留便章（印鑑）：</span>
                <span className="text-stone-600"> 供活期存款存摺開戶留存印鑑使用。</span>
              </div>
            </div>

            <div
              onClick={() => setHasCash(!hasCash)}
              className="flex items-start gap-2.5 p-3 rounded-lg border border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
            >
              {hasCash ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-stone-300 mt-0.5 shrink-0" />
              )}
              <div className="text-xs">
                <span className="font-semibold text-stone-800">4. 開戶起存金：</span>
                <span className="text-stone-600"> 攜帶現金至少 NT$ 1,000 元整存入開戶。</span>
              </div>
            </div>

            <div
              onClick={() => setHasAccountBookCopy(!hasAccountBookCopy)}
              className="flex items-start gap-2.5 p-3 rounded-lg border border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
            >
              {hasAccountBookCopy ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-stone-300 mt-0.5 shrink-0" />
              )}
              <div className="text-xs">
                <span className="font-semibold text-stone-800">5. 存摺封面影印交送出納：</span>
                <span className="text-stone-600"> 辦妥後將存摺封面影本黏貼至「員工薪資轉帳帳戶指定書」送交財行課出納。</span>
              </div>
            </div>
          </div>

          {/* Location & Navigation info */}
          <div className="bg-stone-50 rounded-xl p-4 text-xs space-y-2 border border-stone-200/80">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                三義鄉農會本會信用部
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopy('苗栗縣三義鄉廣盛村中正路152號', 'address')
                }
                className="text-stone-500 hover:text-stone-900 flex items-center gap-1 text-[11px] cursor-pointer"
              >
                {copiedText === 'address' ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>複製地址</span>
              </button>
            </div>
            <div className="text-stone-600">地址：苗栗縣三義鄉廣盛村中正路152號（距公所約3分鐘車程）</div>
            <div className="text-stone-600">電話：(037) 872-001 信用部櫃檯</div>
            <div className="text-stone-600">營業時間：週一至週五 08:00 - 15:30 (公休日除外)</div>
          </div>
        </div>

        {/* Card 2: E.SUN Bank National Travel Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                公所指定國民旅遊卡發卡銀行
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                玉山銀行國民旅遊卡 (E.SUN Bank)
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          {/* Key Official Statement */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-700 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-stone-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>本所國旅卡為玉山銀行</span>
            </div>
            <p className="leading-relaxed">
              三義鄉公所特約國民旅遊卡配合發卡機構為<strong>玉山銀行</strong>。新進同仁到職經銓敘審定後，人事室將登錄同仁資料，即可申辦玉山國旅卡。
            </p>
          </div>

          {/* Subsidies and quotas */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
              公務人員休假補助費（國旅卡）額度說明：
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 text-xs">
                <div className="text-stone-500 font-medium mb-1">觀光旅遊額度</div>
                <div className="font-mono tabular-nums text-base font-bold text-stone-900">
                  NT$ 8,000 元
                </div>
                <div className="text-stone-500 mt-1 text-[11px] leading-relaxed">
                  適用旅行業、旅宿業、觀光遊樂業、交通運輸業特約商店。
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 text-xs">
                <div className="text-stone-500 font-medium mb-1">非觀光消費額度</div>
                <div className="font-mono tabular-nums text-base font-bold text-stone-900">
                  NT$ 8,000 元
                </div>
                <div className="text-stone-500 mt-1 text-[11px] leading-relaxed">
                  適用全台各行業國旅卡特約實體或線上商店（珠寶/儲值除外）。
                </div>
              </div>
            </div>
          </div>

          {/* Customer Service Info (Removed inspection text as requested) */}
          <div className="space-y-2.5 pt-2 text-xs text-stone-600">
            <div className="flex items-start gap-2 bg-stone-50 p-3 rounded-lg border border-stone-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span>
                <strong>玉山專屬客服：</strong>玉山銀行國旅卡免付費客服專線 0800-30-1313 或手機請撥 (02) 2182-1313，洽詢公所員工專案權益。
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigateTab('forms')}
              className="text-xs text-purple-700 hover:text-purple-900 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <span>前往下載「玉山銀行國民旅遊卡專用申請書」表單 →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Card 3: Dedicated Natural Person Certificate (自然人憑證) Guidance Card */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 border-2 border-indigo-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-indigo-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              <span>重要公務憑證 · 數位簽章與差勤必備</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              新進同仁申請「自然人憑證」重要提醒
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              為確保到職後各項日常公務順利推展，新進人員請儘速向任一戶政事務所申請自然人憑證 IC 卡。
            </p>
          </div>
          <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-auto shadow-xs">
            公務必備 · 到職優先辦理
          </div>
        </div>

        {/* 2 Core Usages Highlight Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border-2 border-indigo-100 rounded-xl p-4.5 space-y-2.5 shadow-2xs hover:border-indigo-300 transition-colors">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span>1. 公文線上簽核與辦理必備</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              公所日常各類公文均採電子線上簽核。使用自然人憑證方能進行：
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li><strong>公文系統安全登入</strong>：驗證承辦人員公務身分。</li>
              <li><strong>電子公文簽核與會辦</strong>：公文線上批示、審查加簽與代為決行。</li>
              <li><strong>數位簽章認證</strong>：具備法律保障之電子簽章，符合公文處理規範。</li>
            </ul>
          </div>

          <div className="bg-white border-2 border-purple-100 rounded-xl p-4.5 space-y-2.5 shadow-2xs hover:border-purple-300 transition-colors">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <span>2. 登入 ECPA 人事服務網專用</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              登入行政院人事行政總處人事服務網（ECPA）之後續公務權益：
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li><strong>WebITR 線上差勤系統</strong>：每日打卡簽到退、請假與公差派免申請。</li>
              <li><strong>加班費與補休報支</strong>：公務加班線上申報、核銷審核及時數補休換算。</li>
              <li><strong>個人人事資料查閱</strong>：年資累計、銓敘審定、考績通知書及福利補助查詢。</li>
            </ul>
          </div>
        </div>

        {/* Application Procedure Guide */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 text-xs space-y-3">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>自然人憑證申辦方式與準備須知：</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="font-semibold text-slate-800 mb-1">① 申辦地點</div>
              <div className="text-slate-600 leading-relaxed">
                全國任一戶政事務所臨櫃辦理。<br />
                <span className="text-indigo-700 font-medium">（鄰近本所：苗栗縣三義鄉戶政事務所，步行約 2 分鐘）</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="font-semibold text-slate-800 mb-1">② 應備證件與規費</div>
              <div className="text-slate-600 leading-relaxed">
                1. 本人國民身分證正本。<br />
                2. 工本費現金 NT$ 250 元。<br />
                3. 個人常用之 E-mail 信箱。
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <div className="font-semibold text-slate-800 mb-1">③ 使用準備</div>
              <div className="text-slate-600 leading-relaxed">
                1. 備妥晶片讀卡機。<br />
                2. 臨櫃設定之 6~8 碼 PIN 碼為個人數位印章，請妥善保管切勿外洩。
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="flex justify-center pt-2 pb-4">
        <button
          type="button"
          onClick={() => onNavigateTab('checklist')}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl border-2 border-blue-900 shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>回上頁（返回新進人員報到清單）</span>
        </button>
      </div>
    </div>
  );
};
