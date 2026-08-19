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
    ? 'bg-muted-soft dark:bg-on-dark-muted' 
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
              ? 'bg-surface-light dark:bg-surface-dark border-accent text-ink-heading dark:text-on-dark shadow-sm'
              : 'bg-surface-light dark:bg-surface-dark border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft hover:border-ink-border dark:hover:border-hairline-dark'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Filter className="w-4 h-4 text-accent dark:text-accent-on-dark shrink-0" />
            <span className="text-[11px] font-bold text-muted dark:text-on-dark-muted uppercase tracking-wider shrink-0">Fakultas:</span>
            
            <div className="flex items-center gap-2 truncate">
              <span className={`w-2 h-2 rounded-full shrink-0 ${selectedDotColor}`} />
              <span className="truncate font-bold text-ink-heading dark:text-on-dark">{selectedFakultas}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted border border-hairline-light-soft dark:border-hairline-dark-soft">
                {selectedCount}
              </span>
            </div>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-5 h-5 text-muted dark:text-on-dark-muted shrink-0 ml-2"
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
              <div className="w-full rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-1.5 shadow-xl max-h-[380px] overflow-y-auto">
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
                      ? 'bg-muted-soft dark:bg-on-dark-muted' 
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
                        {/* Dynamic Hover Highlight */}
                        {isTarget && (
                          <motion.div
                            layoutId="faculty-hover-highlight"
                            className="absolute inset-0 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl"
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
                          <span className={`truncate ${isSelected ? 'font-bold text-accent dark:text-accent-on-dark' : 'text-body dark:text-on-dark-soft'}`}>
                            {fak}
                          </span>
                        </div>

                        {/* Badge Count */}
                        <span className={`relative z-10 px-2 py-0.5 text-[10px] font-bold font-mono rounded-md shrink-0 ${
                          isSelected
                            ? 'bg-accent-soft dark:bg-accent/15 text-accent dark:text-accent-on-dark border border-accent-border/50 dark:border-accent/30'
                            : 'bg-surface-light-raised/80 dark:bg-surface-dark-elevated/80 text-muted dark:text-on-dark-muted border border-hairline-light-soft dark:border-hairline-dark-soft'
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
