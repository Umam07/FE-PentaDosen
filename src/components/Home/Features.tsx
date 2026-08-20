import { motion, useInView, useReducedMotion, animate } from 'motion/react';
import {
  LineChart,
  ShieldCheck,
  Database,
  FileText,
  CheckCircle2,
  Lock,
  Cpu,
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react';
import { useEffect, useRef, type ElementType, type MouseEvent, type ReactNode } from 'react';

interface CountUpProps {
  to: number;
  decimals?: number;
  duration?: number;
}

function CountUp({ to, decimals = 0, duration = 1.4 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = to.toFixed(decimals);
      return;
    }
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = v.toFixed(decimals);
      },
    });
    return () => controls.stop();
  }, [inView, to, decimals, duration, reduce]);

  return <span ref={ref}>0</span>;
}

interface FeatureCardProps {
  className?: string;
  children: ReactNode;
  delay?: number;
}

function FeatureCard({ className = '', children, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-3xl border border-hairline-light bg-surface-light p-7 shadow-sm transition-all duration-300 hover:border-ink-border hover:shadow-md md:p-8 dark:border-hairline-dark dark:bg-surface-dark dark:hover:border-hairline-dark flex flex-col justify-between ${className}`}
    >
      <div className="relative z-10 flex h-full w-full flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
}

function IconBadge({ icon: Icon }: { icon: ElementType }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink-border bg-ink-soft text-body transition-transform duration-300 group-hover:scale-105 dark:border-hairline-dark dark:bg-surface-dark-elevated dark:text-on-dark-soft">
      <Icon className="h-5 w-5 text-ink-heading dark:text-on-dark" />
    </div>
  );
}

function CardHead({ icon }: { icon: ElementType }) {
  return (
    <div className="mb-5 flex items-start">
      <IconBadge icon={icon} />
    </div>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
    </span>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-canvas-light dark:bg-canvas-dark relative overflow-hidden font-sans">
      {/* Structural Line Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-ink-heading dark:text-on-dark tracking-tight leading-tight mb-4"
          >
            Semua yang Dibutuhkan <span className="text-accent dark:text-accent-on-dark">Dosen YARSI</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base md:text-lg font-medium text-body dark:text-on-dark-soft leading-relaxed max-w-2xl"
          >
            Dari sinkronisasi publikasi, pengelolaan dokumen Tri Dharma, hingga verifikasi berkas — semuanya tersedia dalam satu platform.
          </motion.p>
        </div>

        {/* --- BENTO GRID START --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">

          {/* CARD 1: Sync Scopus & Scholar (Span 8) */}
          <FeatureCard
            className="md:col-span-8 bg-surface-light dark:bg-surface-dark"
            delay={0.05}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

              <div className="md:col-span-6">
                <CardHead icon={LineChart} />

                <h3 className="text-xl md:text-2xl font-black text-ink-heading dark:text-on-dark tracking-tight mb-3">
                  Sinkronisasi Publikasi Otomatis
                </h3>

                <p className="text-sm font-medium text-body dark:text-on-dark-soft leading-relaxed">
                  Integrasi langsung via API Scopus &amp; Google Scholar untuk penarikan otomatis artikel jurnal, H-Index, dan jumlah sitasi dosen.
                </p>
              </div>

              {/* Live Sync Monitor Preview */}
              <div className="md:col-span-6 relative flex items-center justify-center min-h-[160px]">
                <div className="w-full space-y-3 rounded-2xl border border-hairline-dark bg-surface-dark-soft p-4 text-on-dark shadow-xl dark:bg-surface-dark-soft">
                  <div className="flex items-center justify-between border-b border-hairline-dark pb-2.5">
                    <div className="flex items-center gap-2">
                      <LiveDot />
                      <span className="text-[10px] font-mono font-bold text-on-dark-soft">LIVE SYNC MONITOR</span>
                    </div>
                    <span className="text-[9px] font-mono bg-accent/20 text-accent-on-dark px-2 py-0.5 rounded font-bold">API ACTIVE</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-canvas-dark p-2.5 rounded-xl border border-hairline-dark">
                      <span className="text-[9px] font-mono text-chart-scholar dark:text-chart-scholar-dark block">Google Scholar</span>
                      <div className="text-base font-mono font-bold text-on-dark mt-0.5">
                        <span className="text-success-on-dark">+</span>
                        <CountUp to={248} />{' '}
                        <span className="text-[9px] text-success-on-dark font-bold">▲ 14%</span>
                      </div>
                    </div>
                    <div className="bg-canvas-dark p-2.5 rounded-xl border border-hairline-dark">
                      <span className="text-[9px] font-mono text-chart-scopus dark:text-chart-scopus-dark block">Scopus Index</span>
                      <div className="text-base font-mono font-bold text-chart-scopus dark:text-chart-scopus-dark mt-0.5">
                        <CountUp to={12} /> <span className="text-[9px]">H-Index</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-hairline-dark pt-2.5 text-[10px] font-mono text-on-dark-muted">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="h-3 w-3 animate-spin text-accent-on-dark motion-reduce:animate-none" style={{ animationDuration: '6s' }} />
                      Sync Engine
                    </span>
                    <span className="font-bold text-success-on-dark">Auto-sync 24/7</span>
                  </div>
                </div>
              </div>

            </div>
          </FeatureCard>

          {/* CARD 2: Verifikasi Berjenjang LPPM (Span 4) */}
          <FeatureCard className="md:col-span-4" delay={0.1}>
            <div>
              <CardHead icon={ShieldCheck} />

              <h3 className="text-xl font-black text-ink-heading dark:text-on-dark tracking-tight mb-2.5">
                Verifikasi &amp; Validasi Multilevel
              </h3>

              <p className="text-sm font-medium text-body dark:text-on-dark-soft leading-relaxed mb-6">
                Alur verifikasi bertingkat dari Admin Fakultas hingga LPPM untuk keabsahan karya ilmiah.
              </p>
            </div>

            {/* Approval Flow Indicator */}
            <div className="bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl p-4 border border-hairline-light dark:border-hairline-dark">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-body dark:text-on-dark-soft">
                  Alur Persetujuan
                </span>
                <span className="text-[10px] font-mono font-bold bg-success-soft text-success-dark dark:bg-success/15 dark:text-success-on-dark px-2.5 py-0.5 rounded-full border border-success-border dark:border-success/30">
                  SLA &lt; 24H
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-success-border dark:border-success/30 bg-success-soft dark:bg-surface-dark px-2.5 py-1.5 text-[11px] font-bold text-success-dark dark:text-success-on-dark">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Fakultas
                </div>
                <div className="h-px flex-1 bg-hairline-light dark:bg-hairline-dark" />
                <div className="flex items-center gap-1.5 rounded-lg border border-success-border dark:border-success/30 bg-success-soft dark:bg-surface-dark px-2.5 py-1.5 text-[11px] font-bold text-success-dark dark:text-success-on-dark">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  LPPM
                </div>
                <LiveDot />
              </div>
            </div>
          </FeatureCard>

          {/* CARD 3: Autentikasi SSO Kampus (Span 4) */}
          <FeatureCard className="md:col-span-4" delay={0.15}>
            <div>
              <CardHead icon={Lock} />

              <h3 className="text-xl font-black text-ink-heading dark:text-on-dark tracking-tight mb-2.5">
                Autentikasi LDAP Kampus
              </h3>

              <p className="text-sm font-medium text-body dark:text-on-dark-soft leading-relaxed mb-6">
                Login aman terhubung langsung dengan Active Directory institusi tanpa akun tambahan.
              </p>
            </div>

            {/* Auth Connection Status */}
            <div className="bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl p-4 border border-hairline-light dark:border-hairline-dark">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-ink-heading dark:text-on-dark" />
                  <span className="text-body-strong dark:text-on-dark">Active Directory</span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-success dark:text-success-on-dark">
                  <LiveDot />
                  Connected
                </span>
              </div>

              <div className="my-3 h-px bg-hairline-light dark:bg-hairline-dark" />

              <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-body dark:text-on-dark-soft">
                <Lock className="w-3 h-3 text-body dark:text-on-dark-soft" />
                LDAP &middot; OAuth 2.0 &middot; TLS
              </div>
            </div>
          </FeatureCard>

          {/* CARD 4: Digital Data Vault (Span 8) */}
          <FeatureCard
            className="md:col-span-8 bg-surface-light dark:bg-surface-dark"
            delay={0.2}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

              <div className="md:col-span-6">
                <CardHead icon={FileText} />

                <h3 className="text-xl md:text-2xl font-black text-ink-heading dark:text-on-dark tracking-tight mb-3">
                  Arsip Dokumen Tri Dharma
                </h3>

                <p className="text-sm font-medium text-body dark:text-on-dark-soft leading-relaxed">
                  Penyimpanan terpusat untuk sertifikat HKI, paten, buku ajar, dan laporan penelitian dalam format dokumen PDF.
                </p>
              </div>

              {/* Document Vault Preview */}
              <div className="md:col-span-6 relative flex items-center justify-center min-h-[160px]">
                <div className="w-full space-y-2.5 rounded-2xl border border-hairline-dark bg-surface-dark-soft p-4 text-on-dark shadow-xl dark:bg-surface-dark-soft">
                  <div className="flex items-center justify-between text-xs border-b border-hairline-dark pb-2">
                    <span className="font-mono font-bold text-on-dark-soft">BERKAS PORTOFOLIO</span>
                    <Download className="w-3.5 h-3.5 text-on-dark-muted" />
                  </div>

                  <div className="bg-canvas-dark p-2.5 rounded-xl border border-hairline-dark flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-6 h-6 rounded bg-surface-dark-elevated text-on-dark-soft border border-hairline-dark flex items-center justify-center font-mono font-bold text-[9px] shrink-0">HKI</div>
                      <span className="font-bold text-on-dark-soft truncate">Hak_Cipta_Sistem_2026.pdf</span>
                    </div>
                    <span className="font-mono text-[10px] text-success-on-dark font-bold shrink-0">Ready</span>
                  </div>

                  <div className="bg-canvas-dark p-2.5 rounded-xl border border-hairline-dark text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-6 h-6 rounded bg-surface-dark-elevated text-on-dark-soft border border-hairline-dark flex items-center justify-center font-mono font-bold text-[9px] shrink-0">PAT</div>
                        <span className="font-bold text-on-dark-soft truncate">Paten_Alat_Deteksi_2025.pdf</span>
                      </div>
                      <span className="font-mono text-[10px] text-on-dark-muted font-bold shrink-0">Sync 72%</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-dark-elevated">
                      <motion.div
                        initial={{ width: '0%' }}
                        whileInView={{ width: '72%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-accent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-hairline-dark pt-2.5 font-mono text-[10px] text-on-dark-muted">
                    <span>Format Dokumen: .PDF</span>
                    <span className="font-bold text-success-on-dark">Tersinkron</span>
                  </div>
                </div>
              </div>

            </div>
          </FeatureCard>

          {/* CARD 5: Kalkulasi KPI Presisi (Span 6) */}
          <FeatureCard className="md:col-span-6" delay={0.25}>
            <div>
              <CardHead icon={Cpu} />

              <h3 className="text-xl font-black text-ink-heading dark:text-on-dark tracking-tight mb-2.5">
                Kalkulasi Poin KPI Otomatis
              </h3>

              <p className="text-sm font-medium text-body dark:text-on-dark-soft leading-relaxed mb-6">
                Perhitungan otomatis bobot poin akumulasi kinerja akademik dosen sesuai standar aturan Permenristekdikti.
              </p>
            </div>

            {/* KPI Accumulation Mini Chart */}
            <div className="bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl p-4 border border-hairline-light dark:border-hairline-dark">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-body dark:text-on-dark-soft">
                  Akumulasi KPI
                </span>
                <span className="font-mono text-sm font-black text-ink-heading dark:text-on-dark">
                  +<CountUp to={348.5} decimals={1} />{' '}
                  <span className="text-[10px] font-bold text-body dark:text-on-dark-soft">poin</span>
                </span>
              </div>

              <div className="flex items-end gap-1.5 h-14" aria-hidden>
                {[38, 64, 100].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex-1 rounded-t-md ${h === 100 ? 'bg-ink dark:bg-on-dark' : 'bg-ink/20 dark:bg-on-dark/20'}`}
                  />
                ))}
              </div>

              <div className="mt-2 h-px bg-hairline-light dark:bg-hairline-dark" />
              <div className="mt-2 flex items-center justify-between font-mono text-[10px] font-bold text-body dark:text-on-dark-soft">
                <span>Publikasi &middot; HKI &middot; Buku</span>
                <span className="text-success dark:text-success-on-dark">▲ 18% dari target</span>
              </div>
            </div>
          </FeatureCard>

          {/* CARD 6: Data Export to Excel (Span 6) */}
          <FeatureCard className="md:col-span-6" delay={0.3}>
            <div>
              <CardHead icon={BarChart3} />

              <h3 className="text-xl font-black text-ink-heading dark:text-on-dark tracking-tight mb-2.5">
                Ekspor Data Dokumen
              </h3>

              <p className="text-sm font-medium text-body dark:text-on-dark-soft leading-relaxed mb-6">
                Kemudahan ekspor seluruh data portofolio dan dokumen akademik dosen ke dalam format Excel (.xlsx) untuk kebutuhan pencatatan dan pelaporan.
              </p>
            </div>

            {/* Visual Excel Spreadsheet Export Preview */}
            <div className="bg-surface-light-raised dark:bg-surface-dark-elevated rounded-2xl p-4 border border-hairline-light dark:border-hairline-dark space-y-3 overflow-hidden">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-hairline-light dark:border-hairline-dark text-[10px] font-mono font-bold min-w-0">
                <div className="flex items-center gap-2 text-body-strong dark:text-on-dark min-w-0">
                  <div className="h-6 px-1.5 min-w-6 w-auto rounded-lg bg-success-soft text-success-dark dark:bg-surface-dark dark:text-success-on-dark border border-success-border dark:border-hairline-dark flex items-center justify-center font-bold font-mono text-[9px] shrink-0">
                    .XLSX
                  </div>
                  <span className="truncate">laporan_dokumen.xlsx</span>
                </div>
                <span className="text-success dark:text-success-on-dark flex items-center gap-1 font-bold shrink-0">
                  <Download className="w-3.5 h-3.5 shrink-0" /> 1-Click Export
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-[10px] overflow-hidden">
                <div className="grid grid-cols-12 gap-2 bg-surface-light dark:bg-surface-dark p-2 rounded-lg font-bold text-body-strong dark:text-on-dark-soft border border-hairline-light-soft dark:border-hairline-dark">
                  <span className="col-span-2 shrink-0">NO</span>
                  <span className="col-span-6 truncate">KATEGORI DOKUMEN</span>
                  <span className="col-span-4 text-right truncate">STATUS</span>
                </div>
                <div className="grid grid-cols-12 gap-2 p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark text-body dark:text-on-dark-soft">
                  <span className="col-span-2 font-bold text-body-strong dark:text-on-dark-soft">01</span>
                  <span className="col-span-6 truncate font-medium">Jurnal Internasional Q1</span>
                  <span className="col-span-4 text-right text-success dark:text-success-on-dark font-bold truncate">Terverifikasi</span>
                </div>
                <div className="grid grid-cols-12 gap-2 p-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark text-body dark:text-on-dark-soft">
                  <span className="col-span-2 font-bold text-body-strong dark:text-on-dark-soft">02</span>
                  <span className="col-span-6 truncate font-medium">Sertifikat HKI & Paten</span>
                  <span className="col-span-4 text-right text-success dark:text-success-on-dark font-bold truncate">Terverifikasi</span>
                </div>
              </div>
            </div>
          </FeatureCard>

        </div>
        {/* --- BENTO GRID END --- */}
      </div>
    </section>
  );
}