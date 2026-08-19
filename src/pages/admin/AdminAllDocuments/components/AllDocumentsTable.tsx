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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark text-[10px] font-semibold font-mono uppercase tracking-wider border border-success-border dark:border-success/30">
            <CheckCircle className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-soft dark:bg-error/15 text-error dark:text-error-on-dark text-[10px] font-semibold font-mono uppercase tracking-wider border border-error-border dark:border-error/30">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case 'Verified by Fakultas':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-soft dark:bg-accent/15 text-accent dark:text-accent-on-dark text-[10px] font-semibold font-mono uppercase tracking-wider border border-accent-border dark:border-accent/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark text-[10px] font-semibold font-mono uppercase tracking-wider border border-warning-border dark:border-warning/30">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-xs">
        <thead className="bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark">
          <tr>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">
              {activeTab === 'penelitian' ? 'Penelitian & Program' : 'Dokumen & Kategori'}
            </th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Kontributor</th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Tanggal</th>
            <th className="px-6 py-3.5 text-center text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Status</th>
            <th className="px-6 py-3.5 text-center text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">
              {activeTab === 'penelitian' ? 'Dana' : 'Sumber'}
            </th>
            <th className="px-6 py-3.5 text-center text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Poin</th>
            <th className="px-6 py-3.5 text-center text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
          {items.map((doc) => {
            const title = activeTab === 'penelitian' ? doc.judul_penelitian : doc.title;
            const author = activeTab === 'penelitian' ? doc.user?.name : doc.user_name;
            const category = getDocCategory(doc, activeTab);
            const docSource = activeTab === 'penelitian' ? 'Manual' : getDocSource(doc);
            const dateVal = activeTab === 'penelitian' ? doc.tahun : doc.published_at;

            return (
              <tr key={doc.id} className="group hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors">
                <td className="px-6 py-4 max-w-[300px]">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-ink-heading dark:text-on-dark leading-snug line-clamp-2">{title}</span>
                    <span className="mt-1.5 text-[10px] font-mono font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">{category}</span>
                    {doc.status === 'Rejected' && doc.catatan && (
                      <span className="mt-2 text-[10px] font-medium text-error dark:text-error-on-dark bg-error-soft dark:bg-error/15 px-2 py-0.5 rounded border border-error-border dark:border-error/30 w-fit tracking-wide leading-tight">
                        Catatan: {doc.catatan}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-center text-[10px] font-bold text-muted dark:text-on-dark-muted">
                      {(author || 'D').charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-body-strong dark:text-on-dark uppercase tracking-tight">{author}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-[11px] font-mono text-muted dark:text-on-dark-muted">
                    <CalendarDays className="h-4 w-4 mr-1.5 text-muted-soft dark:text-on-dark-muted" />
                    {dateVal ? new Date(dateVal).toLocaleDateString('id-ID') : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getStatusBadge(doc.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {activeTab === 'penelitian' ? (
                    <span className="text-xs font-bold font-mono text-success-dark dark:text-success-on-dark tabular-nums">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(doc.dana_disetujui || 0)}
                    </span>
                  ) : docSource === 'Scopus' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold font-mono text-chart-scopus dark:text-chart-scopus-dark bg-orange-50/80 dark:bg-orange-950/20 px-2.5 py-1 rounded-lg border border-orange-200/60 dark:border-orange-900/30">
                      <Globe className="w-3 h-3" /> Scopus
                    </span>
                  ) : docSource === 'Scholar' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold font-mono text-chart-scholar dark:text-chart-scholar-dark bg-blue-50/80 dark:bg-blue-950/20 px-2.5 py-1 rounded-lg border border-blue-200/60 dark:border-blue-900/30">
                      <Globe className="w-3 h-3" /> Scholar
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold font-mono text-muted dark:text-on-dark-muted uppercase tracking-wider bg-surface-light-raised dark:bg-surface-dark-elevated px-2.5 py-1 rounded-lg border border-hairline-light-soft dark:border-hairline-dark-soft">
                      <User className="w-3 h-3" /> Manual
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums">{Math.round(doc.awarded_points || 0)}</span>
                    {activeTab !== 'penelitian' && doc.is_kpi_counted && <span className="text-[8px] font-bold font-mono text-success dark:text-success-on-dark uppercase tracking-widest">KPI Verified</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {doc.file_url && doc.file_url !== '-' && doc.file_url !== '' ? (
                    <div className="inline-flex items-center gap-0.5 p-1 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark">
                      <button
                        onClick={() => onPreview({ fileUrl: doc.file_url, title, category })}
                        title="Preview Dokumen"
                        className="p-2 rounded-lg text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light dark:hover:bg-surface-dark shadow-xs transition-all active:scale-95 cursor-pointer"
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
                        className="p-2 rounded-lg text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light dark:hover:bg-surface-dark shadow-xs transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onHistory(doc.id, title)}
                        title="Lihat Riwayat Dokumen"
                        className="p-2 rounded-lg text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light dark:hover:bg-surface-dark shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <History className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-muted-soft dark:text-on-dark-muted text-[10px] font-mono font-semibold uppercase tracking-wider italic cursor-not-allowed">
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
