import { motion } from 'motion/react';
import { LayoutDashboard, Users, ArrowUpRight, ShieldCheck, Database, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Leaderboard from './Leaderboard';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Structural Line Grid Pattern (No glows, no gradients) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.07]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Decorative Structural Corner Accents */}
      <div className="absolute top-20 left-8 hidden lg:block text-slate-300 dark:text-slate-800 text-[10px] font-mono uppercase tracking-widest pointer-events-none select-none">
        // PENTA-DOSEN v2.0
      </div>
      <div className="absolute top-20 right-8 hidden lg:block text-slate-300 dark:text-slate-800 text-[10px] font-mono uppercase tracking-widest pointer-events-none select-none">
        UNIVERSITAS YARSI
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-14 md:mb-20 relative">
          
          {/* Headline - Sharp, bold sans-serif without gradients */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] mb-6 text-slate-900 dark:text-white"
          >
            Masa Depan Karir <br />
            <span className="text-primary-600 dark:text-primary-400">Akademik &amp; Riset Dosen</span>
          </motion.h1>

          {/* Subtitle - Max 20 words max readability */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Otomatisasi sinkronisasi data <span className="text-slate-900 dark:text-white font-bold">Google Scholar</span> &amp; <span className="text-slate-900 dark:text-white font-bold">Scopus</span>. Kelola berkas evaluasi lebih cepat, akurat, dan transparan.
          </motion.p>

          {/* Feature Highlights Pills - High Contrast WCAG AA/AAA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {[
              { label: 'Auto-Sync Scopus', icon: Database },
              { label: 'Scoring KPI Real-time', icon: Award },
              { label: 'Verifikasi LPPM', icon: ShieldCheck }
            ].map((tag, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-primary-50/90 dark:bg-slate-900 border border-primary-200/80 dark:border-slate-800 text-xs font-bold text-primary-900 dark:text-primary-300 shadow-sm"
              >
                <tag.icon className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                {tag.label}
              </span>
            ))}
          </motion.div>

          {/* CTAs - Solid colors, crisp hover states */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            <Link
              to="/insights"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-primary-600 hover:bg-primary-700 active:scale-[0.98] text-white font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 shadow-sm group relative overflow-hidden"
            >
              {/* Shiny Glossy Sheen Sweep Effect */}
              <motion.span 
                animate={{ x: ['-150%', '250%'] }}
                transition={{ repeat: Infinity, repeatDelay: 3.5, duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 w-1/2 h-full bg-white/25 skew-x-[-25deg] pointer-events-none"
              />
              <span className="relative z-10 flex items-center gap-2.5">
                <span>Lihat Insight Platform</span>
                <LayoutDashboard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </Link>

            <Link
              to="/lecturers"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-base px-7 py-4 rounded-xl transition-all duration-200 group shadow-sm"
            >
              <Users className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span>Direktori Dosen</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Leaderboard Container embedded in Hero with ample breathing room */}
        <div id="leaderboard" className="relative max-w-7xl mx-auto mt-16 md:mt-24">
          <Leaderboard isHero={true} />
        </div>
      </div>
    </section>
  );
}