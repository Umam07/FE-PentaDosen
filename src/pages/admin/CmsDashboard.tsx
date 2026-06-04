import React, { useState, useEffect } from 'react';
import { 
  Users, Settings, Megaphone, HelpCircle, FileSpreadsheet, 
  Search, Edit, Trash2, Plus, Save, Upload, Calendar, 
  CheckCircle, AlertCircle, RefreshCw, X, ShieldAlert 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CmsDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'users' | 'kpi' | 'announcements' | 'faq' | 'templates'>('users');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Trigger temporary notification message
  const triggerMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="max-w-none space-y-6 lg:space-y-8 pb-12">
      {/* Header Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 shadow-sm rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary-50 dark:bg-primary-950/30 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/30 shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Super Admin CMS Panel</h3>
            <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
              Pusat konfigurasi master data, pengumuman, panduan, berkas template, dan hak akses
            </p>
          </div>
        </div>
      </motion.div>

      {/* Global Alerts */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl flex items-center gap-3 border ${
              messageType === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' 
                : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30'
            }`}
          >
            {messageType === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="text-xs font-black uppercase tracking-wider">{message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
        {[
          { id: 'users', label: 'Hak Akses & Users', icon: Users },
          { id: 'kpi', label: 'Bobot KPI & Periode', icon: Settings },
          { id: 'announcements', label: 'Pengumuman', icon: Megaphone },
          { id: 'faq', label: 'Panduan & FAQ', icon: HelpCircle },
          { id: 'templates', label: 'Template Berkas', icon: FileSpreadsheet },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/30'
                : 'bg-white dark:bg-zinc-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600 border border-gray-100 dark:border-zinc-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dynamic Content Rendering */}
      <div className="mt-4">
        {activeTab === 'users' && <UsersTab triggerMessage={triggerMessage} />}
        {activeTab === 'kpi' && <KpiTab triggerMessage={triggerMessage} />}
        {activeTab === 'announcements' && <AnnouncementsTab triggerMessage={triggerMessage} user={user} />}
        {activeTab === 'faq' && <FaqTab triggerMessage={triggerMessage} />}
        {activeTab === 'templates' && <TemplatesTab triggerMessage={triggerMessage} />}
      </div>
    </div>
  );
}

// ============================================================================
// TAB 1: USER ACCESS MANAGEMENT
// ============================================================================
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

function UsersTab({ triggerMessage }: { triggerMessage: any }) {
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
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all text-gray-900 dark:text-zinc-100"
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
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100 cursor-pointer"
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
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100 disabled:opacity-50 cursor-pointer"
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

// ============================================================================
// TAB 2: KPI POINT WEIGHTS & ACCREDITATION PERIOD
// ============================================================================
function KpiTab({ triggerMessage }: { triggerMessage: any }) {
  const [weights, setWeights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingWeights, setSavingWeights] = useState(false);

  // Period settings
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [periodLabel, setPeriodLabel] = useState('');
  const [savingPeriod, setSavingPeriod] = useState(false);

  // New category state
  const [newCategory, setNewCategory] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const fetchKpiData = async () => {
    setLoading(true);
    try {
      const resW = await fetch('/api/cms/weights');
      const dataW = await resW.json();
      setWeights(dataW.weights || []);

      const resP = await fetch('/api/cms/settings');
      const dataP = await resP.json();
      setPeriodStart(dataP.kpi_period_start || '');
      setPeriodEnd(dataP.kpi_period_end || '');
      setPeriodLabel(dataP.kpi_period_label || '');
    } catch (e) {
      triggerMessage('Gagal mengambil data master KPI.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpiData();
  }, []);

  const handleWeightChange = (index: number, val: number) => {
    const updated = [...weights];
    updated[index].weight_value = val;
    setWeights(updated);
  };

  const handleSaveWeights = async () => {
    setSavingWeights(true);
    try {
      const res = await fetch('/api/cms/weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weights })
      });
      if (res.ok) {
        triggerMessage('Bobot poin KPI berhasil disimpan!');
      } else {
        triggerMessage('Gagal menyimpan bobot poin.', 'error');
      }
    } catch (e) {
      triggerMessage('Terjadi kesalahan.', 'error');
    } finally {
      setSavingWeights(false);
    }
  };

  const handleSavePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPeriod(true);
    try {
      const res = await fetch('/api/cms/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kpi_period_start: periodStart,
          kpi_period_end: periodEnd,
          kpi_period_label: periodLabel
        })
      });
      if (res.ok) {
        triggerMessage('Periode akreditasi kpi berhasil diperbarui!');
      } else {
        triggerMessage('Gagal menyimpan periode akreditasi.', 'error');
      }
    } catch (e) {
      triggerMessage('Terjadi kesalahan.', 'error');
    } finally {
      setSavingPeriod(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || !newWeight) return;
    setAddingCategory(true);
    try {
      const res = await fetch('/api/cms/weights/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newCategory,
          weight_value: parseInt(newWeight)
        })
      });
      const data = await res.json();
      if (res.ok) {
        triggerMessage('Kategori KPI baru berhasil ditambahkan!');
        setNewCategory('');
        setNewWeight('');
        fetchKpiData();
      } else {
        triggerMessage(data.message || 'Gagal menambahkan kategori.', 'error');
      }
    } catch (e) {
      triggerMessage('Terjadi kesalahan.', 'error');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (category: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${category}"?`)) return;
    try {
      const res = await fetch(`/api/cms/weights/${encodeURIComponent(category)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        triggerMessage('Kategori berhasil dihapus.');
        fetchKpiData();
      } else {
        triggerMessage('Gagal menghapus kategori.', 'error');
      }
    } catch (e) {
      triggerMessage('Terjadi kesalahan.', 'error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
      {/* Bobot Point Table (Col-2) */}
      <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 space-y-6 shadow-sm">
        <div>
          <h3 className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight flex items-center gap-2">
            Bobot KPI Poin Dokumen
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Mengatur besaran poin dinamis dari masing-masing kategori berkas.</p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-2xl" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 text-gray-400 font-bold uppercase tracking-widest">
                    <th className="py-3 text-left">Kategori Dokumen</th>
                    <th className="py-3 text-center w-24">Bobot Poin</th>
                    <th className="py-3 text-right w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800 font-bold text-gray-700 dark:text-zinc-300">
                  {weights.map((w, idx) => (
                    <tr key={w.category}>
                      <td className="py-3.5 text-left font-extrabold text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{w.category}</td>
                      <td className="py-3.5 text-center">
                        <input
                          type="number"
                          value={w.weight_value}
                          onChange={(e) => handleWeightChange(idx, parseInt(e.target.value) || 0)}
                          className="w-16 px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg text-center font-bold text-xs outline-none text-gray-900 dark:text-zinc-100"
                        />
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteCategory(w.category)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end pt-3">
            <button
              onClick={handleSaveWeights}
              disabled={savingWeights || loading}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 dark:shadow-primary-900/20 disabled:opacity-40"
            >
              <Save className="w-4 h-4" />
              {savingWeights ? 'Menyimpan...' : 'Simpan Semua Bobot'}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-zinc-800 pt-6 space-y-4">
          <div>
            <h4 className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-widest">Tambah Kategori Baru</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Tambah jenis kategori penilaian KPI dosen baru ke sistem</p>
          </div>

          <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="Nama kategori (e.g. Pengabdian)..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-3.5 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none text-gray-900 dark:text-zinc-100"
            />
            <input
              type="number"
              required
              placeholder="Poin..."
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="w-full sm:w-24 px-4 py-3.5 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-2xl text-xs font-bold text-center outline-none text-gray-900 dark:text-zinc-100"
            />
            <button
              type="submit"
              disabled={addingCategory}
              className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
              {addingCategory ? 'Adding...' : 'Tambah'}
            </button>
          </form>
        </div>
      </div>

      {/* KPI Period Settings (Col-1) */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 space-y-6 shadow-sm">
        <div>
          <h3 className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight flex items-center gap-2">
            Periode Akreditasi KPI
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Mengatur range tanggal aktif dokumen yang dinilai untuk KPI.</p>
        </div>

        <form onSubmit={handleSavePeriod} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Label Periode</label>
            <input
              type="text"
              required
              placeholder="Contoh: 2025-2027"
              value={periodLabel}
              onChange={(e) => setPeriodLabel(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none text-gray-900 dark:text-zinc-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tanggal Mulai</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="date"
                required
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none text-gray-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tanggal Selesai</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="date"
                required
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none text-gray-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPeriod || loading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 dark:shadow-primary-900/20 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {savingPeriod ? 'Menyimpan...' : 'Perbarui Periode'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// TAB 3: ANNOUNCEMENTS MANAGEMENT
// ============================================================================
function AnnouncementsTab({ triggerMessage, user }: { triggerMessage: any, user: any }) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/announcements');
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch (e) {
      triggerMessage('Gagal mengambil data pengumuman.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setIsActive(true);
    setExpiresAt('');
    setIsOpenForm(true);
  };

  const handleOpenEdit = (a: any) => {
    setEditingId(a.id);
    setTitle(a.title);
    setContent(a.content);
    setIsActive(a.is_active);
    setExpiresAt(a.expires_at ? a.expires_at.substring(0, 10) : '');
    setIsOpenForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/api/cms/announcements/${editingId}` : '/api/cms/announcements';
      const method = editingId ? 'PUT' : 'POST';
      const payload = {
        title,
        content,
        is_active: isActive,
        expires_at: expiresAt || null,
        created_by: user.id
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        triggerMessage(data.message || 'Pengumuman berhasil disimpan!');
        setIsOpenForm(false);
        fetchAnnouncements();
      } else {
        triggerMessage(data.message || 'Gagal menyimpan pengumuman.', 'error');
      }
    } catch (e) {
      triggerMessage('Terjadi kesalahan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) return;
    try {
      const res = await fetch(`/api/cms/announcements/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        triggerMessage('Pengumuman berhasil dihapus.');
        fetchAnnouncements();
      } else {
        triggerMessage('Gagal menghapus pengumuman.', 'error');
      }
    } catch (e) {
      triggerMessage('Terjadi kesalahan.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Daftar Pengumuman Aktif</p>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Terbitkan Pengumuman
        </button>
      </div>

      {/* Grid of Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          [1, 2].map(i => <div key={i} className="h-44 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl animate-pulse" />)
        ) : announcements.length > 0 ? (
          announcements.map((a) => (
            <div key={a.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 flex flex-col justify-between gap-4 shadow-sm relative overflow-hidden">
              {!a.is_active && (
                <div className="absolute top-0 right-0 bg-red-150 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-xl border-l border-b border-red-200 dark:border-red-900/30">
                  Non-aktif
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <Megaphone className="w-3.5 h-3.5 text-primary-500" />
                  <span>Dibuat: {a.created_at ? a.created_at.substring(0, 10) : ''}</span>
                  {a.expires_at && <span className="text-amber-500">Exp: {a.expires_at.substring(0, 10)}</span>}
                </div>
                <h4 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{a.title}</h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed font-bold truncate-multiline max-h-16 overflow-hidden">
                  {a.content}
                </p>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-50 dark:border-zinc-800 pt-4">
                <button
                  onClick={() => handleOpenEdit(a)}
                  className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 hover:text-primary-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-gray-100 dark:border-zinc-800 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-gray-100 dark:border-zinc-800 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-12 text-center text-gray-400 font-bold italic uppercase text-xs tracking-widest">
            Belum ada pengumuman yang diterbitkan.
          </div>
        )}
      </div>

      {/* Editor Modal Popup */}
      <AnimatePresence>
        {isOpenForm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenForm(false)}
              className="fixed inset-0 bg-gray-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 p-8 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                    {editingId ? 'Edit Pengumuman' : 'Terbitkan Pengumuman Baru'}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Informasikan informasi penting kepada seluruh dosen.</p>
                </div>
                <button onClick={() => setIsOpenForm(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Judul Pengumuman</label>
                  <input
                    type="text"
                    required
                    placeholder="Judul info..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Konten / Isi Pengumuman</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tuliskan detail pengumuman..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Batas Kedaluwarsa (Expired Date)</label>
                    <input
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 pt-6 pl-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <label htmlFor="isActive" className="text-xs font-black text-gray-700 dark:text-zinc-300 uppercase tracking-widest cursor-pointer select-none">Tampilkan Langsung (Aktif)</label>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpenForm(false)}
                    className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 rounded-xl text-xs font-black uppercase tracking-widest"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg disabled:opacity-40"
                  >
                    {saving ? 'Menerbitkan...' : 'Terbitkan Sekarang'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// TAB 4: FAQ & GUIDE ARTICLES MANAGEMENT
// ============================================================================
function FaqTab({ triggerMessage }: { triggerMessage: any }) {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState<number | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('Umum');
  const [orderIndex, setOrderIndex] = useState('0');
  const [saving, setSaving] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/faqs');
      const data = await res.json();
      setFaqs(data.faqs || []);
    } catch (e) {
      triggerMessage('Gagal mengambil data FAQ.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setQuestion('');
    setAnswer('');
    setCategory('Umum');
    setOrderIndex('0');
    setIsOpenForm(true);
  };

  const handleOpenEdit = (f: any) => {
    setEditingId(f.id);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category);
    setOrderIndex((f.order_index ?? 0).toString());
    setIsOpenForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/api/cms/faqs/${editingId}` : '/api/cms/faqs';
      const method = editingId ? 'PUT' : 'POST';
      const payload = {
        question,
        answer,
        category,
        order_index: parseInt(orderIndex) || 0
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        triggerMessage(data.message || 'Panduan berhasil disimpan!');
        setIsOpenForm(false);
        fetchFaqs();
      } else {
        triggerMessage(data.message || 'Gagal menyimpan panduan.', 'error');
      }
    } catch (e) {
      triggerMessage('Terjadi kesalahan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus panduan FAQ ini?')) return;
    try {
      const res = await fetch(`/api/cms/faqs/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        triggerMessage('Panduan FAQ berhasil dihapus.');
        fetchFaqs();
      } else {
        triggerMessage('Gagal menghapus panduan.', 'error');
      }
    } catch (e) {
      triggerMessage('Terjadi kesalahan.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Daftar Tanya Jawab / Panduan</p>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Panduan / FAQ
        </button>
      </div>

      {/* Grid of FAQs */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-150 dark:divide-zinc-800 text-sm">
          <thead className="bg-gray-50/50 dark:bg-zinc-800/30">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-20">Urutan</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-36">Kategori</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Pertanyaan / Topik</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Jawaban / Panduan</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800 text-gray-700 dark:text-zinc-300">
            {loading ? (
              [1, 2, 3].map(i => <tr key={i} className="animate-pulse"><td colSpan={5} className="px-6 py-5 bg-gray-50/10 h-16" /></tr>)
            ) : faqs.length > 0 ? (
              faqs.map((f) => (
                <tr key={f.id} className="hover:bg-primary-50/10 transition-colors">
                  <td className="px-6 py-4 text-xs font-black text-center text-gray-500">{f.order_index ?? 0}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-lg text-[9px] font-black uppercase tracking-wider text-gray-600 dark:text-zinc-400">
                      {f.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-gray-900 dark:text-zinc-100 uppercase tracking-tight text-xs">{f.question}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500 max-w-sm truncate">{f.answer}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(f)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-zinc-800 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-zinc-800 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold italic uppercase text-xs tracking-widest">
                  Belum ada tanya jawab / panduan penggunaan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Editor Modal Popup */}
      <AnimatePresence>
        {isOpenForm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenForm(false)}
              className="fixed inset-0 bg-gray-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 p-8 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                    {editingId ? 'Edit Panduan / FAQ' : 'Tambah Panduan / FAQ Baru'}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Panduan tata cara penggunaan fitur bagi pengguna dosen.</p>
                </div>
                <button onClick={() => setIsOpenForm(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Kategori Panduan</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100 cursor-pointer"
                    >
                      <option value="Umum">Umum</option>
                      <option value="Google Scholar">Google Scholar</option>
                      <option value="Scopus">Scopus</option>
                      <option value="Upload KPI">Upload KPI</option>
                      <option value="Penelitian">Penelitian</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Urutan Tampil (Order)</label>
                    <input
                      type="number"
                      required
                      value={orderIndex}
                      onChange={(e) => setOrderIndex(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Topik / Pertanyaan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bagaimana cara sinkronisasi data Scopus?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Detail Panduan / Jawaban</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Tuliskan isi panduan lengkap langkah demi langkah..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100 resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpenForm(false)}
                    className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 rounded-xl text-xs font-black uppercase tracking-widest"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg disabled:opacity-40"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Panduan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// TAB 5: DOCUMENT EXCEL TEMPLATES MANAGEMENT
// ============================================================================
function TemplatesTab({ triggerMessage }: { triggerMessage: any }) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/templates');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (e) {
      triggerMessage('Gagal mengambil data template.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      triggerMessage('Hanya file Excel (.xlsx, .xls) yang diperbolehkan.', 'error');
      return;
    }

    setUploadingType(type);
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file);

    try {
      const res = await fetch('/api/cms/templates/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        triggerMessage(data.message || 'Template berkas excel berhasil diunggah!');
        fetchTemplates();
      } else {
        triggerMessage(data.message || 'Gagal mengunggah template.', 'error');
      }
    } catch (e) {
      triggerMessage('Terjadi kesalahan.', 'error');
    } finally {
      setUploadingType(null);
      if (e.target) e.target.value = '';
    }
  };

  const getTemplateForType = (type: string) => {
    return templates.find(t => t.type === type);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 space-y-6 shadow-sm">
      <div>
        <h3 className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
          Unggah Template Import Excel kustom
        </h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
          Dosen akan mengunduh template kustom yang diunggah di sini saat tombol "Download Template" diklik di modul masing-masing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { type: 'research', label: 'Template Import Penelitian' },
          { type: 'publication', label: 'Template Import Publikasi Jurnal' },
          { type: 'hki', label: 'Template Import HKI' },
          { type: 'buku', label: 'Template Import Buku' },
        ].map((item) => {
          const t = getTemplateForType(item.type);
          return (
            <div key={item.type} className="p-5 border border-gray-150 dark:border-zinc-800 rounded-2xl flex flex-col justify-between gap-4 bg-gray-50/20 dark:bg-zinc-800/10">
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-widest flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  {item.label}
                </h4>
                {t ? (
                  <div className="text-[10px] font-bold text-gray-500">
                    <p className="truncate">File aktif: <span className="font-extrabold text-gray-700 dark:text-zinc-300">{t.file_name}</span></p>
                    <p className="mt-0.5 text-gray-400">Diunggah pada: {t.uploaded_at ? t.uploaded_at.substring(0, 16).replace('T', ' ') : ''}</p>
                  </div>
                ) : (
                  <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider italic">
                    Belum ada template kustom (menggunakan fallback program ExcelJS)
                  </p>
                )}
              </div>

              <div>
                <label className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 rounded-xl cursor-pointer shadow-sm text-gray-700 dark:text-zinc-300 ${uploadingType === item.type ? 'opacity-50 pointer-events-none' : ''}`}>
                  <Upload className="w-4 h-4 text-primary-500" />
                  {uploadingType === item.type ? 'Uploading...' : 'Unggah File Excel'}
                  <input type="file" accept=".xlsx, .xls" className="sr-only" onChange={(e) => handleFileUpload(e, item.type)} disabled={uploadingType === item.type} />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
