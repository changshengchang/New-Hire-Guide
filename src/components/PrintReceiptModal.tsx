import React, { useState, useEffect } from 'react';
import { ChecklistItem, DocumentItem, MyDataFormItem, PersonnelType, DocStatus, EmployeeProfile, SERVICE_UNITS } from '../types';
import { Printer, X, CheckSquare, Square, MinusSquare } from 'lucide-react';

interface PrintReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  personnelType: PersonnelType;
  activeEmployee: EmployeeProfile;
  checklist: ChecklistItem[];
  documents: DocumentItem[];
  docStatuses: Record<string, DocStatus>;
  myDataForms: MyDataFormItem[];
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({
  isOpen,
  onClose,
  personnelType,
  activeEmployee,
  checklist,
  documents,
  docStatuses,
  myDataForms,
}) => {
  const [empId, setEmpId] = useState(activeEmployee?.employeeId || '');
  const [userName, setUserName] = useState(activeEmployee?.name || '');
  const [department, setDepartment] = useState(activeEmployee?.department || '民政課');
  const [reportDate, setReportDate] = useState(() => activeEmployee?.onboardingDate || new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (activeEmployee) {
      setEmpId(activeEmployee.employeeId);
      setUserName(activeEmployee.name);
      setDepartment(activeEmployee.department);
      if (activeEmployee.onboardingDate) {
        setReportDate(activeEmployee.onboardingDate);
      }
    }
  }, [activeEmployee]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const relevantDocs = documents.filter(
    (d) => d.requiredFor === 'both' || d.requiredFor === personnelType
  );

  const relevantMyData = myDataForms.filter(
    (f) => f.targetRole === 'both' || f.targetRole === personnelType
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8">
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-stone-700" />
            <h3 className="text-lg font-bold text-stone-900">
              列印新進人員報到核對確認表
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>列印 / 另存為 PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 rounded-lg text-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Input Customization (Hidden in print) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-4 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs print:hidden">
          <div>
            <label className="block text-stone-600 font-medium mb-1">員工代號：</label>
            <input
              type="text"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              placeholder="員工代號"
              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-md font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1">同仁姓名：</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="請輸入姓名"
              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1">服務單位：</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-md"
            >
              {SERVICE_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-stone-600 font-medium mb-1">報到到職日期：</label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-md font-mono"
            />
          </div>
        </div>

        {/* Printable Official Document Content */}
        <div className="printable-content space-y-6 pt-2 font-sans text-stone-900">
          <div className="text-center border-b-2 border-stone-900 pb-4">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider">
              苗栗縣三義鄉公所 新進人員報到自我檢核確認表
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              人事室承辦電話：(037) 872-801 · 人事室分機：19(主任)、61(協辦人員) · 內部網路人事專區：Z:\人事
            </p>
          </div>

          {/* Metadata Grid (Now includes Employee ID and 服務單位) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs border border-stone-300 p-3 rounded-lg bg-stone-50/50">
            <div>
              <span className="text-stone-500">員工代號：</span>
              <strong className="text-stone-900 font-mono ml-1">{empId || '（未編配）'}</strong>
            </div>
            <div>
              <span className="text-stone-500">同仁姓名：</span>
              <strong className="text-stone-900 ml-1">{userName || '（待填）'}</strong>
            </div>
            <div>
              <span className="text-stone-500">服務單位：</span>
              <strong className="text-stone-900 ml-1">{department}</strong>
            </div>
            <div>
              <span className="text-stone-500">身分類別：</span>
              <strong className="text-stone-900 ml-1">
                {personnelType === 'new_exam' ? '考試分發初任' : '他機關調任'}
              </strong>
            </div>
            <div>
              <span className="text-stone-500">到職日期：</span>
              <strong className="text-stone-900 font-mono ml-1">{reportDate}</strong>
            </div>
          </div>

          {/* Section 1: Required Documents Checklist (with 3-states) */}
          <div>
            <h4 className="text-sm font-bold border-b border-stone-300 pb-1 mb-2 text-stone-900">
              一、應繳證件查驗核對（含本項無需要審核）
            </h4>
            <div className="space-y-1.5 text-xs">
              {relevantDocs.map((doc) => {
                const status = docStatuses[doc.id] || 'pending';
                const isPrepared = status === 'prepared';
                const isNotNeeded = status === 'not_needed';

                return (
                  <div key={doc.id} className="flex items-start gap-2">
                    {isPrepared ? (
                      <CheckSquare className="w-4 h-4 text-emerald-800 mt-0.5 shrink-0" />
                    ) : isNotNeeded ? (
                      <MinusSquare className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <span className={`font-semibold ${isNotNeeded ? 'text-stone-400 line-through' : ''}`}>
                        {doc.name}
                      </span>
                      <span className="text-stone-500 ml-1">（{doc.description}）</span>
                      <span className="ml-2 font-mono font-medium text-[11px]">
                        {isPrepared ? '【✓ 已備齊】' : isNotNeeded ? '【— 本項無需要（免附）】' : '【○ 待準備】'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Banking & Credit Card */}
          <div>
            <h4 className="text-sm font-bold border-b border-stone-300 pb-1 mb-2 text-stone-900">
              二、三義鄉農會薪資開戶與玉山國旅卡
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4 text-stone-400 shrink-0" />
                <span>
                  持雙證件及派令至三義鄉農會信用部開立薪資專戶（起存至少 1,000 元）。
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4 text-stone-400 shrink-0" />
                <span>
                  將農會存摺封面影本黏貼於薪資轉帳同意書，送交五樓人事室及主計室出納建檔。
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4 text-stone-400 shrink-0" />
                <span>
                  本所特約國民旅遊卡為<strong>玉山銀行</strong>，已向人事室確認申辦進度與檢核系統帳號。
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: MyData Online Declarations */}
          <div>
            <h4 className="text-sm font-bold border-b border-stone-300 pb-1 mb-2 text-stone-900">
              三、公務人員個人資料服務網 (MyData) 法定表件線上填報
            </h4>
            <div className="space-y-1.5 text-xs">
              {relevantMyData.map((form) => (
                <div key={form.id} className="flex items-start gap-2">
                  {form.isSubmitted ? (
                    <CheckSquare className="w-4 h-4 text-stone-900 mt-0.5 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                  )}
                  <span>
                    {form.title} — {form.isSubmitted ? '已於線上填報並回復' : '待線上回復'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Internal Network & Forms */}
          <div>
            <h4 className="text-sm font-bold border-b border-stone-300 pb-1 mb-2 text-stone-900">
              四、公所內部資源與各類表單
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4 text-stone-400 shrink-0" />
                <span>已在辦公室公務電腦成功連線掛載【Z:\人事】內部公用磁碟。</span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4 text-stone-400 shrink-0" />
                <span>已下載並填妥新人履歷表、職名章請刻單等紙本表單送審。</span>
              </div>
            </div>
          </div>

          {/* Signatures Row */}
          <div className="pt-6 border-t border-stone-300 grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="text-stone-500 mb-6">新進人員簽章：</div>
              <div className="border-b border-stone-400 w-48"></div>
              <div className="text-stone-400 mt-1">年　　月　　日</div>
            </div>

            <div>
              <div className="text-stone-500 mb-6">人事室審查簽章：</div>
              <div className="border-b border-stone-400 w-48"></div>
              <div className="text-stone-400 mt-1">年　　月　　日</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
