import React, { useState } from 'react';
import { HardDrive, Copy, Check, Phone, ArrowLeft } from 'lucide-react';

interface InternalNetworkGuideProps {
  onBack?: () => void;
}

export const InternalNetworkGuide: React.FC<InternalNetworkGuideProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);

  const drivePath = 'Z:\\1.人事室';

  const handleCopyPath = () => {
    navigator.clipboard.writeText(drivePath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Path Card - Rose Theme */}
      <div className="bg-gradient-to-r from-rose-50 via-orange-50/30 to-white border-2 border-rose-300 rounded-2xl p-5 sm:p-7 shadow-xs">
        {onBack && (
          <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-rose-100">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-lg border-2 border-blue-900 shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5] transition-transform group-hover:-translate-x-0.5" />
              <span>回上頁（報到檢核清單）</span>
            </button>
            <span className="text-xs font-medium text-rose-800 bg-rose-100/80 px-2.5 py-1 rounded-md border border-rose-200">
              人事室分機：19(主任)、61(協辦人員)
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
              <HardDrive className="w-4 h-4 text-rose-600" />
              <span>機關內部區域網路 · 資源共享磁碟</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              本所人事相關法令及表件位置：【Z:\1.人事室】
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              公所內部公務電腦均已預設掛載或可連線至 <strong>{drivePath}</strong>，同仁可在此隨時查閱各項最新人事相關法令、差勤要點及各類公務表單檔案。
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <div className="bg-rose-700 text-white px-5 py-3 rounded-xl flex items-center gap-3 font-mono text-sm sm:text-base font-bold shadow-xs border-2 border-rose-900">
              <HardDrive className="w-5 h-5 text-rose-200" />
              <span>{drivePath}</span>
              <button
                type="button"
                onClick={handleCopyPath}
                className="p-1.5 hover:bg-rose-800 rounded-lg text-rose-200 hover:text-white transition-colors cursor-pointer ml-1"
                title="複製磁碟路徑"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Personnel Office Footer Box */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-xs">
        <div>
          <div className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            人事法規與表單諮詢窗口
          </div>
          <div className="text-sm font-medium text-white leading-relaxed">
            如對各項人事法規有任何疑問，或在尋找相關表件時需要協助，歡迎隨時洽詢人事室同仁。
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-200 bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 shrink-0">
          <Phone className="w-4 h-4 text-amber-400" />
          <span>公所代表號：(037) 872-801 · 人事室分機：19(主任)、61(協辦人員)</span>
        </div>
      </div>

      {/* Bottom Back Button */}
      {onBack && (
        <div className="flex justify-center pt-2 pb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl border-2 border-blue-900 shadow-md hover:shadow-lg transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5] transition-transform group-hover:-translate-x-0.5" />
            <span>回上頁（報到檢核清單）</span>
          </button>
        </div>
      )}
    </div>
  );
};
