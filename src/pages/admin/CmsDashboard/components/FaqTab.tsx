import React from 'react';
import { Plus, Edit, Trash2, X, FileText, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PdfPreviewModal } from '../../../../components/ui/pdf-preview-modal';
import { useFaqTab } from '../hooks/useFaqTab';
import FaqDeleteModal from './FaqDeleteModal';

interface FaqTabProps {
  triggerMessage: (text: string, type?: 'success' | 'error') => void;
}

/**
 * Tab Manajemen Tanya Jawab / Panduan PDF.
 */
export default function FaqTab({ triggerMessage }: FaqTabProps) {
  const {
    faqs,
    loading,
    editingId,
    question,
    setQuestion,
    answer,
    setAnswer,
    category,
    setCategory,
    orderIndex,
    setOrderIndex,
    saving,
    isOpenForm,
    setIsOpenForm,
    existingFileUrl,
    removeFile,
    setRemoveFile,
    previewDoc,
    setPreviewDoc,
    deleteFaq,
    setDeleteFaq,
    handleOpenCreate,
    handleOpenEdit,
    handleFileChange,
    handleSave,
    fetchFaqs
  } = useFaqTab(triggerMessage);

  const getCategoryBadgeClass = (cat: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('publikasi') || c.includes('scholar') || c.includes('scopus')) {
      return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
    if (c.includes('buku')) {
      return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
    if (c.includes('hki')) {
      return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
    if (c.includes('penelitian')) {
      return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    }
    if (c.includes('kpi')) {
      return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
    return 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700';
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Daftar Tanya Jawab / Panduan</p>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mt-0.5">Kelola kategori dan isi panduan untuk dosen</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95 cursor-pointer"
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
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">Kategori</th>
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
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getCategoryBadgeClass(f.category)}`}>
                      {f.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight text-xs">{f.question}</td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-500 max-w-sm truncate">
                    <div className="flex items-center gap-2">
                      {f.file_url && (
                        <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-950/30 rounded text-[9px] font-black tracking-widest uppercase">
                          <FileText className="w-2.5 h-2.5" />
                          PDF
                        </span>
                      )}
                      <span className="truncate">{f.answer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      {f.file_url && (
                        <button
                          onClick={() => setPreviewDoc({
                            fileUrl: f.file_url!,
                            title: f.question,
                            category: f.category
                          })}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-zinc-800 rounded-lg transition-all cursor-pointer"
                          title="Preview PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(f)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-zinc-800 rounded-lg transition-all cursor-pointer"
                        title="Edit Panduan"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteFaq(f)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-zinc-800 rounded-lg transition-all cursor-pointer"
                        title="Hapus Panduan"
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
                <button onClick={() => setIsOpenForm(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 cursor-pointer">
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
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100 cursor-pointer"
                    >
                      <option value="Umum">Umum (Pertanyaan &amp; Akun)</option>
                      <option value="Publikasi">Publikasi (Google Scholar, Scopus, SINTA)</option>
                      <option value="Buku">Buku &amp; Monograf</option>
                      <option value="HKI">HKI &amp; Paten</option>
                      <option value="Penelitian">Penelitian &amp; Pengabdian</option>
                      <option value="Upload KPI">Upload KPI &amp; Kinerja Dosen</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Urutan Tampil (Order)</label>
                    <input
                      type="number"
                      required
                      value={orderIndex}
                      onChange={(e) => setOrderIndex(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Topik / Pertanyaan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bagaimana cara menautkan profil Scopus?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Jawaban / Penjelasan Singkat</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan jawaban atau langkah ringkas..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full p-4 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl font-medium outline-none text-sm text-gray-900 dark:text-zinc-100 leading-relaxed"
                  />
                </div>

                {/* File PDF Attachment */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">File Panduan PDF (Opsional)</label>
                  {existingFileUrl && !removeFile ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700 text-xs">
                      <span className="font-bold text-gray-700 dark:text-zinc-300 truncate">File Panduan PDF Terlampir</span>
                      <button
                        type="button"
                        onClick={() => setRemoveFile(true)}
                        className="text-red-500 hover:text-red-700 font-bold text-[10px] uppercase tracking-wider"
                      >
                        Hapus Berkas
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl font-medium text-xs text-gray-700 dark:text-zinc-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-primary-50 file:text-primary-600"
                    />
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsOpenForm(false)}
                    className="px-5 py-3 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-300 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah Panduan')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <FaqDeleteModal
        isOpen={!!deleteFaq}
        onClose={() => setDeleteFaq(null)}
        faq={deleteFaq}
        onSuccess={fetchFaqs}
        triggerMessage={triggerMessage}
      />

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        fileUrl={previewDoc?.fileUrl ?? null}
        title={previewDoc?.title}
        category={previewDoc?.category}
      />
    </div>
  );
}
