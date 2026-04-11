import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, TrendingUp, Search, Edit3, Save, X, ChevronRight, Mail, BookOpen, ChevronLeft } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLecturers() {
  const { user } = useOutletContext<{ user: any }>();
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
  }, [searchTerm]);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      // Simulasi delay sedikit agar skeleton terlihat lebih jelas (bisa dihapus di production)
      
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

  const filteredLecturers = lecturers.filter((l: any) => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (l.program_studi && l.program_studi.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLecturers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLecturers.length / itemsPerPage);

  // Komponen Skeleton untuk baris tabel
  const SkeletonRow = () => (
    <tr className="animate-pulse bg-white dark:bg-zinc-900 border-b border-gray-50 dark:border-zinc-800">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gray-200 dark:bg-zinc-800"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-3 w-24 bg-gray-100 dark:bg-zinc-800/50 rounded"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="h-6 w-20 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
      </td>
      <td className="px-6 py-5">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-3 w-20 bg-gray-100 dark:bg-zinc-800/50 rounded"></div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-3 w-20 bg-gray-100 dark:bg-zinc-800/50 rounded"></div>
        </div>
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex flex-col items-end space-y-2">
          <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-3 w-20 bg-gray-100 dark:bg-zinc-800/50 rounded"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="max-w-none space-y-6 lg:space-y-10 pb-10">
      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl lg:rounded-[2rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
        
        {/* Header Responsive */}
        <div className="px-6 lg:px-8 py-6 lg:py-8 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400">
               <Users className="h-6 w-6 lg:h-8 lg:w-8" />
            </div>
            <div>
              <h3 className="text-xl lg:text-2xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Profil Dosen</h3>
              <p className="text-gray-400 dark:text-zinc-400 text-[10px] lg:text-xs font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">Manajemen ID Publikasi & Kinerja</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative group flex-1 sm:flex-none">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Cari Dosen / Prodi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl text-sm font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-gray-900 dark:text-zinc-100"
                disabled={isEditing || loading}
              />
            </div>
            
            <div className="flex gap-2">
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
                      className="flex-1 sm:flex-none px-5 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-zinc-700 active:scale-95 transition-all"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveBulk}
                      disabled={saving}
                      className="flex-1 sm:flex-none px-5 py-3 bg-primary-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-100 dark:shadow-primary-900/30 hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-2"
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
                    className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-black text-gray-700 dark:text-zinc-300 uppercase tracking-widest hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-200 hover:text-primary-600 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Bulk IDs
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Table Overflow Auto */}
        <div className="overflow-x-auto scrollbar-hide">
          <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800 whitespace-nowrap">
            <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
              <tr>
                {['Informasi Dosen', 'Unit / Prodi', 'Identity Scholar', 'Identity Scopus', 'Kinerja KPI'].map((h, i) => (
                  <th key={i} className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
              
              {/* Skeleton State */}
              {loading && Array.from({ length: 5 }).map((_, idx) => (
                <SkeletonRow key={`skeleton-${idx}`} />
              ))}

              {/* Empty State */}
              {!loading && filteredLecturers.length === 0 && (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-3xl mb-3">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Tidak ada data dosen</p>
                      <p className="text-[10px] text-gray-300 dark:text-zinc-600 font-bold uppercase mt-1">Coba gunakan kata kunci lainnya</p>
                    </div>
                  </td>
                </motion.tr>
              )}

              {/* Data Rows with Animation */}
              {!loading && currentItems.map((lecturer: any, index: number) => (
                <motion.tr 
                  key={lecturer.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className={`group transition-all ${!isEditing ? 'hover:bg-primary-50/30 dark:hover:bg-primary-900/10 cursor-pointer' : ''}`}
                  onClick={() => !isEditing && navigate(`/admin/lecturers/${lecturer.id}`)}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      {lecturer.thumbnail ? (
                        <img 
                          src={lecturer.thumbnail} 
                          alt="" 
                          className="h-12 w-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-primary-100 transition-all"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-700 dark:text-primary-400 font-black text-lg border border-primary-100 dark:border-primary-900/30 shadow-inner">
                          {lecturer.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-primary-600 transition-colors">{lecturer.name}</p>
                        <div className="flex items-center text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mt-0.5 tracking-tighter">
                          <Mail className="w-3 h-3 mr-1" />
                          {lecturer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-black text-gray-600 dark:text-zinc-300 bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl uppercase tracking-wider border border-gray-100 dark:border-zinc-700">
                      {lecturer.program_studi || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editScholar[lecturer.id] ?? ''}
                        onChange={(e) => setEditScholar(p => ({ ...p, [lecturer.id]: e.target.value }))}
                        onClick={(e) => e.stopPropagation()}
                        className="w-56 px-4 py-2 text-xs font-bold border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 outline-none transition-all placeholder:text-gray-300"
                        placeholder="ID Scholar..."
                      />
                    ) : (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                          <BookOpen className="h-4 w-4 text-gray-300" />
                          {lecturer.scholar_id || <span className="text-gray-300 italic">No ID</span>}
                        </div>
                        {lecturer.scholar_id && (
                          <p className="text-[10px] font-black text-primary-400 uppercase mt-1 tracking-widest">CIT: {lecturer.total_citations || 0} • HI: {lecturer.h_index || 0}</p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editScopus[lecturer.id] ?? ''}
                        onChange={(e) => setEditScopus(p => ({ ...p, [lecturer.id]: e.target.value }))}
                        onClick={(e) => e.stopPropagation()}
                        className="w-56 px-4 py-2 text-xs font-bold border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 outline-none transition-all placeholder:text-gray-300"
                        placeholder="ID Scopus..."
                      />
                    ) : (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                          <GraduationCap className="h-4 w-4 text-gray-300" />
                          {lecturer.scopus_id || <span className="text-gray-300 italic">No ID</span>}
                        </div>
                        {lecturer.scopus_id && (
                          <p className="text-[10px] font-black text-emerald-500 uppercase mt-1 tracking-widest">DOC: {lecturer.scopus_document_count || 0} • CIT: {lecturer.scopus_total_citations || 0}</p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3 group/pts">
                      <div className="text-right">
                        <p className="text-sm font-black text-primary-700 font-mono">+{lecturer.total_kpi_points?.toLocaleString() || 0}</p>
                        <p className="text-[9px] font-black text-primary-300 uppercase tracking-widest">Points earned</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover/pts:text-primary-400 group-hover/pts:translate-x-1 transition-all" />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls - Disembunyikan saat Loading */}
        {!loading && filteredLecturers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-5 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/10 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLecturers.length)} of {filteredLecturers.length} entries
              </span>
              <div className="h-4 w-px bg-gray-200 dark:bg-zinc-700 mx-2 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-gray-400 dark:text-zinc-500 tracking-wider">Per Page:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-gray-100 dark:bg-zinc-800 border-none rounded-lg text-xs font-bold text-gray-600 dark:text-zinc-300 py-1 pl-2 pr-6 focus:ring-2 focus:ring-primary-200 outline-none cursor-pointer"
                >
                  {[5, 10, 25, 50].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-2 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, index, array) => (
                    <React.Fragment key={p}>
                      {index > 0 && array[index - 1] !== p - 1 && (
                        <span className="px-2 text-gray-300 dark:text-zinc-600 font-bold">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`min-w-[36px] h-9 flex items-center justify-center rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                          currentPage === p 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/30' 
                            : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600'
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
                className="p-2 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
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