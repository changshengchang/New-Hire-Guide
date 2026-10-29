import React, { useState, useRef } from 'react';
import { ReportForm, ViewMode, PersonnelType } from '../types';
import { Download, Upload, FileText, Trash2, Plus, CheckCircle, FileCheck, Search, Filter, ArrowLeft, Paperclip } from 'lucide-react';

interface FormsManagerProps {
  forms: ReportForm[];
  viewMode: ViewMode;
  personnelType: PersonnelType;
  onAddForm: (form: Omit<ReportForm, 'id' | 'downloadCount' | 'uploadDate'>) => void;
  onDeleteForm: (id: string) => void;
  onIncrementDownload: (id: string) => void;
  onUpdateFormFile?: (id: string, fileData: { fileName: string; fileSize: string; fileUrl: string }) => void;
  onBack?: () => void;
}

export const FormsManager: React.FC<FormsManagerProps> = ({
  forms,
  viewMode,
  personnelType,
  onAddForm,
  onDeleteForm,
  onIncrementDownload,
  onUpdateFormFile,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Hidden per-item file input ref
  const perFormFileInputRef = useRef<HTMLInputElement>(null);
  const [targetFormIdToAttach, setTargetFormIdToAttach] = useState<string | null>(null);

  // Upload New Form Modal State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ReportForm['category']>('人事基本資料');
  const [newDescription, setNewDescription] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileSize, setNewFileSize] = useState('50.0 KB');
  const [newRequiredRole, setNewRequiredRole] = useState<ReportForm['requiredRole']>('both');

  const categories = ['all', '人事基本資料', '總務與福利'];

  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
    const matchesRole =
      form.requiredRole === 'both' || form.requiredRole === personnelType;
    return matchesSearch && matchesCategory && matchesRole;
  });

  // Handler for uploading/replacing attachment for an existing individual form
  const handleTriggerPerFormUpload = (formId: string) => {
    setTargetFormIdToAttach(formId);
    perFormFileInputRef.current?.click();
  };

  const handlePerFormFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetFormIdToAttach) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdateFormFile?.(targetFormIdToAttach, {
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(1)} KB`,
          fileUrl: reader.result as string,
        });
        setTargetFormIdToAttach(null);
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  // Handle actual file upload from device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFileName(file.name);
      setNewFileSize(`${(file.size / 1024).toFixed(1)} KB`);
      const reader = new FileReader();
      reader.onload = () => {
        setNewFileUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddForm({
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || '由三義鄉公所人事室提供之最新公務標準表單。',
      fileName: newFileName.trim() || `${newTitle}.pdf`,
      fileSize: newFileSize,
      fileUrl: newFileUrl || undefined,
      requiredRole: newRequiredRole,
    });

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewFileName('');
    setNewFileUrl('');
    setShowUploadModal(false);
  };

  // Trigger simulated/real file download
  const handleDownload = (form: ReportForm) => {
    onIncrementDownload(form.id);

    // If actual uploaded data URL exists, download it
    if (form.fileUrl) {
      const a = document.createElement('a');
      a.href = form.fileUrl;
      a.download = form.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create a friendly text template representation
      const content = `【苗栗縣三義鄉公所】\n表單名稱：${form.title}\n文檔編號：${form.id}\n適用類別：${form.category}\n\n說明：\n${form.description}\n\n請依公所人事室規定填妥後，簽名並送交本所五樓人事室審查備查。\n三義鄉公所人事室 敬啟\n服務電話：(037) 872-801 · 人事室分機：19(主任)、61(協辦人員)\n公用磁碟路徑：Z:\\人事\\各類表單`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = form.fileName.endsWith('.txt') ? form.fileName : `${form.fileName}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for per-form attachment upload */}
      <input
        type="file"
        ref={perFormFileInputRef}
        onChange={handlePerFormFileChange}
        className="hidden"
      />

      {/* Header Banner - Sky Blue Theme */}
      <div className="bg-gradient-to-r from-sky-50 via-blue-50/40 to-white border-2 border-sky-300 rounded-2xl p-5 sm:p-6 shadow-xs">
        {onBack && (
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-sky-100">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-lg border-2 border-blue-900 shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5] transition-transform group-hover:-translate-x-0.5" />
              <span>回上頁（報到檢核清單）</span>
            </button>
            <span className="text-xs font-medium text-sky-800 bg-sky-100/80 px-2.5 py-1 rounded-md border border-sky-200">
              人事室分機：19(主任)、61(協辦人員)
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-700 text-xs font-bold mb-1">
              <FileCheck className="w-4 h-4 text-sky-600" />
              <span>人事表單中心 · 範本與申請單</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">報告表單填寫與下載專區</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              人事室已將新進同仁必填之履歷建檔表、公務員到職填寫各類具結書及玉山國旅卡申請書等表件上架供下載。人事管理同仁於後台可為各個表單隨時<strong>上傳更換附件</strong>。
            </p>
          </div>

          {viewMode === 'admin' && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto border border-sky-700"
            >
              <Plus className="w-4 h-4" />
              <span>人事人員上傳新表單</span>
            </button>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 pt-4 border-t border-sky-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors border ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                    : 'text-slate-600 bg-white border-slate-200 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                {cat === 'all' ? '全部表單' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋表單名稱或檔名..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Forms Table / Grid */}
      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-3 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between text-xs text-sky-900 font-semibold">
          <span>共 {filteredForms.length} 份表單供下載</span>
          <span>點選「下載表單」即可存至您的電腦填寫</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredForms.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              查無符合條件的表單，請調整篩選關鍵字。
            </div>
          ) : (
            filteredForms.map((form) => (
              <div
                key={form.id}
                className="p-5 hover:bg-sky-50/20 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0 text-sky-700 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {form.title}
                      </h3>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                        {form.category}
                      </span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-500 font-mono tabular-nums">
                        {form.fileSize}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                      {form.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 text-xs text-sky-900 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-md font-medium">
                        <Paperclip className="w-3 h-3 text-sky-600 shrink-0" />
                        <span>附加檔案：<strong className="font-mono">{form.fileName}</strong></span>
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        更新：{form.uploadDate} · 下載次數：{form.downloadCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center flex-wrap gap-2 shrink-0 self-end md:self-center">
                  {/* Download Form Button */}
                  <button
                    onClick={() => handleDownload(form)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-lg transition-colors shadow-xs whitespace-nowrap cursor-pointer border border-sky-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>下載表單</span>
                  </button>

                  {/* Per-Form Upload Attachment Button for HR Admins */}
                  {viewMode === 'admin' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleTriggerPerFormUpload(form.id)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg transition-colors border-2 border-amber-600 shadow-2xs whitespace-nowrap cursor-pointer"
                        title="為此表單上傳或更換附件檔案"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>上傳附件</span>
                      </button>

                      <button
                        onClick={() => onDeleteForm(form.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="刪除此表單 (人事人員)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Admin Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">人事人員 · 上傳新進人員表單</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitUpload} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  表單名稱 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="例如：員工身心健康問卷調查表"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    所屬類別
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ReportForm['category'])}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
                  >
                    <option value="人事基本資料">人事基本資料</option>
                    <option value="差勤與誓言">差勤與誓言</option>
                    <option value="資訊與帳號">資訊與帳號</option>
                    <option value="總務與福利">總務與福利</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    適用對象
                  </label>
                  <select
                    value={newRequiredRole}
                    onChange={(e) =>
                      setNewRequiredRole(e.target.value as ReportForm['requiredRole'])
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
                  >
                    <option value="both">初任與調任人員通用</option>
                    <option value="new_exam">僅初任人員適用</option>
                    <option value="transfer">僅調任人員適用</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  填表說明與提醒
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="請在此輸入新進人員填寫本表的注意事項與繳交期限..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  選擇本機檔案 (.docx, .pdf, .odt, .xlsx)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-800 hover:file:bg-stone-200"
                />
                {newFileName && (
                  <p className="text-xs text-emerald-700 mt-1">
                    已選定檔案：{newFileName} ({newFileSize})
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow-xs"
                >
                  確認上傳發布
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
