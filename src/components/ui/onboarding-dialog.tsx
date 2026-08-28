import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, ArrowLeft, X, Sparkles, RefreshCw, Layers } from "lucide-react"
import { useNavigate } from "react-router-dom"
import PentaDosenLogo from "./PentaDosenLogo"
import { lockBodyScroll, unlockBodyScroll } from "../../lib/utils"

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

// Ilustrasi 1: Ekosistem & Manajemen Riset Terintegrasi
function EcosystemIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      {/* Background Shape */}
      <rect x="20" y="20" width="280" height="240" rx="22" fill="#F0EFEC" className="dark:fill-[#1b1714]" />
      <rect x="20" y="20" width="280" height="240" rx="22" stroke="#DEDCD7" strokeWidth="1" className="dark:stroke-[#38312a]" />

      {/* Interconnecting Dashed Vector Lines */}
      <path d="M160 140 L85 85" stroke="#D9D6D0" strokeWidth="1.5" strokeDasharray="4 4" className="dark:stroke-[#38312a]" />
      <path d="M160 140 L235 85" stroke="#D9D6D0" strokeWidth="1.5" strokeDasharray="4 4" className="dark:stroke-[#38312a]" />
      <path d="M160 140 L85 195" stroke="#D9D6D0" strokeWidth="1.5" strokeDasharray="4 4" className="dark:stroke-[#38312a]" />
      <path d="M160 140 L235 195" stroke="#D9D6D0" strokeWidth="1.5" strokeDasharray="4 4" className="dark:stroke-[#38312a]" />

      {/* Central Hub Node (PentaDosen Core) */}
      <rect x="120" y="100" width="80" height="80" rx="18" fill="#191918" className="dark:fill-[#2a241f]" />
      <rect x="120" y="100" width="80" height="80" rx="18" stroke="#2563EB" strokeWidth="1.5" />
      <rect x="135" y="115" width="50" height="50" rx="10" fill="#2563EB" />
      {/* Central Cap Icon */}
      <path d="M160 131 L176 139 L160 147 L144 139 Z" fill="#FFFFFF" />
      <path d="M150 143.5 V149.5 C150 151.5 154 153 160 153 C166 153 170 151.5 170 149.5 V143.5" fill="#FFFFFF" opacity="0.9" />

      {/* Node 1: Tri Dharma Module (Top Left) */}
      <g transform="translate(45, 52)">
        <rect width="80" height="58" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="12" y="14" width="30" height="6" rx="3" fill="#191918" className="dark:fill-[#ece4db]" />
        <rect x="12" y="26" width="54" height="4" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
        <rect x="12" y="35" width="38" height="4" rx="2" fill="#E9E7E2" className="dark:fill-[#2c2621]" />
        <circle cx="62" cy="17" r="4" fill="#2563EB" />
      </g>

      {/* Node 2: Publication Module (Top Right) */}
      <g transform="translate(195, 52)">
        <rect width="80" height="58" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="12" y="14" width="28" height="6" rx="3" fill="#2563EB" />
        <rect x="12" y="26" width="48" height="4" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
        <rect x="12" y="35" width="36" height="4" rx="2" fill="#E9E7E2" className="dark:fill-[#2c2621]" />
        <circle cx="60" cy="38" r="7" fill="#EFF6FF" className="dark:fill-[#1b1714]" />
        <path d="M57.5 38 L59.5 40 L63 36.5" stroke="#2563EB" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Node 3: Analytics & KPI Module (Bottom Left) */}
      <g transform="translate(45, 170)">
        <rect width="80" height="58" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="14" y="36" width="9" height="12" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
        <rect x="27" y="26" width="9" height="22" rx="2" fill="#4A78D0" />
        <rect x="40" y="18" width="9" height="30" rx="2" fill="#2563EB" />
        <rect x="53" y="30" width="9" height="18" rx="2" fill="#D9823B" />
      </g>

      {/* Node 4: Integration Node (Bottom Right) */}
      <g transform="translate(195, 170)">
        <rect width="80" height="58" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <circle cx="40" cy="29" r="15" fill="#EFEEEA" className="dark:fill-[#2a241f]" />
        <path d="M34 29 C34 25.8 36.5 23.5 40 23.5 C42.2 23.5 44.2 24.8 45 26.8" stroke="#191918" strokeWidth="1.8" strokeLinecap="round" className="dark:stroke-[#ece4db]" />
        <path d="M46 29 C46 32.2 43.5 34.5 40 34.5 C37.8 34.5 35.8 33.2 35 31.2" stroke="#191918" strokeWidth="1.8" strokeLinecap="round" className="dark:stroke-[#ece4db]" />
      </g>

      {/* Subtle Geometric Accents */}
      <circle cx="32" cy="140" r="3.5" fill="#2563EB" opacity="0.5" />
      <circle cx="288" cy="140" r="3.5" fill="#D9823B" opacity="0.5" />
    </svg>
  )
}

// Ilustrasi 2: Sinkronisasi Google Scholar & Scopus
function SyncWorkflowIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      {/* Background Shape */}
      <rect x="20" y="20" width="280" height="240" rx="22" fill="#F0EFEC" className="dark:fill-[#1b1714]" />
      <rect x="20" y="20" width="280" height="240" rx="22" stroke="#DEDCD7" strokeWidth="1" className="dark:stroke-[#38312a]" />

      {/* Data Source Box (Left) */}
      <g transform="translate(38, 76)">
        <rect width="88" height="128" rx="14" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        {/* Source Header Badge */}
        <rect x="12" y="14" width="46" height="7" rx="3.5" fill="#191918" className="dark:fill-[#ece4db]" />
        
        {/* Scholar Data Item */}
        <rect x="10" y="32" width="68" height="24" rx="6" fill="#FBFAF8" className="dark:fill-[#2a241f]" stroke="#4A78D0" strokeWidth="1" strokeOpacity="0.4" />
        <circle cx="21" cy="44" r="5" fill="#4A78D0" />
        <rect x="31" y="42" width="38" height="4" rx="2" fill="#4A78D0" />
        
        {/* Scopus Data Item */}
        <rect x="10" y="62" width="68" height="24" rx="6" fill="#FBFAF8" className="dark:fill-[#2a241f]" stroke="#D9823B" strokeWidth="1" strokeOpacity="0.4" />
        <circle cx="21" cy="74" r="5" fill="#D9823B" />
        <rect x="31" y="72" width="38" height="4" rx="2" fill="#D9823B" />
        
        {/* Progress status line */}
        <rect x="12" y="98" width="50" height="4" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
        <rect x="12" y="108" width="32" height="4" rx="2" fill="#E9E7E2" className="dark:fill-[#2c2621]" />
      </g>

      {/* Synchronizing Data Flow Vector Arrows */}
      <g transform="translate(133, 115)">
        <path d="M0 25 C15 5, 40 5, 54 20" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
        <polygon points="54,23 55,16 48,19" fill="#2563EB" />

        <path d="M54 30 C39 50, 14 50, 0 35" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
        <polygon points="0,32 1,39 7,36" fill="#2563EB" />

        {/* Central Sync Badge */}
        <circle cx="27" cy="27" r="16" fill="#191918" className="dark:fill-[#ece4db]" />
        <path d="M22 27 A 5 5 0 1 1 29 31" stroke="#FFFFFF" className="dark:stroke-[#191918]" strokeWidth="1.8" strokeLinecap="round" />
        <polygon points="30,32 30,27 26,29" fill="#FFFFFF" className="dark:fill-[#191918]" />
      </g>

      {/* Output / Portfolio Box (Right) */}
      <g transform="translate(194, 76)">
        <rect width="88" height="128" rx="14" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <rect x="12" y="14" width="42" height="7" rx="3.5" fill="#191918" className="dark:fill-[#ece4db]" />
        
        {/* Document Lines */}
        <rect x="12" y="32" width="60" height="4" rx="2" fill="#D9D6D0" className="dark:fill-[#38312a]" />
        <rect x="12" y="42" width="50" height="4" rx="2" fill="#E9E7E2" className="dark:fill-[#2c2621]" />
        <rect x="12" y="52" width="56" height="4" rx="2" fill="#E9E7E2" className="dark:fill-[#2c2621]" />

        {/* Verified Status Pill */}
        <g transform="translate(10, 68)">
          <rect width="68" height="38" rx="8" fill="#EDF7F0" stroke="#CAE5D2" strokeWidth="1" className="dark:fill-[#201b17] dark:stroke-[#38312a]" />
          <circle cx="20" cy="19" r="8" fill="#3F8F5F" />
          <path d="M17 19 L19 21 L23 17" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="33" y="14" width="26" height="4" rx="2" fill="#3F8F5F" />
          <rect x="33" y="21" width="18" height="3" rx="1.5" fill="#75C995" />
        </g>
      </g>

      {/* Top Floating Status Indicator */}
      <g transform="translate(100, 36)">
        <rect width="120" height="26" rx="8" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        <circle cx="20" cy="13" r="4" fill="#3F8F5F" />
        <rect x="30" y="10" width="70" height="6" rx="3" fill="#191918" className="dark:fill-[#ece4db]" />
      </g>
    </svg>
  )
}

// Ilustrasi 3: Koneksi Profil Dosen & Portofolio Tri Dharma
function ProfileConnectIllustration() {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[260px] h-auto drop-shadow-sm select-none"
    >
      {/* Background Shape */}
      <rect x="20" y="20" width="280" height="240" rx="22" fill="#F0EFEC" className="dark:fill-[#1b1714]" />
      <rect x="20" y="20" width="280" height="240" rx="22" stroke="#DEDCD7" strokeWidth="1" className="dark:stroke-[#38312a]" />

      {/* Main Center Profile Card */}
      <g transform="translate(95, 56)">
        <rect width="130" height="168" rx="16" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#DEDCD7" strokeWidth="1" />
        
        {/* Header Cover Bar */}
        <path d="M0 16 C0 7.16 7.16 0 16 0 H114 C122.84 0 130 7.16 130 16 V44 H0 V16 Z" fill="#191918" className="dark:fill-[#2a241f]" />

        {/* Profile Avatar Circle */}
        <circle cx="65" cy="44" r="20" fill="#FBFAF8" stroke="#191918" strokeWidth="2.5" className="dark:fill-[#201b17] dark:stroke-[#ece4db]" />
        <circle cx="65" cy="40" r="8" fill="#2563EB" />
        <path d="M53 55 C53 49 58 47 65 47 C72 47 77 49 77 55 Z" fill="#2563EB" />

        {/* Name & NIDN Bars */}
        <rect x="30" y="74" width="70" height="7" rx="3.5" fill="#191918" className="dark:fill-[#ece4db]" />
        <rect x="42" y="86" width="46" height="5" rx="2.5" fill="#74716B" className="dark:fill-[#9d9285]" />

        {/* Status Indicator inside Card */}
        <g transform="translate(15, 106)">
          <rect width="100" height="42" rx="10" fill="#F0EFEC" stroke="#DEDCD7" strokeWidth="1" className="dark:fill-[#2a241f] dark:stroke-[#38312a]" />
          <circle cx="22" cy="21" r="7" fill="#3F8F5F" />
          <path d="M19.5 21 L21 22.5 L24.5 19" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="36" y="15" width="48" height="5" rx="2.5" fill="#191918" className="dark:fill-[#ece4db]" />
          <rect x="36" y="24" width="34" height="4" rx="2" fill="#2563EB" />
        </g>
      </g>

      {/* Google Scholar ID Connection Node (Left) */}
      <g transform="translate(28, 88)">
        <path d="M52 38 L67 38" stroke="#4A78D0" strokeWidth="1.5" strokeDasharray="3 3" />
        <rect width="52" height="52" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#4A78D0" strokeWidth="1" />
        <circle cx="26" cy="26" r="14" fill="#EFF6FF" className="dark:fill-[#1b1714]" />
        {/* Mortarboard Icon */}
        <path d="M26 18 L34 22.5 L26 27 L18 22.5 Z" fill="#4A78D0" />
        <path d="M21 25.5 V29.5 C21 31 23 32 26 32 C29 32 31 31 31 29.5 V25.5" fill="#4A78D0" opacity="0.85" />
      </g>

      {/* Scopus ID Connection Node (Right) */}
      <g transform="translate(240, 88)">
        <path d="M-15 38 L0 38" stroke="#D9823B" strokeWidth="1.5" strokeDasharray="3 3" />
        <rect width="52" height="52" rx="12" fill="#FBFAF8" className="dark:fill-[#201b17]" stroke="#D9823B" strokeWidth="1" />
        <circle cx="26" cy="26" r="14" fill="#FFF7EA" className="dark:fill-[#1b1714]" />
        {/* Scopus Symbol */}
        <circle cx="21" cy="26" r="4" fill="#D9823B" />
        <circle cx="31" cy="26" r="4" fill="#D9823B" />
        <path d="M21 26 L31 26" stroke="#D9823B" strokeWidth="2" />
      </g>
    </svg>
  )
}

const slides = [
  {
    id: "welcome",
    badge: "PENTADOSEN 2.0",
    title: "Selamat Datang di PentaDosen",
    description: "Platform terintegrasi untuk pengelolaan KPI akademik, rekam jejak riset, dan pemantauan capaian Tri Dharma di lingkungan Universitas YARSI.",
    icon: <Sparkles className="w-5 h-5 text-accent dark:text-accent-on-dark" />,
    Illustration: EcosystemIllustration,
  },
  {
    id: "sync_integration",
    badge: "SINKRONISASI OTOMATIS",
    title: "Integrasi Scholar & Scopus",
    description: "Sinkronisasi publikasi dan sitasi secara otomatis dari Google Scholar dan Scopus untuk memperbarui data portofolio riset Anda tanpa input manual berulang.",
    icon: <RefreshCw className="w-5 h-5 text-accent dark:text-accent-on-dark" />,
    Illustration: SyncWorkflowIllustration,
  },
  {
    id: "profile_setup",
    badge: "MULAI INTEGRASI",
    title: "Lengkapi Profil & Portofolio",
    description: "Hubungkan Google Scholar ID dan Scopus ID Anda di menu Integrasi Profil untuk mulai menarik riwayat publikasi dan memantau perolehan poin KPI.",
    icon: <Layers className="w-5 h-5 text-accent dark:text-accent-on-dark" />,
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

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleComplete()
      }
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      lockBodyScroll()
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
        unlockBodyScroll()
      }
    }
  }, [open])

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
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 font-sans"
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-slide-title"
        >
          {/* Backdrop (Warm Espresso / Deep Coffee overlay) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#171412]/60 backdrop-blur-md"
            onClick={handleComplete}
          />

          {/* Main Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            className="relative w-full max-w-4xl h-auto md:h-[520px] lg:h-[540px] bg-surface-light dark:bg-surface-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-hairline-light dark:border-hairline-dark z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleComplete}
              className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-surface-light-raised/80 hover:bg-surface-light text-muted hover:text-ink-heading border border-hairline-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark dark:text-on-dark-muted dark:hover:text-on-dark dark:border-hairline-dark transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Tutup Panduan Onboarding"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Side: Warm Neutral Vector Illustration & Minimal Branding */}
            <div className="relative hidden md:flex md:w-[42%] h-full flex-col justify-between p-6 overflow-hidden bg-surface-light-raised dark:bg-surface-dark-soft border-r border-hairline-light dark:border-hairline-dark">
              {/* Top Branding Header */}
              <div className="flex items-center gap-2.5 z-20">
                <PentaDosenLogo size={22} className="w-5.5 h-5.5" />
                <span className="font-semibold text-sm tracking-tight text-ink-heading dark:text-on-dark">
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
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-full flex justify-center items-center"
                  >
                    <IllustrationComponent />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer Monospace Academic Tag */}
              <div className="z-20 text-center">
                <p className="text-[11px] font-mono font-medium text-muted dark:text-on-dark-muted tracking-wider uppercase">
                  Sistem Informasi KPI &amp; Tri Dharma Dosen
                </p>
              </div>
            </div>

            {/* Right Side: Content & Action Interactions */}
            <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between bg-surface-light dark:bg-surface-dark">
              <div className="space-y-6 md:space-y-8">
                {/* Progress Indicator Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={cn(
                          "h-2 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                          index === activeIndex
                            ? "w-8 bg-ink dark:bg-on-dark"
                            : "w-2 bg-hairline-light dark:bg-hairline-dark hover:bg-ink-border dark:hover:bg-hairline-dark-soft"
                        )}
                        aria-label={`Buka slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono font-medium text-muted dark:text-on-dark-muted">
                    Langkah {activeIndex + 1} dari {slides.length}
                  </span>
                </div>

                {/* Main Content Animated Container */}
                <div className="min-h-[190px] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="space-y-3.5 w-full"
                    >
                      {/* Monospace Uppercase Badge */}
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent dark:bg-accent-on-dark" />
                        <span className="text-[11px] font-mono font-semibold tracking-wider text-muted dark:text-on-dark-muted uppercase">
                          {currentSlide.badge}
                        </span>
                      </div>

                      <h2 
                        id="onboarding-slide-title"
                        className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink-heading dark:text-on-dark leading-tight"
                      >
                        {currentSlide.title}
                      </h2>
                      <p className="text-sm sm:text-base text-body dark:text-on-dark-soft leading-relaxed font-normal max-w-xl">
                        {currentSlide.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevious}
                    disabled={isFirstSlide}
                    className={cn(
                      "h-11 w-11 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark transition-colors flex items-center justify-center group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      isFirstSlide ? "opacity-0 pointer-events-none" : "opacity-100"
                    )}
                    aria-label="Kembali ke langkah sebelumnya"
                  >
                    <ArrowLeft className="w-4 h-4 text-body dark:text-on-dark-soft group-hover:text-ink-heading dark:group-hover:text-on-dark transition-colors" />
                  </button>

                  {!isLastSlide && (
                    <button
                      onClick={handleComplete}
                      className="text-xs font-semibold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors cursor-pointer px-2 py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      Lewati
                    </button>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="h-11 px-6 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm bg-ink text-on-ink hover:bg-ink-hover active:bg-ink-active dark:bg-on-dark dark:text-canvas-dark dark:hover:bg-on-dark-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span>{isLastSlide ? "Mulai Sekarang" : "Lanjut"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
