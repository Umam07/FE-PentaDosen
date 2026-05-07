import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Upload, FileText, CheckCircle, XCircle, Clock, CalendarDays, 
  Shield, Archive, Award, Zap, ChevronDown, Download, 
  FileSpreadsheet, User, Filter, Search, Globe, BookMarked, Beaker,
  AlertCircle, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminInputDocument() {
  const { user: adminUser } = useOutletContext<{ user: any }>();
  const [users, setUsers] = useState<any[]>([]);
  const [weights, setWeights] = useState<any[]>([]);
  
  // Form States
  const [selectedUserId, setSelectedUserId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [docType, setDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [file, setFile] = useState<File | null>(null);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchWeights();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users?role=dosen');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingUsers(false);
    }
  };

  const fetchWeights = async () => {
    try {
      const res = await fetch('/api/weights');
      const data = await res.json();
      setWeights(data.weights || []);
      if (data.weights.length > 0) {
        setCategory(data.weights[0].category);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !file || !title || !category || !tahun) {
      setMessage('Harap lengkapi semua field.');
      setMessageType('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('user_id', selectedUserId);
    formData.append('published_at', `${tahun}-01-01`);
    formData.append('doc_type', docType);
    formData.append('status', 'Approved'); // Admin input is auto-approved

    try {
      setLoading(true);
      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Dokumen dosen berhasil diinput dan disetujui otomatis!');
        setMessageType('success');
        setTitle('');
        setFile(null);
        setTahun(new Date().getFullYear().toString());
      } else {
        setMessage(data.message || 'Gagal menginput dokumen.');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan saat menginput.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-none space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Input Dokumen Dosen</h1>
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Input Mandiri Dokumen oleh Admin LPPM
          </p>
        </div>
      </div>

      <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="p-8 lg:p-12">
          <form onSubmit={handleUpload} className="space-y-10">
            {/* Step 1: Pilih Dosen */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-600">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Pilih Dosen</h3>
              </div>
              <div className="relative">
                <select
                  required
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="appearance-none w-full px-6 py-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-zinc-200 shadow-sm"
                >
                  <option value="">-- Pilih Dosen Penerima --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.fakultas || 'No Faculty'})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Step 2: Form Input (Same as Dosen) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Detail Dokumen</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Tipe Input</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDocType('kpi')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${docType === 'kpi' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 bg-white text-gray-400'}`}
                      >
                        <Award className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Poin KPI</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDocType('arsip')}
                        className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${docType === 'arsip' ? 'border-gray-400 bg-gray-50 text-gray-600' : 'border-gray-100 bg-white text-gray-400'}`}
                      >
                        <Archive className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Arsip</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Judul Dokumen</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Masukkan judul publikasi..."
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Kategori</label>
                      <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
                      >
                        {weights.map(w => (
                          <option key={w.id} value={w.category}>{w.category}</option>
                        ))}
                        <option value="Jurnal Internasional">Jurnal Internasional</option>
                        <option value="Jurnal Nasional">Jurnal Nasional</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Tahun</label>
                      <select
                        required
                        value={tahun}
                        onChange={(e) => setTahun(e.target.value)}
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all"
                      >
                        {Array.from({ length: 15 }, (_, i) => {
                          const y = (new Date().getFullYear() - i).toString();
                          return <option key={y} value={y}>{y}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Upload File</h3>
                </div>

                <div 
                  onClick={() => document.getElementById('admin-file-upload')?.click()}
                  className={`relative h-full min-h-[250px] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${file ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50'}`}
                >
                  <input
                    id="admin-file-upload"
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                    {file ? <CheckCircle className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                  </div>
                  <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                    {file ? file.name : 'Klik untuk pilih PDF'}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 text-center">
                    Pastikan file yang diunggah adalah bukti fisik yang valid.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <AnimatePresence>
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest ${messageType === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
                  >
                    {messageType === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-12 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-200 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
              >
                {loading ? 'Processing...' : 'Simpan Dokumen Dosen'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
