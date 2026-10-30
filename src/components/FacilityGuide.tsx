import React, { useState, useRef } from 'react';
import { FacilityLocation, ViewMode } from '../types';
import { Building2, Camera, Upload, Phone, MapPin, Search, Edit3, Check, Filter, ArrowLeft, Lock } from 'lucide-react';
import { compressImage } from '../utils/photoStorage';

interface FacilityGuideProps {
  facilities: FacilityLocation[];
  viewMode: ViewMode;
  onUpdatePhoto: (id: string, newPhotoUrl: string) => void;
  onUpdateDescription: (id: string, newDesc: string) => void;
  onBack?: () => void;
}

const formatUnitName = (name: string) => name?.replace(/\s*[(（]?思恩堂[)）]?/g, '').trim() || name;

export const FacilityGuide: React.FC<FacilityGuideProps> = ({
  facilities,
  viewMode,
  onUpdatePhoto,
  onUpdateDescription,
  onBack,
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(
    facilities[0]?.id || 'fac-1f-minzheng'
  );
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [editingDescId, setEditingDescId] = useState<string | null>(null);
  const [tempDesc, setTempDesc] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingTargetId, setUploadingTargetId] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const floorTabs = [
    { id: 'all', label: '全部空間' },
    { id: '1F 一樓', label: '1F 民政/收發' },
    { id: '2F 二樓', label: '2F 政風/建設/觀農' },
    { id: '3F 三樓', label: '3F 鄉長/秘書/主計' },
    { id: '4F 四樓', label: '4F 調解/檔案/會議' },
    { id: '5F 五樓', label: '5F 財行/人事/市場' },
    { id: '6F 六樓', label: '6F 大禮堂' },
    { id: '附屬館舍', label: '第二大樓與館舍' },
  ];

  const filteredFacilities = facilities.filter((fac) => {
    if (floorFilter !== 'all') {
      if (floorFilter === '附屬館舍') {
        if (fac.building === '行政大樓') return false;
      } else {
        if (fac.floorLevel !== floorFilter) return false;
      }
    }
    if (searchKeyword.trim()) {
      const matchText = `${fac.floorLevel} ${fac.unitName} ${fac.title} ${fac.description}`.toLowerCase();
      if (!matchText.includes(searchKeyword.toLowerCase())) return false;
    }
    return true;
  });

  const activeFacility =
    facilities.find((f) => f.id === selectedFacilityId) ||
    filteredFacilities[0] ||
    facilities[0];

  const handleTriggerUpload = (facilityId: string) => {
    setUploadingTargetId(facilityId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingTargetId) {
      const targetId = uploadingTargetId;
      try {
        setIsCompressing(true);
        const compressedBase64 = await compressImage(file);
        onUpdatePhoto(targetId, compressedBase64);
      } catch (err) {
        console.warn('Canvas image compression failed, using reader fallback', err);
        const reader = new FileReader();
        reader.onload = () => {
          onUpdatePhoto(targetId, reader.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsCompressing(false);
        setUploadingTargetId(null);
      }
    }
    e.target.value = '';
  };

  const handleStartEditDesc = (facility: FacilityLocation) => {
    setEditingDescId(facility.id);
    setTempDesc(facility.description);
  };

  const handleSaveDesc = (id: string) => {
    onUpdateDescription(id, tempDesc);
    setEditingDescId(null);
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Main Banner - Amber / Sanyi Wood Theme */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50/40 to-white border-2 border-amber-300 rounded-2xl p-5 sm:p-6 shadow-xs">
        {onBack && (
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-amber-100">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-lg border-2 border-blue-900 shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5] transition-transform group-hover:-translate-x-0.5" />
              <span>回上頁（報到檢核清單）</span>
            </button>
            <span className="text-xs font-medium text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-md border border-amber-200">
              人事室分機：19(主任)、61(協辦人員)
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs font-bold mb-1">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>所內環境配置 · 各樓層獨立課室空間圖鑑</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              各樓層獨立課室及附屬館舍導覽
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              每個樓層之各課室（如一樓民政課與公文收發處）均採<strong>獨立專屬介紹與各自照片</strong>，點擊即可查看並在人事後台分別更換實景相片。
            </p>
          </div>

          {viewMode === 'admin' ? (
            <div className="bg-amber-100 border border-amber-300 rounded-lg px-3.5 py-2 text-xs text-amber-950 flex items-center gap-2 shrink-0 self-start sm:self-auto font-medium shadow-xs">
              <Camera className="w-4 h-4 text-amber-800" />
              <span>人事後台模式：具備各課室相片更換與課室說明維護權限</span>
            </div>
          ) : (
            <div className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>新進人員瀏覽模式（照片維護權限請於人事後台操作）</span>
            </div>
          )}
        </div>

        {/* Floor Filter Tabs */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {floorTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFloorFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  floorFilter === tab.id
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜尋課室名稱 (如 民政、人事、檔案室)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Navigation Rail & Selected Facility Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Individual Unit Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[780px] overflow-y-auto pr-1">
          {filteredFacilities.length === 0 ? (
            <div className="p-6 bg-white rounded-xl border border-stone-200 text-center text-xs text-stone-500">
              無符合篩選條件的課室或地點。
            </div>
          ) : (
            filteredFacilities.map((facility) => {
              const isSelected = facility.id === activeFacility?.id;
              return (
                <div
                  key={facility.id}
                  onClick={() => setSelectedFacilityId(facility.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-mono text-xs font-bold ${
                        isSelected ? 'text-amber-300' : 'text-stone-500'
                      }`}
                    >
                      {facility.floorLevel}
                    </span>
                    <span
                      className={`text-xs ${
                        isSelected ? 'text-stone-400' : 'text-stone-400'
                      }`}
                    >
                      {facility.contactExt}
                    </span>
                  </div>

                  <div className="text-base font-bold mb-1">
                    {formatUnitName(facility.unitName)}
                  </div>

                  <div
                    className={`text-xs line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-stone-300' : 'text-stone-600'
                    }`}
                  >
                    {facility.title} — {facility.description}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Unit Detailed Showcase (7 cols) */}
        {activeFacility && (
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            {/* Visual Photo Area */}
            <div className="relative aspect-16/9 bg-stone-100 overflow-hidden group">
              <img
                src={activeFacility.photoUrl}
                alt={`${activeFacility.floorLevel} ${formatUnitName(activeFacility.unitName)}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-101"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Photo Overlay Info */}
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                <div>
                  <div className="text-xs font-mono text-amber-300 font-semibold mb-1">
                    {activeFacility.building} · {activeFacility.floorLevel}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {formatUnitName(activeFacility.unitName)}
                  </h3>
                  <p className="text-xs text-stone-200 mt-0.5 line-clamp-1">
                    {activeFacility.title}
                  </p>
                </div>

                {/* Upload Photo Button for this SPECIFIC unit - ONLY IN ADMIN MODE */}
                {viewMode === 'admin' && (
                  <button
                    onClick={() => handleTriggerUpload(activeFacility.id)}
                    disabled={isCompressing}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg shadow-sm backdrop-blur-xs transition-all shrink-0 border border-amber-600 hover:shadow ring-2 ring-amber-300/80 cursor-pointer"
                    title={`【人事後台權限】上傳更換【${formatUnitName(activeFacility.unitName)}】專屬照片`}
                  >
                    <Upload className="w-3.5 h-3.5 text-stone-950 stroke-[2.5]" />
                    <span>{isCompressing ? '處理保存中...' : '更換此課室相片 (人事後台)'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Information Body */}
            <div className="p-6 space-y-5">
              {/* Unit Tag and Location */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-stone-900 text-white text-xs font-bold rounded-md font-mono">
                    {activeFacility.floorLevel}
                  </span>
                  <span className="text-base font-bold text-stone-900">
                    {formatUnitName(activeFacility.unitName)}
                  </span>
                </div>
                <span className="text-xs text-stone-500 font-mono">
                  {activeFacility.contactExt}
                </span>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    課室環境與核心定位說明
                  </span>
                  {viewMode === 'admin' && editingDescId !== activeFacility.id && (
                    <button
                      onClick={() => handleStartEditDesc(activeFacility)}
                      className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>編輯說明</span>
                    </button>
                  )}
                </div>

                {editingDescId === activeFacility.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={tempDesc}
                      onChange={(e) => setTempDesc(e.target.value)}
                      className="w-full text-xs p-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingDescId(null)}
                        className="px-3 py-1 text-xs text-stone-600"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleSaveDesc(activeFacility.id)}
                        className="px-3 py-1 text-xs bg-stone-900 text-white rounded-md flex items-center gap-1 font-medium"
                      >
                        <Check className="w-3 h-3" />
                        <span>儲存</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {activeFacility.description}
                  </p>
                )}
              </div>

              {/* Responsibilities & Services */}
              <div>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                  主要業務職掌範疇
                </span>
                <ul className="space-y-2">
                  {activeFacility.responsibilities.map((resp, i) => (
                    <li
                      key={i}
                      className="text-xs sm:text-sm text-stone-700 flex items-start gap-2 bg-stone-50 p-2.5 rounded-lg border border-stone-100"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Extension */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-stone-400" />
                  <span className="font-medium text-stone-800">公所代表總機：</span>
                  <span>(037) 872-801 · {activeFacility.contactExt}</span>
                </div>
                <span className="text-stone-400 font-mono text-[11px]">
                  相片更新：{activeFacility.updatedAt}
                </span>
              </div>
            </div>
          </div>
        )}
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
