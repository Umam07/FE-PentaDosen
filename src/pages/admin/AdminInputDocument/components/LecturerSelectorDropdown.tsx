import React from 'react';
import { User, Search, ChevronDown, CheckCircle } from 'lucide-react';
import type { LecturerSelectorDropdownProps } from '../types/adminInputDocument.types';

export default function LecturerSelectorDropdown({
  users,
  selectedUserId,
  searchTerm,
  isDropdownOpen,
  dropdownRef,
  onSearchChange,
  onSelectUser,
  onToggleDropdown,
}: LecturerSelectorDropdownProps) {
  const selectedUser = users.find(u => u.id == selectedUserId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-600">
          <User className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Pilih Dosen</h3>
      </div>
      <div className="relative" ref={dropdownRef}>
        <div 
          className={`flex items-center gap-3 w-full px-6 py-4 bg-gray-50 dark:bg-zinc-800 border-2 rounded-2xl transition-all ${
            isDropdownOpen 
              ? 'border-primary-500 ring-4 ring-primary-100 dark:ring-primary-900/20' 
              : 'border-gray-200 dark:border-zinc-700'
          }`}
        >
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={selectedUser ? `${selectedUser.name} (${selectedUser.fakultas || 'Umum'})` : "Ketik nama dosen atau cari..."}
            value={searchTerm}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (!isDropdownOpen) onToggleDropdown();
            }}
            onFocus={() => {
              if (!isDropdownOpen) onToggleDropdown();
            }}
            className="w-full bg-transparent border-none text-sm font-bold text-gray-900 dark:text-zinc-100 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500"
          />
          <button
            type="button"
            onClick={onToggleDropdown}
            className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg text-gray-400 transition-colors"
          >
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {isDropdownOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-50 dark:divide-zinc-800">
            {users.length === 0 ? (
              <div className="p-4 text-center text-xs font-bold text-gray-400">Memuat data dosen...</div>
            ) : (
              users.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u.id);
                    onSearchChange('');
                  }}
                  className={`p-4 hover:bg-primary-50/50 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-between transition-colors ${
                    selectedUserId == u.id ? 'bg-primary-50 dark:bg-primary-950/30' : ''
                  }`}
                >
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-zinc-100">{u.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{u.fakultas || 'Tanpa Fakultas'}</p>
                  </div>
                  {selectedUserId == u.id && (
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
