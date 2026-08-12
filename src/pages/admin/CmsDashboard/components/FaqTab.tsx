import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, FileText, Eye, Search, FileQuestion, HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PdfPreviewModal } from '../../../../components/ui/pdf-preview-modal';
import { useFaqTab } from '../hooks/useFaqTab';
import FaqDeleteModal from './FaqDeleteModal';

interface FaqTabProps {
  triggerMessage: (text: string, type?: 'success' | 'error') => void;
}

/**
 * Tab Manajemen Tanya Jawab / Panduan PDF.
 * Disesuaikan tampilan dan aksinya secara tepat dengan halaman FaqHelpPage Dosen.
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

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  const toggleExpandFaq = (id: number) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  };

  const filteredFaqs = faqs.filter(f => {
    const query = searchQuery.toLowerCase().trim();
    return (
      query === '' ||
      f.question.toLowerCase().includes(query) ||
      f.answer.toLowerCase().includes(query) ||
      (f.category && f.category.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Daftar Tanya Jawab & Panduan</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Kelola isi dan lampiran file panduan untuk civitas dosen.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-98 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Panduan / FAQ
        </button>
      </div>

      {/* Search Bar matching FaqSearchInput design */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors" />
        <input
          type="text"
          placeholder="Cari panduan, kata kunci, atau topik..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-600 rounded-xl text-sm font-medium outline-none focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-500/20 transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            title="Bersihkan pencarian"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Accordion Card List Container matching FaqAccordionList */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
        {/* Container Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <FileQuestion className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Manual Book &amp; Panduan Penggunaan</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
            {filteredFaqs.length} Panduan
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-2.5">
          {loading ? (
            <div className="block space-y-2.5 animate-pulse">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="h-16 w-full bg-slate-50 dark:bg-zinc-800/40 rounded-xl flex items-center px-5 justify-between"
                >
                  <div className="flex items-center gap-3 w-2/3">
                    <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-zinc-700" />
                    <div className="h-3.5 bg-slate-200 dark:bg-zinc-700 rounded w-4/5" />
                  </div>
                  <div className="h-4 w-4 bg-slate-200 dark:bg-zinc-700 rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredFaqs.length > 0 ? (
            filteredFaqs.map((f) => {
              const isExpanded = expandedFaqId === f.id;

              return (
                <div
                  key={f.id}
                  className={`rounded-xl border overflow-hidden transition-all ${
                    isExpanded
                      ? 'border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xs'
                      : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/20 hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  {/* Card Header & Controls */}
                  <div className="w-full px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Icon & Question */}
                    <div
                      onClick={() => toggleExpandFaq(f.id)}
                      className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer select-none group"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {f.question}
                        </h4>
                      </div>
                    </div>

                    {/* Right: Admin Action Buttons & Expand Arrow */}
                    <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-zinc-800">
                      {f.file_url && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewDoc({
                              fileUrl: f.file_url!,
                              title: f.question,
                              category: f.category
                            });
                          }}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-zinc-800 rounded-lg transition-all cursor-pointer"
                          title="Preview PDF"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(f);
                        }}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-zinc-800 rounded-lg transition-all cursor-pointer"
                        title="Edit Panduan"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteFaq(f);
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-zinc-800 rounded-lg transition-all cursor-pointer"
                        title="Hapus Panduan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleExpandFaq(f.id)}
                        className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        title={isExpanded ? 'Sembunyikan detail' : 'Tampilkan detail'}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-slate-900 dark:text-white' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Accordion Expand Body */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-zinc-800/50 text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                          <p className="pl-[52px]">{f.answer}</p>
                          {f.file_url && (
                            <div className="mt-4 pl-[52px]">
                              <button
                                onClick={() => setPreviewDoc({
                                  fileUrl: f.file_url!,
                                  title: f.question,
                                  category: f.category
                                })}
                                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                                <span>Lihat Panduan PDF</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : searchQuery ? (
            <div className="py-14 px-4 text-center">
              <div className="w-12 h-12 bg-slate-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-3.5 border border-slate-200 dark:border-zinc-700">
                <HelpCircle className="w-6 h-6 text-slate-400 dark:text-zinc-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200 mb-1">Panduan Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed mb-4">
                Tidak ada panduan yang cocok dengan pencarian &quot;{searchQuery}&quot;.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Bersihkan Pencarian</span>
              </button>
            </div>
          ) : (
            <div className="py-14 px-4 text-center">
              <div className="w-12 h-12 bg-slate-100 dark:bg-zinc-800/80 rounded-xl flex items-center justify-center mx-auto mb-3.5 border border-slate-200 dark:border-zinc-700">
                <FileQuestion className="w-6 h-6 text-slate-400 dark:text-zinc-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200 mb-1">
                Belum Ada Panduan
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed mb-4">
                Klik tombol &quot;Tambah Panduan / FAQ&quot; di atas untuk membuat panduan pertama.
              </p>
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Panduan Baru</span>
              </button>
            </div>
          )}
        </div>
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
                        className="text-red-500 hover:text-red-700 font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                      >
                        Hapus Berkas
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl font-medium text-xs text-gray-700 dark:text-zinc-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-primary-50 file:text-primary-600 cursor-pointer"
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
