import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig, type Variants } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';
import { getFakultasTheme } from '../constants';

interface LecturerFilterStripProps {
  fakultasOptions: string[];
  selectedFakultas: string;
  onFakultasChange: (val: string) => void;
  fakultasCounts?: Record<string, number>;
}

// Hook click outside untuk Fluid Dropdown
function useClickAway(ref: React.RefObject<HTMLElement | null>, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export default function LecturerFilterStrip({
  fakultasOptions,
  selectedFakultas,
  onFakultasChange,
  fakultasCounts = {}
}: LecturerFilterStripProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredFakultas, setHoveredFakultas] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickAway(dropdownRef, () => setIsOpen(false));

  const selectedCount = fakultasCounts[selectedFakultas] ?? 0;
  const selectedDotColor = selectedFakultas === 'Semua' 
    ? 'bg-slate-400 dark:bg-slate-500' 
    : getFakultasTheme(selectedFakultas).color;

  return (
    <div className="w-full max-w-md relative" ref={dropdownRef}>
      <MotionConfig reducedMotion="user">
        {/* Trigger Button Dropdown */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
            isOpen
              ? 'bg-white dark:bg-slate-900 border-primary-500 text-slate-900 dark:text-white shadow-md shadow-primary-500/5'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Filter className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Fakultas:</span>
            
            <div className="flex items-center gap-2 truncate">
              <span className={`w-2 h-2 rounded-full shrink-0 ${selectedDotColor}`} />
              <span className="truncate font-bold text-slate-900 dark:text-white">{selectedFakultas}</span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                {selectedCount}
              </span>
            </div>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-5 h-5 text-slate-400 shrink-0 ml-2"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        {/* Animated Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: 'spring',
                  stiffness: 450,
                  damping: 30,
                  mass: 1,
                },
              }}
              exit={{
                opacity: 0,
                y: -4,
                scale: 0.98,
                transition: {
                  duration: 0.15,
                  ease: 'easeIn',
                },
              }}
              className="absolute left-0 right-0 top-full mt-2 z-50"
            >
              <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-2xl max-h-[380px] overflow-y-auto">
                <motion.div 
                  className="py-0.5 space-y-0.5" 
                  variants={containerVariants} 
                  initial="hidden" 
                  animate="visible"
                >
                  {fakultasOptions.map((fak) => {
                    const isSelected = selectedFakultas === fak;
                    const isTarget = (hoveredFakultas || selectedFakultas) === fak;
                    const count = fakultasCounts[fak] ?? 0;
                    const dotColor = fak === 'Semua' 
                      ? 'bg-slate-400 dark:bg-slate-500' 
                      : getFakultasTheme(fak).color;

                    return (
                      <motion.button
                        key={fak}
                        type="button"
                        onClick={() => {
                          onFakultasChange(fak);
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setHoveredFakultas(fak)}
                        onMouseLeave={() => setHoveredFakultas(null)}
                        className="relative flex w-full items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl cursor-pointer transition-colors duration-150"
                        whileTap={{ scale: 0.98 }}
                        variants={itemVariants}
                      >
                        {/* Pixel-Perfect Dynamic Hover Highlight */}
                        {isTarget && (
                          <motion.div
                            layoutId="faculty-hover-highlight"
                            className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-xl"
                            initial={false}
                            transition={{
                              type: 'spring',
                              bounce: 0.15,
                              duration: 0.35,
                            }}
                          />
                        )}

                        {/* Label & Dot */}
                        <div className="relative z-10 flex items-center gap-2.5 truncate">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                          <span className={`truncate ${isSelected ? 'font-bold text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>
                            {fak}
                          </span>
                        </div>

                        {/* Badge Count */}
                        <span className={`relative z-10 px-2 py-0.5 text-[10px] font-extrabold rounded-md shrink-0 ${
                          isSelected
                            ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-800/50'
                            : 'bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800/40'
                        }`}>
                          {count}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </div>
  );
}
