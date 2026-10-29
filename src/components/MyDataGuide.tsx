import React from 'react';
import { MyDataFormItem, PersonnelType } from '../types';
import { KeySquare, CheckCircle2, Circle, AlertCircle, ExternalLink, Calendar, ShieldCheck, Award, ArrowLeft } from 'lucide-react';

interface MyDataGuideProps {
  forms: MyDataFormItem[];
  personnelType: PersonnelType;
  onToggleSubmission: (id: string) => void;
  onBack?: () => void;
}

export const MyDataGuide: React.FC<MyDataGuideProps> = ({
  forms,
  personnelType,
  onToggleSubmission,
  onBack,
}) => {
  // Filter forms according to personnel type
  const relevantForms = forms.filter(
    (f) => f.targetRole === 'both' || f.targetRole === personnelType
  );

  const completedCount = relevantForms.filter((f) => f.isSubmitted).length;

  return (
    <div className="space-y-6">
      {/* Title Banner - Teal Theme */}
      <div className="bg-gradient-to-r from-teal-50 via-cyan-50/40 to-white border-2 border-teal-300 rounded-2xl p-5 sm:p-6 shadow-xs">
        {onBack && (
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-teal-100">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-lg border-2 border-blue-900 shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5] transition-transform group-hover:-translate-x-0.5" />
              <span>回上頁（報到檢核清單）</span>
            </button>
            <span className="text-xs font-medium text-teal-800 bg-teal-100/80 px-2.5 py-1 rounded-md border border-teal-200">
              人事室分機：19(主任)、61(協辦人員)
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold mb-1">
              <KeySquare className="w-4 h-4 text-teal-600" />
              <span>人事行政總處 · 法定線上申報</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              公務人員個人資料服務網 (MyData) 線上填寫指引
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              請使用<strong>自然人憑證</strong>或<strong>健保卡+密碼</strong>登入 eCPA 人事服務網之 MyData 個人資料系統，依序填報完成並點選回復。
            </p>
          </div>

          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 px-3.5 py-2 rounded-lg text-xs">
            <span className="text-teal-700 font-semibold">線上填寫回復進度：</span>
            <span className="font-mono tabular-nums font-bold text-teal-900 text-sm">
              {completedCount} / {relevantForms.length}
            </span>
          </div>
        </div>

        {/* Portal Entry Link Card */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200/80">
          <div className="text-xs text-stone-600">
            <div className="font-semibold text-stone-800 mb-0.5">
              eCPA 人事服務網（MyData 線上填寫平台）
            </div>
            <div>路徑：登入 eCPA → 應用系統 → B.公務人員個人資料服務網 (MyData) → 調查表件專區</div>
          </div>

          <a
            href="https://ecpa.dgpa.gov.tw"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>前往 eCPA 登入系統</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 4 Core Forms List */}
      <div className="space-y-4">
        {relevantForms.map((item, index) => {
          return (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl p-6 transition-all shadow-xs ${
                item.isSubmitted
                  ? 'border-emerald-300 bg-emerald-50/15'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => onToggleSubmission(item.id)}
                    className="mt-1 text-stone-400 hover:text-stone-600 transition-colors focus:outline-none"
                    aria-label="切換完成回復狀態"
                  >
                    {item.isSubmitted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-50" />
                    ) : (
                      <Circle className="w-6 h-6 text-stone-300 hover:text-stone-400" />
                    )}
                  </button>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        onClick={() => onToggleSubmission(item.id)}
                        className={`text-base font-bold cursor-pointer ${
                          item.isSubmitted ? 'text-emerald-950' : 'text-stone-900'
                        }`}
                      >
                        {item.title}
                      </h3>

                      {item.targetRole === 'new_exam' && (
                        <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium">
                          初任人員專用
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="text-xs text-stone-500 font-mono">
                      法規依據：{item.legalBasis}
                    </div>

                    {/* Key Checklist Points */}
                    <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 mt-3 space-y-1.5 text-xs text-stone-600">
                      <div className="font-semibold text-stone-800 mb-1">填報重點注意事項：</div>
                      {item.keyPoints.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Toggle Box */}
                <div className="flex flex-col items-end gap-2 shrink-0 self-end md:self-start">
                  <button
                    onClick={() => onToggleSubmission(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                      item.isSubmitted
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    <span>{item.isSubmitted ? '已完成線上回復' : '尚未回復（點此登記）'}</span>
                  </button>

                  {item.isSubmitted && item.submissionDate && (
                    <div className="flex items-center gap-1 text-[11px] text-stone-400 font-mono">
                      <Calendar className="w-3 h-3" />
                      <span>登載日期：{item.submissionDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statutory Notice Card */}
      <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-5 text-xs text-teal-900 space-y-2">
        <div className="font-bold text-teal-950 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-teal-700" />
          <span>公所人事室特別提醒</span>
        </div>
        <p className="leading-relaxed text-teal-800">
          依公務人員任用及服務法規，上述具結書均具備正式法律責任。若有經營商業、設立商號、或擔任公司董監事等情形，應於到職日前依法完成解任或股份轉讓；未在大陸設籍之具結送出後，公所人事室將依法列冊函報內政部移民署實施身分勾稽，請同仁務必誠實正確申報。
        </p>
      </div>

      {/* Bottom Back Button */}
      {onBack && (
        <div className="flex justify-center pt-2 pb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl border-2 border-blue-900 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>回上頁（返回新進人員報到清單）</span>
          </button>
        </div>
      )}
    </div>
  );
};
