import { motion } from 'motion/react';
import { LayoutDashboard, Users, ArrowUpRight, ShieldCheck, Database, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Leaderboard from './Leaderboard';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-canvas-light dark:bg-canvas-dark transition-colors duration-300">
      {/* Structural Line Grid Pattern (No glows, no gradients) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.07]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-14 md:mb-20 relative">
          
          {/* Headline - Sharp, bold sans-serif without gradients */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] mb-6 text-ink-heading dark:text-on-dark"
          >
            Masa Depan Karir <br />
            <span className="text-accent dark:text-accent-on-dark">Akademik &amp; Riset Dosen</span>
          </motion.h1>

          {/* Subtitle - Max 20 words max readability */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl font-medium text-body dark:text-on-dark-soft max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Otomatisasi sinkronisasi data <span className="text-ink-heading dark:text-on-dark font-bold">Google Scholar</span> &amp; <span className="text-ink-heading dark:text-on-dark font-bold">Scopus</span>. Kelola berkas evaluasi lebih cepat, akurat, dan transparan.
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
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-ink-soft dark:bg-surface-dark-elevated border border-ink-border dark:border-hairline-dark text-xs font-bold text-body dark:text-on-dark-soft shadow-sm"
              >
                <tag.icon className="w-3.5 h-3.5 text-body dark:text-on-dark-soft shrink-0" />
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
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-accent hover:bg-accent-hover active:scale-[0.98] text-white font-bold text-base px-8 py-4 rounded-lg transition-all duration-200 shadow-sm group relative overflow-hidden"
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
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark active:scale-[0.98] border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark font-bold text-base px-7 py-4 rounded-lg transition-all duration-200 group shadow-sm"
            >
              <Users className="w-5 h-5 text-muted dark:text-on-dark-muted" />
              <span>Direktori Dosen</span>
              <ArrowUpRight className="w-4 h-4 text-muted group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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