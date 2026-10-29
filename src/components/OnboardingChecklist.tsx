import React from 'react';
import { ChecklistItem, PersonnelType, ActiveTab, DocStatus, DocumentItem } from '../types';
import { CheckCircle2, Circle, ArrowRight, Bookmark, Compass, Check } from 'lucide-react';

interface OnboardingChecklistProps {
  items: ChecklistItem[];
  personnelType: PersonnelType;
  onToggleItem: (id: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  docStatuses?: Record<string, DocStatus>;
  documents?: DocumentItem[];
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  items,
  personnelType,
  onToggleItem,
  onNavigateTab,
  docStatuses = {},
  documents = [],
}) => {
  // Filter items matching current personnel type or 'both'
  const filteredItems = items.filter(
    (item) => item.requiredFor === 'both' || item.requiredFor === personnelType
  );

  const completedCount = filteredItems.filter((i) => i.completed).length;

  const relevantDocs = documents.filter(
    (d) => d.requiredFor === 'both' || d.requiredFor === personnelType
  );
  const preparedOrNotNeededCount = relevantDocs.filter((d) => {
    const s = docStatuses[d.id];
    return s === 'prepared' || s === 'not_needed';
  }).length;
  const isAllDocsDone = relevantDocs.length > 0 && preparedOrNotNeededCount === relevantDocs.length;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card - Bright, Inspiring Blue-Sky-Indigo Gradient */}
      <div className="bg-gradient-to-r from-blue-700 via-sky-700 to-indigo-800 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-blue-500/40">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4 stroke-[2.5]" />
            <span>三義鄉公所人事室 · 溫馨引導</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            歡迎加入三義鄉公所服務團隊
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed mb-4">
            為協助您順利完成各項到職法定義務與行政手續，本系統彙整了繳交證件、報告表單、三義農會開戶、玉山國旅卡、MyData具結及內部磁碟【Z:\人事】等指引。請依下方檢核項目逐一核對辦理。
          </p>
          <div className="flex items-center gap-4 text-xs text-blue-200 flex-wrap">
            <span className="bg-blue-800/80 px-2.5 py-1 rounded-md border border-blue-600/60">
              身分類別：
              <strong className="text-amber-300 font-bold ml-1">
                {personnelType === 'new_exam' ? '考試分發初任人員' : '他機關調任人員'}
              </strong>
            </span>
            <span>·</span>
            <span className="bg-blue-800/80 px-2.5 py-1 rounded-md border border-blue-600/60">
              已完成：
              <strong className="text-white font-mono font-bold tabular-nums ml-1">
                {completedCount} / {filteredItems.length}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-stone-500" />
            <h2 className="text-base font-semibold text-stone-900">新進人員到職待辦檢核清單</h2>
          </div>
          <span className="text-xs text-stone-500">點擊勾選即可即時記錄個人完成狀態（證件備妥與填報具備自動連動）</span>
        </div>

        <div className="divide-y divide-stone-100">
          {filteredItems.map((item, index) => {
            const isDocItem = item.id === 'chk-doc-1';

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 transition-colors flex items-start gap-4 ${
                  item.completed ? 'bg-stone-50/70' : 'hover:bg-stone-50/40'
                }`}
              >
                {/* Interactive Checkbox */}
                <button
                  onClick={() => onToggleItem(item.id)}
                  className="mt-0.5 text-stone-400 hover:text-stone-600 transition-colors focus:outline-none"
                  aria-label={item.completed ? '取消勾選' : '標記完成'}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300 hover:text-stone-400" />
                  )}
                </button>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-stone-400">
                      0{index + 1}.
                    </span>
                    <span
                      onClick={() => onToggleItem(item.id)}
                      className={`text-sm sm:text-base font-medium cursor-pointer ${
                        item.completed ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="text-xs text-stone-500">·</span>
                    <span className="text-xs text-stone-500">{item.category}</span>
                    <span className="text-xs text-stone-500">·</span>
                    <span
                      className={`text-xs font-semibold ${
                        item.priority === '必辦'
                          ? 'text-rose-700'
                          : item.priority === '重要'
                          ? 'text-amber-700'
                          : 'text-stone-600'
                      }`}
                    >
                      {item.priority}
                    </span>

                    {/* Auto-sync indicator for Document requirements */}
                    {isDocItem && (
                      isAllDocsDone ? (
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>證件已全數備齊或免附（自動打勾）</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-500 font-mono bg-stone-100 px-2 py-0.5 rounded">
                          已完成：{preparedOrNotNeededCount}/{relevantDocs.length}
                        </span>
                      )
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-2">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => onNavigateTab(item.targetTab)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-xs rounded-lg border border-amber-700 shadow-xs hover:shadow transition-all cursor-pointer group"
                    >
                      <span>前往詳細指引專頁</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Cards Grid - Color Coded for Each Domain */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigateTab('banking')}
          className="bg-white border-2 border-purple-200 rounded-xl p-5 hover:border-purple-400 hover:bg-purple-50/30 transition-all cursor-pointer shadow-xs group"
        >
          <div className="text-xs font-bold text-purple-700 mb-1 flex items-center justify-between">
            <span>第一天重要金融任務</span>
            <span className="text-purple-400 group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <h3 className="text-base font-bold text-purple-950 mb-2">三義鄉農會開戶指引</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            請攜帶身分證、健保卡及派令或報到單，攜帶至少 1,000 元至鄉農會開立薪資專戶。
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('mydata')}
          className="bg-white border-2 border-teal-200 rounded-xl p-5 hover:border-teal-400 hover:bg-teal-50/30 transition-all cursor-pointer shadow-xs group"
        >
          <div className="text-xs font-bold text-teal-700 mb-1 flex items-center justify-between">
            <span>法定申報與誓言</span>
            <span className="text-teal-400 group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <h3 className="text-base font-bold text-teal-950 mb-2">MyData 4大表件線上回復</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            包括擬任具結書、服務誓言（初任）、兼職調查表及未設籍大陸具結書線上查核。
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('zdrive')}
          className="bg-white border-2 border-rose-200 rounded-xl p-5 hover:border-rose-400 hover:bg-rose-50/30 transition-all cursor-pointer shadow-xs group"
        >
          <div className="text-xs font-bold text-rose-700 mb-1 flex items-center justify-between">
            <span>公所內部資源</span>
            <span className="text-rose-400 group-hover:translate-x-1 transition-transform">→</span>
          </div>
          <h3 className="text-base font-bold text-rose-950 mb-2">網路磁碟【Z:\人事】</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            公務電腦掛載 Z 槽即可存取差勤管理規則、請假標準作業、公差旅費及各類常用申請單。
          </p>
        </div>
      </div>
    </div>
  );
};
