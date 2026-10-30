/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  PersonnelType,
  ViewMode,
  ChecklistItem,
  ReportForm,
  FacilityLocation,
  MyDataFormItem,
  DocStatus,
  EmployeeProfile,
} from './types';
import {
  INITIAL_CHECKLIST,
  INITIAL_DOCUMENTS,
  INITIAL_FORMS,
  INITIAL_FACILITIES,
  INITIAL_MYDATA_FORMS,
  DEFAULT_EMPLOYEES,
} from './data/initialData';
import { Header } from './components/Header';
import { IdentitySelector } from './components/IdentitySelector';
import { AdminEmployeeManager } from './components/AdminEmployeeManager';
import { OnboardingChecklist } from './components/OnboardingChecklist';
import { DocumentsView } from './components/DocumentsView';
import { FormsManager } from './components/FormsManager';
import { FacilityGuide } from './components/FacilityGuide';
import { BankingAndCardView } from './components/BankingAndCardView';
import { MyDataGuide } from './components/MyDataGuide';
import { InternalNetworkGuide } from './components/InternalNetworkGuide';
import { PrintReceiptModal } from './components/PrintReceiptModal';

export default function App() {
  // Navigation & Mode States
  const [activeTab, setActiveTab] = useState<ActiveTab>('checklist');
  const [viewMode, setViewMode] = useState<ViewMode>('newcomer');

  // Multi-Employee State Management (Each employee has isolated progress & status)
  const [employees, setEmployees] = useState<EmployeeProfile[]>(() => {
    try {
      const saved = localStorage.getItem('sanyi_employees_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_EMPLOYEES;
  });

  const [activeEmployeeId, setActiveEmployeeId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem('sanyi_active_emp_id_v2');
      if (savedId && employees.some((e) => e.employeeId === savedId)) {
        return savedId;
      }
    } catch (e) {
      console.error(e);
    }
    return employees[0]?.employeeId || 'SY11501';
  });

  // Front-end Newcomer Login Status
  const [isNewcomerLoggedIn, setIsNewcomerLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sanyi_is_newcomer_logged_in');
      if (saved !== null) return saved === 'true';
    } catch (e) {
      console.error(e);
    }
    return true; // default true for initial seeded user
  });

  // Current Active Employee Profile
  const activeEmployee =
    employees.find((e) => e.employeeId === activeEmployeeId) || employees[0] || DEFAULT_EMPLOYEES[0];

  // Global Forms State (Township-wide)
  const [forms, setForms] = useState<ReportForm[]>(() => {
    try {
      const saved = localStorage.getItem('sanyi_forms');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FORMS;
  });

  // Global Facilities State (Township-wide, 19 distinct locations with photos)
  const [facilities, setFacilities] = useState<FacilityLocation[]>(() => {
    try {
      const saved = localStorage.getItem('sanyi_facilities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 18) {
          // Sanitize any legacy cached names (ensuring 三義鄉納骨堂 has no "(思恩堂)")
          return parsed.map((item: FacilityLocation) => {
            if (item.id === 'fac-annex-funeral-columbarium' || item.unitName?.includes('思恩堂')) {
              return {
                ...item,
                unitName: '三義鄉納骨堂',
                title: item.title?.replace(/\s*[(（]?思恩堂[)）]?/g, '').trim() || item.title,
                description: item.description?.replace(/\s*[(（]?思恩堂[)）]?/g, '').trim() || item.description,
              };
            }
            return item;
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FACILITIES;
  });

  // Print Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Sync Employees and Active ID to LocalStorage
  useEffect(() => {
    localStorage.setItem('sanyi_employees_v2', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('sanyi_active_emp_id_v2', activeEmployeeId);
  }, [activeEmployeeId]);

  useEffect(() => {
    localStorage.setItem('sanyi_is_newcomer_logged_in', String(isNewcomerLoggedIn));
  }, [isNewcomerLoggedIn]);

  useEffect(() => {
    localStorage.setItem('sanyi_forms', JSON.stringify(forms));
  }, [forms]);

  useEffect(() => {
    localStorage.setItem('sanyi_facilities', JSON.stringify(facilities));
  }, [facilities]);

  // Auto-sync Checklist Item 1 when all required documents are 'prepared' or 'not_needed'
  useEffect(() => {
    const relevantDocs = INITIAL_DOCUMENTS.filter(
      (d) => d.requiredFor === 'both' || d.requiredFor === activeEmployee.personnelType
    );

    if (relevantDocs.length > 0) {
      const allHandled = relevantDocs.every((d) => {
        const s = activeEmployee.docStatuses[d.id];
        return s === 'prepared' || s === 'not_needed';
      });

      const currentChk = activeEmployee.checklist.find((i) => i.id === 'chk-doc-1');
      if (currentChk && currentChk.completed !== allHandled) {
        setEmployees((prev) =>
          prev.map((emp) => {
            if (emp.employeeId === activeEmployee.employeeId) {
              return {
                ...emp,
                checklist: emp.checklist.map((item) =>
                  item.id === 'chk-doc-1' ? { ...item, completed: allHandled } : item
                ),
              };
            }
            return emp;
          })
        );
      }
    }
  }, [activeEmployee.docStatuses, activeEmployee.personnelType, activeEmployee.employeeId]);

  // Front-end Login & Logout Handlers
  const handleNewcomerLogin = (empId: string) => {
    setActiveEmployeeId(empId);
    setIsNewcomerLoggedIn(true);
  };

  const handleNewcomerLogout = () => {
    setIsNewcomerLoggedIn(false);
  };

  // Admin Multi-Employee Management Handlers
  const handleSelectEmployee = (empId: string) => {
    setActiveEmployeeId(empId);
    setIsNewcomerLoggedIn(true);
  };

  const handleCreateEmployee = (
    newEmpData: Omit<EmployeeProfile, 'checklist' | 'docStatuses' | 'myDataForms'>
  ) => {
    const freshEmployee: EmployeeProfile = {
      ...newEmpData,
      checklist: INITIAL_CHECKLIST.map((item) => ({ ...item, completed: false })),
      docStatuses: {},
      myDataForms: INITIAL_MYDATA_FORMS.map((form) => ({ ...form, isSubmitted: false })),
    };

    setEmployees((prev) => [freshEmployee, ...prev]);
    setActiveEmployeeId(freshEmployee.employeeId);
    setIsNewcomerLoggedIn(true);
  };

  const handleUpdateEmployee = (
    empId: string,
    updatedData: Partial<Omit<EmployeeProfile, 'checklist' | 'docStatuses' | 'myDataForms'>>
  ) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.employeeId === empId) {
          return {
            ...emp,
            ...updatedData,
          };
        }
        return emp;
      })
    );

    if (activeEmployeeId === empId && updatedData.employeeId) {
      setActiveEmployeeId(updatedData.employeeId);
    }
  };

  const handleDeleteEmployee = (empId: string) => {
    if (employees.length <= 1) {
      alert('請至少保留一位新進同仁資料！');
      return;
    }
    if (window.confirm(`確定要刪除員工代號【${empId}】的報到資料嗎？此操作無法復原。`)) {
      setEmployees((prev) => {
        const remaining = prev.filter((e) => e.employeeId !== empId);
        if (activeEmployeeId === empId) {
          setActiveEmployeeId(remaining[0].employeeId);
        }
        return remaining;
      });
    }
  };

  // State mutation handlers isolated to activeEmployee
  const handleSetPersonnelType = (type: PersonnelType) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.employeeId === activeEmployee.employeeId ? { ...emp, personnelType: type } : emp
      )
    );
  };

  const handleToggleChecklistItem = (id: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.employeeId === activeEmployee.employeeId) {
          return {
            ...emp,
            checklist: emp.checklist.map((item) =>
              item.id === id ? { ...item, completed: !item.completed } : item
            ),
          };
        }
        return emp;
      })
    );
  };

  const handleChangeDocStatus = (id: string, status: DocStatus) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.employeeId === activeEmployee.employeeId) {
          return {
            ...emp,
            docStatuses: {
              ...emp.docStatuses,
              [id]: status,
            },
          };
        }
        return emp;
      })
    );
  };

  const handleToggleMyDataSubmission = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.employeeId === activeEmployee.employeeId) {
          return {
            ...emp,
            myDataForms: emp.myDataForms.map((item) => {
              if (item.id === id) {
                const nextStatus = !item.isSubmitted;
                return {
                  ...item,
                  isSubmitted: nextStatus,
                  submissionDate: nextStatus ? today : undefined,
                };
              }
              return item;
            }),
          };
        }
        return emp;
      })
    );
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        `確定要將【${activeEmployee.name}】(${activeEmployee.employeeId}) 的報到勾選進度重置回初始狀態嗎？其他同仁之進度不受影響。`
      )
    ) {
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.employeeId === activeEmployee.employeeId) {
            return {
              ...emp,
              checklist: INITIAL_CHECKLIST.map((item) => ({ ...item, completed: false })),
              docStatuses: {},
              myDataForms: INITIAL_MYDATA_FORMS.map((form) => ({ ...form, isSubmitted: false })),
            };
          }
          return emp;
        })
      );
    }
  };

  // Forms Handlers
  const handleAddForm = (newForm: Omit<ReportForm, 'id' | 'downloadCount' | 'uploadDate'>) => {
    const created: ReportForm = {
      ...newForm,
      id: `form-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      downloadCount: 0,
    };
    setForms((prev) => [created, ...prev]);
  };

  const handleDeleteForm = (id: string) => {
    setForms((prev) => prev.filter((f) => f.id !== id));
  };

  const handleIncrementDownload = (id: string) => {
    setForms((prev) =>
      prev.map((f) => (f.id === id ? { ...f, downloadCount: f.downloadCount + 1 } : f))
    );
  };

  const handleUpdateFormFile = (
    formId: string,
    fileData: { fileName: string; fileSize: string; fileUrl: string }
  ) => {
    setForms((prev) =>
      prev.map((f) =>
        f.id === formId
          ? {
              ...f,
              ...fileData,
              uploadDate: new Date().toISOString().split('T')[0],
            }
          : f
      )
    );
  };

  // Facility Handlers
  const handleUpdateFacilityPhoto = (facilityId: string, newPhotoUrl: string) => {
    setFacilities((prev) =>
      prev.map((fac) =>
        fac.id === facilityId
          ? {
              ...fac,
              photoUrl: newPhotoUrl,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : fac
      )
    );
  };

  const handleUpdateFacilityDesc = (facilityId: string, newDesc: string) => {
    setFacilities((prev) =>
      prev.map((fac) =>
        fac.id === facilityId
          ? {
              ...fac,
              description: newDesc,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : fac
      )
    );
  };

  // Metrics for active employee
  const relevantChecklist = activeEmployee.checklist.filter(
    (item) => item.requiredFor === 'both' || item.requiredFor === activeEmployee.personnelType
  );
  const completedCount = relevantChecklist.filter((i) => i.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/20 to-blue-50/20 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header with Password Protected Admin Mode */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Admin Mode Floating Indicator */}
      {viewMode === 'admin' && (
        <div className="bg-amber-500 text-stone-950 px-4 py-2 text-xs font-semibold text-center border-b border-amber-600 shadow-xs flex items-center justify-center gap-2 print:hidden">
          <span>
            目前處於【人事人員管理後台模式】：可新增/修改/刪除新進人員帳號（含編輯報到日期）、上傳公所表單與更換課室相片。
          </span>
          <button
            onClick={() => setViewMode('newcomer')}
            className="ml-2 underline font-bold hover:text-white"
          >
            點此退出後台
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Admin Mode: Centralized Employee Account & Onboarding Date Management */}
        {viewMode === 'admin' && (
          <AdminEmployeeManager
            employees={employees}
            activeEmployeeId={activeEmployee.employeeId}
            onSelectEmployee={handleSelectEmployee}
            onCreateEmployee={handleCreateEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        )}

        {/* Front-End Newcomer: Identity & Login Banner */}
        <IdentitySelector
          personnelType={activeEmployee.personnelType}
          setPersonnelType={handleSetPersonnelType}
          activeEmployee={activeEmployee}
          allEmployees={employees}
          isLoggedIn={isNewcomerLoggedIn}
          onLogin={handleNewcomerLogin}
          onLogout={handleNewcomerLogout}
          onOpenPrintModal={() => setIsPrintModalOpen(true)}
          onResetProgress={handleResetProgress}
          completedCount={completedCount}
          totalCount={relevantChecklist.length}
        />

        {/* Tab View Router */}
        {activeTab === 'checklist' && (
          <OnboardingChecklist
            items={activeEmployee.checklist}
            personnelType={activeEmployee.personnelType}
            onToggleItem={handleToggleChecklistItem}
            onNavigateTab={setActiveTab}
            docStatuses={activeEmployee.docStatuses}
            documents={INITIAL_DOCUMENTS}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsView
            documents={INITIAL_DOCUMENTS}
            personnelType={activeEmployee.personnelType}
            setPersonnelType={handleSetPersonnelType}
            docStatuses={activeEmployee.docStatuses}
            onChangeDocStatus={handleChangeDocStatus}
            onBack={() => setActiveTab('checklist')}
          />
        )}

        {activeTab === 'forms' && (
          <FormsManager
            forms={forms}
            viewMode={viewMode}
            personnelType={activeEmployee.personnelType}
            onAddForm={handleAddForm}
            onDeleteForm={handleDeleteForm}
            onIncrementDownload={handleIncrementDownload}
            onUpdateFormFile={handleUpdateFormFile}
            onBack={() => setActiveTab('checklist')}
          />
        )}

        {activeTab === 'facilities' && (
          <FacilityGuide
            facilities={facilities}
            viewMode={viewMode}
            onUpdatePhoto={handleUpdateFacilityPhoto}
            onUpdateDescription={handleUpdateFacilityDesc}
            onBack={() => setActiveTab('checklist')}
          />
        )}

        {activeTab === 'banking' && (
          <BankingAndCardView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'mydata' && (
          <MyDataGuide
            forms={activeEmployee.myDataForms}
            personnelType={activeEmployee.personnelType}
            onToggleSubmission={handleToggleMyDataSubmission}
            onBack={() => setActiveTab('checklist')}
          />
        )}

        {activeTab === 'zdrive' && (
          <InternalNetworkGuide onBack={() => setActiveTab('checklist')} />
        )}
      </main>

      {/* Footer - Bright, Crisp Government Footer */}
      <footer className="bg-slate-900 text-slate-300 text-xs py-8 border-t-4 border-blue-600 print:hidden mt-12 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-white font-bold text-sm mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>苗栗縣三義鄉公所 人事室 (Sanyi Township Office Personnel Office)</span>
            </div>
            <div className="text-slate-400">
              機關地址：36741 苗栗縣三義鄉廣盛村80號 · 總機：(037) 872-801 · 人事室分機：19(主任)、61(協辦人員)
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-xs flex-wrap">
            {isNewcomerLoggedIn && (
              <>
                <span className="text-white font-semibold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  登入同仁：{activeEmployee.name} ({activeEmployee.employeeId})
                </span>
                <span>·</span>
                <span className="text-sky-300 font-medium">服務單位：{activeEmployee.department}</span>
                <span>·</span>
              </>
            )}
            <span className="bg-slate-800 text-rose-300 px-2 py-0.5 rounded border border-slate-700 font-mono">Z:\1.人事室</span>
            <span>·</span>
            <span className="bg-slate-800 text-purple-300 px-2 py-0.5 rounded border border-slate-700">玉山國旅卡</span>
            <span>·</span>
            <span className="bg-slate-800 text-emerald-300 px-2 py-0.5 rounded border border-slate-700">三義農會發薪</span>
          </div>
        </div>
      </footer>

      {/* Print Document Modal */}
      <PrintReceiptModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        personnelType={activeEmployee.personnelType}
        activeEmployee={activeEmployee}
        checklist={activeEmployee.checklist}
        documents={INITIAL_DOCUMENTS}
        docStatuses={activeEmployee.docStatuses}
        myDataForms={activeEmployee.myDataForms}
      />
    </div>
  );
}
