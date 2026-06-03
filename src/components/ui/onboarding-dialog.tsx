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
    title: "Selamat Datang di Penta Dosen",
    description: "Platform integrasi data masa depan untuk para akademisi. Kelola publikasi, penelitian, dan pengabdian masyarakat Anda dalam satu ekosistem cerdas.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=800",
    color: "from-blue-600/20 to-indigo-600/20",
    accent: "bg-blue-500",
    icon: <Rocket className="w-8 h-8 text-blue-500" />,
  },
  {
    id: "about",
    title: "Sentralisasi Data Akademik",
    description: "Lupakan cara manual. Kami mengintegrasikan Scopus, Google Scholar secara otomatis untuk memvalidasi portofolio Anda secara real-time.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=800",
    color: "from-emerald-600/20 to-teal-600/20",
    accent: "bg-emerald-500",
    icon: <BookOpen className="w-8 h-8 text-emerald-500" />,
  },
  {
    id: "workflow",
    title: "Alur Kerja yang Efisien",
    description: "Tarik data, verifikasi detailnya, dan hasilkan laporan kinerja Anda hanya dalam hitungan detik. Fokus pada penelitian, biar kami yang urus administrasinya.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=800",
    color: "from-orange-600/20 to-amber-600/20",
    accent: "bg-orange-500",
    icon: <CheckCircle2 className="w-8 h-8 text-orange-500" />,
  },
  {
    id: "privacy",
    title: "Keamanan Tanpa Kompromi",
    description: "Privasi data Anda adalah prioritas utama kami. Kami menggunakan enkripsi standar industri untuk memastikan aset intelektual Anda tetap aman.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200&h=800",
    color: "from-purple-600/20 to-pink-600/20",
    accent: "bg-purple-500",
    icon: <Shield className="w-8 h-8 text-purple-500" />,
  },
  {
    id: "final",
    title: "Lengkapi Profil Anda",
    description: "Langkah terakhir, pastikan Anda mengisi Scopus ID dan Google Scholar ID pada halaman profil ini, lalu klik tombol sinkronisasi untuk menarik data publikasi Anda secara otomatis.",
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=1200&h=800",
    color: "from-blue-600/20 to-cyan-600/20",
    accent: "bg-blue-500",
    icon: <RefreshCw className="w-8 h-8 text-blue-500" />,
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
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 font-[system-ui,sans-serif]">
          {/* Backdrop with sophisticated blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
          />

          {/* Main Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-5xl h-[600px] md:h-[650px] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row border border-white/10"
          >
            {/* Close Button */}
            <button 
              onClick={handleComplete}
              className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Side: Visual Experience */}
            <div className="relative w-full md:w-[45%] h-[200px] md:h-auto overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br mix-blend-overlay z-10", currentSlide.color)} />
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />
                </motion.div>
              </AnimatePresence>

              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 z-30 flex items-center gap-4 bg-white/10 backdrop-blur-2xl p-4 rounded-3xl border border-white/20 shadow-2xl">
                <div className="p-3 bg-white rounded-2xl shadow-xl">
                  {currentSlide.icon}
                </div>
                <div className="text-white pr-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">System Ready</p>
                  <p className="text-lg font-black tracking-tight">PENTA DASHBOARD</p>
                </div>
              </div>
            </div>

            {/* Right Side: Content & Interaction */}
            <div className="flex-1 p-8 md:p-14 flex flex-col justify-between bg-zinc-50 dark:bg-zinc-900">
              <div className="space-y-12">
                {/* Progress Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-500",
                          index === activeIndex ? "w-10 bg-zinc-900 dark:bg-white" : "w-2 bg-zinc-300 dark:bg-zinc-700"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                    Step {activeIndex + 1} of {slides.length}
                  </span>
                </div>

                {/* Main Content Animation */}
                <div className="min-h-[250px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[1.1]">
                        {currentSlide.title}
                      </h2>
                      <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium max-w-lg">
                        {currentSlide.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevious}
                    disabled={isFirstSlide}
                    className={cn(
                      "p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group",
                      isFirstSlide ? "opacity-0 pointer-events-none" : "opacity-100"
                    )}
                  >
                    <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white" />
                  </button>
                  <button
                    onClick={handleComplete}
                    className="text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    Skip
                  </button>
                </div>

                <button
                  onClick={handleNext}
                  className={cn(
                    "relative group px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all overflow-hidden flex items-center gap-3",
                    "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xl hover:scale-[1.02] active:scale-95"
                  )}
                >
                  <span className="relative z-10">{isLastSlide ? "Get Started" : "Next"}</span>
                  <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
