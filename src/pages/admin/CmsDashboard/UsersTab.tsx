import React, { useState, useEffect } from 'react';
import { Search, Edit, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAKULTAS_PRODI_MAP: Record<string, string[]> = {
  'Fakultas Kedokteran': ['Kedokteran'],
  'Fakultas Kedokteran Gigi': ['Kedokteran Gigi'],
  'Fakultas Teknologi Informasi': ['Teknik Informatika', 'Perpustakaan dan Sains Informasi'],
  'Fakultas Ekonomi dan Bisnis': ['Manajemen', 'Akuntansi'],
  'Fakultas Hukum': ['Ilmu Hukum'],
  'Fakultas Psikologi': ['Psikologi']
};

const findNormalizedFakultas = (val: string) => {
  if (!val) return '';
  const key = Object.keys(FAKULTAS_PRODI_MAP).find(
    k => k.toLowerCase() === val.toLowerCase()
  );
  return key || '';
};

const findNormalizedProdi = (fakultasKey: string, val: string) => {
  if (!fakultasKey || !val) return '';
  const list = FAKULTAS_PRODI_MAP[fakultasKey] || [];
  const found = list.find(p => p.toLowerCase() === val.toLowerCase());
  return found || '';
};

export default function UsersTab({ triggerMessage }: { triggerMessage: (text: string, type?: 'success' | 'error') => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Edit user modal state
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editFakultas, setEditFakultas] = useState('');
  const [editProdi, setEditProdi] = useState('');
  const [savingUser, setSavingUser] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cms/users?search=${search}&role=${selectedRole}&page=${page}`);
      const data = await res.json();
      setUsers(data.data || []);
      setLastPage(data.last_page || 1);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(e);
      triggerMessage('Gagal mengambil data user.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, selectedRole]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleOpenEdit = (u: any) => {
    setEditingUser(u);
    setEditRole(u.role || 'dosen');
    const normFak = findNormalizedFakultas(u.fakultas || '');
    setEditFakultas(normFak);
    setEditProdi(findNormalizedProdi(normFak, u.program_studi || ''));
  };

  const handleFakultasChange = (fakKey: string) => {
    setEditFakultas(fakKey);
    const prodis = FAKULTAS_PRODI_MAP[fakKey] || [];
    if (prodis.length > 0) {
      setEditProdi(prodis[0]);
    } else {
      setEditProdi('');
    }
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    setSavingUser(true);
    try {
      const res = await fetch(`/api/admin/cms/users/${editingUser.id}/assign-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: editRole,
          fakultas: editFakultas,
          program_studi: editProdi
        })
      });
      const data = await res.json();
      if (res.ok) {
        triggerMessage(data.message || 'Hak akses berhasil diperbarui!');
        setEditingUser(null);
        fetchUsers();
      } else {
        triggerMessage(data.message || 'Gagal memperbarui hak akses.', 'error');
      }
    } catch (e) {
      triggerMessage('Terjadi kesalahan.', 'error');
    } finally {
      setSavingUser(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
      {/* Search and Filters Bar */}
      <div className="p-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/20 dark:bg-zinc-800/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-96">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari user (nama, email, nidn)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-805 border border-gray-200 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all text-gray-900 dark:text-zinc-100"
            />
          </div>
          <button type="submit" className="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md">
            Cari
          </button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <select
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); setPage(1); }}
            className="px-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none text-gray-700 dark:text-zinc-300 cursor-pointer"
          >
            <option value="">Semua Role</option>
            <option value="dosen">Dosen</option>
            <option value="staf">Staf</option>
            <option value="admin lppm">Admin Penelitian</option>
            <option value="admin fakultas">Admin Fakultas</option>
            <option value="reviewer">Reviewer</option>
            <option value="super admin">Super Admin</option>
          </select>
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
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-black text-sm uppercase">
                        {u.name?.charAt(0)}
                      </div>
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
                    <span className={`inline-flex px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                      u.role === 'super admin' ? 'bg-red-50 text-red-700 border-red-100' :
                      u.role === 'admin lppm' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      u.role === 'admin fakultas' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                      u.role === 'reviewer' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                      'bg-gray-50 text-gray-600 border-gray-100'
                    }`}>
                      {u.role === 'admin lppm' ? 'admin penelitian' : u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-extrabold text-gray-700 dark:text-zinc-300 uppercase tracking-tight">{u.fakultas || '-'}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{u.program_studi || '-'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleOpenEdit(u)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-zinc-800 rounded-xl transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
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

      {/* Pagination */}
      {users.length > 0 && (
        <div className="p-6 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/10 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total: {total} Users</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-4 py-2 border rounded-xl text-xs font-black uppercase tracking-wider bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-500 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={page === lastPage}
              onClick={() => setPage(p => Math.min(lastPage, p + 1))}
              className="px-4 py-2 border rounded-xl text-xs font-black uppercase tracking-wider bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-500 disabled:opacity-40"
            >
              Next
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
              className="fixed inset-0 bg-gray-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 p-8 overflow-hidden"
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
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100"
                  >
                    <option value="dosen">Dosen</option>
                    <option value="staf">Staf</option>
                    <option value="admin lppm">Admin Penelitian</option>
                    <option value="admin fakultas">Admin Fakultas</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="super admin">Super Admin</option>
                  </select>
                </div>

                {(editRole === 'admin fakultas' || editRole === 'dosen') && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Fakultas</label>
                      <select
                        value={editFakultas}
                        onChange={(e) => handleFakultasChange(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-855 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100 cursor-pointer"
                      >
                        <option value="">Pilih Fakultas</option>
                        {Object.keys(FAKULTAS_PRODI_MAP).map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Program Studi</label>
                      <select
                        value={editProdi}
                        onChange={(e) => setEditProdi(e.target.value)}
                        disabled={!editFakultas}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-855 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100 disabled:opacity-50 cursor-pointer"
                      >
                        <option value="">Pilih Program Studi</option>
                        {(FAKULTAS_PRODI_MAP[editFakultas] || []).map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div className="pt-4 flex gap-3">
                  <button 
                    onClick={() => setEditingUser(null)}
                    className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 rounded-xl text-xs font-black uppercase tracking-widest"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSaveUser}
                    disabled={savingUser}
                    className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg disabled:opacity-40"
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
