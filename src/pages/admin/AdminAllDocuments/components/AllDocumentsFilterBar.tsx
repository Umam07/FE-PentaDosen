import React from 'react';
import { Search, GraduationCap, Clock } from 'lucide-react';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import type { AllDocumentsFilterBarProps } from '../types/adminAllDocuments.types';

export default function AllDocumentsFilterBar({
  activeTab,
  tabDetails,
  searchTerm,
  selectedFakultas,
  sortOrder,
  userRole,
  onSearchChange,
  onFakultasChange,
  onSortOrderChange,
}: AllDocumentsFilterBarProps) {
  const currentTabInfo = tabDetails[activeTab];
  const IconComponent = currentTabInfo.icon;

  return (
    <div className="relative z-20 p-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/10 backdrop-blur-sm">
      <div className="flex flex-col xl:flex-row xl:flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className={`hidden md:flex p-3 rounded-2xl shadow-sm border ${currentTabInfo.colorClass}`}>
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
              {currentTabInfo.title}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              {currentTabInfo.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Search Bar */}
          <div className="relative w-full xl:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-[1.25rem] bg-white dark:bg-zinc-800 text-sm font-bold text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all shadow-inner"
              placeholder={`Cari judul, dosen, atau kategori ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Fakultas Filter Component */}
          {userRole === 'admin penelitian' && (
            <DropdownSelect
              value={selectedFakultas}
              onChange={(val) => onFakultasChange(String(val))}
              options={[
                { value: "", label: "Semua Fakultas" },
                { value: "Fakultas Kedokteran", label: "Kedokteran" },
                { value: "Fakultas Kedokteran Gigi", label: "Kedokteran Gigi" },
                { value: "Fakultas Teknologi Informasi", label: "Teknologi Informasi" },
                { value: "Fakultas Ekonomi dan Bisnis", label: "Ekonomi dan Bisnis" },
                { value: "Fakultas Hukum", label: "Hukum" },
                { value: "Fakultas Psikologi", label: "Psikologi" },
              ]}
              icon={<GraduationCap className="w-4 h-4" />}
              className="w-full sm:w-[200px]"
            />
          )}

          {/* Sort Component */}
          <DropdownSelect
            value={sortOrder}
            onChange={(val) => onSortOrderChange(val as 'desc' | 'asc')}
            options={[
              { value: "desc", label: "Terbaru" },
              { value: "asc", label: "Terlama" },
            ]}
            icon={<Clock className="w-4 h-4" />}
            className="w-full sm:w-[160px]"
          />
        </div>
      </div>
    </div>
  );
}
