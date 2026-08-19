import React from 'react';
import { 
  ShieldCheck, Beaker, FileText, Globe, 
  Landmark, Award, Zap, Archive, Eye, History, Mail, CalendarDays, X 
} from 'lucide-react';
import { VerificationTableProps } from '../types/verification.types';

export default function VerificationTable({
  activeTab,
  items,
  actionLoading,
  userRole,
  onVerify,
  onRejectStart,
  onPreview,
  onHistory
}: VerificationTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto scrollbar-hide">
      <table className="min-w-full divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft text-xs">
        <thead className="bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark">
          <tr>
            {['Nama Dosen', 'Fakultas / Prodi', 'Informasi Detail', 'Program / Kategori', activeTab === 'penelitian' ? 'Dana' : 'Status Performa', 'Aksi'].map((h, i) => (
              <th 
                key={i} 
                className={`px-6 py-3.5 text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider ${
                  ['Program / Kategori', 'Dana', 'Status Performa', 'Aksi'].includes(h) ? 'text-center' : 'text-left'
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
          {items.map((item: any) => (
            <tr key={item.id} className="group hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors">
              {/* Nama Dosen Column */}
              <td className="px-6 py-4 align-top text-left">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-ink-heading dark:text-on-dark group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
                     {activeTab === 'penelitian' ? item.user?.name : (item.user?.name || item.user_name)}
                  </p>
                  <div className="flex items-center text-[10px] font-mono text-muted dark:text-on-dark-muted mt-1">
                    <Mail className="w-3 h-3 mr-1.5 text-muted-soft dark:text-on-dark-muted" />
                    {(activeTab === 'penelitian' ? item.user?.email : item.user?.email) || 'N/A'}
                  </div>
                </div>
              </td>

              {/* Fakultas / Prodi Column */}
              <td className="px-6 py-4 align-top text-left">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-body-strong dark:text-on-dark">
                    {(activeTab === 'penelitian' ? item.user?.program_studi : item.user?.program_studi) || 'N/A'}
                  </span>
                  <span className="text-[10px] font-medium text-muted dark:text-on-dark-muted mt-1">
                    {(activeTab === 'penelitian' ? item.user?.fakultas : item.fakultas) || 'N/A'}
                  </span>
                  {userRole === 'admin penelitian' && (
                    <div className="mt-1.5">
                      <span className="inline-flex items-center text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md bg-accent-soft dark:bg-accent/15 text-accent dark:text-accent-on-dark border border-accent-border dark:border-accent/30 uppercase tracking-wider">
                        FAKULTAS VERIFIED
                      </span>
                    </div>
                  )}
                </div>
              </td>

              {/* Informasi Detail Column */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 p-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft text-muted dark:text-on-dark-muted">
                    {activeTab === 'penelitian' ? <Beaker className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                  </div>
                  <div className="max-w-[300px] lg:max-w-[400px]">
                    <p className="text-xs font-semibold text-ink-heading dark:text-on-dark leading-snug line-clamp-2">
                      {activeTab === 'penelitian' ? item.judul_penelitian : item.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                       <p className="text-[10px] font-mono text-muted dark:text-on-dark-muted flex items-center">
                         <CalendarDays className="w-3.5 h-3.5 mr-1 text-muted-soft dark:text-on-dark-muted" />
                         {activeTab === 'penelitian' ? 'Submitted: ' + new Date(item.created_at).toLocaleDateString('id-ID') : 'Published: ' + (item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-')}
                       </p>
                        {activeTab === 'penelitian' && (
                         <div className="flex gap-1.5">
                           <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-hairline-light-soft dark:border-hairline-dark-soft uppercase">
                              {item.skema}
                           </span>
                           <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-hairline-light-soft dark:border-hairline-dark-soft uppercase">
                              {item.fokus}
                           </span>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </td>

              {/* Program / Kategori Column */}
              <td className="px-6 py-4 align-top text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark rounded-lg border border-hairline-light-soft dark:border-hairline-dark-soft text-[10px] font-mono font-semibold uppercase tracking-wider">
                   {activeTab === 'penelitian' ? (
                     <>
                        {item.program === 'hibah luar negeri' ? <Globe className="w-3.5 h-3.5" /> : <Landmark className="w-3.5 h-3.5" />}
                        {item.program}
                     </>
                   ) : (
                     <>
                        <Award className="w-3.5 h-3.5" />
                        {item.category}
                     </>
                   )}
                </div>
              </td>

              {/* Dana / Status Performa Column */}
              <td className="px-6 py-4 align-top text-center">
                {activeTab === 'penelitian' ? (
                  <div className="flex flex-col gap-0.5 items-center">
                     <span className="text-xs font-bold font-mono text-success-dark dark:text-success-on-dark tabular-nums">
                       {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.dana_disetujui || 0)}
                     </span>
                     <p className="text-[9px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider">Dana Disetujui</p>
                  </div>
                ) : (
                  item.is_kpi_counted ? (
                    <div className="flex flex-col items-center">
                       <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-success-dark dark:text-success-on-dark bg-success-soft dark:bg-success/15 px-2.5 py-1 rounded-full border border-success-border dark:border-success/30 uppercase tracking-wider">
                          <Zap className="w-3 h-3" />
                          KPI {item.accreditation_period || 'Aktif'}
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-muted dark:text-on-dark-muted bg-surface-light-raised dark:bg-surface-dark-elevated px-2.5 py-1 rounded-full border border-hairline-light-soft dark:border-hairline-dark-soft uppercase tracking-wider">
                        <Archive className="w-3 h-3" />
                        ARSIP
                      </div>
                    </div>
                  )
                )}
              </td>

              {/* Action Column */}
              <td className="px-6 py-4 text-center align-top">
                <div className="inline-flex items-center gap-0.5 p-1 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark">
                  {/* Preview Button */}
                  {(() => {
                    const fileUrl = item.file_url;
                    const judul = activeTab === 'penelitian' ? item.judul_penelitian : item.title;
                    const kategori = activeTab === 'penelitian' ? item.program : item.category;
                    return fileUrl && fileUrl !== '-' && fileUrl !== '' ? (
                      <button
                        onClick={() => onPreview({ fileUrl, title: judul, category: kategori })}
                        title="Preview Dokumen"
                        className="p-2 rounded-lg text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light dark:hover:bg-surface-dark shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    ) : (
                      <div
                        title="Tidak ada file"
                        className="p-2 rounded-lg text-muted-soft/40 dark:text-on-dark-muted/40 cursor-not-allowed"
                      >
                        <FileText className="h-4 w-4" />
                      </div>
                    );
                  })()}

                  {/* Riwayat Button */}
                  <button
                    onClick={() => onHistory(item.id, activeTab === 'penelitian' ? item.judul_penelitian : item.title)}
                    title="Riwayat Dokumen"
                    className="p-2 rounded-lg text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light dark:hover:bg-surface-dark shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <History className="h-4 w-4" />
                  </button>

                  {/* Vertical Divider */}
                  <div className="w-px h-4 bg-hairline-light dark:bg-hairline-dark mx-0.5" />

                  {/* Approve Button */}
                  <button
                    onClick={() => onVerify(item.id, 'Approved')}
                    disabled={actionLoading === item.id}
                    title="Approve"
                    className="p-2 rounded-lg text-success-dark dark:text-success-on-dark hover:bg-success hover:text-white dark:hover:bg-success dark:hover:text-white shadow-xs transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                  >
                    {actionLoading === item.id ? (
                      <div className="w-4 h-4 border-2 border-success/30 border-t-success rounded-full animate-spin" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => onRejectStart({
                      id: item.id,
                      title: activeTab === 'penelitian' ? item.judul_penelitian : item.title,
                      type: activeTab === 'penelitian' ? 'research' : 'documents'
                    })}
                    disabled={actionLoading === item.id}
                    title="Tolak"
                    className="p-2 rounded-lg text-error dark:text-error-on-dark hover:bg-error hover:text-white dark:hover:bg-error dark:hover:text-white shadow-xs transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
