import React from 'react';
import { 
  Clock, ShieldCheck, Beaker, FileText, Globe, 
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
      <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
        <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
          <tr>
            {['Nama Dosen', 'Fakultas / Prodi', 'Informasi Detail', 'Program / Kategori', activeTab === 'penelitian' ? 'Dana' : 'Status Performa', 'Aksi'].map((h, i) => (
              <th 
                key={i} 
                className={`px-6 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em] ${
                  ['Program / Kategori', 'Dana', 'Status Performa', 'Aksi'].includes(h) ? 'text-center' : 'text-left'
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
          {items.map((item: any) => (
            <tr key={item.id} className="group hover:bg-primary-50/[0.03] dark:hover:bg-primary-900/10 transition-all duration-200">
              {/* Nama Dosen Column */}
              <td className="px-6 py-6 align-top text-left">
                <div className="flex flex-col">
                  <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                     {activeTab === 'penelitian' ? item.user?.name : (item.user?.name || item.user_name)}
                  </p>
                  <div className="flex items-center text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mt-1 tracking-widest">
                    <Mail className="w-3 h-3 mr-1.5 text-primary-400/70" />
                    {(activeTab === 'penelitian' ? item.user?.email : item.user?.email) || 'N/A'}
                  </div>
                </div>
              </td>

              {/* Fakultas / Prodi Column */}
              <td className="px-6 py-6 align-top text-left">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                    {(activeTab === 'penelitian' ? item.user?.program_studi : item.user?.program_studi) || 'N/A'}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">
                    {(activeTab === 'penelitian' ? item.user?.fakultas : item.fakultas) || 'N/A'}
                  </span>
                  {userRole === 'admin lppm' && (
                    <div className="mt-1.5">
                      <span className="inline-flex items-center text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-100/50">
                        FAKULTAS VERIFIED
                      </span>
                    </div>
                  )}
                </div>
              </td>

              {/* Informasi Detail Column */}
              <td className="px-6 py-6">
                <div className="flex items-center gap-5">
                  <div className="shrink-0 p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl group-hover:bg-primary-100/50 transition-colors border border-gray-100 dark:border-zinc-800">
                    {activeTab === 'penelitian' ? <Beaker className="h-6 w-6 text-gray-400 group-hover:text-primary-600" /> : <FileText className="h-6 w-6 text-gray-400 group-hover:text-primary-600" />}
                  </div>
                  <div className="max-w-[300px] lg:max-w-[400px]">
                    <p className="text-sm font-black text-gray-800 dark:text-zinc-200 uppercase tracking-tight leading-snug line-clamp-2">
                      {activeTab === 'penelitian' ? item.judul_penelitian : item.title}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                       <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center">
                         <CalendarDays className="w-4 h-4 mr-1.5 text-primary-500/70" />
                         {activeTab === 'penelitian' ? 'Submitted: ' + new Date(item.created_at).toLocaleDateString('id-ID') : 'Published: ' + (item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-')}
                       </p>
                        {activeTab === 'penelitian' && (
                         <div className="flex gap-2">
                           <span className="text-[9px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg border border-blue-100/50 uppercase tracking-tight">
                              {item.skema}
                           </span>
                           <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-lg border border-indigo-100/50 uppercase tracking-tight">
                              {item.fokus}
                           </span>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </td>

              {/* Program / Kategori Column */}
              <td className="px-6 py-6 align-top text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 rounded-xl border border-primary-100 dark:border-primary-900/30 text-[10px] font-black uppercase tracking-widest shadow-sm">
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
              <td className="px-6 py-6 align-top text-center">
                {activeTab === 'penelitian' ? (
                  <div className="flex flex-col gap-1 items-center">
                     <div className="flex items-center gap-2 text-emerald-600">
                        <span className="text-sm font-black tracking-tight">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.dana_disetujui)}
                        </span>
                     </div>
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dana Disetujui</p>
                  </div>
                ) : (
                  item.is_kpi_counted ? (
                    <div className="flex flex-col items-center">
                       <div className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl border border-emerald-100/50 w-fit uppercase tracking-widest">
                          <Zap className="w-3.5 h-3.5" />
                          KPI {item.accreditation_period}
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-zinc-700 w-fit uppercase tracking-widest">
                        <Archive className="w-3.5 h-3.5" />
                        ARSIP
                      </div>
                    </div>
                  )
                )}
              </td>

              {/* Action Column */}
              <td className="px-6 py-6 text-center align-top">
                <div className="inline-flex items-center gap-0.5 p-1 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
                  {/* Preview Button */}
                  {(() => {
                    const fileUrl = item.file_url;
                    const judul = activeTab === 'penelitian' ? item.judul_penelitian : item.title;
                    const kategori = activeTab === 'penelitian' ? item.program : item.category;
                    return fileUrl && fileUrl !== '-' && fileUrl !== '' ? (
                      <button
                        onClick={() => onPreview({ fileUrl, title: judul, category: kategori })}
                        title="Preview Dokumen"
                        className="p-2.5 rounded-xl text-gray-400 dark:text-zinc-500 hover:text-primary-600 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm transition-all active:scale-90"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    ) : (
                      <div
                        title="Tidak ada file"
                        className="p-2.5 rounded-xl text-gray-200 dark:text-zinc-700 cursor-not-allowed"
                      >
                        <FileText className="h-4 w-4" />
                      </div>
                    );
                  })()}

                  {/* Riwayat Button */}
                  <button
                    onClick={() => onHistory(item.id, activeTab === 'penelitian' ? item.judul_penelitian : item.title)}
                    title="Riwayat Dokumen"
                    className="p-2.5 rounded-xl text-gray-400 dark:text-zinc-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm transition-all active:scale-90"
                  >
                    <History className="h-4 w-4" />
                  </button>

                  {/* Vertical Divider */}
                  <div className="w-px h-5 bg-gray-200 dark:bg-zinc-700 mx-0.5" />

                  {/* Approve Button */}
                  <button
                    onClick={() => onVerify(item.id, 'Approved')}
                    disabled={actionLoading === item.id}
                    title="Approve"
                    className="p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white hover:shadow-sm transition-all active:scale-90 disabled:opacity-40"
                  >
                    {actionLoading === item.id ? (
                      <div className="w-4 h-4 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
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
                    className="p-2.5 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white hover:shadow-sm transition-all active:scale-90 disabled:opacity-40"
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
