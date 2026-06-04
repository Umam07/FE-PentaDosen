import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { 
  UserCheck, 
  FileText, 
  ShieldCheck, 
  Award, 
  PieChart,
  ArrowRight,
  User,
  Users,
  Settings
} from 'lucide-react';

export default function Workflow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 85%", "start 15%"]
  });

  const steps = [
    {
      id: 1,
      title: 'Otentikasi & Integrasi',
      subtitle: 'Seamless Access',
      description: 'Login menggunakan akun institusi (SSO) yang terhubung dengan LDAP dan sinkronisasi otomatis SINTA/Sister.',
      icon: UserCheck,
      role: 'Dosen',
      color: 'blue'
    },
    {
      id: 2,
      title: 'Manajemen Kinerja',
      subtitle: 'Unified Portfolio',
      description: 'Input terpusat untuk publikasi, HKI, penelitian, dan pengabdian masyarakat dalam satu dasbor intuitif.',
      icon: FileText,
      role: 'Dosen',
      color: 'blue'
    },
    {
      id: 3,
      title: 'Verifikasi Berjenjang',
      subtitle: 'Initial Audit',
      description: 'Review komprehensif oleh Admin Fakultas untuk menjamin validitas berkas sebelum diproses lebih lanjut.',
      icon: ShieldCheck,
      role: 'Admin Fakultas',
      color: 'blue'
    },
    {
      id: 4,
      title: 'Validasi Akhir LPPM',
      subtitle: 'Final Accreditation',
      description: 'Verifikasi tingkat universitas oleh LPPM untuk sinkronisasi skor SIKD dan penetapan status kinerja.',
      icon: Award,
      role: 'Admin LPPM',
      color: 'blue'
    },
    {
      id: 5,
      title: 'Analisis Statistik',
      subtitle: 'Executive Insight',
      description: 'Visualisasi skor kinerja dan tren produktivitas dosen secara real-time untuk pengambilan keputusan strategis.',
      icon: PieChart,
      role: 'Dosen & Pimpinan',
      color: 'blue'
    }
  ];

  return (
    <section 
      id="workflow" 
      ref={containerRef}
      className="py-32 md:py-48 bg-[#FAFAFA] dark:bg-[#030303] relative overflow-hidden font-sans"
    >
      {/* Premium Background Backgrounds */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.03),transparent_70%)]" />
        <div 
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
             className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-6"
          >
            Alur Kerja Produktivitas <br />
            <span className="text-blue-600 dark:text-blue-500">Penta Dosen</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base md:text-lg font-bold text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto"
          >
            Sistem terintegrasi yang menghubungkan Dosen, Admin, dan Pimpinan dalam satu ekosistem produktivitas yang transparan.
          </motion.p>
        </div>

        {/* Workflow Timeline */}
        <div className="relative" ref={timelineRef}>
          {/* Central Progress Line Logic */}
          <div className="hidden lg:block absolute top-[60px] left-10 right-10 h-[2px] z-0 overflow-hidden">
             {/* Background Line */}
            <div className="h-full w-full bg-gray-200 dark:bg-gray-800/60 rounded-full" />
            
            {/* Active Filling Line */}
            <motion.div 
              className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-500 origin-left"
              style={{ scaleX: scrollYProgress }}
            />

            {/* Moving Particle Effect */}
            <motion.div 
              className="absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent z-10"
              animate={{ left: ['0%', '100%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-6 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              
              // More aggressive activation mapping
              const stepTrigger = index / steps.length;
              const isActive = useTransform(
                scrollYProgress,
                [stepTrigger, Math.min(stepTrigger + 0.1, 1)],
                [0, 1]
              );
              const scale = useTransform(isActive, [0, 1], [0.95, 1.05]);
              const opacity = useTransform(isActive, [0, 1], [0.4, 1]);

              return (
                <motion.div
                  key={step.id}
                  style={{ scale, opacity }}
                  className="relative group pt-4"
                >
                  <div className="flex flex-col items-center">
                    {/* Node Icon Cluster */}
                    <div className="relative mb-8">
                      {/* Active Pulse Aura */}
                      <motion.div 
                         style={{ scale: isActive, opacity: isActive }}
                         className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"
                      />
                      
                      <motion.div 
                        whileHover={{ rotateY: 15, rotateX: -5, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="w-24 h-24 lg:w-28 lg:h-28 rounded-3xl bg-white dark:bg-white/[0.03] backdrop-blur-2xl border border-gray-100 dark:border-white/5 flex items-center justify-center shadow-2xl relative z-20 group-hover:border-blue-500/30 transition-colors"
                      >
                         <Icon className={`w-10 h-10 lg:w-12 lg:h-12 text-blue-600 dark:text-blue-500 transition-transform duration-300 group-hover:scale-110`} />
                         
                         {/* Step Badge */}
                         <div className="absolute -top-3 -right-3 w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-lg">
                           {step.id}
                         </div>
                      </motion.div>

                      {/* Role Floating Label */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-full shadow-md z-30">
                         <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1">
                           <User size={10} className="text-blue-500" /> {step.role}
                         </span>
                      </div>
                    </div>

                    {/* Content Glass Card */}
                    <motion.div 
                      whileHover={{ y: -10 }}
                      className="w-full bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[40px] p-8 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:bg-white dark:group-hover:bg-white/[0.05]"
                    >
                      <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[.2em] mb-3">
                        {step.subtitle}
                      </p>
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-4 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {step.title}
                      </h3>
                      <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                        {step.description}
                      </p>

                      <div className="mt-8 pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                         <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">0{step.id} / 05</span>
                         <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight size={14} className="text-blue-600" />
                         </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modern Grid Overlays */}
      <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent pointer-events-none" />
      <div className="absolute bottom-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent pointer-events-none" />
    </section>
  );
}