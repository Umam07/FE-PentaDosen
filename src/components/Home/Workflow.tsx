import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { 
  UserCheck, 
  FileText, 
  ShieldCheck, 
  PieChart,
  Settings,
  User,
  CheckCircle2,
  Cpu,
  Database,
  Layers,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RefreshCw,
  Award
} from 'lucide-react';

interface Step {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  icon: React.ElementType;
  role: string;
  highlights: string[];
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
}

export default function Workflow() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps: Step[] = [
    {
      id: 1,
      title: 'Otentikasi & Integrasi Data',
      subtitle: 'Identity & Data Sync',
      category: 'KONEKTIVITAS TERPADU',
      description: 'Integrasi instan via akun SSO LDAP kampus dan otomatisasi pengambilan data publikasi dari Scopus & Google Scholar.',
      icon: UserCheck,
      role: 'Dosen & Staf',
      highlights: [
        'Single Sign-On (SSO) LDAP Institusi',
        'Auto-Sync API Scopus & Google Scholar',
        'Deteksi Otomatis ID Peneliti (ORCID/SINTA)'
      ],
      accentColor: 'blue',
      accentBg: 'bg-blue-500/10 dark:bg-blue-400/10',
      accentBorder: 'border-blue-500/20 dark:border-blue-400/20',
      accentText: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 2,
      title: 'Input & Ingest Portofolio',
      subtitle: 'Multi-Source Data Ingest',
      category: 'PENCATATAN TRI DHARMA',
      description: 'Pencatatan terpusat untuk publikasi ilmiah, HKI, paten, riset, dan pengabdian melalui impor massal berkas PDF/BibTeX.',
      icon: FileText,
      role: 'Dosen Pengampu',
      highlights: [
        'Impor Otomatis Berkas RIS / BibTeX / PDF',
        'Dukungan Multi-Kategori (Jurnal, HKI, Buku)',
        'Unggah Berkas Pendukung Ber-SLA Aman'
      ],
      accentColor: 'indigo',
      accentBg: 'bg-indigo-500/10 dark:bg-indigo-400/10',
      accentBorder: 'border-indigo-500/20 dark:border-indigo-400/20',
      accentText: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      id: 3,
      title: 'Deduplikasi & Calculation Engine',
      subtitle: 'Core Automated Engine',
      category: 'PEMROSESAN SISTEM',
      description: 'Pembersihan data ganda berbasis DOI & Fuzzy Matching serta kalkulasi poin akumulasi KPI secara presisi.',
      icon: Settings,
      role: 'Sistem AI Engine',
      highlights: [
        'Algoritma Fuzzy Matching Bebas Duplikasi',
        'Kalkulasi Poin KPI Sesuai Bobot Aturan',
        'Audit Trail Perhitungan Transparan'
      ],
      accentColor: 'violet',
      accentBg: 'bg-violet-500/10 dark:bg-violet-400/10',
      accentBorder: 'border-violet-500/20 dark:border-violet-400/20',
      accentText: 'text-violet-600 dark:text-violet-400'
    },
    {
      id: 4,
      title: 'Verifikasi & Validasi Berjenjang',
      subtitle: 'Verification & Approval Layer',
      category: 'VALIDASI MUTU',
      description: 'Alur persetujuan bertingkat dari Admin Fakultas hingga LPPM untuk menjamin otentisitas karya akademik.',
      icon: ShieldCheck,
      role: 'Admin & LPPM',
      highlights: [
        'Verifikasi Berkas Berjenjang Multilevel',
        'Fitur Catatan Perbaikan & Catatan Reviewer',
        'SLA Verifikasi Terukur < 24 Jam'
      ],
      accentColor: 'emerald',
      accentBg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
      accentBorder: 'border-emerald-500/20 dark:border-emerald-400/20',
      accentText: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 5,
      title: 'Dashboard & Analytic Insights',
      subtitle: 'Executive Decision System',
      category: 'ANALISIS KINERJA',
      description: 'Penyajian grafik produktivitas, matriks pemeringkatan dosen, dan laporan siap cetak untuk pengambil keputusan.',
      icon: PieChart,
      role: 'Dosen & Pimpinan',
      highlights: [
        'Visualisasi Performa Real-time & Rangking',
        'Ekspor Laporan Resmi Excel / PDF Format',
        'Proyeksi Pencapaian Target Tri Dharma'
      ],
      accentColor: 'amber',
      accentBg: 'bg-amber-500/10 dark:bg-amber-400/10',
      accentBorder: 'border-amber-500/20 dark:border-amber-400/20',
      accentText: 'text-amber-600 dark:text-amber-400'
    }
  ];

  const currentStep = steps.find(s => s.id === activeStep) || steps[0];

  // Auto-play timer mechanism
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveStep((current) => (current % steps.length) + 1);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const handleSelectStep = (id: number) => {
    setActiveStep(id);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveStep((prev) => (prev % steps.length) + 1);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev === 1 ? steps.length : prev - 1));
    setProgress(0);
  };

  return (
    <section 
      id="workflow" 
      ref={containerRef}
      className="py-20 md:py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden font-sans"
    >
      {/* Structural Line Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4"
          >
            Alur Kerja Terpadu <span className="text-blue-600 dark:text-blue-400">Penta Dosen</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto"
          >
            Proses otomatisasi 5 tahap yang menghubungkan Dosen, Admin Fakultas, dan LPPM dalam satu ekosistem produktivitas yang presisi.
          </motion.p>
        </div>

        {/* Step Navigation Pill Track */}
        <div className="mb-10 max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => handleSelectStep(step.id)}
                  className={`relative flex items-center gap-2.5 px-4 py-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive 
                      ? 'text-slate-900 dark:text-white font-bold' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeWorkflowTab"
                      className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 z-0"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  <span className={`relative z-10 w-6 h-6 rounded-lg font-mono text-xs flex items-center justify-center font-bold transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    0{step.id}
                  </span>

                  <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                    <Icon className={`w-4 h-4 ${isActive ? step.accentText : 'text-slate-400'}`} />
                    <span>{step.title.split(' ')[0]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN SPOTLIGHT STAGE */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-12 relative">
          
          {/* Top Progress Bar for Auto-play */}
          {isPlaying && (
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-100 ease-linear" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          )}

          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                
                {/* Left Column: Technical Narrative & Actions */}
                <div className="lg:col-span-6 flex flex-col justify-center">
                  
                  {/* Step Category & Counter */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider border ${currentStep.accentBg} ${currentStep.accentBorder} ${currentStep.accentText}`}>
                      <Layers className="w-3.5 h-3.5" />
                      {currentStep.category}
                    </span>

                    <span className="text-3xl sm:text-4xl font-mono font-black text-slate-300 dark:text-slate-800 select-none">
                      0{currentStep.id} <span className="text-sm font-sans font-medium text-slate-400">/ 05</span>
                    </span>
                  </div>

                  {/* Step Title & Subtitle */}
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2 leading-tight">
                    {currentStep.title}
                  </h3>
                  
                  <p className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                    {currentStep.subtitle}
                  </p>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
                    {currentStep.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-3 mb-8 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    {currentStep.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded-full ${currentStep.accentBg} flex items-center justify-center shrink-0`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${currentStep.accentText}`} />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Role Badge & Controls Footer */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-medium text-slate-400 shrink-0">Aktor Utama:</span>
                      <span className="h-9 sm:h-10 inline-flex items-center gap-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 truncate">
                        <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="truncate">{currentStep.role}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`h-9 sm:h-10 px-3.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                          isPlaying
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        title={isPlaying ? 'Pause Auto Play' : 'Play Auto Flow'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 shrink-0" /> : <Play className="w-4 h-4 shrink-0" />}
                        <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Auto Play'}</span>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={handlePrev}
                          className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                          aria-label="Tahap Sebelumnya"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNext}
                          className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-colors cursor-pointer shadow-xs flex items-center justify-center shrink-0"
                          aria-label="Tahap Selanjutnya"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Custom Interactive Stage Graphics */}
                <div className="lg:col-span-6">
                  <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-6 border border-slate-800 text-white shadow-2xl relative overflow-hidden min-h-[340px] flex flex-col justify-between">
                    
                    {/* Background Grid Pattern inside Card */}
                    <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

                    {/* Render Specific Visual per Step */}
                    {currentStep.id === 1 && (
                      <div className="relative z-10 flex flex-col h-full justify-between gap-6 py-2">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-mono font-bold text-slate-300">SYSTEM GATEWAY ACTIVE</span>
                          </div>
                          <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">SSO OAuth 2.0</span>
                        </div>

                        {/* Connected Node Graph Simulation */}
                        <div className="grid grid-cols-3 gap-3 items-center text-center relative my-4">
                          <motion.div 
                            whileHover={{ scale: 1.03 }}
                            className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex flex-col items-center gap-2"
                          >
                            <UserCheck className="w-6 h-6 text-blue-400" />
                            <span className="text-xs font-bold text-slate-200">LDAP Kampus</span>
                            <span className="text-[9px] font-mono text-emerald-400 font-bold">✓ Authenticated</span>
                          </motion.div>

                          <div className="flex flex-col items-center justify-center relative">
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500 flex items-center justify-center text-blue-400 mb-1"
                            >
                              <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                            </motion.div>
                            <span className="text-[9px] font-mono text-slate-400">Sync Engine</span>
                          </div>

                          <motion.div 
                            whileHover={{ scale: 1.03 }}
                            className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex flex-col items-center gap-2"
                          >
                            <Database className="w-6 h-6 text-emerald-400" />
                            <span className="text-xs font-bold text-slate-200">Scopus & Scholar</span>
                            <span className="text-[9px] font-mono text-blue-400 font-bold">API Connected</span>
                          </motion.div>
                        </div>

                        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400" />
                            <span className="font-mono text-slate-300">Data Stream Sync:</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-400">142 Articles Ingested</span>
                        </div>
                      </div>
                    )}

                    {currentStep.id === 2 && (
                      <div className="relative z-10 flex flex-col h-full justify-between gap-4 py-2">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <span className="text-xs font-mono font-bold text-slate-300">MULTI-FORMAT INGESTION</span>
                          <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30">PDF / BibTeX / RIS</span>
                        </div>

                        {/* Publication Items Stack */}
                        <div className="space-y-2.5 my-2">
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 font-bold text-xs">
                                J1
                              </div>
                              <div className="overflow-hidden">
                                <div className="text-xs font-bold text-slate-200 truncate">Deep Learning for Precision Agriculture</div>
                                <div className="text-[10px] font-mono text-slate-400">Jurnal Q1 Scopus • DOI: 10.1016/j.future</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Imported</span>
                          </motion.div>

                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 font-bold text-xs">
                                HKI
                              </div>
                              <div className="overflow-hidden">
                                <div className="text-xs font-bold text-slate-200 truncate">Sistem Otomatisasi Evaluasi Kinerja</div>
                                <div className="text-[10px] font-mono text-slate-400">Hak Cipta No. EC00202688192</div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Imported</span>
                          </motion.div>
                        </div>

                        <div className="bg-indigo-950/40 rounded-xl p-3 border border-indigo-800/50 flex items-center justify-between text-xs">
                          <span className="font-mono text-indigo-300">Format Pendukung:</span>
                          <div className="flex gap-1.5 font-mono text-[10px]">
                            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">.PDF</span>
                            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">.BIB</span>
                            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">.RIS</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep.id === 3 && (
                      <div className="relative z-10 flex flex-col h-full justify-between gap-4 py-2">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <span className="text-xs font-mono font-bold text-slate-300">CORE DEDUPLICATION & SCORING</span>
                          <span className="text-[10px] font-mono bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded border border-violet-500/30">FUZZY MATCH 99.8%</span>
                        </div>

                        {/* Processing Matrix Simulation */}
                        <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700 space-y-3 my-1">
                          <div className="flex items-center justify-between text-xs border-b border-slate-700/60 pb-2">
                            <span className="text-slate-400">Verifikasi DOI:</span>
                            <span className="font-mono font-bold text-emerald-400">✓ Unique Entry Validated</span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="text-slate-400">Skor Bobot Jurnal (Q1):</span>
                              <span className="text-slate-200 font-bold">40.0 Poin</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="text-slate-400">Pengali Penulis Utama (60%):</span>
                              <span className="text-slate-200 font-bold">× 0.6</span>
                            </div>
                            <div className="h-px bg-slate-700 my-1" />
                            <div className="flex justify-between text-xs font-mono font-bold">
                              <span className="text-violet-300">Akumulasi Poin Kinerja:</span>
                              <span className="text-emerald-400 text-sm">+24.0 KPI</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-violet-400" />
                            <span className="font-mono text-slate-300">Rules Engine:</span>
                          </div>
                          <span className="font-mono font-bold text-violet-400">Permenristekdikti Standard</span>
                        </div>
                      </div>
                    )}

                    {currentStep.id === 4 && (
                      <div className="relative z-10 flex flex-col h-full justify-between gap-4 py-2">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <span className="text-xs font-mono font-bold text-slate-300">VERIFICATION APPROVAL TRACK</span>
                          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">SLA &lt; 24 JAM</span>
                        </div>

                        {/* Approval Stage Timeline */}
                        <div className="space-y-3 my-2">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                              ✓
                            </div>
                            <div className="flex-1 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-200">1. Submit Berkas Dosen</span>
                              <span className="text-[10px] font-mono text-slate-400">09:15 WIB</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                              ✓
                            </div>
                            <div className="flex-1 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-200">2. Verifikasi Admin Fakultas</span>
                              <span className="text-[10px] font-mono text-slate-400">11:40 WIB</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
                              ✓
                            </div>
                            <div className="flex-1 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-700/60 flex justify-between items-center text-xs">
                              <span className="font-bold text-emerald-300">3. Validasi Final LPPM</span>
                              <span className="text-[10px] font-mono font-bold text-emerald-400">VERIFIED</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-emerald-950/40 rounded-xl p-3 border border-emerald-800/50 flex items-center justify-between text-xs">
                          <span className="font-mono text-emerald-300">Status Dokumen:</span>
                          <span className="font-mono font-bold text-emerald-400 uppercase tracking-wider">TERVALIDASI RESMI</span>
                        </div>
                      </div>
                    )}

                    {currentStep.id === 5 && (
                      <div className="relative z-10 flex flex-col h-full justify-between gap-4 py-2">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <span className="text-xs font-mono font-bold text-slate-300">EXECUTIVE ANALYTICS</span>
                          <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">REAL-TIME RANKING</span>
                        </div>

                        {/* Analytics Mini Dashboard */}
                        <div className="grid grid-cols-2 gap-3 my-1">
                          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex flex-col justify-between">
                            <span className="text-[10px] font-mono text-slate-400">Total Akumulasi Skor</span>
                            <div className="text-2xl font-mono font-black text-amber-400 mt-1">348.5 <span className="text-xs font-sans text-slate-300">pts</span></div>
                            <span className="text-[9px] text-emerald-400 font-mono mt-1">▲ 18% dari target</span>
                          </div>

                          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex flex-col justify-between">
                            <span className="text-[10px] font-mono text-slate-400">Posisi Pemeringkatan</span>
                            <div className="text-2xl font-mono font-black text-white mt-1">#01 <span className="text-xs font-sans text-slate-400">FTI</span></div>
                            <span className="text-[9px] text-amber-400 font-mono mt-1">Top 5% Perguruan Tinggi</span>
                          </div>
                        </div>

                        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-400" />
                            <span className="font-mono text-slate-300">Export Ready:</span>
                          </div>
                          <span className="font-mono font-bold text-amber-400">Format BKD & SKP Ready</span>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
