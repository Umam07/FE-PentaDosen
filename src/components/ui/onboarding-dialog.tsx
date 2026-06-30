import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Shield, BookOpen, Rocket, CheckCircle2, X, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

const slides = [
  {
    id: "welcome",
    title: "Selamat Datang di PentaDosen",
    description: "Satu ekosistem akademik cerdas untuk mengelola publikasi dan penelitian Anda secara terintegrasi.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=800",
    color: "from-primary-500/20 to-blue-600/20",
    icon: <Rocket className="w-6 h-6 text-primary-500" />,
  },
  {
    id: "about",
    title: "Sinkronisasi Otomatis",
    description: "Integrasi langsung dengan Google Scholar dan Scopus untuk memperbarui portofolio akademik secara real-time.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=800",
    color: "from-emerald-500/20 to-teal-500/20",
    icon: <BookOpen className="w-6 h-6 text-emerald-500" />,
  },
  {
    id: "workflow",
    title: "Alur Kerja Efisien",
    description: "Tarik data, verifikasi berkas, dan unduh laporan kinerja akademik Anda hanya dalam beberapa klik.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=800",
    color: "from-amber-500/20 to-orange-500/20",
    icon: <CheckCircle2 className="w-6 h-6 text-amber-500" />,
  },
  {
    id: "privacy",
    title: "Keamanan Terjamin",
    description: "Perlindungan data dan aset intelektual Anda dengan standar enkripsi industri yang aman dan tepercaya.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200&h=800",
    color: "from-purple-500/20 to-indigo-500/20",
    icon: <Shield className="w-6 h-6 text-purple-500" />,
  },
  {
    id: "final",
    title: "Lengkapi Profil Anda",
    description: "Hubungkan Google Scholar & Scopus ID Anda di menu integrasi, lalu jalankan sinkronisasi untuk menarik data.",
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=1200&h=800",
    color: "from-blue-500/20 to-cyan-500/20",
    icon: <RefreshCw className="w-6 h-6 text-primary-500" />,
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

  const handleNext = () => {
    if (isLastSlide) {
      handleComplete()
      return
    }
    setActiveIndex(prev => prev + 1)
  }

  const handlePrevious = () => {
    if (isFirstSlide) return
    setActiveIndex(prev => prev - 1)
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
          {/* Backdrop with sophisticated blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Main Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl h-auto md:h-[550px] lg:h-[580px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200/50 dark:border-slate-800/80"
          >
            {/* Close Button */}
            <button 
              onClick={handleComplete}
              className="absolute top-5 right-5 z-50 p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-500 dark:text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Side: Visual Experience (Desktop Only) */}
            <div className="relative hidden md:block md:w-[40%] h-full overflow-hidden border-r border-slate-100 dark:border-slate-800/50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br mix-blend-overlay z-10", currentSlide.color)} />
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent z-20" />
                </motion.div>
              </AnimatePresence>

              {/* Floating Brand Badge */}
              <div className="absolute bottom-6 left-6 right-6 z-30 flex items-center gap-3 bg-slate-950/60 backdrop-blur-xl p-3.5 rounded-2xl border border-white/10 shadow-lg">
                <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-white">
                  {currentSlide.icon}
                </div>
                <div className="text-white">
                  <p className="text-[9px] font-bold font-mono uppercase tracking-[0.2em] text-primary-400">System Ready</p>
                  <p className="text-sm font-extrabold tracking-tight font-sans">PENTADOSEN 2.0</p>
                </div>
              </div>
            </div>

            {/* Right Side: Content & Interaction */}
            <div className="flex-1 p-6 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-between bg-slate-50 dark:bg-slate-900/40">
              <div className="space-y-6 md:space-y-10">
                {/* Progress Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                          index === activeIndex 
                            ? "w-8 bg-primary-600 dark:bg-primary-500" 
                            : "w-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Step {activeIndex + 1} of {slides.length}
                  </span>
                </div>

                {/* Main Content Animation */}
                <div className="min-h-[220px] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="space-y-5 w-full"
                    >
                      {/* Active icon for mobile display only */}
                      <div className="inline-flex p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm md:hidden">
                        {currentSlide.icon}
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.15]">
                        {currentSlide.title}
                      </h2>
                      <p className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-normal max-w-xl">
                        {currentSlide.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevious}
                    disabled={isFirstSlide}
                    className={cn(
                      "p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group cursor-pointer",
                      isFirstSlide ? "opacity-0 pointer-events-none" : "opacity-100"
                    )}
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200" />
                  </button>

                  {!isLastSlide && (
                    <button
                      onClick={handleComplete}
                      className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
                    >
                      Skip
                    </button>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className={cn(
                    "relative group px-6 py-3 rounded-xl font-bold text-sm transition-all overflow-hidden flex items-center gap-2 cursor-pointer",
                    "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:text-slate-950 dark:hover:bg-primary-400 shadow-md active:scale-98"
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

