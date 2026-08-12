import React, { useMemo } from 'react';
import { Search, Edit, X, ChevronLeft, ChevronRight, Users } from 'lucide-react';
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
  { value: 'admin penelitian', label: 'Admin Penelitian' }
];

const ROLE_EDIT_OPTIONS = [
  { value: 'dosen', label: 'Dosen' },
  { value: 'admin fakultas', label: 'Admin Fakultas' },
  { value: 'admin penelitian', label: 'Admin Penelitian' }
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
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs">
      {/* Search and Filters Bar */}
      <div className="p-5 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col xl:flex-row items-center justify-between gap-4">

        {/* Left: Sub-header */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="hidden md:flex p-2.5 bg-primary-50 dark:bg-primary-950/40 rounded-xl text-primary-600 dark:text-primary-400 border border-primary-200/60 dark:border-primary-800/40">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
              Manajemen User & Hak Akses
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
              Kelola hak akses pengguna, peranan sistem, serta unit fakultas & prodi.
            </p>
          </div>
        </div>

        {/* Right: Search + Filter Role */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full xl:w-[360px]">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Cari user (nama, email, NIDN)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 active:scale-98 text-white rounded-xl text-xs font-semibold tracking-wide shadow-xs transition-all shrink-0 cursor-pointer"
            >
              Cari
            </button>
          </form>

          <DropdownSelect
            value={selectedRole}
            onChange={(val) => { setSelectedRole(String(val)); setPage(1); }}
            options={ROLE_FILTER_OPTIONS}
            className="w-full sm:w-[200px]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800 text-xs">
          <thead className="bg-gray-50/80 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">User</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">NIDN</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Fakultas / Prodi</th>
              <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-5 bg-gray-50/10 h-16"></td>
                </tr>
              ))
            ) : users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.avatar ? (
                        <img 
                          src={u.avatar} 
                          alt="" 
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-zinc-700 shadow-xs"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-xs ${getRoleAvatarStyle(u.role)}`}>
                          {u.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900 dark:text-zinc-100 text-xs">{u.name}</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {u.nidn ? (
                      <span className="font-mono text-xs font-semibold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-md border border-gray-200/60 dark:border-zinc-700/60 inline-block">
                        {u.nidn}
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-zinc-500 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${getRoleBadgeStyle(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-semibold text-gray-900 dark:text-zinc-100">{u.fakultas || '-'}</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{u.program_studi || '-'}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleOpenEdit(u)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 hover:bg-primary-100 dark:hover:bg-primary-900/60 border border-primary-200/60 dark:border-primary-800/40 rounded-xl transition-all cursor-pointer shadow-xs"
                      aria-label="Atur Hak Akses"
                      title="Atur Hak Akses"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Hak Akses</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 dark:text-zinc-500 font-medium text-xs">
                  Tidak ada data user yang sesuai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && users.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 dark:text-zinc-400">
              Menampilkan <span className="font-semibold text-gray-800 dark:text-zinc-200">{(page - 1) * perPage + 1} - {Math.min(page * perPage, total)}</span> dari <span className="font-semibold text-gray-800 dark:text-zinc-200">{total}</span> Users
            </span>
            <div className="h-4 w-px bg-gray-200 dark:bg-zinc-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-gray-400">Limit:</span>
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

          <div className="flex items-center gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-primary-600 hover:border-primary-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: lastPage }, (_, i) => i + 1)
                .filter(p => p === 1 || p === lastPage || Math.abs(p - page) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-1 text-gray-300 dark:text-zinc-600 text-xs">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`min-w-[34px] h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                        page === p 
                          ? 'bg-primary-600 text-white shadow-xs' 
                          : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600'
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
              className="p-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-primary-600 hover:border-primary-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
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
              className="fixed inset-0 bg-gray-950/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-200 dark:border-zinc-800 p-6 md:p-8 overflow-visible"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Atur Hak Akses</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{editingUser.name}</p>
                </div>
                <button 
                  onClick={() => setEditingUser(null)} 
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Pilih Role Baru</label>
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
                      <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Fakultas</label>
                      <DropdownSelect
                        value={editFakultas}
                        onChange={(val) => handleFakultasChange(String(val))}
                        options={fakultasOptions}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300">Program Studi</label>
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
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSaveUser}
                    disabled={savingUser}
                    className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-sm disabled:opacity-40 transition-colors"
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
