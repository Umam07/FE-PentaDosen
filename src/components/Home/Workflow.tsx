import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef } from 'react';
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
  RefreshCw,
  Award,
  Bot,
  GraduationCap
} from 'lucide-react';

interface Step {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  icon: React.ElementType;
  role: string;
  roleIcon: React.ElementType;
  highlights: string[];
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
}

export default function Workflow() {
  const [activeStep, setActiveStep] = useState<number>(1);
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
      roleIcon: UserCheck,
      highlights: [
        'Single Sign-On (SSO) LDAP Institusi',
        'Auto-Sync API Scopus & Google Scholar',
        'Deteksi Otomatis ID Peneliti (Scopus & Scholar)'
      ],
      accentColor: 'blue',
      accentBg: 'bg-accent/10 dark:bg-accent/20',
      accentBorder: 'border-accent/30 dark:border-accent/40',
      accentText: 'text-accent-hover dark:text-accent-on-dark'
    },
    {
      id: 2,
      title: 'Input & Ingest Portofolio',
      subtitle: 'Multi-Source Data Ingest',
      category: 'PENCATATAN TRI DHARMA',
      description: 'Pencatatan terpusat untuk publikasi ilmiah, HKI, paten, riset, dan buku melalui unggah berkas PDF atau impor massal Excel (.xlsx).',
      icon: FileText,
      role: 'Dosen Pengampu',
      roleIcon: GraduationCap,
      highlights: [
        'Unggah Bukti Berkas Dokumen Format PDF',
        'Bulk Import & Export Massal Berkas Excel (.xlsx)',
        'Dukungan Multi-Kategori (Jurnal, HKI, Paten, Buku)'
      ],
      accentColor: 'indigo',
      accentBg: 'bg-ink-soft dark:bg-surface-dark-elevated',
      accentBorder: 'border-ink-border dark:border-hairline-dark',
      accentText: 'text-ink-heading dark:text-on-dark'
    },
    {
      id: 3,
      title: 'Deduplikasi & Calculation Engine',
      subtitle: 'Core Automated Engine',
      category: 'PEMROSESAN SISTEM',
      description: 'Pembersihan data ganda berbasis DOI & Fuzzy Matching serta kalkulasi poin akumulasi KPI secara presisi.',
      icon: Cpu,
      role: 'Sistem Backend',
      roleIcon: Bot,
      highlights: [
        'Algoritma Fuzzy Matching Bebas Duplikasi',
        'Kalkulasi Poin KPI Sesuai Bobot Aturan',
        'Audit Trail Perhitungan Transparan'
      ],
      accentColor: 'violet',
      accentBg: 'bg-[#5b21b6]/10 dark:bg-[#7c5cf0]/20',
      accentBorder: 'border-[#5b21b6]/25 dark:border-[#7c5cf0]/40',
      accentText: 'text-[#5b21b6] dark:text-[#c4b5fd]'
    },
    {
      id: 4,
      title: 'Verifikasi & Validasi Berjenjang',
      subtitle: 'Verification & Approval Layer',
      category: 'VALIDASI MUTU',
      description: 'Alur persetujuan bertingkat dari Admin Fakultas hingga LPPM untuk menjamin otentisitas karya akademik.',
      icon: ShieldCheck,
      role: 'Admin & LPPM',
      roleIcon: ShieldCheck,
      highlights: [
        'Verifikasi Berkas Berjenjang Multilevel',
        'Fitur Catatan Perbaikan & Catatan Reviewer',
        'SLA Verifikasi Terukur < 24 Jam'
      ],
      accentColor: 'emerald',
      accentBg: 'bg-success-soft dark:bg-success/15',
      accentBorder: 'border-success-border dark:border-success/30',
      accentText: 'text-success dark:text-success-on-dark'
    },
    {
      id: 5,
      title: 'Dashboard & Analytic Insights',
      subtitle: 'Executive Decision System',
      category: 'ANALISIS KINERJA',
      description: 'Penyajian grafik produktivitas, matriks pemeringkatan dosen, dan ekspor laporan rekapitulasi data format Excel (.xlsx).',
      icon: PieChart,
      role: 'Dosen & Pimpinan',
      roleIcon: Award,
      highlights: [
        'Visualisasi Performa Real-time & Rangking',
        'Ekspor Rekap Laporan Format Excel (.xlsx)',
        'Rekap Portofolio per Dosen & Fakultas'
      ],
      accentColor: 'amber',
      accentBg: 'bg-warning-soft dark:bg-warning/15',
      accentBorder: 'border-warning-border dark:border-warning/30',
      accentText: 'text-warning dark:text-warning-on-dark'
    }
  ];

  const currentStep = steps.find(s => s.id === activeStep) || steps[0];

  const handleSelectStep = (id: number) => {
    setActiveStep(id);
  };

  const handleNext = () => {
    setActiveStep((prev) => (prev % steps.length) + 1);
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev === 1 ? steps.length : prev - 1));
  };

  return (
    <section 
      id="workflow" 
      ref={containerRef}
      className="py-20 md:py-32 bg-canvas-light dark:bg-canvas-dark relative overflow-hidden font-sans"
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
            className="text-3xl sm:text-4xl md:text-5xl font-black text-ink-heading dark:text-on-dark tracking-tight leading-tight mb-4"
          >
            Cara Kerja <span className="text-accent dark:text-accent-on-dark">PentaDosen</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg font-medium text-body dark:text-on-dark-soft leading-relaxed max-w-2xl mx-auto"
          >
            5 tahap yang menghubungkan Dosen, Admin Fakultas, dan LPPM — dari sinkronisasi data hingga verifikasi berkas portofolio akademik.
          </motion.p>
        </div>

        {/* Step Navigation Pill Track */}
        <div className="mb-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-5">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;

              return (
                <button
                  key={step.id}
                  onClick={() => handleSelectStep(step.id)}
                  className={`relative flex items-center justify-center gap-2 px-3 py-2.5 sm:px-3.5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 shrink-0 sm:shrink cursor-pointer ${
                    isActive 
                      ? 'text-ink-heading dark:text-on-dark font-bold' 
                      : 'text-body dark:text-on-dark-soft hover:text-ink-heading dark:hover:text-on-dark'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeWorkflowTab"
                      className="absolute inset-0 bg-surface-light dark:bg-surface-dark rounded-xl shadow-xs border border-hairline-light dark:border-hairline-dark z-0"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  <span className={`relative z-10 w-6 h-6 rounded-md font-mono text-xs flex items-center justify-center font-bold transition-colors shrink-0 ${
                    isActive 
                      ? 'bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark shadow-xs' 
                      : 'bg-surface-light-raised dark:bg-surface-dark-elevated text-body-strong dark:text-on-dark font-bold'
                  }`}>
                    0{step.id}
                  </span>

                  <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap truncate">
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-ink-heading dark:text-on-dark' : 'text-body dark:text-on-dark-soft'}`} />
                    <span className="truncate">{step.title.split(' ')[0]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN SPOTLIGHT STAGE */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl border border-hairline-light dark:border-hairline-dark shadow-xl overflow-hidden mb-12 relative">
          
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className="flex flex-col gap-8 lg:gap-10"
              >
                {/* Main 2-Column Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Left Column: Technical Narrative */}
                  <div className="lg:col-span-6 flex flex-col justify-center">
                    
                    {/* Step Category Badge */}
                    <div className="flex items-center mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider border ${currentStep.accentBg} ${currentStep.accentBorder} ${currentStep.accentText}`}>
                        <Layers className="w-3.5 h-3.5" />
                        {currentStep.category}
                      </span>
                    </div>

                    {/* Step Title & Subtitle */}
                    <h3 className="text-2xl sm:text-3xl font-black text-ink-heading dark:text-on-dark tracking-tight mb-2 leading-tight">
                      {currentStep.title}
                    </h3>
                    
                    <p className="text-xs font-mono font-bold text-body-strong dark:text-on-dark-soft uppercase tracking-widest mb-4">
                      {currentStep.subtitle}
                    </p>

                    <p className="text-sm sm:text-base text-body dark:text-on-dark-soft leading-relaxed mb-6 font-normal">
                      {currentStep.description}
                    </p>

                    {/* Highlights Bullet List */}
                    <div className="space-y-3 pt-2">
                      {currentStep.highlights.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`mt-0.5 w-5 h-5 rounded-full ${currentStep.accentBg} flex items-center justify-center shrink-0`}>
                            <CheckCircle2 className={`w-3.5 h-3.5 ${currentStep.accentText}`} />
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-body-strong dark:text-on-dark">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>

                {/* Right Column: Clean Interactive Stage Visual */}
                <div className="lg:col-span-6">
                  <div className="bg-surface-light-raised/80 dark:bg-surface-dark-elevated/60 rounded-2xl p-6 sm:p-8 border border-hairline-light dark:border-hairline-dark min-h-[360px] flex flex-col justify-between">
                    
                    {/* Render Specific Visual per Step */}
                    {currentStep.id === 1 && (
                      <div className="flex flex-col h-full justify-between gap-6">
                        <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-4">
                          <span className="text-xs font-mono font-bold tracking-wider text-body-strong dark:text-on-dark-soft uppercase">
                            Integrasi Sumber Data
                          </span>
                          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-accent/10 dark:bg-accent/20 text-accent-hover dark:text-accent-on-dark border border-accent/20">
                            SSO & API Terkoneksi
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center py-2">
                          <div className="flex flex-col items-center gap-2 p-2">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 dark:bg-accent/20 text-accent-hover dark:text-accent-on-dark flex items-center justify-center">
                              <UserCheck className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-ink-heading dark:text-on-dark">Akun Dosen</span>
                            <span className="text-xs text-body dark:text-on-dark-soft">SSO LDAP Universitas</span>
                          </div>

                          <div className="flex flex-col items-center justify-center gap-1.5 py-2">
                            <div className="w-9 h-9 rounded-full bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark flex items-center justify-center text-body dark:text-on-dark-soft">
                              <RefreshCw className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-mono text-body dark:text-on-dark-soft">Sinkronisasi</span>
                          </div>

                          <div className="flex flex-col items-center gap-2 p-2">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 dark:bg-accent/20 text-accent-hover dark:text-accent-on-dark flex items-center justify-center">
                              <Database className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-ink-heading dark:text-on-dark">Basis Eksternal</span>
                            <span className="text-xs text-body dark:text-on-dark-soft">Scopus & Google Scholar</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-hairline-light dark:border-hairline-dark flex items-center justify-between text-xs text-body dark:text-on-dark-soft">
                          <span>Protokol Keamanan:</span>
                          <span className="font-mono font-medium text-ink-heading dark:text-on-dark">OAuth 2.0 / Kampus LDAP</span>
                        </div>
                      </div>
                    )}

                    {currentStep.id === 2 && (
                      <div className="flex flex-col h-full justify-between gap-6">
                        <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-4">
                          <span className="text-xs font-mono font-bold tracking-wider text-body-strong dark:text-on-dark-soft uppercase">
                            Kanal Penerimaan Berkas
                          </span>
                          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-ink-soft dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark border border-hairline-light dark:border-hairline-dark">
                            Multi-Format
                          </span>
                        </div>

                        <div className="divide-y divide-hairline-light dark:divide-hairline-dark py-1">
                          <div className="py-2.5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-accent/10 dark:bg-accent/20 text-accent-hover dark:text-accent-on-dark flex items-center justify-center font-bold text-xs shrink-0">
                                J1
                              </div>
                              <div className="truncate">
                                <div className="text-sm font-semibold text-ink-heading dark:text-on-dark truncate">Publikasi & Artikel Ilmiah</div>
                                <div className="text-xs text-body dark:text-on-dark-soft">Jurnal Scopus, WoS, dan SINTA</div>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-body dark:text-on-dark-soft shrink-0">PDF & Metadata</span>
                          </div>

                          <div className="py-2.5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-warning/15 dark:bg-warning/20 text-warning dark:text-warning-on-dark flex items-center justify-center font-bold text-xs shrink-0">
                                HKI
                              </div>
                              <div className="truncate">
                                <div className="text-sm font-semibold text-ink-heading dark:text-on-dark truncate">Hak Kekayaan Intelektual & Paten</div>
                                <div className="text-xs text-body dark:text-on-dark-soft">Sertifikat & Surat Pencatatan Resmi</div>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-body dark:text-on-dark-soft shrink-0">Unggah Bukti</span>
                          </div>

                          <div className="py-2.5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-success/15 dark:bg-success/20 text-success dark:text-success-on-dark flex items-center justify-center font-bold text-xs shrink-0">
                                XLS
                              </div>
                              <div className="truncate">
                                <div className="text-sm font-semibold text-ink-heading dark:text-on-dark truncate">Impor Massal Portofolio</div>
                                <div className="text-xs text-body dark:text-on-dark-soft">Unggah rekapitulasi berkas Excel</div>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-body dark:text-on-dark-soft shrink-0">.xlsx / .xls</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-hairline-light dark:border-hairline-dark flex items-center justify-between text-xs text-body dark:text-on-dark-soft">
                          <span>Dukungan Berkas:</span>
                          <span className="font-mono font-medium text-ink-heading dark:text-on-dark">PDF, Excel (.xlsx), & Formulir Langsung</span>
                        </div>
                      </div>
                    )}

                    {currentStep.id === 3 && (
                      <div className="flex flex-col h-full justify-between gap-6">
                        <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-4">
                          <span className="text-xs font-mono font-bold tracking-wider text-body-strong dark:text-on-dark-soft uppercase">
                            Kalkulasi & Verifikasi DOI
                          </span>
                          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#5b21b6]/10 dark:bg-[#7c5cf0]/20 text-[#5b21b6] dark:text-[#c4b5fd] border border-[#5b21b6]/20">
                            Anti-Duplikasi
                          </span>
                        </div>

                        <div className="space-y-3 py-1">
                          <div className="flex items-center justify-between text-xs pb-2 border-b border-hairline-light dark:border-hairline-dark">
                            <span className="text-body dark:text-on-dark-soft">Validasi Keunikan Dokumen:</span>
                            <span className="font-semibold text-success dark:text-success-on-dark">Terverifikasi Unik (DOI Match)</span>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-body dark:text-on-dark-soft">Bobot Kategori Karya (Jurnal Q1):</span>
                              <span className="font-mono font-semibold text-ink-heading dark:text-on-dark">40.0 Poin</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-body dark:text-on-dark-soft">Pengali Penulis Pertama (60%):</span>
                              <span className="font-mono font-semibold text-ink-heading dark:text-on-dark">× 0.6</span>
                            </div>
                            <div className="pt-2 border-t border-hairline-light dark:border-hairline-dark flex justify-between items-center">
                              <span className="font-semibold text-ink-heading dark:text-on-dark text-sm">Akumulasi Poin Kinerja:</span>
                              <span className="font-mono font-bold text-accent dark:text-accent-on-dark text-base">+24.0 KPI</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-hairline-light dark:border-hairline-dark flex items-center justify-between text-xs text-body dark:text-on-dark-soft">
                          <span>Rujukan Aturan:</span>
                          <span className="font-mono font-medium text-ink-heading dark:text-on-dark">Pedoman Operasional PAK & KPI Kampus</span>
                        </div>
                      </div>
                    )}

                    {currentStep.id === 4 && (
                      <div className="flex flex-col h-full justify-between gap-6">
                        <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-4">
                          <span className="text-xs font-mono font-bold tracking-wider text-body-strong dark:text-on-dark-soft uppercase">
                            Tahapan Validasi
                          </span>
                          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-success/15 dark:bg-success/20 text-success dark:text-success-on-dark border border-success/30">
                            Berjenjang & Terstruktur
                          </span>
                        </div>

                        <div className="relative pl-7 space-y-4 py-1">
                          <div className="absolute left-3 top-2.5 bottom-2.5 w-0.5 bg-hairline-light dark:bg-hairline-dark" />

                          <div className="relative">
                            <div className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-success text-on-ink flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                            <div className="flex justify-between items-baseline">
                              <div className="text-sm font-semibold text-ink-heading dark:text-on-dark">1. Pengajuan Dokumen</div>
                              <span className="text-xs text-body dark:text-on-dark-soft">Dosen</span>
                            </div>
                            <p className="text-xs text-body dark:text-on-dark-soft mt-0.5">Berkas dan bukti luaran diunggah ke sistem</p>
                          </div>

                          <div className="relative">
                            <div className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-success text-on-ink flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                            <div className="flex justify-between items-baseline">
                              <div className="text-sm font-semibold text-ink-heading dark:text-on-dark">2. Verifikasi Berkas</div>
                              <span className="text-xs text-body dark:text-on-dark-soft">Admin Fakultas</span>
                            </div>
                            <p className="text-xs text-body dark:text-on-dark-soft mt-0.5">Pemeriksaan kelengkapan dan kesesuaian kategori</p>
                          </div>

                          <div className="relative">
                            <div className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-accent text-on-ink flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                            <div className="flex justify-between items-baseline">
                              <div className="text-sm font-semibold text-ink-heading dark:text-on-dark">3. Pengesahan Kinerja</div>
                              <span className="text-xs font-semibold text-accent dark:text-accent-on-dark">LPPM</span>
                            </div>
                            <p className="text-xs text-body dark:text-on-dark-soft mt-0.5">Poin kinerja tercatat resmi dalam rekam jejak institusi</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-hairline-light dark:border-hairline-dark flex items-center justify-between text-xs text-body dark:text-on-dark-soft">
                          <span>Jejak Riwayat:</span>
                          <span className="font-mono font-medium text-ink-heading dark:text-on-dark">Terdokumentasi Lengkap dengan Catatan Reviewer</span>
                        </div>
                      </div>
                    )}

                    {currentStep.id === 5 && (
                      <div className="flex flex-col h-full justify-between gap-6">
                        <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-4">
                          <span className="text-xs font-mono font-bold tracking-wider text-body-strong dark:text-on-dark-soft uppercase">
                            Pemantauan & Analitik
                          </span>
                          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-warning/15 dark:bg-warning/20 text-warning dark:text-warning-on-dark border border-warning/30">
                            Siap Evaluasi
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
                          <div className="space-y-1.5">
                            <span className="text-xs text-body dark:text-on-dark-soft">Akumulasi Poin Kinerja</span>
                            <div className="text-3xl font-mono font-black text-ink-heading dark:text-on-dark">
                              348.5 <span className="text-xs font-sans font-normal text-body dark:text-on-dark-soft">poin KPI</span>
                            </div>
                            <p className="text-xs text-success dark:text-success-on-dark font-medium">Melampaui target semester</p>
                          </div>

                          <div className="space-y-1.5">
                            <span className="text-xs text-body dark:text-on-dark-soft">Posisi Kinerja Fakultas</span>
                            <div className="text-3xl font-mono font-black text-ink-heading dark:text-on-dark">
                              Top 5% <span className="text-xs font-sans font-normal text-body dark:text-on-dark-soft">Fakultas</span>
                            </div>
                            <p className="text-xs text-body dark:text-on-dark-soft">Produktivitas publikasi tertinggi</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-hairline-light dark:border-hairline-dark flex items-center justify-between text-xs text-body dark:text-on-dark-soft">
                          <span>Format Laporan:</span>
                          <span className="font-mono font-medium text-ink-heading dark:text-on-dark">Ekspor Rekapitulasi Excel (.xlsx) & PDF</span>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
                </div>

                {/* Full-Width Bottom Navigation & Meta Bar */}
                <div className="pt-6 border-t border-hairline-light dark:border-hairline-dark flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Left: Aktor Utama */}
                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
                    <span className="text-xs font-medium text-body dark:text-on-dark-soft">Aktor Utama:</span>
                    <span className="h-10 inline-flex items-center gap-2 px-3.5 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-xs font-bold text-body-strong dark:text-on-dark border border-hairline-light dark:border-hairline-dark shadow-2xs">
                      <currentStep.roleIcon className="w-4 h-4 text-accent dark:text-accent-on-dark shrink-0" />
                      <span>{currentStep.role}</span>
                    </span>
                  </div>

                  {/* Right: Integrated Control Cluster (Progress Dots + Counter + Prev/Next Buttons) */}
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Mini Step Segment Progress */}
                    <div className="hidden sm:flex items-center gap-1.5" aria-hidden="true">
                      {steps.map((s) => (
                        <div 
                          key={s.id} 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            s.id === currentStep.id 
                              ? 'w-6 bg-ink dark:bg-on-dark' 
                              : s.id < currentStep.id
                                ? 'w-2.5 bg-body/40 dark:bg-on-dark-soft/40'
                                : 'w-2.5 bg-hairline-light dark:bg-hairline-dark'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Step Counter */}
                    <span className="font-mono text-sm font-bold text-ink-heading dark:text-on-dark select-none">
                      0{currentStep.id} <span className="text-muted dark:text-on-dark-muted font-normal">/ 05</span>
                    </span>

                    {/* Prev / Next Navigation Buttons (Tap target min 40x40px, rounded-lg) */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handlePrev}
                        className="w-10 h-10 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-hairline-light dark:hover:bg-hairline-dark active:scale-95 border border-hairline-light dark:border-hairline-dark text-body-strong dark:text-on-dark transition-all cursor-pointer flex items-center justify-center shadow-xs"
                        aria-label="Tahap Sebelumnya"
                        title="Tahap Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="w-10 h-10 rounded-lg bg-ink dark:bg-on-dark hover:bg-ink-hover dark:hover:bg-white text-on-ink dark:text-ink-heading active:scale-95 transition-all cursor-pointer shadow-xs flex items-center justify-center"
                        aria-label="Tahap Selanjutnya"
                        title="Tahap Selanjutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
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
