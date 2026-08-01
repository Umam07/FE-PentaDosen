import React from 'react';
import {
  CalendarDays, User, Globe, Eye, Download, History,
  CheckCircle, XCircle, ShieldCheck, Clock
} from 'lucide-react';
import { buildDownloadFilename, downloadWithFilename } from '../../../../lib/utils';
import { getDocSource, getDocCategory } from '../utils/adminAllDocumentsUtils';
import type { AllDocumentsMobileListProps } from '../types/adminAllDocuments.types';

export default function AllDocumentsMobileList({
  items,
  activeTab,
  onPreview,
  onHistory,
}: AllDocumentsMobileListProps) {
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
    <div className="md:hidden divide-y divide-gray-50 dark:divide-zinc-800/50">
      {items.map((doc) => {
        const title = activeTab === 'penelitian' ? doc.judul_penelitian : doc.title;
        const author = activeTab === 'penelitian' ? doc.user?.name : doc.user_name;
        const category = getDocCategory(doc, activeTab);
        const docSource = activeTab === 'penelitian' ? 'Manual' : getDocSource(doc);
        const dateVal = activeTab === 'penelitian' ? doc.tahun : doc.published_at;

        return (
          <div key={doc.id} className="p-6 space-y-4 bg-white dark:bg-zinc-900">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h4 className="text-sm font-black text-gray-900 dark:text-zinc-100 leading-snug uppercase tracking-tight">
                  {title}
                </h4>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 uppercase tracking-tight border border-primary-100/50">
                    {category}
                  </span>
                  {activeTab !== 'penelitian' && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-tight border flex items-center gap-1 ${
                      docSource === 'Scopus' 
                        ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 border-sky-100/50' 
                        : docSource === 'Scholar' 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100/50'
                        : 'bg-gray-50 dark:bg-zinc-800 text-gray-500 border-gray-200'
                    }`}>
                      {docSource === 'Manual' ? <User className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />} {docSource}
                    </span>
                  )}
                </div>
              </div>
              <div className="shrink-0">{getStatusBadge(doc.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50/50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-gray-100/50 dark:border-zinc-800/50">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Dosen</p>
                <p className="text-[11px] font-bold text-gray-800 dark:text-zinc-300 truncate">{author}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                  {activeTab === 'penelitian' ? 'Diajukan' : 'Publikasi'}
                </p>
                <p className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {dateVal ? new Date(dateVal).toLocaleDateString('id-ID') : '-'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                  {activeTab === 'penelitian' ? 'Skema / Fokus' : 'Status KPI'}
                </p>
                <div className="mt-0.5">
                  {activeTab === 'penelitian' ? (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 uppercase">
                      {doc.skema} / {doc.fokus}
                    </span>
                  ) : doc.is_kpi_counted ? (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 uppercase">
                      {doc.accreditation_period}
                    </span>
                  ) : (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-400 uppercase">
                      Arsip
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                  {activeTab === 'penelitian' ? 'Dana' : 'Poin'}
                </p>
                <p className="text-sm font-black text-gray-900 dark:text-zinc-100">
                  {activeTab === 'penelitian' 
                    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(doc.dana_disetujui)
                    : `${Math.round(doc.awarded_points || 0)} PTS`}
                </p>
              </div>
            </div>

            {doc.status === 'Rejected' && doc.catatan && (
              <div className="text-[10px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                Catatan Umpan Balik: {doc.catatan}
              </div>
            )}

            <div className="flex justify-end pt-2 gap-2">
              {doc.file_url && doc.file_url !== '-' && doc.file_url !== '' ? (
                <>
                  <button
                    onClick={() => onPreview({ fileUrl: doc.file_url, title, category })}
                    className="inline-flex items-center px-4 py-2.5 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-600 text-primary-600 dark:text-primary-400 hover:text-white border border-primary-100 dark:border-primary-900/30 hover:border-primary-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    Preview
                  </button>
                  <button
                    onClick={async (e) => {
                      const btn = e.currentTarget;
                      btn.disabled = true;
                      const filename = buildDownloadFilename(title || 'dokumen', doc.file_url);
                      await downloadWithFilename(doc.file_url, filename);
                      btn.disabled = false;
                    }}
                    className="inline-flex items-center px-4 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-primary-500 hover:text-primary-600 text-gray-600 dark:text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-sm"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Unduh
                  </button>
                </>
              ) : (
                <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-zinc-800 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-gray-100 dark:border-zinc-700 cursor-not-allowed italic">
                  <Globe className="w-3.5 h-3.5 mr-2" />
                  No File (Synced)
                </div>
              )}
              <button
                onClick={() => onHistory(doc.id, title)}
                className="inline-flex items-center px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 hover:text-white border border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
                title="Lihat Riwayat Dokumen"
              >
                <History className="w-4 h-4 mr-1.5" />
                Riwayat
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
