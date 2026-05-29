import React, { useState, useEffect } from 'react';
import { 
  Users, GraduationCap, TrendingUp, Search, Edit3, Save, 
  X, ChevronRight, Mail, BookOpen, ChevronLeft, Filter, 
  UserCircle2, BadgeCheck
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLecturers() {
  const { user } = useOutletContext<{ user: any }>();
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFakultas, setSelectedFakultas] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editScholar, setEditScholar] = useState<{ [key: string]: string }>({});
  const [editScopus, setEditScopus] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchLecturers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFakultas]);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/lecturers?role=${user?.role}&user_id=${user?.id}`);
      const data = await res.json();
      setLecturers(data.lecturers);
      const initialScholar: any = {};
      const initialScopus: any = {};
      data.lecturers.forEach((l: any) => {
        initialScholar[l.id] = l.scholar_id || '';
        initialScopus[l.id] = l.scopus_id || '';
      });
      setEditScholar(initialScholar);
      setEditScopus(initialScopus);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBulk = async () => {
    try {
      setSaving(true);
      const updatesScholar = lecturers.map(l => ({ id: l.id, scholar_id: editScholar[l.id] }));
      const updatesScopus = lecturers.map(l => ({ id: l.id, scopus_id: editScopus[l.id] }));

      await Promise.all([
        fetch('/api/admin/lecturers/bulk-scholar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lecturers: updatesScholar })
        }),
        fetch('/api/admin/lecturers/bulk-scopus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lecturers: updatesScopus })
        })
      ]);

      setIsEditing(false);
      fetchLecturers();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filteredLecturers = lecturers.filter((l: any) => {
    const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (l.program_studi && l.program_studi.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchFakultas = selectedFakultas ? l.fakultas === selectedFakultas : true;
    return matchSearch && matchFakultas;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLecturers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLecturers.length / itemsPerPage);

  return (
    <div className="max-w-none space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Database Dosen</h1>
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Manajemen ID Publikasi & Pemantauan Kinerja
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div 
                key="editing-actions"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex gap-2 w-full"
              >
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 sm:flex-none px-6 py-3 border border-gray-200 dark:border-zinc-700 rounded-2xl bg-white dark:bg-zinc-800 text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-zinc-700 active:scale-95 transition-all shadow-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveBulk}
                  disabled={saving}
                  className="flex-1 sm:flex-none px-6 py-3 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/10 hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Simpan'}
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="edit-button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl text-[10px] font-black text-gray-700 dark:text-zinc-300 uppercase tracking-widest hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:border-primary-200 hover:text-primary-600 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Edit3 className="h-4 w-4" />
                Edit Bulk IDs
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/10 backdrop-blur-sm">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="hidden md:flex p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400 shadow-sm border border-primary-100/50 dark:border-primary-900/30">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Eksplorasi Profil</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Daftar Dosen di Lingkungan {user?.role === 'admin lppm' ? 'Universitas' : 'Fakultas'}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="relative w-full xl:w-[400px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama dosen atau program studi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-[1.25rem] bg-white dark:bg-zinc-800 text-sm font-bold text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all shadow-inner"
                  disabled={isEditing || loading}
                />
              </div>
              {user?.role === 'admin lppm' && (
                <div className="relative w-full sm:w-[220px]">
                  <select
                    value={selectedFakultas}
                    onChange={(e) => setSelectedFakultas(e.target.value)}
                    className="appearance-none w-full px-5 py-3 pl-11 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-zinc-200 shadow-sm"
                    disabled={isEditing || loading}
                  >
                    <option value="">Semua Fakultas</option>
                    <option value="Fakultas Kedokteran">Kedokteran</option>
                    <option value="Fakultas Kedokteran Gigi">Kedokteran Gigi</option>
                    <option value="Fakultas Teknologi Informasi">Teknologi Informasi</option>
                    <option value="Fakultas Ekonomi Bisnis">Ekonomi Bisnis</option>
                    <option value="Fakultas Hukum">Hukum</option>
                    <option value="Fakultas Psikologi">Psikologi</option>
                  </select>
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="min-h-[400px]">
          {loading ? (
             <div className="p-20 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Memuat Database...</p>
             </div>
          ) : filteredLecturers.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                <Users className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic tracking-[0.2em]">Data Tidak Ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800 whitespace-nowrap">
                <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
                  <tr>
                    {['Informasi Dosen', 'Fakultas / Prodi', 'Identity Scholar', 'Identity Scopus', 'Kinerja KPI'].map((h, i) => (
                      <th key={i} className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-100/0 divide-y divide-gray-50 dark:divide-zinc-800">
                  {currentItems.map((lecturer: any, index: number) => (
                    <motion.tr 
                      key={lecturer.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      className={`group transition-all ${!isEditing ? 'hover:bg-primary-50/[0.03] dark:hover:bg-primary-900/[0.03] cursor-pointer' : ''}`}
                      onClick={() => !isEditing && navigate(`/admin/lecturers/${lecturer.id}`)}
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          {lecturer.thumbnail ? (
                            <img 
                              src={lecturer.thumbnail} 
                              alt="" 
                              className="h-12 w-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-primary-100/50 transition-all shadow-md"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 text-lg font-black border border-gray-200 dark:border-zinc-700 shadow-inner">
                              {lecturer.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-primary-600 transition-colors flex items-center gap-1.5">
                              {lecturer.name}
                              {lecturer.total_kpi_points > 100 && <BadgeCheck className="w-3.5 h-3.5 text-primary-500" />}
                            </p>
                            <div className="flex items-center text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mt-1 tracking-widest">
                              <Mail className="w-3 h-3 mr-1.5 text-primary-400/70" />
                              {lecturer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] font-black text-gray-600 dark:text-zinc-300 bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-gray-100 dark:border-zinc-700 shadow-sm">
                          {lecturer.fakultas ? `${lecturer.fakultas} • ` : ''}{lecturer.program_studi || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editScholar[lecturer.id] ?? ''}
                            onChange={(e) => setEditScholar(p => ({ ...p, [lecturer.id]: e.target.value }))}
                            onClick={(e) => e.stopPropagation()}
                            className="w-56 px-4 py-2 text-xs font-bold border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-4 focus:ring-primary-100 outline-none transition-all placeholder:text-gray-300"
                            placeholder="ID Scholar..."
                          />
                        ) : (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                              <BookOpen className="h-4 w-4 text-blue-500" />
                              {lecturer.scholar_id || <span className="text-gray-300 italic font-medium">Not Set</span>}
                            </div>
                            {lecturer.scholar_id && (
                              <p className="text-[9px] font-black text-primary-400 uppercase mt-1.5 tracking-[0.1em]">CIT: {lecturer.total_citations || 0} • HI: {lecturer.h_index || 0}</p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editScopus[lecturer.id] ?? ''}
                            onChange={(e) => setEditScopus(p => ({ ...p, [lecturer.id]: e.target.value }))}
                            onClick={(e) => e.stopPropagation()}
                            className="w-56 px-4 py-2 text-xs font-bold border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-4 focus:ring-primary-100 outline-none transition-all placeholder:text-gray-300"
                            placeholder="ID Scopus..."
                          />
                        ) : (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                              <GraduationCap className="h-4 w-4 text-orange-500" />
                              {lecturer.scopus_id || <span className="text-gray-300 italic font-medium">Not Set</span>}
                            </div>
                            {lecturer.scopus_id && (
                              <p className="text-[9px] font-black text-emerald-500 uppercase mt-1.5 tracking-[0.1em]">DOC: {lecturer.scopus_document_count || 0} • CIT: {lecturer.scopus_total_citations || 0}</p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 group/pts">
                          <div className="text-right">
                            <p className="text-base font-black text-primary-600 tracking-tight">+{lecturer.total_kpi_points?.toLocaleString() || 0}</p>
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none">Points Accum.</p>
                          </div>
                          <div className="p-2 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-300 group-hover/pts:text-primary-500 group-hover/pts:bg-primary-50 transition-all">
                             <ChevronRight className="w-4 h-4 translate-x-0 group-hover/pts:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && filteredLecturers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-8 py-8 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/5 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
                Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredLecturers.length)} of {filteredLecturers.length}
              </span>
              <div className="h-5 w-px bg-gray-200 dark:bg-zinc-700 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Limit:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold py-1 px-3 focus:ring-4 focus:ring-primary-100 outline-none cursor-pointer shadow-sm"
                >
                  {[10, 25, 50, 100].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, index, array) => (
                    <React.Fragment key={p}>
                      {index > 0 && array[index - 1] !== p - 1 && (
                        <span className="px-2 text-gray-300 font-bold">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`min-w-[44px] h-11 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          currentPage === p 
                            ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 dark:shadow-primary-900/30 scale-105' 
                            : 'bg-white dark:bg-zinc-900 text-gray-500 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 hover:text-primary-600 shadow-sm'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
              </div>

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}