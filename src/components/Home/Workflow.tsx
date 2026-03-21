import { motion } from 'motion/react';
import { UserPlus, UploadCloud, CheckSquare, BarChart2 } from 'lucide-react';

export default function Workflow() {
  const steps = [
    {
      number: '01',
      title: 'Daftar & Login',
      description: 'Dosen mendaftarkan akun dengan mengisi data diri serta memilih Institusi atau Fakultas terkait.',
      icon: UserPlus,
      glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(45,212,191,0.5)]',
      iconTheme: 'text-teal-500',
      bgTheme: 'bg-teal-500/10',
      strokeColor: 'text-teal-500',
    },
    {
      number: '02',
      title: 'Berbagi Dokumen',
      description: 'Lengkapi berkas Publikasi, HKI, maupun laporan Penelitian Anda ke penyimpanan berkas utama.',
      icon: UploadCloud,
      glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]',
      iconTheme: 'text-blue-500',
      bgTheme: 'bg-blue-500/10',
      strokeColor: 'text-blue-500',
    },
    {
      number: '03',
      title: 'Verifikasi Berkas',
      description: 'Dokumen masuk ke tahap pemeriksaan oleh Tim Verifikator sebelum disinkronkan ke nilai pimpinan.',
      icon: CheckSquare,
      glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]',
      iconTheme: 'text-emerald-500',
      bgTheme: 'bg-emerald-500/10',
      strokeColor: 'text-emerald-500',
    },
    {
      number: '04',
      title: 'Hasil Visualisasi',
      description: 'Dapatkan rekapitulasi nilai kumulatif, statistik sitasi, dan grafik representatif di dashboard Anda.',
      icon: BarChart2,
      glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)]',
      iconTheme: 'text-violet-500',
      bgTheme: 'bg-violet-500/10',
      strokeColor: 'text-violet-500',
    },
  ];

  return (
    <section id="workflow" className="py-24 md:py-40 bg-[#FAFAFA] dark:bg-[#0A0A0A] relative overflow-hidden font-sans">
      
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-40 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-32 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm mb-8"
          >
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Live Tracker Process</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight mb-6"
          >
            Sistem Kerja <br />
            Yang <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-violet-500">Terstruktur</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Pantau setiap tahapan secara real-time. Alur kerja dinamis yang dirancang untuk mempercepat birokrasi dan meningkatkan kinerja publikasi Anda.
          </motion.p>
        </div>

        {/* Timeline Sequence - Zig Zag Layout */}
        <div className="relative mt-20">
          
          {/* Main Horizontal Progress Bar Axis (Desktop Only) */}
          {/* Diposisikan tepat di tengah-tengah secara vertikal */}
          <div className="hidden lg:block absolute top-[40%] left-[10%] right-[10%] h-1 bg-gray-200 dark:bg-gray-800/80 rounded-full z-0 overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-teal-500 via-blue-500 to-violet-500 relative"
            >
              {/* Glowing tip */}
              <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent blur-[2px]" />
            </motion.div>
          </div>

          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10 items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              // Logika Zig-Zag: Index ganjil (1, 3) akan turun, genap (0, 2) akan naik.
              const isStaggeredDown = index % 2 !== 0;
              
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: isStaggeredDown ? 80 : -20 }}
                  whileInView={{ opacity: 1, y: isStaggeredDown ? 48 : -48 }} // 48px offset (translate-y-12)
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.7, delay: index * 0.15, type: 'spring', stiffness: 80 }}
                  className="relative group flex flex-col items-center text-center w-full"
                >
                  
                  {/* Floating Number Watermark (Dipindah ke belakang) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[140px] font-black text-gray-100/60 dark:text-white/[0.02] transition-transform duration-700 group-hover:-translate-y-4 pointer-events-none z-0 select-none">
                    {step.number}
                  </div>

                  {/* Circular Progress & Icon Node */}
                  <div className="relative w-40 h-40 flex items-center justify-center mb-8 z-10">
                    
                    {/* SVG Circular Progress Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-xl transition-transform duration-500 group-hover:scale-105" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="46" 
                        stroke="currentColor" strokeWidth="1" fill="none" 
                        className="text-gray-200 dark:text-gray-800/80" 
                      />
                      <motion.circle
                        cx="50" cy="50" r="46"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        className={step.strokeColor}
                        initial={{ strokeDasharray: 290, strokeDashoffset: 290 }}
                        whileInView={{ strokeDashoffset: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 1.2, delay: (index * 0.4) + 0.3, ease: "easeOut" }}
                      />
                    </svg>

                    {/* Inner Icon Orb */}
                    <div className={`w-24 h-24 rounded-full bg-white dark:bg-black/80 backdrop-blur-sm border border-gray-100 dark:border-gray-800/50 flex items-center justify-center shadow-2xl relative z-10 ${step.glow} transition-all duration-500 group-hover:scale-110 overflow-hidden`}>
                      <div className={`absolute inset-0 ${step.bgTheme} opacity-40 dark:opacity-20`} />
                      <Icon className={`w-10 h-10 ${step.iconTheme} relative z-10 transition-transform duration-300 group-hover:rotate-6`} />
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="relative z-10 px-4 bg-white/50 dark:bg-[#0A0A0A]/50 backdrop-blur-md py-4 rounded-2xl">
                    <div className="inline-block mb-3 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-xs font-extrabold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
                      Tahap {parseInt(step.number)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-3 transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-500 dark:group-hover:from-white dark:group-hover:to-gray-400">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                      {step.description}
                    </p>
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