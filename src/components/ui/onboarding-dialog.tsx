import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Rocket, RefreshCw, Layers, ArrowRight, ArrowLeft, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import PentaDosenLogo from "./PentaDosenLogo"

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

/*
 * Step Keamanan Terjamin (Draft copy - disimpan untuk referensi jika ingin dipakai di halaman pengaturan integrasi/keamanan):
 * Title: "Keamanan Terjamin"
 * Description: "Perlindungan data dan aset intelektual Anda dengan standar enkripsi industri yang aman dan tepercaya."
 */

// Ilustrasi Flat 1: Abstrak Ekosistem & Platform Akademik
function EcosystemIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      {/* Background Subtle Shape */}
      <rect x="20" y="20" width="280" height="240" rx="24" fill="#EFF6FF" className="dark:fill-slate-800/60" />
      
      {/* Interconnecting Dashed Vector Lines */}
      <path d="M160 140 L85 85" stroke="#93C5FD" strokeWidth="2" strokeDasharray="4 4" className="dark:stroke-blue-500/40" />
      <path d="M160 140 L235 85" stroke="#93C5FD" strokeWidth="2" strokeDasharray="4 4" className="dark:stroke-blue-500/40" />
      <path d="M160 140 L85 195" stroke="#93C5FD" strokeWidth="2" strokeDasharray="4 4" className="dark:stroke-blue-500/40" />
      <path d="M160 140 L235 195" stroke="#93C5FD" strokeWidth="2" strokeDasharray="4 4" className="dark:stroke-blue-500/40" />

      {/* Central Hub Node (Platform Core) */}
      <rect x="120" y="100" width="80" height="80" rx="20" fill="#2563EB" />
      <rect x="135" y="115" width="50" height="50" rx="12" fill="#3B82F6" />
      {/* Central Cap Icon */}
      <path d="M160 132 L175 140 L160 148 L145 140 Z" fill="#FFFFFF" />
      <path d="M151 144.5 V150.5 C151 152 155 153.5 160 153.5 C165 153.5 169 152 169 150.5 V144.5" fill="#FFFFFF" opacity="0.9" />

      {/* Node 1: Research Module (Top Left) */}
      <g transform="translate(45, 50)">
        <rect width="80" height="60" rx="14" fill="#FFFFFF" className="dark:fill-slate-700" stroke="#BFDBFE" strokeWidth="1.5" />
        <rect x="12" y="14" width="32" height="6" rx="3" fill="#2563EB" />
        <rect x="12" y="26" width="56" height="4" rx="2" fill="#93C5FD" />
        <rect x="12" y="36" width="40" height="4" rx="2" fill="#BFDBFE" />
        <circle cx="62" cy="17" r="4" fill="#60A5FA" />
      </g>

      {/* Node 2: Publication Module (Top Right) */}
      <g transform="translate(195, 50)">
        <rect width="80" height="60" rx="14" fill="#FFFFFF" className="dark:fill-slate-700" stroke="#BFDBFE" strokeWidth="1.5" />
        <rect x="12" y="14" width="28" height="6" rx="3" fill="#1D4ED8" />
        <rect x="12" y="26" width="48" height="4" rx="2" fill="#60A5FA" />
        <rect x="12" y="36" width="36" height="4" rx="2" fill="#BFDBFE" />
        <circle cx="60" cy="40" r="8" fill="#DBEAFE" />
        <path d="M57 40 L59 42 L63 38" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Node 3: Analytics Module (Bottom Left) */}
      <g transform="translate(45, 170)">
        <rect width="80" height="60" rx="14" fill="#FFFFFF" className="dark:fill-slate-700" stroke="#BFDBFE" strokeWidth="1.5" />
        <rect x="14" y="38" width="10" height="12" rx="2" fill="#93C5FD" />
        <rect x="28" y="28" width="10" height="22" rx="2" fill="#3B82F6" />
        <rect x="42" y="20" width="10" height="30" rx="2" fill="#2563EB" />
        <rect x="56" y="32" width="10" height="18" rx="2" fill="#60A5FA" />
      </g>

      {/* Node 4: Integration Sync Node (Bottom Right) */}
      <g transform="translate(195, 170)">
        <rect width="80" height="60" rx="14" fill="#FFFFFF" className="dark:fill-slate-700" stroke="#BFDBFE" strokeWidth="1.5" />
        <circle cx="40" cy="30" r="16" fill="#DBEAFE" />
        <path d="M34 30 C34 26.6863 36.6863 24 40 24 C42.5 24 44.6 25.5 45.5 27.6" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        <path d="M46 30 C46 33.3137 43.3137 36 40 36 C37.5 36 35.4 34.5 34.5 32.4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Floating Geometric Decorative Accents */}
      <circle cx="30" cy="140" r="4" fill="#3B82F6" opacity="0.6" />
      <circle cx="290" cy="140" r="5" fill="#60A5FA" opacity="0.6" />
    </svg>
  )
}

// Ilustrasi Flat 2: Abstrak Sinkronisasi Otomatis & Alur Kerja
function SyncWorkflowIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      {/* Background Card */}
      <rect x="20" y="20" width="280" height="240" rx="24" fill="#EFF6FF" className="dark:fill-slate-800/60" />

      {/* Data Source Box (Left) */}
      <g transform="translate(40, 80)">
        <rect width="85" height="120" rx="16" fill="#FFFFFF" className="dark:fill-slate-700" stroke="#BFDBFE" strokeWidth="1.5" />
        {/* Source Header Badge */}
        <rect x="12" y="14" width="36" height="8" rx="4" fill="#2563EB" />
        {/* Scholar Data Item */}
        <rect x="12" y="34" width="61" height="20" rx="6" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="1" />
        <circle cx="24" cy="44" r="5" fill="#0284C7" />
        <rect x="34" y="42" width="30" height="4" rx="2" fill="#0284C7" />
        {/* Scopus Data Item */}
        <rect x="12" y="62" width="61" height="20" rx="6" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
        <circle cx="24" cy="72" r="5" fill="#2563EB" />
        <rect x="34" y="70" width="30" height="4" rx="2" fill="#2563EB" />
        {/* Indicator */}
        <rect x="12" y="94" width="45" height="5" rx="2.5" fill="#93C5FD" />
      </g>

      {/* Synchronizing Data Flow Vector Arrows */}
      <g transform="translate(133, 115)">
        <path d="M0 25 C15 5, 40 5, 54 20" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
        <polygon points="54,23 55,16 48,19" fill="#2563EB" />

        <path d="M54 30 C39 50, 14 50, 0 35" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
        <polygon points="0,32 1,39 7,36" fill="#3B82F6" />

        {/* Central Sync Badge */}
        <circle cx="27" cy="27" r="16" fill="#2563EB" />
        <path d="M22 27 A 5 5 0 1 1 29 31" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <polygon points="30,32 30,27 26,29" fill="#FFFFFF" />
      </g>

      {/* Output Report & Verified Portfolio (Right) */}
      <g transform="translate(195, 80)">
        <rect width="85" height="120" rx="16" fill="#FFFFFF" className="dark:fill-slate-700" stroke="#BFDBFE" strokeWidth="1.5" />
        <rect x="14" y="16" width="40" height="8" rx="4" fill="#1E293B" className="dark:fill-slate-200" />
        
        {/* Document Lines */}
        <rect x="14" y="34" width="57" height="4" rx="2" fill="#60A5FA" />
        <rect x="14" y="44" width="48" height="4" rx="2" fill="#93C5FD" />
        <rect x="14" y="54" width="52" height="4" rx="2" fill="#BFDBFE" />

        {/* Verified Badge Icon */}
        <rect x="14" y="70" width="57" height="34" rx="10" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1" />
        <circle cx="30" cy="87" r="9" fill="#2563EB" />
        <path d="M26.5 87 L29 89.5 L33.5 84.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="43" y="83" width="20" height="4" rx="2" fill="#2563EB" />
        <rect x="43" y="90" width="14" height="3" rx="1.5" fill="#60A5FA" />
      </g>

      {/* Top Floating Sync Status Tag */}
      <g transform="translate(100, 35)">
        <rect width="120" height="28" rx="14" fill="#FFFFFF" className="dark:fill-slate-700" stroke="#BFDBFE" strokeWidth="1.5" />
        <circle cx="20" cy="14" r="4" fill="#10B981" />
        <rect x="32" y="11" width="68" height="6" rx="3" fill="#2563EB" />
      </g>
    </svg>
  )
}

// Ilustrasi Flat 3: Abstrak Koneksi Profil Dosen
function ProfileConnectIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      {/* Background Shape */}
      <rect x="20" y="20" width="280" height="240" rx="24" fill="#EFF6FF" className="dark:fill-slate-800/60" />

      {/* Main Center Profile Card */}
      <g transform="translate(95, 60)">
        <rect width="130" height="160" rx="20" fill="#FFFFFF" className="dark:fill-slate-700" stroke="#BFDBFE" strokeWidth="1.5" />
        
        {/* Header Cover Bar */}
        <path d="M0 20 C0 8.9543 8.9543 0 20 0 H110 C121.046 0 130 8.9543 130 20 V45 H0 V20 Z" fill="#2563EB" />

        {/* Profile Avatar Circle */}
        <circle cx="65" cy="45" r="22" fill="#FFFFFF" className="dark:fill-slate-700" stroke="#2563EB" strokeWidth="3" />
        <circle cx="65" cy="41" r="9" fill="#3B82F6" />
        <path d="M51 58 C51 51 57 49 65 49 C73 49 79 51 79 58 Z" fill="#3B82F6" />

        {/* Name & ID Bars */}
        <rect x="30" y="78" width="70" height="7" rx="3.5" fill="#1E293B" className="dark:fill-slate-100" />
        <rect x="40" y="91" width="50" height="5" rx="2.5" fill="#60A5FA" />

        {/* Status Pills inside Card */}
        <g transform="translate(15, 110)">
          <rect width="100" height="34" rx="10" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
          <circle cx="22" cy="17" r="7" fill="#10B981" />
          <path d="M19.5 17 L21 18.5 L24.5 15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="36" y="12" width="48" height="5" rx="2.5" fill="#2563EB" />
          <rect x="36" y="20" width="32" height="4" rx="2" fill="#93C5FD" />
        </g>
      </g>

      {/* Google Scholar ID Connection Node (Left) */}
      <g transform="translate(30, 90)">
        <path d="M50 40 L65 40" stroke="#2563EB" strokeWidth="2" strokeDasharray="3 3" />
        <rect width="50" height="50" rx="14" fill="#FFFFFF" className="dark:fill-slate-700" stroke="#BFDBFE" strokeWidth="1.5" />
        {/* Scholar Book / Mortarboard Icon */}
        <circle cx="25" cy="25" r="14" fill="#EFF6FF" />
        <path d="M25 18 L33 22 L25 26 L17 22 Z" fill="#2563EB" />
        <path d="M20 24.5 V28.5 C20 30 22 31 25 31 C28 31 30 30 30 28.5 V24.5" fill="#2563EB" opacity="0.8" />
      </g>

      {/* Scopus ID Connection Node (Right) */}
      <g transform="translate(240, 90)">
        <path d="M-15 40 L0 40" stroke="#2563EB" strokeWidth="2" strokeDasharray="3 3" />
        <rect width="50" height="50" rx="14" fill="#FFFFFF" className="dark:fill-slate-700" stroke="#BFDBFE" strokeWidth="1.5" />
        {/* Scopus Link Node Icon */}
        <circle cx="25" cy="25" r="14" fill="#EFF6FF" />
        <circle cx="20" cy="25" r="4" fill="#0284C7" />
        <circle cx="30" cy="25" r="4" fill="#2563EB" />
        <path d="M20 25 L30 25" stroke="#2563EB" strokeWidth="2" />
      </g>
    </svg>
  )
}

const slides = [
  {
    id: "welcome",
    title: "Selamat Datang di PentaDosen",
    description: "Satu ekosistem akademik cerdas untuk mengelola publikasi dan penelitian Anda secara terintegrasi.",
    icon: <Rocket className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    Illustration: EcosystemIllustration,
  },
  {
    id: "sync_workflow",
    title: "Sinkronisasi & Alur Kerja Efisien",
    description: "Terhubung otomatis dengan Google Scholar & Scopus untuk tarik data, verifikasi berkas, dan unduh laporan kinerja akademik dalam beberapa klik.",
    icon: <Layers className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    Illustration: SyncWorkflowIllustration,
  },
  {
    id: "profile_setup",
    title: "Lengkapi Profil Anda",
    description: "Hubungkan Google Scholar & Scopus ID Anda di menu integrasi, lalu jalankan sinkronisasi untuk menarik data.",
    icon: <RefreshCw className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    Illustration: ProfileConnectIllustration,
  },
] as const

export function OnboardingDialog() {
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const navigate = useNavigate()

  React.useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("penta_onboarding_seen")
    if (!hasSeenOnboarding) {
      setOpen(true)
      navigate("/profile?tab=integrasi")
    }
  }, [navigate])

  const isFirstSlide = activeIndex === 0
  const isLastSlide = activeIndex === slides.length - 1
  const currentSlide = slides[activeIndex] ?? slides[0]
  const IllustrationComponent = currentSlide.Illustration

  const handleNext = () => {
    if (isLastSlide) {
      handleComplete()
      return
    }
    setActiveIndex((prev) => prev + 1)
  }

  const handlePrevious = () => {
    if (isFirstSlide) return
    setActiveIndex((prev) => prev - 1)
  }

  const handleComplete = () => {
    localStorage.setItem("penta_onboarding_seen", "true")
    setOpen(false)
    navigate("/profile?tab=integrasi")
  }

  return (
    <AnimatePresence mode="wait">
      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Main Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="relative w-full max-w-4xl h-auto md:h-[520px] lg:h-[540px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200/80 dark:border-slate-800"
          >
            {/* Close Button */}
            <button
              onClick={handleComplete}
              className="absolute top-4 right-4 z-50 p-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-500 dark:text-slate-400 cursor-pointer"
              aria-label="Tutup Onboarding"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Side: Flat Abstract Illustration & Minimal Branding */}
            <div className="relative hidden md:flex md:w-[42%] h-full flex-col justify-between p-6 overflow-hidden bg-blue-50/60 dark:bg-slate-800/40 border-r border-slate-200/60 dark:border-slate-800/60">
              {/* Top Minimal Branding Header (Replacing Sci-Fi Badge) */}
              <div className="flex items-center gap-2.5 z-20">
                <PentaDosenLogo size={24} className="w-6 h-6" />
                <span className="font-extrabold text-sm tracking-tight text-slate-800 dark:text-slate-100">
                  PentaDosen
                </span>
              </div>

              {/* Center Abstract Vector Illustration */}
              <div className="relative flex-1 flex items-center justify-center my-2 z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full flex justify-center items-center"
                  >
                    <IllustrationComponent />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer Subtle Subtitle */}
              <div className="z-20 text-center">
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 tracking-wide uppercase">
                  Ekosistem Pengelolaan Publikasi &amp; Penelitian
                </p>
              </div>
            </div>

            {/* Right Side: Content & Action Interactions */}
            <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between bg-white dark:bg-slate-900">
              <div className="space-y-6 md:space-y-8">
                {/* Progress Indicator Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={cn(
                          "h-2 rounded-full transition-all duration-300 cursor-pointer",
                          index === activeIndex
                            ? "w-8 bg-primary-600 dark:bg-primary-500"
                            : "w-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
                        )}
                        aria-label={`Go to step ${index + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500">
                    Step {activeIndex + 1} of {slides.length}
                  </span>
                </div>

                {/* Main Content Animated Container */}
                <div className="min-h-[200px] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="space-y-4 w-full"
                    >
                      {/* Active Icon for Mobile View */}
                      <div className="inline-flex p-3 bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700/60 rounded-2xl md:hidden">
                        {currentSlide.icon}
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
                        {currentSlide.title}
                      </h2>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal max-w-xl">
                        {currentSlide.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevious}
                    disabled={isFirstSlide}
                    className={cn(
                      "p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group cursor-pointer",
                      isFirstSlide ? "opacity-0 pointer-events-none" : "opacity-100"
                    )}
                    aria-label="Kembali ke step sebelumnya"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-100" />
                  </button>

                  {!isLastSlide && (
                    <button
                      onClick={handleComplete}
                      className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer px-2 py-1"
                    >
                      Skip
                    </button>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className={cn(
                    "relative group px-6 py-2.5 rounded-xl font-semibold text-sm transition-all overflow-hidden flex items-center gap-2 cursor-pointer shadow-sm active:scale-98",
                    "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:text-slate-950 dark:hover:bg-primary-400"
                  )}
                >
                  <span>{isLastSlide ? "Mulai" : "Lanjut"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
