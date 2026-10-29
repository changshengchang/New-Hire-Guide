import React, { useState } from 'react';
import { HardDrive, Copy, Check, FolderTree, FileText, ExternalLink, HelpCircle, Phone, Monitor, Shield, ArrowLeft } from 'lucide-react';

interface InternalNetworkGuideProps {
  onBack?: () => void;
}

export const InternalNetworkGuide: React.FC<InternalNetworkGuideProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);

  const drivePath = 'Z:\\人事';

  const handleCopyPath = () => {
    navigator.clipboard.writeText(drivePath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const folderStructure = [
    {
      name: '01_差勤管理與請假作業',
      desc: '包含本所差勤出退勤管理要點、WebITR 簽到退指引、加班費報支與補休規定期限、公差派車規定。',
      files: ['三義鄉公所公務人員請假要點.pdf', 'WebITR差勤系統新進同仁使用懶人包.pdf', '加班與補休申請注意事項.docx'],
    },
    {
      name: '02_各類常用人事申請表單',
      desc: '公假派免單、各類簽陳報告標準範本、在職證明書申請書、結婚生育與喪葬生活津貼補助申請表。',
      files: ['新進人員職章請刻表.docx', '公教各項生活津貼申請書.pdf', '公務人員留職停薪申請單.odt'],
    },
    {
      name: '03_公務法規與各項規定',
      desc: '公務員服務法（兼職規範與旋轉門條款）、公務人員保障法、任用法、考績法及公職人員利益衝突迴避法。',
      files: ['公務員服務法最新修正規範重點.pdf', '公職人員利益衝突迴避法宣導手冊.pdf'],
    },
    {
      name: '04_文康休閒與員工協助方案(EAP)',
      desc: '公所年度文康旅遊活動、客家日特約優惠、心理諮商與法律諮詢服務資源（EAP協談專線）。',
      files: ['三義鄉公所員工協助方案(EAP)實施計畫.pdf', '苗栗縣政府暨所屬機關員工特約商店手冊.pdf'],
    },
    {
      name: '05_保險退休與待遇撫卹專區',
      desc: '公教人員保險給付權益、全民健康保險投保手冊、個人專戶退撫新制儲金說明。',
      files: ['公教人員退撫儲金新制宣導手冊.pdf', '全民健康保險加退保及眷屬隨同投保須知.pdf'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Card - Rose Theme */}
      <div className="bg-gradient-to-r from-rose-50 via-orange-50/30 to-white border-2 border-rose-300 rounded-2xl p-5 sm:p-6 shadow-xs">
        {onBack && (
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-rose-100">
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-700 text-xs font-bold mb-1">
              <HardDrive className="w-4 h-4 text-rose-600" />
              <span>機關內部區域網路 · 資源共享磁碟</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              本所人事相關法令及表件位置：【Z:\人事】
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              公所內部公務電腦均已預設掛載或可隨時連線至 <strong>Z 槽人事專區</strong>，隨時查閱最新差勤規範與下載各類表單。
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="bg-rose-700 text-white px-4 py-2 rounded-xl flex items-center gap-3 font-mono text-sm font-bold shadow-xs border border-rose-800">
              <HardDrive className="w-4 h-4 text-rose-200" />
              <span>{drivePath}</span>
              <button
                onClick={handleCopyPath}
                className="p-1 hover:bg-rose-800 rounded text-rose-200 hover:text-white transition-colors cursor-pointer"
                title="複製磁碟路徑"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Tutorial Card */}
      <div className="bg-gradient-to-br from-stone-50 to-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
          <Monitor className="w-4 h-4 text-stone-700" />
          <span>公所辦公室電腦連線至【Z:\人事】操作教學</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white border border-stone-200/80 rounded-xl p-4 space-y-2">
            <div className="font-mono font-bold text-amber-800 text-sm">步驟一：檢查我的電腦</div>
            <p className="text-stone-600 leading-relaxed">
              雙擊開啟桌面「此電腦」（檔案總管），在「網路位置」區塊尋找是否有 <strong>人事 (Z:)</strong>。多數公務電腦已由資訊室預先建立捷徑。
            </p>
          </div>

          <div className="bg-white border border-stone-200/80 rounded-xl p-4 space-y-2">
            <div className="font-mono font-bold text-amber-800 text-sm">步驟二：手動連線網路磁碟</div>
            <p className="text-stone-600 leading-relaxed">
              若無 Z 槽，在檔案總管上方點選「...」或「電腦」→「<strong>連線網路磁碟機</strong>」，磁碟機代號挑選 <strong>Z:</strong>，資料夾輸入內網檔案伺服器位置。
            </p>
          </div>

          <div className="bg-white border border-stone-200/80 rounded-xl p-4 space-y-2">
            <div className="font-mono font-bold text-amber-800 text-sm">步驟三：若需權限洽人事室</div>
            <p className="text-stone-600 leading-relaxed">
              若跳出帳號密碼登入視窗，請以配發之公務電腦網域帳號登入，或撥打人事室分機 <strong>19(主任)、61(協辦人員)</strong> 協助開啟讀取權限。
            </p>
          </div>
        </div>
      </div>

      {/* Directory Structure Breakdown */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-stone-600" />
            <h3 className="text-base font-bold text-stone-900">【Z:\人事】內部資料夾目錄架構</h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">三義鄉公所人事室維護</span>
        </div>

        <div className="space-y-4">
          {folderStructure.map((folder, index) => (
            <div
              key={index}
              className="bg-stone-50/70 border border-stone-200/80 rounded-xl p-4 hover:border-stone-300 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <h4 className="text-sm font-bold text-stone-900 font-mono">
                  {drivePath}\{folder.name}
                </h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed mb-3">
                {folder.desc}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {folder.files.map((file, fIdx) => (
                  <span
                    key={fIdx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 text-stone-700 text-xs rounded-md font-mono"
                  >
                    <FileText className="w-3 h-3 text-stone-400" />
                    <span>{file}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Personnel Office Footer Box */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            人事法規與表單諮詢窗口
          </div>
          <div className="text-sm font-medium text-white">
            如有差勤規定、法規疑義或找不到所需表單，歡迎隨時向人事室洽詢！
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-700 shrink-0">
          <Phone className="w-3.5 h-3.5 text-amber-400" />
          <span>公所代表號：(037) 872-801 · 人事室分機：19(主任)、61(協辦人員)</span>
        </div>
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
