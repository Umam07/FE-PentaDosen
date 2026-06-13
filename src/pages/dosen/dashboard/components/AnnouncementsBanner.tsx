import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

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
              className="p-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-[2.5rem] text-white shadow-xl shadow-amber-500/20 relative overflow-hidden"
            >
              <div className="relative z-10 flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md flex-shrink-0 mt-0.5">
                  <Zap className="w-6 h-6 fill-current text-white" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-lg">
                    PENGUMUMAN AKADEMIK
                  </span>
                  <h4 className="text-lg font-black uppercase tracking-tight mt-2">{ann.title}</h4>
                  <p className="text-xs font-bold opacity-90 mt-1 leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-xl" />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
