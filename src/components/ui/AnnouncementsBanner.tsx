import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      className="group relative rounded-xl border border-blue-100/90 dark:border-blue-900/50 border-l-4 border-l-blue-600 dark:border-l-blue-500 bg-gradient-to-r from-blue-50/60 via-slate-50/20 to-white dark:from-blue-950/30 dark:via-slate-900/50 dark:to-slate-900/90 p-4 sm:p-4.5 shadow-xs hover:shadow-md hover:border-blue-200/90 dark:hover:border-blue-800/80 transition-all duration-200"
    >
      <div className="flex items-start gap-3.5">
        {/* Blue Icon Container */}
        <div className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-blue-100/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/50 shadow-2xs">
          <Megaphone className="h-4.5 w-4.5" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          {/* Header Row: Title & Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug group-hover:text-blue-950 dark:group-hover:text-blue-100 transition-colors">
              {ann.title}
            </h4>

            {ann.created_at && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[11px] font-medium border border-blue-200/40 dark:border-blue-800/30 shrink-0 self-start sm:self-auto">
                <Calendar className="h-3 w-3 text-blue-600/80 dark:text-blue-400" />
                <span>{formatDate(ann.created_at)}</span>
              </span>
            )}
          </div>

          {/* Content Body */}
          <motion.div
            layout
            className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal"
          >
            {isLongContent && !isExpanded ? (
              <>
                {ann.content.slice(0, 180)}
                <span className="text-slate-400 font-medium">...</span>
              </>
            ) : (
              ann.content
            )}
          </motion.div>

          {/* Expand Toggle Button */}
          {isLongContent && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group/btn mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors cursor-pointer"
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