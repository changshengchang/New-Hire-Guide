import React, { useState } from 'react';
import { Landmark, CreditCard, CheckCircle2, Circle, AlertCircle, Copy, Check, MapPin, ExternalLink, ShieldCheck, ArrowLeft } from 'lucide-react';

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
          <span>金融服務與法定福利 · 薪資開戶及國旅卡</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          三義鄉農會開戶與玉山國民旅遊卡指引
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          公所各項公務薪資、加班費及年終獎金均由三義鄉農會統一撥付；本所特約國民旅遊卡為玉山銀行發行。
        </p>
      </div>

      {/* Grid: 2 Primary Sections */}
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
                <span className="text-stone-600">
                  國民身分證必備 + 第二證件（健保卡或有效駕照）。
                </span>
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
                <span className="font-semibold text-stone-800">2. 任職證明文件：</span>
                <span className="text-stone-600">
                  縣府核發之派令正本或本所人事室出具之「新進同仁報到通知單」。
                </span>
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
                <span className="font-semibold text-stone-800">3. 私人印章：</span>
                <span className="text-stone-600">個人私章，作為農會開戶印鑑留存。</span>
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
                <span className="font-semibold text-stone-800">4. 開戶起存現金：</span>
                <span className="text-stone-600 font-mono tabular-nums">
                  依法規與農會作業慣例，開戶至少需存入 <strong>1,000 元整</strong>。
                </span>
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
                <span className="font-semibold text-stone-800">5. 存摺封面影本回傳：</span>
                <span className="text-stone-600">
                  開戶完成後，請影印存摺封面交回五樓人事室與主計室建檔入帳。
                </span>
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
                onClick={() =>
                  handleCopy('苗栗縣三義鄉廣盛村中正路152號', 'address')
                }
                className="text-stone-500 hover:text-stone-900 flex items-center gap-1 text-[11px]"
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
              三義鄉公所特約國民旅遊卡配合發卡機構為<strong>玉山銀行</strong>。新進同仁到職經銓敘審定後，人事室將登錄同仁資料至行政院人事行政總處「國民旅遊卡檢核系統」，即可申辦玉山國旅卡。
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

          {/* Inspection and link instructions */}
          <div className="space-y-2.5 pt-2 text-xs text-stone-600">
            <div className="flex items-start gap-2 bg-stone-50 p-3 rounded-lg border border-stone-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span>
                <strong>檢核系統登記：</strong>開卡後請至「公務人員國民旅遊卡檢核系統」註冊帳號，確認個人身分證字號與公所機關代碼連結無誤。
              </span>
            </div>

            <div className="flex items-start gap-2 bg-stone-50 p-3 rounded-lg border border-stone-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span>
                <strong>玉山專屬客服：</strong>玉山銀行國旅卡免付費客服專線 0800-30-1313 或手機請撥 (02) 2182-1313，洽詢公所員工專案權益。
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('forms')}
              className="text-xs text-purple-700 hover:text-purple-900 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <span>前往下載「玉山銀行國民旅遊卡專用申請書」表單 →</span>
            </button>
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
