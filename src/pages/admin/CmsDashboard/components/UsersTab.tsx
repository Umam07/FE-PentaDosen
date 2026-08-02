import React, { useMemo } from 'react';
import { Search, Edit, X, ChevronLeft, ChevronRight, Users, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUsersTab, FAKULTAS_PRODI_MAP } from '../hooks/useUsersTab';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { getRoleBadgeStyle, getRoleAvatarStyle } from '../../../../lib/roleColors';

interface UsersTabProps {
  triggerMessage: (text: string, type?: 'success' | 'error') => void;
}

const ROLE_FILTER_OPTIONS = [
  { value: '', label: 'Semua Role' },
  { value: 'dosen', label: 'Dosen' },
  { value: 'admin fakultas', label: 'Admin Fakultas' },
  { value: 'admin penelitian', label: 'Admin Penelitian' },
  { value: 'super admin', label: 'Super Admin' }
];

const ROLE_EDIT_OPTIONS = [
  { value: 'dosen', label: 'Dosen' },
  { value: 'admin fakultas', label: 'Admin Fakultas' },
  { value: 'admin penelitian', label: 'Admin Penelitian' },
  { value: 'super admin', label: 'Super Admin' }
];

const PER_PAGE_OPTIONS = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' }
];

/**
 * Tab Manajemen User & Hak Akses.
 */
export default function UsersTab({ triggerMessage }: UsersTabProps) {
  const {
    users,
    search,
    setSearch,
    selectedRole,
    setSelectedRole,
    loading,
    page,
    setPage,
    lastPage,
    total,
    perPage,
    setPerPage,
    editingUser,
    setEditingUser,
    editRole,
    setEditRole,
    editFakultas,
    editProdi,
    setEditProdi,
    savingUser,
    handleSearchSubmit,
    handleOpenEdit,
    handleFakultasChange,
    handleSaveUser
  } = useUsersTab(triggerMessage);

  const fakultasOptions = useMemo(() => [
    { value: '', label: 'Pilih Fakultas' },
    ...Object.keys(FAKULTAS_PRODI_MAP).map(f => ({ value: f, label: f }))
  ], []);

  const prodiOptions = useMemo(() => [
    { value: '', label: 'Pilih Program Studi' },
    ...((editFakultas && FAKULTAS_PRODI_MAP[editFakultas]) || []).map(p => ({ value: p, label: p }))
  ], [editFakultas]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
      {/* Search and Filters Bar */}
      <div className="relative z-20 p-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/5 backdrop-blur-sm">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-6">

          {/* Left: Sub-header */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <div className="hidden md:flex p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400 shadow-sm border border-primary-100/50 dark:border-primary-900/30">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                Manajemen User & Hak Akses
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                Super Admin • Kelola Pengguna & Hak Akses Sistem
              </p>
            </div>
          </div>

          {/* Right: Search + Filter Role */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full xl:w-[360px]">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-zinc-500" />
                <input
                  type="text"
                  placeholder="Cari user (nama, email, nidn)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-[1.25rem] bg-white dark:bg-zinc-800 text-sm font-bold text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 outline-none transition-all shadow-inner"
                />
              </div>
              <button type="submit" className="px-5 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest shadow-md transition-all shrink-0 cursor-pointer">
                Cari
              </button>
            </form>

            <DropdownSelect
              value={selectedRole}
              onChange={(val) => { setSelectedRole(String(val)); setPage(1); }}
              options={ROLE_FILTER_OPTIONS}
              icon={<Shield className="w-4 h-4" />}
              className="w-full sm:w-[220px]"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800 text-sm">
          <thead className="bg-gray-50/50 dark:bg-zinc-800/30">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">NIDN</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Fakultas / Prodi</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-5 bg-gray-50/10 h-16"></td>
                </tr>
              ))
            ) : users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-primary-50/10 dark:hover:bg-zinc-800/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.avatar ? (
                        <img 
                          src={u.avatar} 
                          alt="" 
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-primary-100/50 transition-all shadow-sm"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm uppercase transition-all shadow-sm ${getRoleAvatarStyle(u.role)}`}>
                          {u.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-extrabold text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{u.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 lowercase">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-gray-600 dark:text-zinc-400 uppercase tracking-wider">
                    {u.nidn || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${getRoleBadgeStyle(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-extrabold text-gray-700 dark:text-zinc-300 uppercase tracking-tight">{u.fakultas || '-'}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{u.program_studi || '-'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative group inline-block">
                      <button 
                        onClick={() => handleOpenEdit(u)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-zinc-800 rounded-xl transition-all"
                        aria-label="Atur Hak Akses"
                        title="Atur Hak Akses"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:flex items-center justify-center px-2 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm whitespace-nowrap pointer-events-none z-10 transition-opacity">
                        Atur Hak Akses
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold italic uppercase text-xs tracking-widest">
                  Tidak ada data user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && users.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 px-6 py-6 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/5 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
              Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, total)} of {total} Users
            </span>
            <div className="h-5 w-px bg-gray-200 dark:bg-zinc-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Limit:</span>
              <DropdownSelect
                size="sm"
                value={perPage}
                onChange={(val) => { setPerPage(Number(val)); setPage(1); }}
                options={PER_PAGE_OPTIONS}
                position="top"
                className="w-[85px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-2.5 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: lastPage }, (_, i) => i + 1)
                .filter(p => p === 1 || p === lastPage || Math.abs(p - page) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-1.5 text-gray-300 font-bold">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`min-w-[38px] h-9 flex items-center justify-center rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        page === p 
                          ? 'bg-primary-600 text-white shadow-sm scale-105' 
                          : 'bg-white dark:bg-zinc-900 text-gray-500 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 hover:text-primary-600 shadow-sm'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              disabled={page === lastPage || lastPage === 0}
              onClick={() => setPage(p => Math.min(lastPage, p + 1))}
              className="p-2.5 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Edit Access Modal Dialog */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="fixed inset-0 bg-gray-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 p-8 overflow-visible"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Atur Hak Akses</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{editingUser.name}</p>
                </div>
                <button onClick={() => setEditingUser(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pilih Role Baru</label>
                  <DropdownSelect
                    value={editRole}
                    onChange={(val) => setEditRole(String(val))}
                    options={ROLE_EDIT_OPTIONS}
                    className="w-full"
                  />
                </div>

                {(editRole === 'admin fakultas' || editRole === 'dosen') && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fakultas</label>
                      <DropdownSelect
                        value={editFakultas}
                        onChange={(val) => handleFakultasChange(String(val))}
                        options={fakultasOptions}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Program Studi</label>
                      <DropdownSelect
                        value={editProdi}
                        onChange={(val) => setEditProdi(String(val))}
                        options={prodiOptions}
                        disabled={!editFakultas}
                        position="top"
                        className="w-full"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setEditingUser(null)}
                    className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSaveUser}
                    disabled={savingUser}
                    className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg disabled:opacity-40 transition-colors"
                  >
                    {savingUser ? 'Menyimpan...' : 'Simpan Hak Akses'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
