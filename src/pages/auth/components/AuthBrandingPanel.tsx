import { motion } from 'motion/react';
import { BookOpen, Users } from 'lucide-react';

interface AuthBrandingPanelProps {
  totalDocs: number | string;
  totalDosen: number | string;
}

export function AuthBrandingPanel({ totalDocs, totalDosen }: AuthBrandingPanelProps) {
  return (
    <div className="hidden lg:flex flex-col justify-between w-[44%] bg-surface-light dark:bg-surface-dark px-14 py-12 absolute top-0 bottom-0 left-0 border-r border-hairline-light dark:border-hairline-dark z-20">
      {/* Top Placeholder */}
      <div className="h-6" />

      {/* Center: Konten Branding Hero */}
      <div className="relative z-10 space-y-8 my-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <p className="text-[11px] font-bold text-accent dark:text-accent-on-dark uppercase tracking-[0.2em]">
              Platform Penelitian Dosen YARSI
            </p>
            <h1 className="text-4xl font-extrabold text-ink-heading dark:text-on-dark leading-[1.2] tracking-tight">
              Satu Ekosistem<br />Portofolio Tri Dharma<br />Dosen YARSI.
            </h1>
          </div>
          
          <p className="text-body dark:text-on-dark-soft text-sm leading-relaxed font-medium max-w-sm">
            PentaDosen membantu dosen YARSI mengelola publikasi, sitasi, dan dokumen Tri Dharma dalam satu ekosistem yang aman dan modern.
          </p>

          {/* Daftar Fitur */}
          <ul className="space-y-4">
            {[
              'Sinkronisasi data publikasi dari Google Scholar & Scopus',
              'Kelola penelitian, pengabdian, dan HKI dalam satu tempat',
              'Pantau rekam jejak akademik & dokumen kinerja dosen',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-body-strong dark:text-on-dark text-sm font-medium">
                <div className="p-0.5 bg-ink-soft dark:bg-surface-dark-elevated rounded-md text-ink dark:text-on-dark shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Card Statistik Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl p-5 shadow-sm max-w-sm"
        >
          <p className="text-[10px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-widest mb-3">
            Statistik Kinerja Kampus
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-muted dark:text-on-dark-muted mb-1">
                <BookOpen className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />
                <span className="text-[11px] font-semibold">Total Dokumen</span>
              </div>
              <p className="text-xl font-bold font-mono text-ink-heading dark:text-on-dark">
                {typeof totalDocs === 'number' ? `${totalDocs.toLocaleString('id-ID')}` : totalDocs}
              </p>
            </div>
            <div className="border-l border-hairline-light dark:border-hairline-dark pl-4">
              <div className="flex items-center gap-1.5 text-muted dark:text-on-dark-muted mb-1">
                <Users className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />
                <span className="text-[11px] font-semibold">Dosen Aktif</span>
              </div>
              <p className="text-xl font-bold font-mono text-ink-heading dark:text-on-dark">
                {typeof totalDosen === 'number' ? `${totalDosen.toLocaleString('id-ID')}` : totalDosen}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom: Hak Cipta */}
      <div className="relative z-10">
        <p className="text-muted dark:text-on-dark-muted text-[10px] font-semibold uppercase tracking-wider">
          © 2026 PentaDosen · Platform Penelitian Dosen YARSI
        </p>
      </div>
    </div>
  );
}

