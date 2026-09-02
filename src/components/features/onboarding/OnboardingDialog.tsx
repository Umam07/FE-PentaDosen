import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, ArrowLeft, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import PentaDosenLogo from "../../shared/PentaDosenLogo"
import { lockBodyScroll, unlockBodyScroll } from "../../../lib/utils"
import {
  UserRole,
  getSlidesForRole,
  getStorageKeyForRole,
  getCompletionRouteForRole,
} from "./slides.config"

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

export interface OnboardingDialogProps {
  user?: {
    id?: number | string
    name?: string
    role?: UserRole | string
    [key: string]: any
  } | null
}

export function OnboardingDialog({ user }: OnboardingDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const navigate = useNavigate()

  // Ambil role aktif dari prop atau sessionStorage
  const activeRole: UserRole = React.useMemo(() => {
    if (user?.role) {
      if (user.role === "admin fakultas") return "admin fakultas"
      if (user.role === "admin penelitian") return "admin penelitian"
      return "dosen"
    }
    const stored = sessionStorage.getItem("pentadosen_user")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.role === "admin fakultas") return "admin fakultas"
        if (parsed.role === "admin penelitian") return "admin penelitian"
      } catch (e) {
        // fallback to dosen
      }
    }
    return "dosen"
  }, [user])

  const storageKey = React.useMemo(() => getStorageKeyForRole(activeRole), [activeRole])
  const slides = React.useMemo(() => getSlidesForRole(activeRole), [activeRole])

  React.useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem(storageKey)
    if (!hasSeenOnboarding) {
      setOpen(true)
      if (activeRole === "dosen") {
        navigate("/profile?tab=integrasi")
      }
    }
  }, [storageKey, activeRole, navigate])

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
    localStorage.setItem(storageKey, "true")
    setOpen(false)
    navigate(getCompletionRouteForRole(activeRole))
  }

  return (
    <AnimatePresence mode="wait">
      {open && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center p-3.5 sm:p-6 font-sans"
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
            className="relative w-full max-w-sm sm:max-w-lg md:max-w-4xl h-auto md:h-[520px] lg:h-[540px] bg-surface-light dark:bg-surface-dark rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-hairline-light dark:border-hairline-dark z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleComplete}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 p-2 rounded-lg bg-surface-light-raised/80 hover:bg-surface-light text-muted hover:text-ink-heading border border-hairline-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark dark:text-on-dark-muted dark:hover:text-on-dark dark:border-hairline-dark transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Tutup Panduan Onboarding"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Side: Warm Neutral Vector Illustration & Minimal Branding (Desktop) */}
            <div className="relative hidden md:flex md:w-[42%] h-full flex-col justify-between p-6 overflow-hidden bg-surface-light-raised dark:bg-surface-dark-soft border-r border-hairline-light dark:border-hairline-dark">
              {/* Top Branding Header */}
              <div className="flex items-center gap-2.5 z-20">
                <PentaDosenLogo size={22} className="w-5.5 h-5.5" />
                <span className="font-semibold text-sm tracking-tight text-ink-heading dark:text-on-dark">
                  PentaDosen
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-light dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark font-medium uppercase">
                  {activeRole === "dosen" ? "Dosen" : activeRole === "admin fakultas" ? "Admin Fak" : "Admin Univ"}
                </span>
              </div>

              {/* Center Abstract Vector Illustration */}
              <div className="relative flex-1 flex items-center justify-center my-2 z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeRole}_${activeIndex}`}
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
                  {activeRole === "dosen" 
                    ? "Sistem Informasi KPI & Tri Dharma Dosen" 
                    : activeRole === "admin fakultas"
                    ? "Portal Tata Kelola & Verifikasi Fakultas"
                    : "Pusat Manajemen Riset & LPPM Universitas"}
                </p>
              </div>
            </div>

            {/* Right Side: Content & Action Interactions */}
            <div className="flex-1 p-5 sm:p-7 md:p-10 lg:p-12 flex flex-col justify-between bg-surface-light dark:bg-surface-dark">
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {/* Progress Indicator Header with safe margin on mobile for close button */}
                <div className="flex items-center justify-between gap-3 pr-10 md:pr-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={cn(
                          "h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                          index === activeIndex
                            ? "w-6 sm:w-8 bg-ink dark:bg-on-dark"
                            : "w-1.5 sm:w-2 bg-hairline-light dark:bg-hairline-dark hover:bg-ink-border dark:hover:bg-hairline-dark-soft"
                        )}
                        aria-label={`Buka slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] sm:text-xs font-mono font-medium text-muted dark:text-on-dark-muted whitespace-nowrap">
                    Langkah {activeIndex + 1} dari {slides.length}
                  </span>
                </div>

                {/* Main Content Animated Container */}
                <div className="min-h-[140px] sm:min-h-[160px] md:min-h-[190px] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${activeRole}_${activeIndex}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="space-y-3 sm:space-y-3.5 w-full"
                    >
                      {/* Monospace Uppercase Badge + Mobile Icon Badge */}
                      <div className="flex items-center gap-2">
                        <div className="md:hidden flex items-center justify-center w-7 h-7 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark text-accent dark:text-accent-on-dark shrink-0">
                          {React.cloneElement(currentSlide.icon as React.ReactElement<any>, {
                            className: "w-3.5 h-3.5 text-accent dark:text-accent-on-dark"
                          })}
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent dark:bg-accent-on-dark" />
                          <span className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider text-muted dark:text-on-dark-muted uppercase">
                            {currentSlide.badge}
                          </span>
                        </div>
                      </div>

                      <h2 
                        id="onboarding-slide-title"
                        className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-ink-heading dark:text-on-dark leading-snug sm:leading-tight"
                      >
                        {currentSlide.title}
                      </h2>
                      <p className="text-xs sm:text-sm md:text-base text-body dark:text-on-dark-soft leading-relaxed font-normal max-w-xl">
                        {currentSlide.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 sm:pt-6 mt-4 border-t border-hairline-light-soft dark:border-hairline-dark-soft gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={handlePrevious}
                    disabled={isFirstSlide}
                    className={cn(
                      "h-10 w-10 sm:h-11 sm:w-11 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark transition-colors flex items-center justify-center group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                      isFirstSlide ? "opacity-0 pointer-events-none" : "opacity-100"
                    )}
                    aria-label="Kembali ke langkah sebelumnya"
                  >
                    <ArrowLeft className="w-4 h-4 text-body dark:text-on-dark-soft group-hover:text-ink-heading dark:group-hover:text-on-dark transition-colors" />
                  </button>

                  {!isLastSlide && (
                    <button
                      onClick={handleComplete}
                      className="text-xs sm:text-sm font-semibold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors cursor-pointer px-2 py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      Lewati
                    </button>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="h-10 sm:h-11 px-4 sm:px-6 rounded-lg font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-sm bg-ink text-on-ink hover:bg-ink-hover active:bg-ink-active dark:bg-on-dark dark:text-canvas-dark dark:hover:bg-on-dark-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0"
                >
                  <span>{isLastSlide ? "Mulai Sekarang" : "Lanjut"}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
export default OnboardingDialog
