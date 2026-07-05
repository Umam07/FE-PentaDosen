import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

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
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.06 }}
      className="group relative overflow-hidden rounded-2xl border border-amber-100 dark:border-amber-900/30 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Subtle gradient overlay top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      {/* Left glow accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber-400 via-amber-500 to-amber-300 rounded-l-2xl" />

      <div className="pl-5 pr-5 pt-4 pb-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            {/* Icon bubble */}
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm shadow-amber-200 dark:shadow-amber-900/40">
              <BellRing className="w-4 h-4 text-white" strokeWidth={2.2} />
            </div>

            {/* Badge */}
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Pengumuman
            </span>
          </div>

          {/* Date */}
          {ann.created_at && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 flex-shrink-0">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(ann.created_at)}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h4 className="text-sm sm:text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-snug mb-2 tracking-tight">
          {ann.title}
        </h4>

        {/* Content */}
        <div className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
          {isLongContent && !isExpanded ? (
            <>
              {ann.content.slice(0, 180)}
              <span className="text-slate-400 dark:text-slate-500">...</span>
            </>
          ) : (
            ann.content
          )}
        </div>

        {/* Expand / Collapse button */}
        {isLongContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 mt-2.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-200 cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Sembunyikan
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Selengkapnya
              </>
            )}
          </button>
        )}
      </div>

      {/* Bottom shimmer on hover */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default function AnnouncementsBanner({ announcements }: AnnouncementsBannerProps) {
  if (announcements.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2.5 px-0.5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
            Pengumuman Terbaru
          </h3>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
            {announcements.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-2.5">
        <AnimatePresence>
          {announcements.map((ann, i) => (
            <AnnouncementItem key={ann.id} ann={ann} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}