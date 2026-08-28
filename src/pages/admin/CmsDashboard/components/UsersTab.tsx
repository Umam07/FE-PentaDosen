import React, { useMemo } from 'react';
import { Edit, X, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUsersTab, FAKULTAS_PRODI_MAP } from '../hooks/useUsersTab';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { TableFilterHeader } from '../../../../components/shared/TableFilterHeader';
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

  const hasActiveFilter = Boolean(search || selectedRole);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark shadow-xs overflow-hidden">
      {/* Search and Filters Bar */}
      <TableFilterHeader
        icon={Users}
        title="Manajemen User & Hak Akses"
        description="Kelola hak akses pengguna, peranan sistem, serta unit fakultas & prodi."
        showSearch
        searchTerm={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        searchPlaceholder="Cari user (nama, email, NIDN)..."
        searchWidthClassName="w-full sm:w-[280px] md:w-[320px] xl:w-[360px]"
        hasActiveFilter={hasActiveFilter}
        onResetFilters={() => {
          setSearch('');
          setSelectedRole('');
          setPage(1);
        }}
      >
        <div className="w-full sm:w-[200px] shrink-0">
          <DropdownSelect
            value={selectedRole}
            onChange={(val) => { setSelectedRole(String(val)); setPage(1); }}
            options={ROLE_FILTER_OPTIONS}
          />
        </div>
      </TableFilterHeader>

      {/* Users Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-xs">
          <thead className="bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">User</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">NIDN</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Role</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Fakultas / Prodi</th>
              <th className="px-6 py-3.5 text-center text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-5 bg-surface-light-raised/30 h-16"></td>
                </tr>
              ))
            ) : users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.avatar ? (
                        <img 
                          src={u.avatar} 
                          alt="" 
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-hairline-light dark:ring-hairline-dark shadow-xs"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-xs uppercase shadow-xs ${getRoleAvatarStyle(u.role)}`}>
                          {u.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-ink-heading dark:text-on-dark text-xs">{u.name}</p>
                        <p className="text-[10px] font-mono text-muted dark:text-on-dark-muted mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {u.nidn ? (
                      <span className="font-mono text-xs font-semibold text-ink-heading dark:text-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated px-2.5 py-1 rounded-md border border-hairline-light-soft dark:border-hairline-dark-soft inline-block">
                        {u.nidn}
                      </span>
                    ) : (
                      <span className="text-muted-soft dark:text-on-dark-muted text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${getRoleBadgeStyle(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">{u.fakultas || '-'}</p>
                    <p className="text-[10px] text-muted dark:text-on-dark-muted mt-0.5">{u.program_studi || '-'}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleOpenEdit(u)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-ink-heading dark:text-on-dark bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                      aria-label="Atur Hak Akses"
                      title="Atur Hak Akses"
                    >
                      <Edit className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />
                      <span>Hak Akses</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted dark:text-on-dark-muted font-medium text-xs">
                  Tidak ada data user yang sesuai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && users.length > 0 && (
        <div className="px-6 py-4 border-t border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted dark:text-on-dark-muted">
              Menampilkan <span className="font-semibold font-mono text-ink-heading dark:text-on-dark">{(page - 1) * perPage + 1} - {Math.min(page * perPage, total)}</span> dari <span className="font-semibold font-mono text-ink-heading dark:text-on-dark">{total}</span> Users
            </span>
            <div className="h-4 w-px bg-hairline-light dark:bg-hairline-dark hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-muted dark:text-on-dark-muted">Limit:</span>
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
              className="p-2 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: lastPage }, (_, i) => i + 1)
                .filter(p => p === 1 || p === lastPage || Math.abs(p - page) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-1 text-muted-soft dark:text-on-dark-muted text-xs font-mono">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`min-w-[34px] h-8 flex items-center justify-center rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        page === p 
                          ? 'bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark font-semibold shadow-xs' 
                          : 'bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark'
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
              className="p-2 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
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
              className="fixed inset-0 bg-ink/40 dark:bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-hairline-light dark:border-hairline-dark p-6 md:p-8 overflow-visible"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight">Atur Hak Akses</h3>
                  <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5">{editingUser.name}</p>
                </div>
                <button 
                  onClick={() => setEditingUser(null)} 
                  className="p-1.5 text-muted hover:text-ink-heading dark:hover:text-on-dark rounded-xl hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">Pilih Role Baru</label>
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
                      <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">Fakultas</label>
                      <DropdownSelect
                        value={editFakultas}
                        onChange={(val) => handleFakultasChange(String(val))}
                        options={fakultasOptions}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-ink-heading dark:text-on-dark">Program Studi</label>
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
                    className="flex-1 py-2.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSaveUser}
                    disabled={savingUser}
                    className="flex-1 py-2.5 bg-ink hover:bg-ink/90 dark:bg-surface-dark-elevated dark:hover:bg-surface-dark-elevated/80 text-on-ink dark:text-on-dark rounded-xl text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors cursor-pointer"
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
