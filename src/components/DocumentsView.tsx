import React from 'react';
import { DocumentItem, PersonnelType, DocStatus } from '../types';
import { ShieldCheck, CheckCircle2, Circle, MinusCircle, AlertCircle, Info, Award, ArrowLeftRight, Check, X, ArrowLeft } from 'lucide-react';

interface DocumentsViewProps {
  documents: DocumentItem[];
  personnelType: PersonnelType;
  setPersonnelType: (type: PersonnelType) => void;
  docStatuses: Record<string, DocStatus>;
  onChangeDocStatus: (id: string, status: DocStatus) => void;
  onBack?: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  personnelType,
  setPersonnelType,
  docStatuses,
  onChangeDocStatus,
  onBack,
}) => {
  const isExam = personnelType === 'new_exam';

  const relevantDocs = documents.filter(
    (doc) => doc.requiredFor === 'both' || doc.requiredFor === personnelType
  );

  const preparedCount = relevantDocs.filter((d) => docStatuses[d.id] === 'prepared').length;
  const notNeededCount = relevantDocs.filter((d) => docStatuses[d.id] === 'not_needed').length;
  const pendingCount = relevantDocs.length - preparedCount - notNeededCount;

  return (
    <div className="space-y-6">
      {/* Title & Scope Header - Emerald Theme */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white border-2 border-emerald-300 rounded-2xl p-5 sm:p-6 shadow-xs">
        {/* Back Button Row */}
        {onBack && (
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-emerald-100">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-lg border-2 border-blue-900 shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5] transition-transform group-hover:-translate-x-0.5" />
              <span>回上頁（報到檢核清單）</span>
            </button>

            <span className="text-xs font-medium text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md border border-emerald-200">
              人事室分機：19(主任)、61(協辦人員)
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>人事法規 · 證件查驗規範</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">新進同仁到職應繳證件清單</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              請於報到首日攜帶下列文件正本（驗畢發還）與清楚影本各 1 份至本所五樓人事室審驗。若部分項目無相關資歷或免繳，可標記為「本項無需要」。
            </p>
          </div>

          {/* Status Counter Chips */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-600 border border-emerald-700 text-white font-bold shadow-xs">
              已備齊：<strong className="font-mono tabular-nums">{preparedCount}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-600 border border-slate-700 text-white font-bold shadow-xs">
              本項無需要：<strong className="font-mono tabular-nums">{notNeededCount}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-500 border border-amber-600 text-stone-950 font-bold shadow-xs">
              待準備：<strong className="font-mono tabular-nums">{pendingCount}</strong>
            </span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-stone-100 flex-wrap">
          <button
            onClick={() => setPersonnelType('new_exam')}
            className={`flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors cursor-pointer ${
              isExam
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>考試分發初任人員必備 ({documents.filter((d) => d.requiredFor === 'both' || d.requiredFor === 'new_exam').length} 項)</span>
          </button>

          <button
            onClick={() => setPersonnelType('transfer')}
            className={`flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors cursor-pointer ${
              !isExam
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
            <span>調任人員必備 ({documents.filter((d) => d.requiredFor === 'both' || d.requiredFor === 'transfer').length} 項)</span>
          </button>
        </div>
      </div>

      {/* Primary Document Cards */}
      <div className="grid grid-cols-1 gap-4">
        {relevantDocs.map((doc, idx) => {
          const currentStatus: DocStatus = docStatuses[doc.id] || 'pending';
          const isPrepared = currentStatus === 'prepared';
          const isNotNeeded = currentStatus === 'not_needed';

          return (
            <div
              key={doc.id}
              className={`bg-white border-2 rounded-2xl p-5 sm:p-6 transition-all shadow-xs ${
                isPrepared
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : isNotNeeded
                  ? 'border-stone-200 bg-stone-50/60 opacity-80'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {/* Status Indicator Icon */}
                  <div className="mt-1 shrink-0">
                    {isPrepared ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-50" />
                    ) : isNotNeeded ? (
                      <MinusCircle className="w-6 h-6 text-stone-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-amber-500" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-mono text-sm sm:text-base font-bold text-stone-400">
                        0{idx + 1}.
                      </span>
                      <h3
                        className={`text-lg sm:text-xl font-bold ${
                          isPrepared
                            ? 'text-emerald-950'
                            : isNotNeeded
                            ? 'text-stone-500 line-through'
                            : 'text-stone-900'
                        }`}
                      >
                        {doc.name}
                      </h3>
                      <span className="text-sm text-stone-300">·</span>
                      <span className="text-xs sm:text-sm text-stone-600 font-medium">
                        核發單位：{doc.issuingUnit}
                      </span>
                    </div>

                    <p
                      className={`text-base sm:text-lg leading-relaxed mb-3.5 ${
                        isNotNeeded ? 'text-stone-400' : 'text-stone-800'
                      }`}
                    >
                      {doc.description}
                    </p>

                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-sm text-stone-700 flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900 font-bold">人事室提醒：</strong>
                        <span className="leading-relaxed">{doc.notes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3-State Toggle Segmented Control (已備齊 / 待準備 / 本項無需要) */}
                <div className="shrink-0 flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200 self-end md:self-start">
                  <button
                    onClick={() => onChangeDocStatus(doc.id, 'prepared')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-all cursor-pointer ${
                      isPrepared
                        ? 'bg-emerald-600 text-white shadow-xs font-bold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>已備齊</span>
                  </button>

                  <button
                    onClick={() => onChangeDocStatus(doc.id, 'pending')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-all cursor-pointer ${
                      currentStatus === 'pending'
                        ? 'bg-white text-stone-900 shadow-xs font-bold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    <span>待準備</span>
                  </button>

                  <button
                    onClick={() => onChangeDocStatus(doc.id, 'not_needed')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-all cursor-pointer ${
                      isNotNeeded
                        ? 'bg-stone-700 text-white shadow-xs font-bold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>本項無需要</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Public Sector Tips Box - Enlarged for Superior Readability */}
      <div className="bg-gradient-to-br from-amber-50/90 via-white to-stone-50 border-2 border-amber-300 rounded-2xl p-6 sm:p-7 shadow-xs">
        <h4 className="text-base sm:text-lg font-bold text-stone-950 flex items-center gap-2 mb-3.5">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>公所人事室貼心查驗備註</span>
        </h4>
        <ul className="space-y-3 text-sm sm:text-base leading-relaxed text-stone-800">
          <li className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
            <div>
              <strong className="text-stone-950 font-bold">本項無需要判定：</strong>
              <span>例如無曾任公家機關約聘僱年資者、或無其他專長語言證照之初任同仁，可將該項目標記為<strong className="text-stone-950 font-bold">「本項無需要」</strong>，系統將不列為缺漏文件。</span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
            <div>
              <strong className="text-stone-950 font-bold">戶籍謄本電子申辦：</strong>
              <span>新進同仁若無現成戶口名簿，可使用自然人憑證登入「內政部戶政司全球資訊網」，免費線上申請「現戶全戶電子戶籍謄本」（具電子簽章有效防偽）。</span>
            </div>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
            <div>
              <strong className="text-stone-950 font-bold">調任人員銜補單：</strong>
              <span>原機關人事室所開立之銜補單請保持密封完整交予本所人事室，裡面包含公保退撫扣繳基數、出勤及特休日數，若遺漏將影響新月份薪資撥付與休假權利。</span>
            </div>
          </li>
        </ul>
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
