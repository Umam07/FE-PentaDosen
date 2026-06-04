import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { LayoutDashboard, MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Leaderboard from './Leaderboard';

export default function Hero() {

  // Logic untuk Panah Penunjuk Button
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring effect untuk pergerakan halus
  const springX = useSpring(mouseX, { damping: 25, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 200 });

  const buttonRectRef = useRef<DOMRect | null>(null);
  const heroRectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const updateRects = () => {
      if (buttonRef.current) {
        buttonRectRef.current = buttonRef.current.getBoundingClientRect();
      }
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroRectRef.current = heroSection.getBoundingClientRect();
      }
    };

    // Initialize rects
    updateRects();

    const handleMouseMove = (e: MouseEvent) => {
      // Hanya aktifkan di desktop atau layar lebar
      if (window.innerWidth < 1024) return;
      
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      if (!buttonRectRef.current || !heroRectRef.current) {
        updateRects();
      }

      const rect = buttonRectRef.current;
      const heroRect = heroRectRef.current;
      
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Kalkulasi sudut antara mouse dan tengah button
        const angle = Math.atan2(centerY - e.clientY, centerX - e.clientX) * (180 / Math.PI);
        setRotation(angle);
      }
      
      if (heroRect) {
        // Tampilkan panah jika mouse berada di area hero
        if (
          e.clientX >= heroRect.left && 
          e.clientX <= heroRect.right && 
          e.clientY >= heroRect.top && 
          e.clientY <= heroRect.bottom
        ) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateRects);
    window.addEventListener('scroll', updateRects);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateRects);
      window.removeEventListener('scroll', updateRects);
    };
  }, [mouseX, mouseY]);

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-100 dark:bg-primary-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 dark:opacity-40 animate-blob transition-colors duration-300" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-100 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 dark:opacity-40 animate-blob animation-delay-2000 transition-colors duration-300" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 dark:opacity-30 transition-colors duration-300" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/cubes.png')] opacity-[0.03] dark:opacity-[0.05] dark:invert"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24 relative">


          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-8 transition-colors duration-300"
          >
            Masa Depan <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 dark:from-primary-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Karir Akademik Anda
              </span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary-100/60 dark:bg-primary-900/40 -z-10 rotate-1"></span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12 transition-colors duration-300"
          >
            Otomatisasi sinkronisasi data <span className="text-slate-900 dark:text-white font-bold">Google Scholar</span> & <span className="text-slate-900 dark:text-white font-bold">Scopus</span>. 
            Kelola berkas evaluasi lebih cepat, akurat, dan transparan dalam satu dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 px-4"
          >
            {/* Primary Button */}
            <Link
              ref={buttonRef}
              to="/insights"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-500 text-white font-bold text-base px-10 py-5 rounded-2xl shadow-2xl shadow-slate-200 dark:shadow-none transition-all duration-300 group overflow-hidden relative"
            >
              <span className="relative z-10">Lihat Lebih Lengkap</span>
              <LayoutDashboard className="w-5 h-5 group-hover:rotate-12 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Shine Effect */}
              <motion.div
                className="absolute top-0 -inset-full h-full w-1/2 z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                animate={{ left: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: 2, repeatDelay: 1 }}
              />
            </Link>


          </motion.div>
        </div>

        {/* --- --- --- Bagian Leaderboard --- --- --- */}
        <div id="leaderboard" className="relative max-w-7xl mx-auto mt-16 md:mt-24">
          <Leaderboard isHero={true} />
        </div>
      </div>

      {/* Directional Arrow Overlay (Premium Cyber-Guidance) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
        style={{
          x: springX,
          y: springY,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <motion.div
          animate={{ 
            rotate: rotation,
            scale: isVisible ? 1 : 0.5,
          }}
          transition={{ type: "spring", damping: 15, stiffness: 100 }}
          className="relative"
        >
          {/* Main Arrow Container */}
          <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            
            {/* Outer Rotating Ring (Decorative) */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="absolute w-20 h-20 border-2 border-dashed border-primary-500/20 rounded-full"
            />
            
            {/* Pulsing Brackets */}
            <motion.div 
               animate={{ 
                 scale: [1, 1.1, 1],
                 opacity: [0.3, 0.6, 0.3]
               }}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               className="absolute w-16 h-16 border-x-2 border-primary-500/40 rounded-xl"
            />

            {/* Glowing Core */}
            <div className="relative group">
               <div className="absolute -inset-2 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
               
               <div className="relative bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl p-4 rounded-full border border-white/20 dark:border-primary-500/30 shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center justify-center overflow-hidden">
                  {/* Internal Scanning Line */}
                  <motion.div 
                    animate={{ x: [-20, 20, -20] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 bottom-0 w-0.5 bg-primary-400/30 blur-sm"
                  />
                  
                  <MoveRight className="w-6 h-6 text-primary-600 dark:text-white relative z-10" strokeWidth={3} />
               </div>
            </div>

            {/* Floating Info Tag */}
            <motion.div 
               style={{ rotate: -rotation }} // Keep text level
               className="absolute left-16 px-3 py-1 bg-slate-900/90 dark:bg-primary-600/90 text-white text-[10px] rounded-lg font-black uppercase tracking-tighter shadow-xl border border-white/20 flex flex-col items-start min-w-[100px]"
            >
               <span className="opacity-60 text-[8px]">TARGET LOCKED</span>
               <span className="flex items-center gap-1">
                 PANEL INSIGHTS <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
               </span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}} />
    </section>
  );
}