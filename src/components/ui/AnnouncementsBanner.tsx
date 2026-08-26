import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at?: string;
}

interface AnnouncementsBannerProps {
  announcements: Announcement[];
}

const AnnouncementItem: React.FC<{ ann: Announcement; index: number }> = ({ ann, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongContent = ann.content.length > 180;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className="group relative rounded-2xl border border-hairline-light dark:border-hairline-dark border-l-4 border-l-accent dark:border-l-accent-on-dark bg-surface-light dark:bg-surface-dark p-4 sm:p-5 shadow-xs transition-all duration-200"
    >
      <div className="flex items-start gap-3.5">
        {/* Accent Icon Container */}
        <div className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-accent-soft dark:bg-surface-dark-elevated text-accent dark:text-accent-on-dark border border-accent-border dark:border-hairline-dark shadow-2xs">
          <Megaphone className="h-4 w-4" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          {/* Header Row: Title & Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
            <h3 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark tracking-tight leading-snug">
              {ann.title}
            </h3>

            {ann.created_at && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted text-[11px] font-medium font-mono border border-hairline-light dark:border-hairline-dark shrink-0 self-start sm:self-auto">
                <Calendar className="h-3 w-3 text-muted dark:text-on-dark-muted" />
                <span>{formatDate(ann.created_at)}</span>
              </span>
            )}
          </div>

          {/* Content Body */}
          <motion.div
            layout
            className="text-xs sm:text-sm text-body dark:text-on-dark-soft leading-relaxed whitespace-pre-line font-normal"
          >
            {isLongContent && !isExpanded ? (
              <>
                {ann.content.slice(0, 180)}
                <span className="text-muted dark:text-on-dark-muted font-medium">...</span>
              </>
            ) : (
              ann.content
            )}
          </motion.div>

          {/* Expand Toggle Button */}
          {isLongContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? `Sembunyikan detail ${ann.title}` : `Baca selengkapnya ${ann.title}`}
              className="group/btn mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover dark:text-accent-on-dark transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
            >
              <span>{isExpanded ? 'Sembunyikan' : 'Baca selengkapnya'}</span>
              {isExpanded ? (
                <ChevronUp className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:-translate-y-0.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-y-0.5" />
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function AnnouncementsBanner({ announcements }: AnnouncementsBannerProps) {
  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {announcements.map((ann, index) => (
          <AnnouncementItem key={ann.id} ann={ann} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}