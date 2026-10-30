import React, { useState, useRef } from 'react';
import { EmployeeProfile, PersonnelType, SERVICE_UNITS, FacilityLocation, ActiveTab } from '../types';
import { Users, Plus, Edit, Trash2, Calendar, Check, X, ShieldAlert, Award, ArrowLeftRight, Eye, Camera, Upload, RotateCcw, ExternalLink } from 'lucide-react';
import { INITIAL_FACILITIES } from '../data/initialData';
import { compressImage } from '../utils/photoStorage';

interface AdminEmployeeManagerProps {
  employees: EmployeeProfile[];
  activeEmployeeId: string;
  onSelectEmployee: (empId: string) => void;
  onCreateEmployee: (newEmpData: Omit<EmployeeProfile, 'checklist' | 'docStatuses' | 'myDataForms'>) => void;
  onUpdateEmployee: (empId: string, updatedData: Partial<Omit<EmployeeProfile, 'checklist' | 'docStatuses' | 'myDataForms'>>) => void;
  onDeleteEmployee: (empId: string) => void;
  facilities?: FacilityLocation[];
  onUpdateFacilityPhoto?: (facilityId: string, newPhotoUrl: string) => void;
  onResetFacilityPhoto?: (facilityId: string) => void;
  onNavigateTab?: (tab: ActiveTab) => void;
}

export const AdminEmployeeManager: React.FC<AdminEmployeeManagerProps> = ({
  employees,
  activeEmployeeId,
  onSelectEmployee,
  onCreateEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  facilities = INITIAL_FACILITIES,
  onUpdateFacilityPhoto,
  onResetFacilityPhoto,
  onNavigateTab,
}) => {
  const [adminSubTab, setAdminSubTab] = useState<'employees' | 'facilities'>('employees');
  const [facilityFloorFilter, setFacilityFloorFilter] = useState<string>('all');
  const [uploadingFacilityId, setUploadingFacilityId] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState<EmployeeProfile | null>(null);

  // Add Employee Form State
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState<string>(SERVICE_UNITS[0]);
  const [newRole, setNewRole] = useState<PersonnelType>('new_exam');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [addError, setAddError] = useState('');

  // Edit Employee Form State
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editDept, setEditDept] = useState<string>(SERVICE_UNITS[0]);
  const [editRole, setEditRole] = useState<PersonnelType>('new_exam');
  const [editDate, setEditDate] = useState('');
  const [editError, setEditError] = useState('');

  const handleOpenAdd = () => {
    setNewId('');
    setNewName('');
    setNewDept(SERVICE_UNITS[0]);
    setNewRole('new_exam');
    setNewDate(new Date().toISOString().split('T')[0]);
    setAddError('');
    setShowAddModal(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = newId.trim().toUpperCase();
    const cleanName = newName.trim();

    if (!cleanId || !cleanName) {
      setAddError('請務必輸入「員工代號」與「同仁姓名」！');
      return;
    }

    if (employees.some((emp) => emp.employeeId.toUpperCase() === cleanId)) {
      setAddError(`員工代號【${cleanId}】已存在，請使用不同代號！`);
      return;
    }

    onCreateEmployee({
      employeeId: cleanId,
      name: cleanName,
      department: newDept,
      personnelType: newRole,
      onboardingDate: newDate || new Date().toISOString().split('T')[0],
    });

    setShowAddModal(false);
  };

  const handleOpenEdit = (emp: EmployeeProfile) => {
    setEditingEmp(emp);
    setEditId(emp.employeeId);
    setEditName(emp.name);
    setEditDept(emp.department);
    setEditRole(emp.personnelType);
    setEditDate(emp.onboardingDate || new Date().toISOString().split('T')[0]);
    setEditError('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmp) return;

    const cleanId = editId.trim().toUpperCase();
    const cleanName = editName.trim();

    if (!cleanId || !cleanName) {
      setEditError('請務必輸入「員工代號」與「同仁姓名」！');
      return;
    }

    // Check if ID is changed to an existing ID of another employee
    if (
      cleanId !== editingEmp.employeeId &&
      employees.some((emp) => emp.employeeId.toUpperCase() === cleanId)
    ) {
      setEditError(`員工代號【${cleanId}】已由其他同仁使用！`);
      return;
    }

    onUpdateEmployee(editingEmp.employeeId, {
      employeeId: cleanId,
      name: cleanName,
      department: editDept,
      personnelType: editRole,
      onboardingDate: editDate,
    });

    setEditingEmp(null);
  };

  const adminFloorTabs = [
    { id: 'all', label: '全部空間' },
    { id: '1F 一樓', label: '1F 民政/收發' },
    { id: '2F 二樓', label: '2F 政風/建設/觀農' },
    { id: '3F 三樓', label: '3F 鄉長/秘書/主計' },
    { id: '4F 四樓', label: '4F 調解/檔案/會議' },
    { id: '5F 五樓', label: '5F 財行/人事/市場' },
    { id: '6F 六樓', label: '6F 大禮堂' },
    { id: '附屬館舍', label: '第二大樓與館舍' },
  ];

  const filteredAdminFacilities = (facilities || INITIAL_FACILITIES).filter((fac) => {
    if (facilityFloorFilter !== 'all') {
      if (facilityFloorFilter === '附屬館舍') {
        if (fac.building === '行政大樓') return false;
      } else {
        if (fac.floorLevel !== facilityFloorFilter) return false;
      }
    }
    return true;
  });

  const handleTriggerUpload = (facId: string) => {
    setUploadingFacilityId(facId);
    photoInputRef.current?.click();
  };

  const handleFacilityPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingFacilityId && onUpdateFacilityPhoto) {
      const targetId = uploadingFacilityId;
      try {
        setIsCompressing(true);
        const compressed = await compressImage(file);
        onUpdateFacilityPhoto(targetId, compressed);
      } catch (err) {
        console.warn('Compression failed, fallback to raw', err);
        const reader = new FileReader();
        reader.onload = () => {
          onUpdateFacilityPhoto(targetId, reader.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsCompressing(false);
        setUploadingFacilityId(null);
      }
    }
    e.target.value = '';
  };

  const handleResetPhoto = (facId: string, unitName: string) => {
    if (window.confirm(`確定要將【${unitName}】的照片恢復為系統初始預設照片嗎？`)) {
      onResetFacilityPhoto?.(facId);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50/60 via-white to-slate-50 border-2 border-amber-300 rounded-2xl p-6 shadow-xs mb-8 print:hidden">
      {/* Admin Function Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-6 p-1.5 bg-amber-100/70 rounded-xl border border-amber-200">
        <button
          type="button"
          onClick={() => setAdminSubTab('employees')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
            adminSubTab === 'employees'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-amber-900 hover:bg-amber-200/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>新進同仁名冊與帳號管理 ({employees.length} 位)</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminSubTab('facilities')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
            adminSubTab === 'facilities'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-amber-900 hover:bg-amber-200/60'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>各樓層課室照片維護管理 ({facilities?.length || 19} 處空間)</span>
        </button>
      </div>

      {/* SubTab 1: Employees Management */}
      {adminSubTab === 'employees' && (
        <div>
          {/* Title & Add Button Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-100">
        <div>
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold mb-1">
            <Users className="w-4 h-4 text-amber-700" />
            <span>人事專案管理 · 新進人員帳號與代號管理中心</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            新進同仁名冊與帳號權限管理
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            由人事室統一新增、配發與維護新進同仁之專屬「員工代號」，並可編輯其姓名、服務單位、身分類別與報到日期。
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto border border-amber-700 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>新增新進同仁帳號</span>
        </button>
      </div>

      {/* Employee List Grid */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>目前在案報到同仁名冊（共 {employees.length} 位）：</span>
          <span>點選「檢視進度」可即時切換視角</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {employees.map((emp) => {
            const isCurrent = emp.employeeId === activeEmployeeId;
            const relevantItems = emp.checklist.filter(
              (i) => i.requiredFor === 'both' || i.requiredFor === emp.personnelType
            );
            const compCount = relevantItems.filter((i) => i.completed).length;
            const compPercent =
              relevantItems.length > 0 ? Math.round((compCount / relevantItems.length) * 100) : 0;

            return (
              <div
                key={emp.employeeId}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-400/40 shadow-xs'
                    : 'bg-stone-50/70 border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Top Badge: Employee ID & Status */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-stone-900 text-amber-200 shadow-2xs">
                    {emp.employeeId}
                  </span>

                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      compPercent === 100
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-white border border-stone-200 text-stone-700'
                    }`}
                  >
                    進度：{compPercent}%
                  </span>
                </div>

                {/* Name & Service Unit */}
                <div className="flex items-baseline justify-between mb-1">
                  <div className="text-base font-bold text-stone-900">{emp.name}</div>
                  <div className="text-xs font-semibold text-stone-700 bg-white border border-stone-200 px-2 py-0.5 rounded">
                    {emp.department}
                  </div>
                </div>

                {/* Identity & Onboarding Date */}
                <div className="text-xs text-stone-500 space-y-0.5 mb-3">
                  <div className="flex items-center gap-1.5">
                    {emp.personnelType === 'new_exam' ? (
                      <span className="text-amber-800 font-medium">考試分發初任人員</span>
                    ) : (
                      <span className="text-emerald-800 font-medium">他機關調任人員</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-stone-500">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>報到日期：{emp.onboardingDate || '未指定'}</span>
                  </div>
                </div>

                {/* Action Buttons: View, Edit, Delete */}
                <div className="pt-2.5 border-t border-stone-200/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectEmployee(emp.employeeId)}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                      isCurrent
                        ? 'bg-amber-200 text-amber-950 font-bold'
                        : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isCurrent ? '當前檢視中' : '檢視進度'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(emp)}
                      className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded-md border border-transparent hover:border-stone-200 transition-colors"
                      title="編輯此同仁帳號資料（含報到日期）"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteEmployee(emp.employeeId)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="刪除此同仁帳號"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )}

  {/* SubTab 2: Facilities Photo Management */}
  {adminSubTab === 'facilities' && (
    <div className="space-y-4">
      {/* Hidden File Input for Facility Photo */}
      <input
        type="file"
        ref={photoInputRef}
        onChange={handleFacilityPhotoChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
        <div>
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold mb-1">
            <Camera className="w-4 h-4 text-amber-700" />
            <span>人事後台專屬 · 各樓層獨立課室實景照片維護</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            各樓層課室實景照片管理中心
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            由人事室專責維護或更換全所 19 處課室與附屬館舍照片。更換後採高解析輕量自動保存，新進同仁登入時均維持您所更換之照片。
          </p>
        </div>

        {onNavigateTab && (
          <button
            type="button"
            onClick={() => onNavigateTab('facilities')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 shadow-xs cursor-pointer self-start sm:self-auto shrink-0 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            <span>前往環境導覽全覽頁</span>
          </button>
        )}
      </div>

      {/* Floor Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {adminFloorTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFacilityFloorFilter(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              facilityFloorFilter === tab.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white/80 text-stone-600 hover:bg-white border border-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Facility Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAdminFacilities.map((fac) => {
          const initialMatch = INITIAL_FACILITIES.find((init) => init.id === fac.id);
          const isCustom = fac.photoUrl !== initialMatch?.photoUrl;
          const displayUnitName = fac.unitName.replace(/\s*[(（]?思恩堂[)）]?/g, '').trim();

          return (
            <div
              key={fac.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Photo Box */}
                <div className="relative aspect-16/9 bg-stone-100 overflow-hidden group">
                  <img
                    src={fac.photoUrl}
                    alt={`${fac.floorLevel} ${displayUnitName}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-101"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 text-white text-[11px] font-mono rounded font-semibold shadow-xs">
                    {fac.floorLevel}
                  </div>

                  {isCustom ? (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded flex items-center gap-1 shadow-xs">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>人事已更換</span>
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-stone-700/80 text-stone-200 text-[10px] rounded">
                      預設照片
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="p-3.5 pb-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">
                      {displayUnitName}
                    </h4>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {fac.contactExt}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-1">
                    {fac.title}
                  </p>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="p-3.5 pt-0 flex items-center justify-between gap-2 border-t border-stone-100 mt-2">
                <button
                  type="button"
                  onClick={() => handleTriggerUpload(fac.id)}
                  disabled={isCompressing}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg border border-amber-600 shadow-xs cursor-pointer transition-colors"
                  title={`上傳或更換【${displayUnitName}】之照片`}
                >
                  <Upload className="w-3.5 h-3.5 text-stone-950 stroke-[2.5]" />
                  <span>
                    {isCompressing && uploadingFacilityId === fac.id ? '壓縮儲存中...' : '更換相片'}
                  </span>
                </button>

                {isCustom && onResetFacilityPhoto && (
                  <button
                    type="button"
                    onClick={() => handleResetPhoto(fac.id, displayUnitName)}
                    className="flex items-center justify-center gap-1 py-1.5 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg border border-stone-300 cursor-pointer transition-colors"
                    title="恢復回系統預設照片"
                  >
                    <RotateCcw className="w-3 h-3 text-stone-600" />
                    <span className="text-[11px]">還原預設</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )}

  {/* Modal: Add New Employee */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  人事室 · 新增新進同仁帳號
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="mt-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    員工代號 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    placeholder="例如：SY11503"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    同仁姓名 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="例如：王小明"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    服務單位 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600 bg-white"
                  >
                    {SERVICE_UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    報到身分類別
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as PersonnelType)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600 bg-white"
                  >
                    <option value="new_exam">考試分發初任人員</option>
                    <option value="transfer">他機關調任人員</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  報到日期
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>建立帳號並登錄</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Employee */}
      {editingEmp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Edit className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  修改同仁帳號資料（含報到日期）
                </h3>
              </div>
              <button
                onClick={() => setEditingEmp(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="mt-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    員工代號 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editId}
                    onChange={(e) => setEditId(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    同仁姓名 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    服務單位 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600 bg-white"
                  >
                    {SERVICE_UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    報到身分類別
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as PersonnelType)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600 bg-white"
                  >
                    <option value="new_exam">考試分發初任人員</option>
                    <option value="transfer">他機關調任人員</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  報到日期（可在此修改調整）
                </label>
                <input
                  type="date"
                  required
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEmp(null)}
                  className="px-3.5 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 font-semibold bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>儲存修改</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
