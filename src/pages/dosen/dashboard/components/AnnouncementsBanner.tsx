import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  content: string;
}

interface AnnouncementsBannerProps {
  announcements: Announcement[];
}

export default function AnnouncementsBanner({ announcements }: AnnouncementsBannerProps) {
  return (
    <AnimatePresence>
      {announcements.length > 0 && (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, scale: 0.98, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="p-6 bg-gradient-to-br from-amber-50/90 to-orange-50/50 dark:from-slate-900/80 dark:to-slate-900/40 border border-amber-200/50 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden pl-8"
            >
              {/* Left Accent Bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-orange-500 rounded-r-full" />
              
              {/* Decorative Background Glows */}
              <div className="pointer-events-none absolute -right-10 -bottom-10 w-32 h-32 bg-amber-300/10 dark:bg-amber-500/5 rounded-full blur-2xl" />
              <div className="pointer-events-none absolute -left-10 -top-10 w-32 h-32 bg-orange-300/10 dark:bg-orange-500/5 rounded-full blur-2xl" />

              <div className="relative z-10 flex items-start gap-4">
                <div className="p-3 bg-amber-100/70 dark:bg-amber-950/40 rounded-2xl flex-shrink-0 mt-0.5 shadow-inner">
                  <Megaphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.15em] bg-amber-100/60 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-200/30 dark:border-amber-900/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      PENGUMUMAN AKADEMIK
                    </span>
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-snug">
                    {ann.title}
                  </h4>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

