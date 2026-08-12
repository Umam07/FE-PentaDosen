import React from 'react';
import {
  CalendarDays, User, Globe, Eye, Download, History,
  Zap, CheckCircle, XCircle, ShieldCheck, Clock
} from 'lucide-react';
import { buildDownloadFilename, downloadWithFilename } from '../../../../lib/utils';
import { getDocSource, getDocCategory } from '../utils/adminAllDocumentsUtils';
import type { AllDocumentsTableProps } from '../types/adminAllDocuments.types';

export default function AllDocumentsTable({
  items,
  activeTab,
  onPreview,
  onHistory,
}: AllDocumentsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
            <CheckCircle className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case 'Verified by Fakultas':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-900/30">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800 text-xs">
        <thead className="bg-gray-50/80 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800">
          <tr>
            <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
              {activeTab === 'penelitian' ? 'Penelitian & Program' : 'Dokumen & Kategori'}
            </th>
            <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Kontributor</th>
            <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Tanggal</th>
            <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
              {activeTab === 'penelitian' ? 'Dana' : 'Sumber'}
            </th>
            <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Poin</th>
            <th className="px-6 py-3.5 text-center text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 bg-white dark:bg-zinc-900">
          {items.map((doc) => {
            const title = activeTab === 'penelitian' ? doc.judul_penelitian : doc.title;
            const author = activeTab === 'penelitian' ? doc.user?.name : doc.user_name;
            const category = getDocCategory(doc, activeTab);
            const docSource = activeTab === 'penelitian' ? 'Manual' : getDocSource(doc);
            const dateVal = activeTab === 'penelitian' ? doc.tahun : doc.published_at;

            return (
              <tr key={doc.id} className="group hover:bg-gray-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                <td className="px-6 py-4 max-w-[300px]">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight line-clamp-2">{title}</span>
                    <span className="mt-1.5 text-[9px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">{category}</span>
                    {doc.status === 'Rejected' && doc.catatan && (
                      <span className="mt-2 text-[9px] font-black text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/30 w-fit lowercase tracking-wide leading-tight">
                        Catatan: {doc.catatan}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-gray-500">
                      {(author || 'D').charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-tight">{author}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-[11px] font-bold text-gray-500 dark:text-zinc-500 italic">
                    <CalendarDays className="h-4 w-4 mr-1.5 text-gray-300" />
                    {dateVal ? new Date(dateVal).toLocaleDateString('id-ID') : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getStatusBadge(doc.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {activeTab === 'penelitian' ? (
                    <span className="text-xs font-black text-emerald-600 tabular-nums">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(doc.dana_disetujui || 0)}
                    </span>
                  ) : docSource === 'Scopus' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/20 px-2.5 py-1 rounded-lg border border-sky-100 dark:border-sky-900/30">
                      <Globe className="w-3 h-3" /> Scopus
                    </span>
                  ) : docSource === 'Scholar' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                      <Globe className="w-3 h-3" /> Scholar
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
                      <User className="w-3 h-3" /> Manual
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-black text-gray-900 dark:text-zinc-100">{Math.round(doc.awarded_points || 0)}</span>
                    {activeTab !== 'penelitian' && doc.is_kpi_counted && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">KPI Verified</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {doc.file_url && doc.file_url !== '-' && doc.file_url !== '' ? (
                    <div className="inline-flex items-center gap-0.5 p-1 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
                      <button
                        onClick={() => onPreview({ fileUrl: doc.file_url, title, category })}
                        title="Preview Dokumen"
                        className="p-2.5 rounded-xl text-gray-400 dark:text-zinc-500 hover:text-primary-600 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm transition-all active:scale-95"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={async (e) => {
                          const btn = e.currentTarget;
                          btn.disabled = true;
                          const filename = buildDownloadFilename(title || 'dokumen', doc.file_url);
                          await downloadWithFilename(doc.file_url, filename);
                          btn.disabled = false;
                        }}
                        title="Unduh File"
                        className="p-2.5 rounded-xl text-gray-400 dark:text-zinc-500 hover:text-primary-600 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm transition-all active:scale-95 disabled:opacity-40"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onHistory(doc.id, title)}
                        title="Lihat Riwayat Dokumen"
                        className="p-2.5 rounded-xl text-gray-400 dark:text-zinc-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm transition-all active:scale-90"
                      >
                        <History className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 text-gray-300 dark:text-zinc-700 text-[10px] font-black uppercase tracking-widest italic cursor-not-allowed">
                      <Zap className="w-3.5 h-3.5" /> Auto-Sync
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
