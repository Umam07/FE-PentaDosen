import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Upload } from 'lucide-react';

export default function TemplatesTab({ triggerMessage }: { triggerMessage: (text: string, type?: 'success' | 'error') => void }) {
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
            <div key={item.type} className="p-5 border border-gray-155 dark:border-zinc-800 rounded-2xl flex flex-col justify-between gap-4 bg-gray-50/20 dark:bg-zinc-800/10">
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
