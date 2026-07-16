import React from 'react';
import { Users, Search, GraduationCap } from 'lucide-react';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { LecturersFilterProps } from '../types/lecturers.types';

export default function LecturersFilter({
  searchTerm,
  onSearchChange,
  selectedFakultas,
  onFakultasChange,
  loading,
  userRole
}: LecturersFilterProps) {
  return (
    <div className="relative z-20 p-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/10 backdrop-blur-sm">
      <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="hidden md:flex p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400 shadow-sm border border-primary-100/50 dark:border-primary-900/30">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Eksplorasi Profil</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Daftar Dosen di Lingkungan {userRole === 'admin penelitian' ? 'Universitas' : 'Fakultas'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full xl:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama dosen atau program studi..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-[1.25rem] bg-white dark:bg-zinc-800 text-sm font-bold text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all shadow-inner"
              disabled={loading}
            />
          </div>
          {userRole === 'admin penelitian' && (
            <DropdownSelect
              value={selectedFakultas}
              onChange={onFakultasChange}
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
              className="w-full sm:w-[220px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
