import { motion, useScroll } from 'motion/react';
import { useRef, useState } from 'react';
import { 
  UserCheck, 
  FileText, 
  ShieldCheck, 
  PieChart,
  ArrowRight,
  User,
  Settings
} from 'lucide-react';

export default function Workflow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 20%"]
  });

  const steps = [
    {
      id: 1,
      title: 'Otentikasi & Integrasi',
      subtitle: 'Identity & Integration',
      description: 'Integrasi akun via LDAP institusi dan sinkronisasi otomatis data eksternal Scopus serta Google Scholar.',
      icon: UserCheck,
      role: 'Dosen & Staf'
    },
    {
      id: 2,
      title: 'Input Portofolio',
      subtitle: 'Data Ingestion',
      description: 'Pencatatan terpusat untuk publikasi ilmiah, HKI, penelitian, dan buku melalui form manual atau impor massal.',
      icon: FileText,
      role: 'Dosen'
    },
    {
      id: 3,
      title: 'Deduplikasi & Scoring',
      subtitle: 'Core Processing',
      description: 'Pembersihan otomatis data ganda berbasis DOI/Fuzzy Match dan kalkulasi poin kinerja berdasarkan bobot aturan.',
      icon: Settings,
      role: 'Sistem'
    },
    {
      id: 4,
      title: 'Verifikasi & Validasi',
      subtitle: 'Verification Layer',
      description: 'Pemeriksaan berkas portofolio oleh Admin Fakultas dan LPPM untuk validitas dan persetujuan status kinerja.',
      icon: ShieldCheck,
      role: 'Admin & LPPM'
    },
    {
      id: 5,
      title: 'Dashboard & Analisis',
      subtitle: 'Executive Insight',
      description: 'Penyajian grafik statistik produktivitas dan pemeringkatan dosen secara real-time untuk keputusan strategis.',
      icon: PieChart,
      role: 'Dosen & Pimpinan'
    }
  ];

  return (
    <section 
      id="workflow" 
      ref={containerRef}
      className="py-20 md:py-36 bg-white dark:bg-slate-950 relative overflow-hidden font-sans"
    >
      {/* Structural Line Grid Pattern (No glows, no gradients) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4"
          >
            Alur Kerja Produktivitas <span className="text-blue-600 dark:text-blue-400">Penta Dosen</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto"
          >
            Sistem terintegrasi yang menghubungkan Dosen, Admin, dan Pimpinan dalam satu ekosistem produktivitas yang transparan.
          </motion.p>
        </div>

        {/* Workflow Timeline Container */}
        <div className="relative" ref={timelineRef}>
          {/* Central Progress Line */}
          <div className="hidden lg:block absolute top-[52px] left-12 right-12 h-[2px] z-0 bg-slate-200 dark:bg-slate-800">
            <motion.div 
              className="h-full bg-blue-600 origin-left"
              style={{ scaleX: scrollYProgress }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10 items-stretch">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isSelected = activeStep === step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setActiveStep(step.id)}
                  className="relative group cursor-pointer pt-2 flex flex-col"
                >
                  <div className="flex flex-col items-center h-full">
                    
                    {/* Node Icon Circle */}
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 rounded-2xl border transition-all duration-200 flex items-center justify-center relative z-20 ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 group-hover:border-blue-500'
                      }`}>
                        <Icon className="w-8 h-8" />
                        
                        {/* Step Number Badge */}
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center border shadow-sm ${
                          isSelected 
                            ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-800 dark:border-slate-200' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}>
                          {step.id}
                        </div>
                      </div>

                      {/* Role Chip */}
                      <div className="mt-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 uppercase">
                          <User size={10} className="text-blue-600 dark:text-blue-400" /> {step.role}
                        </span>
                      </div>
                    </div>

                    {/* Step Card */}
                    <div className={`w-full flex-1 flex flex-col rounded-2xl p-6 border transition-all duration-200 ${
                      isSelected
                        ? 'bg-slate-50 dark:bg-slate-900 border-blue-600 dark:border-blue-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 group-hover:border-slate-300 dark:group-hover:border-slate-700'
                    }`}>
                      <p className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">
                        {step.subtitle}
                      </p>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight mb-2">
                        {step.title}
                      </h3>
                      <p className="flex-1 text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                        {step.description}
                      </p>

                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">STEP 0{step.id}</span>
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-blue-600 dark:text-blue-400 translate-x-1' : 'text-slate-300 dark:text-slate-600'}`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}