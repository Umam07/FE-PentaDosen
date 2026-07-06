import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Users } from 'lucide-react';

interface AuthBrandingPanelProps {
  isAdmin: boolean;
  totalDocs: number | string;
  totalDosen: number | string;
}

export function AuthBrandingPanel({ isAdmin, totalDocs, totalDosen }: AuthBrandingPanelProps) {
  return (
    <div className={`hidden lg:flex flex-col justify-between w-[44%] bg-slate-50 dark:bg-slate-900/20 px-14 py-12 absolute top-0 bottom-0 transition-all duration-700 ease-in-out z-20 ${
      isAdmin 
        ? 'left-[56%] border-l border-slate-200/80 dark:border-slate-800/80' 
        : 'left-0 border-r border-slate-200/80 dark:border-slate-800/80'
    }`}>
      {/* Top Placeholder (Menjaga konsistensi layout justify-between) */}
      <div className="h-6" />

      {/* Center: Konten Branding Hero */}
      <div className="relative z-10 space-y-8 my-auto">
        <AnimatePresence mode="wait">
          {!isAdmin ? (
            <motion.div
              key="dosen-branding"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <p className="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                  Portal Akademik Dosen
                </p>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-[1.2] tracking-tight">
                  Satu Platform Untuk<br />Penelitian & KPI<br />Akademik Anda.
                </h1>
              </div>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium max-w-sm">
                PentaDosen mengintegrasikan rekam jejak akademik, kinerja penelitian, dan monitoring KPI dalam satu interface yang modern.
              </p>

              {/* Daftar Fitur */}
              <ul className="space-y-4">
                {[
                  'Sinkronisasi Google Scholar & Scopus otomatis',
                  'Visualisasi pencapaian KPI secara real-time',
                  'Penyusunan berkas evaluasi kinerja akademik',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm font-medium">
                    <div className="p-0.5 bg-primary-50 dark:bg-primary-950/50 rounded-md text-primary-600 dark:text-primary-400 shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              key="admin-branding"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <p className="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
                  Portal Administrator
                </p>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-[1.2] tracking-tight">
                  Manajemen Riset &<br />KPI Akademik Kampus<br />Lebih Terarah.
                </h1>
              </div>
              
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium max-w-sm">
                PentaDosen Control Panel memudahkan pengelolaan data dosen, verifikasi berkas bukti kinerja, dan pemantauan kriteria KPI secara komprehensif.
              </p>

              {/* Daftar Fitur Admin */}
              <ul className="space-y-4">
                {[
                  'Verifikasi berkas bukti fisik KPI secara real-time',
                  'Manajemen target, bobot, dan kriteria penilaian',
                  'Log aktivitas sistem dan audit trails lengkap',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm font-medium">
                    <div className="p-0.5 bg-primary-50 dark:bg-primary-950/50 rounded-md text-primary-600 dark:text-primary-400 shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Statistik Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 rounded-2xl p-5 shadow-sm max-w-sm"
        >
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
            Statistik Kinerja Kampus
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                <span className="text-[11px] font-semibold">Total Dokumen</span>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {typeof totalDocs === 'number' ? `${totalDocs.toLocaleString('id-ID')}` : totalDocs}
              </p>
            </div>
            <div className="border-l border-slate-100 dark:border-slate-800 pl-4">
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
                <Users className="w-3.5 h-3.5 text-primary-500" />
                <span className="text-[11px] font-semibold">Dosen Aktif</span>
              </div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {typeof totalDosen === 'number' ? `${totalDosen.toLocaleString('id-ID')}` : totalDosen}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom: Hak Cipta */}
      <div className="relative z-10">
        <p className="text-slate-400 dark:text-slate-600 text-[10px] font-semibold uppercase tracking-wider">
          © 2026 PentaDosen · KPI & Research System
        </p>
      </div>
    </div>
  );
}
