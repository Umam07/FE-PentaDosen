import React from 'react';
import { HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import type { FaqHelpHeaderProps } from '../types/faqHelp.types';

export default function FaqHelpHeader({
  title = "Panduan & Bantuan",
  subtitle = "Pusat Dukungan"
}: FaqHelpHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
    >
      {/* Left: Icon, Title & Badge & Subtitle */}
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <div className="p-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark shrink-0">
          <HelpCircle className="w-5 h-5 text-accent dark:text-accent-on-dark" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-ink-heading dark:text-on-dark">
              {title}
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark uppercase tracking-wider font-mono">
              {subtitle}
            </span>
          </div>
          <p className="text-xs text-muted dark:text-on-dark-muted mt-0.5 truncate">
            Panduan manual book, FAQ penggunaan sistem, dan layanan konsultasi kendala teknis.
          </p>
        </div>
      </div>
    </motion.div>
  );
}


