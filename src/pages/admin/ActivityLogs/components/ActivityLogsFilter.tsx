import React from 'react';
import { Activity, Search } from 'lucide-react';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { ActivityLogsFilterProps } from '../types/activityLogs.types';

export default function ActivityLogsFilter({
  searchTerm,
  onSearchChange,
  selectedAction,
  onActionChange,
  userRole
}: ActivityLogsFilterProps) {
  return (
    <div className="relative z-20 p-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/5 backdrop-blur-sm">
      <div className="flex flex-col xl:flex-row items-center justify-between gap-6">

        {/* Left: Sub-header */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="hidden md:flex p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400 shadow-sm border border-primary-100/50 dark:border-primary-900/30">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
              Riwayat Log Sistem
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              {userRole === 'admin lppm' ? 'Penelitian' : 'Fakultas'} • Audit Trail
            </p>
          </div>
        </div>

        {/* Right: Search + Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Search */}
          <div className="relative w-full xl:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-[1.25rem] bg-white dark:bg-zinc-800 text-sm font-bold text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all shadow-inner"
              placeholder="Cari aksi, deskripsi, atau nama dosen..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Filter Aksi */}
          <DropdownSelect
            value={selectedAction}
            onChange={onActionChange}
            options={[
              { value: "", label: "Semua Aksi" },
              { value: "create", label: "Create (Submit/Upload)" },
              { value: "login", label: "Login" },
              { value: "logout", label: "Logout" },
              { value: "sync", label: "Sync (Scholar/Scopus)" },
              { value: "verify", label: "Verify (Admin Action)" }
            ]}
            icon={<Activity className="w-4 h-4" />}
            className="w-full sm:w-[220px]"
          />
        </div>
      </div>
    </div>
  );
}
