export type PersonnelType = 'new_exam' | 'transfer'; // 考試分發初任人員 vs 調任人員
export type ViewMode = 'newcomer' | 'admin'; // 新進人員視角 vs 人事管理視角
export type ActiveTab = 'checklist' | 'documents' | 'forms' | 'facilities' | 'banking' | 'mydata' | 'zdrive';

export type DocStatus = 'pending' | 'prepared' | 'not_needed'; // 待準備 | 已備齊 | 本項無需要

export const SERVICE_UNITS = [
  '民政課',
  '財政暨行政課',
  '建設課',
  '觀光產業暨農業課',
  '社會福利課',
  '主計室',
  '政風室',
  '人事室',
  '圖書館',
  '零售市場',
  '清潔隊',
] as const;

export type ServiceUnit = typeof SERVICE_UNITS[number];

export interface ChecklistItem {
  id: string;
  title: string;
  category: '證件備妥' | '表單下載' | '金融開戶' | '國旅卡' | 'MyData申報' | '環境認識' | '公所內網';
  description: string;
  requiredFor: 'both' | 'new_exam' | 'transfer';
  completed: boolean;
  priority: '必辦' | '重要' | '建議';
  targetTab: ActiveTab;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: '初任' | '調任' | '共同';
  description: string;
  issuingUnit: string;
  notes: string;
  requiredFor: 'both' | 'new_exam' | 'transfer';
}

export interface ReportForm {
  id: string;
  title: string;
  category: '人事基本資料' | '差勤與誓言' | '資訊與帳號' | '總務與福利';
  description: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  fileUrl?: string; // Data URL or template link
  downloadCount: number;
  requiredRole: 'both' | 'new_exam' | 'transfer';
}

export interface FacilityLocation {
  id: string;
  building: '行政大樓' | '第二辦公大樓' | '附屬館舍';
  floorLevel: string; // e.g. 1F, 2F, 3F, 4F, 5F, 6F, 附屬館舍
  unitName: string; // 獨立課室/地點名稱 (如 民政課、公文收發處、政風室、建設課...)
  title: string;
  description: string;
  responsibilities: string[];
  contactExt: string;
  photoUrl: string;
  updatedAt: string;
}

export interface MyDataFormItem {
  id: string;
  title: string;
  targetRole: 'both' | 'new_exam' | 'transfer';
  description: string;
  legalBasis: string;
  keyPoints: string[];
  isSubmitted: boolean;
  submissionDate?: string;
}

export interface EmployeeProfile {
  employeeId: string; // 員工代號 (如 SY11501)
  name: string; // 同仁姓名
  department: string; // 服務單位 (如 民政課、財政暨行政課、社會福利課...)
  personnelType: PersonnelType; // 報到身分類別
  onboardingDate: string; // 報到日期 (YYYY-MM-DD)
  checklist: ChecklistItem[];
  docStatuses: Record<string, DocStatus>;
  myDataForms: MyDataFormItem[];
}
