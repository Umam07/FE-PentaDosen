import { motion } from 'motion/react';
import { Lock, Zap } from 'lucide-react';

interface LoginCtaProps {
  onLogin: () => void;
}

export default function LoginCta({ onLogin }: LoginCtaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-10 p-1 bg-gradient-to-r from-slate-200 via-primary-500/20 to-slate-200 dark:from-slate-800 dark:via-primary-500/20 dark:to-slate-800 rounded-[2.5rem]"
    >
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.4rem] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20 shadow-inner">
            <Lock className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-1.5">Akses Profil Terbatas</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Masuk ke Portal Penta untuk melihat detail lengkap & analisis mendalam</p>
          </div>
        </div>
        <button
          onClick={onLogin}
          className="group flex items-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary-600 dark:hover:bg-primary-500 dark:hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95"
        >
          <span>Login ke Portal</span>
          <div className="w-6 h-6 rounded-full bg-white/20 dark:bg-slate-900/10 flex items-center justify-center group-hover:bg-white/40">
            <Zap className="w-3 h-3 rotate-12" />
          </div>
        </button>
      </div>
    </motion.div>
  );
}
