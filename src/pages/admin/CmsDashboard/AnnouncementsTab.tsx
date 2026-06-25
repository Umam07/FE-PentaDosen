import React, { useState, useEffect } from 'react';
import { Plus, Megaphone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnnouncementsTab({ triggerMessage, user }: { triggerMessage: (text: string, type?: 'success' | 'error') => void, user: any }) {
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
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-855 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold outline-none text-sm text-gray-900 dark:text-zinc-100"
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
