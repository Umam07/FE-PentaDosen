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
        <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl text-ink-heading dark:text-on-dark border border-hairline-light-soft dark:border-hairline-dark-soft">
          <User className="w-5 h-5 text-accent dark:text-accent-on-dark" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight">Pilih Dosen</h3>
      </div>
      <div className="relative" ref={dropdownRef}>
        <div 
          className={`flex items-center gap-3 w-full px-4 py-3 bg-surface-light-raised dark:bg-surface-dark-elevated border rounded-xl transition-all ${
            isDropdownOpen 
              ? 'border-accent dark:border-accent-on-dark ring-2 ring-accent/20' 
              : 'border-hairline-light dark:border-hairline-dark'
          }`}
        >
          <Search className="w-4 h-4 text-muted dark:text-on-dark-muted" />
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
            className="w-full bg-transparent border-none text-xs font-semibold text-ink-heading dark:text-on-dark focus:outline-none placeholder:text-muted dark:placeholder:text-on-dark-muted"
          />
          <button
            type="button"
            onClick={onToggleDropdown}
            className="p-1 hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg text-muted dark:text-on-dark-muted transition-colors cursor-pointer"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {isDropdownOpen && (
          <div className="absolute z-50 w-full mt-2 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft">
            {users.length === 0 ? (
              <div className="p-4 text-center text-xs font-semibold text-muted dark:text-on-dark-muted">Memuat data dosen...</div>
            ) : (
              users.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u.id);
                    onSearchChange('');
                  }}
                  className={`p-3.5 hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated cursor-pointer flex items-center justify-between transition-colors ${
                    selectedUserId == u.id ? 'bg-accent-soft/40 dark:bg-accent/10' : ''
                  }`}
                >
                  <div>
                    <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">{u.name}</p>
                    <p className="text-[10px] font-mono font-medium text-muted dark:text-on-dark-muted uppercase tracking-wider">{u.fakultas || 'Tanpa Fakultas'}</p>
                  </div>
                  {selectedUserId == u.id && (
                    <CheckCircle className="w-4 h-4 text-accent dark:text-accent-on-dark" />
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
