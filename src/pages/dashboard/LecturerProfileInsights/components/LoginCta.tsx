import React from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight } from 'lucide-react';

interface LoginCtaProps {
  onLogin: () => void;
}

export default function LoginCta({ onLogin }: LoginCtaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2 }}
      className="mt-10 rounded-3xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-6 sm:p-8 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-hairline-light bg-surface-light-raised text-ink-heading dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-ink-heading dark:text-on-dark">
              Akses Profil Terbatas
            </h3>
            <p className="text-xs sm:text-sm text-muted dark:text-on-dark-muted mt-0.5">
              Masuk ke Portal PentaDosen untuk melihat detail lengkap dan analisis mendalam.
            </p>
          </div>
        </div>

        <button
          onClick={onLogin}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-on-ink transition-colors hover:bg-ink-hover dark:bg-on-dark dark:text-ink dark:hover:bg-on-dark-soft shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent shrink-0"
        >
          <span>Login ke Portal</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
