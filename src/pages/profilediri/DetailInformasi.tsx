import { motion } from 'framer-motion';
import { 
  User, Mail, GraduationCap, BookOpen, Award, Globe, Hash, BadgeCheck, Fingerprint
} from 'lucide-react';

interface DetailInformasiProps {
  user: any;
  tabVariants: any;
}

export default function DetailInformasi({ user, tabVariants }: DetailInformasiProps) {
  return (
    <motion.div 
      key="info"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 p-8 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle Decorative Gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="relative z-10">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-10 uppercase tracking-widest flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400">
              <User className="w-6 h-6" />
            </div>
            Data Akademik & Profil
          </h3>
          
          <div className="space-y-12">
            {/* Academic Info Section */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-primary-500" /> Informasi Institusi
                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Alamat Email', value: user?.email, icon: Mail, color: 'text-blue-500', bg: 'bg-blue-500/5' },
                  { label: 'Fakultas', value: user?.fakultas, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/5' },
                  { label: 'Program Studi', value: user?.program_studi, icon: GraduationCap, color: 'text-orange-500', bg: 'bg-orange-500/5' },
                ].map((item, idx) => (
                  <div key={idx} className="group p-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:border-primary-500/30">
                    <label className="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{item.label}</label>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate flex-1">{item.value || '-'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Identitas Publikasi Section */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                <Globe className="w-4 h-4 text-emerald-500" /> Identitas Publikasi
                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Scholar ID', value: user?.scholar_id, icon: Globe, color: 'text-blue-500' },
                  { label: 'Scopus ID', value: user?.scopus_id, icon: Hash, color: 'text-pink-500' },
                  { label: 'Penta ID', value: user?.penta_id, icon: Fingerprint, color: 'text-emerald-500' },
                  { label: 'NIDN / NIP', value: user?.nidn || user?.nip, icon: User, color: 'text-indigo-500' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all">
                    <label className="block text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{item.label}</label>
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 truncate">{item.value || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
