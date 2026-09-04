import { motion } from 'motion/react';
import PentaDosenLogo from '../../../components/shared/PentaDosenLogo';

export function AuthBrandingPanel() {
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
          <div className="space-y-6">
            <div className="flex items-center gap-3 sm:gap-3.5">
              {/* Institution: Universitas YARSI */}
              <div className="flex items-center gap-2 shrink-0">
                <img 
                  src="/YARSI-KOTAK-e1739161183276.png" 
                  alt="Universitas YARSI" 
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain shrink-0"
                />
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-body dark:text-on-dark-soft uppercase leading-tight">
                    UNIVERSITAS
                  </span>
                  <span className="text-xs font-black tracking-tight text-ink-heading dark:text-on-dark uppercase leading-tight">
                    YARSI
                  </span>
                </div>
              </div>

              {/* Centered Vertical Divider */}
              <div className="h-7 w-[1px] bg-hairline-light dark:bg-hairline-dark shrink-0" />

              {/* Product: PentaDosen */}
              <div className="flex items-center gap-2 shrink min-w-0">
                <PentaDosenLogo className="w-8 h-8 shrink-0" />
                <span className="text-base font-black text-ink-heading dark:text-on-dark tracking-tight uppercase truncate leading-none">
                  Penta<span className="text-accent dark:text-accent-on-dark">Dosen</span>
                </span>
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-ink-heading dark:text-on-dark leading-[1.2] tracking-tight">
              Satu Klik untuk Semua<br />Rekam Jejak Akademik<br />Anda.
            </h1>
          </div>

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

