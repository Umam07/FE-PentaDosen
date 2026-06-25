import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FaqTab({ triggerMessage }: { triggerMessage: (text: string, type?: 'success' | 'error') => void }) {
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
