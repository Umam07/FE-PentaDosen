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
    <div className="md:hidden divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft">
      {items.map((doc) => {
        const title = activeTab === 'penelitian' ? doc.judul_penelitian : doc.title;
        const author = activeTab === 'penelitian' ? doc.user?.name : doc.user_name;
        const category = getDocCategory(doc, activeTab);
        const docSource = activeTab === 'penelitian' ? 'Manual' : getDocSource(doc);
        const dateVal = activeTab === 'penelitian' ? doc.tahun : doc.published_at;

        return (
          <div key={doc.id} className="p-5 space-y-4 bg-surface-light dark:bg-surface-dark">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-ink-heading dark:text-on-dark leading-snug">
                  {title}
                </h4>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted uppercase tracking-wider border border-hairline-light-soft dark:border-hairline-dark-soft">
                    {category}
                  </span>
                  {activeTab !== 'penelitian' && (
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg uppercase tracking-wider border flex items-center gap-1 ${
                      docSource === 'Scopus' 
                        ? 'bg-orange-50/80 dark:bg-orange-950/20 text-chart-scopus dark:text-chart-scopus-dark border-orange-200/60 dark:border-orange-900/30' 
                        : docSource === 'Scholar' 
                        ? 'bg-blue-50/80 dark:bg-blue-950/20 text-chart-scholar dark:text-chart-scholar-dark border-blue-200/60 dark:border-blue-900/30'
                        : 'bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted border-hairline-light-soft dark:border-hairline-dark-soft'
                    }`}>
                      {docSource === 'Manual' ? <User className="w-3 h-3" /> : <Globe className="w-3 h-3" />} {docSource}
                    </span>
                  )}
                </div>
              </div>
              <div className="shrink-0">{getStatusBadge(doc.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-surface-light-raised dark:bg-surface-dark-elevated p-4 rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft">
              <div>
                <p className="text-[9px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider leading-none mb-1">Dosen</p>
                <p className="text-xs font-semibold text-body-strong dark:text-on-dark truncate">{author}</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider leading-none mb-1">
                  {activeTab === 'penelitian' ? 'Diajukan' : 'Publikasi'}
                </p>
                <p className="text-xs font-mono text-muted dark:text-on-dark-muted flex items-center gap-1">
                  <CalendarDays className="h-3 w-3 text-muted-soft dark:text-on-dark-muted" />
                  {dateVal ? new Date(dateVal).toLocaleDateString('id-ID') : '-'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider leading-none mb-1">
                  {activeTab === 'penelitian' ? 'Skema / Fokus' : 'Status KPI'}
                </p>
                <div className="mt-0.5">
                  {activeTab === 'penelitian' ? (
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-lg bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark uppercase border border-hairline-light-soft dark:border-hairline-dark-soft">
                      {doc.skema} / {doc.fokus}
                    </span>
                  ) : doc.is_kpi_counted ? (
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-lg bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark uppercase border border-success-border dark:border-success/30">
                      {doc.accreditation_period || 'KPI Aktif'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-lg bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted uppercase border border-hairline-light-soft dark:border-hairline-dark-soft">
                      Arsip
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider leading-none mb-1">
                  {activeTab === 'penelitian' ? 'Dana' : 'Poin'}
                </p>
                <p className="text-sm font-bold font-mono text-ink-heading dark:text-on-dark tabular-nums">
                  {activeTab === 'penelitian' 
                    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(doc.dana_disetujui || 0)
                    : `${Math.round(doc.awarded_points || 0)} PTS`}
                </p>
              </div>
            </div>

            {doc.status === 'Rejected' && doc.catatan && (
              <div className="text-[10px] font-mono text-error dark:text-error-on-dark bg-error-soft dark:bg-error/15 p-3 rounded-xl border border-error-border dark:border-error/30">
                Catatan Umpan Balik: {doc.catatan}
              </div>
            )}

            <div className="flex justify-end pt-2 gap-2">
              {doc.file_url && doc.file_url !== '-' && doc.file_url !== '' ? (
                <>
                  <button
                    onClick={() => onPreview({ fileUrl: doc.file_url, title, category })}
                    className="inline-flex items-center px-3.5 py-2 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark text-xs font-semibold uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5 text-accent dark:text-accent-on-dark" />
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
                    className="inline-flex items-center px-3.5 py-2 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark text-xs font-semibold uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-xs cursor-pointer disabled:opacity-40"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5 text-muted dark:text-on-dark-muted" />
                    Unduh
                  </button>
                </>
              ) : (
                <div className="inline-flex items-center px-3.5 py-2 bg-surface-light-raised dark:bg-surface-dark-elevated text-muted-soft dark:text-on-dark-muted text-[10px] font-mono font-semibold uppercase tracking-wider rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft cursor-not-allowed italic">
                  <Globe className="w-3.5 h-3.5 mr-1.5" />
                  Auto-Sync
                </div>
              )}
              <button
                onClick={() => onHistory(doc.id, title)}
                className="inline-flex items-center px-3.5 py-2 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark text-xs font-semibold uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-xs cursor-pointer"
                title="Lihat Riwayat Dokumen"
              >
                <History className="w-3.5 h-3.5 mr-1.5 text-muted dark:text-on-dark-muted" />
                Riwayat
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
