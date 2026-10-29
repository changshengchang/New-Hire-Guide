import React, { useState } from 'react';
import { EmployeeProfile, PersonnelType, SERVICE_UNITS } from '../types';
import { Users, Plus, Edit, Trash2, Calendar, Check, X, ShieldAlert, Award, ArrowLeftRight, Eye } from 'lucide-react';

interface AdminEmployeeManagerProps {
  employees: EmployeeProfile[];
  activeEmployeeId: string;
  onSelectEmployee: (empId: string) => void;
  onCreateEmployee: (newEmpData: Omit<EmployeeProfile, 'checklist' | 'docStatuses' | 'myDataForms'>) => void;
  onUpdateEmployee: (empId: string, updatedData: Partial<Omit<EmployeeProfile, 'checklist' | 'docStatuses' | 'myDataForms'>>) => void;
  onDeleteEmployee: (empId: string) => void;
}

export const AdminEmployeeManager: React.FC<AdminEmployeeManagerProps> = ({
  employees,
  activeEmployeeId,
  onSelectEmployee,
  onCreateEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
}) => {
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

  return (
    <div className="bg-gradient-to-r from-amber-50/60 via-white to-slate-50 border-2 border-amber-300 rounded-2xl p-6 shadow-xs mb-8 print:hidden">
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
