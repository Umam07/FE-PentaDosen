import React from 'react';
import { FileText, CalendarDays, Beaker, Eye, ShieldCheck, X } from 'lucide-react';
import { VerificationMobileListProps } from '../types/verification.types';

export default function VerificationMobileList({
  activeTab,
  items,
  actionLoading,
  userRole,
  onVerify,
  onRejectStart,
  onPreview
}: VerificationMobileListProps) {
  return (
    <div className="md:hidden divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft">
      {items.map((item: any) => (
        <div key={item.id} className="p-5 space-y-4 bg-surface-light dark:bg-surface-dark">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink-heading dark:text-on-dark line-clamp-1">
                {activeTab === 'penelitian' ? item.user?.name : (item.user?.name || item.user_name)}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-[10px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Dosen Pengaju</p>
                {userRole === 'admin penelitian' && (
                  <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider bg-accent-soft text-accent dark:bg-accent/15 dark:text-accent-on-dark border border-accent-border dark:border-accent/30">
                    FAKULTAS VERIFIED
                  </span>
                )}
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold text-muted dark:text-on-dark-muted bg-surface-light-raised dark:bg-surface-dark-elevated px-2.5 py-1 rounded-lg border border-hairline-light-soft dark:border-hairline-dark-soft uppercase tracking-wider">
              {activeTab === 'penelitian' ? item.program : item.category}
            </span>
          </div>

          <div className="flex items-center gap-3 bg-surface-light-raised dark:bg-surface-dark-elevated p-4 rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft">
            <div className="p-2.5 bg-surface-light dark:bg-surface-dark rounded-xl shadow-xs border border-hairline-light-soft dark:border-hairline-dark-soft text-muted dark:text-on-dark-muted">
              {activeTab === 'penelitian' ? <Beaker className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-ink-heading dark:text-on-dark line-clamp-2 leading-snug">
                {activeTab === 'penelitian' ? item.judul_penelitian : item.title}
              </p>
              <p className="text-[10px] font-mono text-muted dark:text-on-dark-muted mt-1.5 flex items-center">
                <CalendarDays className="w-3.5 h-3.5 mr-1 text-muted-soft dark:text-on-dark-muted" />
                {activeTab === 'penelitian' ? new Date(item.created_at).toLocaleDateString('id-ID') : (item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-')}
              </p>
            </div>
          </div>

          {activeTab === 'penelitian' && (
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-surface-light-raised dark:bg-surface-dark-elevated p-3 rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft">
                  <p className="text-[9px] font-semibold uppercase text-muted dark:text-on-dark-muted tracking-wider mb-1 leading-none">Dana Disetujui</p>
                  <p className="text-xs font-bold font-mono text-success-dark dark:text-success-on-dark tabular-nums">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.dana_disetujui || 0)}
                  </p>
               </div>
               <div className="bg-surface-light-raised dark:bg-surface-dark-elevated p-3 rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft">
                  <p className="text-[9px] font-semibold uppercase text-muted dark:text-on-dark-muted tracking-wider mb-1 leading-none">Skema / Fokus</p>
                  <p className="text-[10px] font-mono font-semibold text-body dark:text-on-dark truncate">{item.skema} / {item.fokus}</p>
               </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
            {/* Preview file button */}
            {(() => {
              const fileUrl = item.file_url;
              const judul = activeTab === 'penelitian' ? item.judul_penelitian : item.title;
              const kategori = activeTab === 'penelitian' ? item.program : item.category;
              return fileUrl && fileUrl !== '-' && fileUrl !== '' ? (
                <button
                  onClick={() => onPreview({ fileUrl, title: judul, category: kategori })}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark rounded-xl text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 whitespace-nowrap shadow-xs cursor-pointer"
                >
                  <Eye className="h-4 w-4 text-accent dark:text-accent-on-dark" />
                  Preview
                </button>
              ) : (
                <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-surface-light-raised dark:bg-surface-dark-elevated text-muted-soft dark:text-on-dark-muted rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft text-[10px] font-mono font-semibold uppercase tracking-wider cursor-not-allowed italic whitespace-nowrap">
                  <FileText className="h-4 w-4" />
                  No File
                </div>
              );
            })()}
            
            {/* Approve Button */}
            <button
              onClick={() => onVerify(item.id, 'Approved')}
              disabled={actionLoading === item.id}
              className="flex-1 px-4 py-2 bg-success hover:bg-success-dark text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50 whitespace-nowrap cursor-pointer"
            >
              {actionLoading === item.id ? (
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              Approve
            </button>

            {/* Reject Button */}
            <button
              onClick={() => {
                onRejectStart({
                  id: item.id,
                  title: activeTab === 'penelitian' ? item.judul_penelitian : item.title,
                  type: activeTab === 'penelitian' ? 'research' : 'documents'
                });
              }}
              disabled={actionLoading === item.id}
              className="p-2 bg-error-soft dark:bg-error/15 hover:bg-error text-error dark:text-error-on-dark hover:text-white rounded-xl transition-all border border-error-border dark:border-error/30 active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer shadow-xs"
              title="Tolak"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
