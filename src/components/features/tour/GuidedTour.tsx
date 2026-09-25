import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, X, Check } from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  badge?: string;
  placement?: 'bottom' | 'top' | 'auto';
}

export interface GuidedTourProps {
  isOpen: boolean;
  steps: TourStep[];
  currentStep?: number;
  onStepChange?: (stepIndex: number) => void;
  onComplete: () => void;
  onSkip: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export function GuidedTour({
  isOpen,
  steps,
  currentStep: controlledStep,
  onStepChange,
  onComplete,
  onSkip,
}: GuidedTourProps) {
  const [internalStep, setInternalStep] = React.useState(0);
  const activeStep = controlledStep !== undefined ? controlledStep : internalStep;

  const [targetRect, setTargetRect] = React.useState<TargetRect | null>(null);
  const [popoverPos, setPopoverPos] = React.useState<{ top: number; left: number; placement: 'top' | 'bottom' } | null>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const hasInitialized = React.useRef(false);

  const stepData = steps[activeStep];
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;

  // Reset initialization flag when tour is closed
  React.useEffect(() => {
    if (!isOpen) {
      hasInitialized.current = false;
      setTargetRect(null);
      setPopoverPos(null);
    }
  }, [isOpen]);

  const updatePosition = React.useCallback(() => {
    if (!stepData) return;
    const el = document.getElementById(stepData.targetId);
    if (!el) {
      setTargetRect(null);
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      right: rect.right,
    });

    const popoverWidth = popoverRef.current ? popoverRef.current.offsetWidth : 320;
    const popoverHeight = popoverRef.current ? popoverRef.current.offsetHeight : 150;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let placement: 'top' | 'bottom' = 'bottom';
    if (stepData.placement === 'top') {
      placement = 'top';
    } else if (stepData.placement === 'bottom') {
      placement = 'bottom';
    } else {
      if (rect.bottom + popoverHeight + 16 > viewportHeight && rect.top > popoverHeight + 16) {
        placement = 'top';
      } else {
        placement = 'bottom';
      }
    }

    let top = placement === 'bottom' ? rect.bottom + 10 : rect.top - popoverHeight - 10;
    top = Math.max(12, Math.min(top, viewportHeight - popoverHeight - 12));

    let left = rect.left + rect.width / 2 - popoverWidth / 2;
    left = Math.max(12, Math.min(left, viewportWidth - popoverWidth - 12));

    setPopoverPos({ top, left, placement });
  }, [stepData]);

  // Locate element on mount & step change
  React.useEffect(() => {
    if (!isOpen || !stepData) return;

    let retries = 0;
    const locate = () => {
      const el = document.getElementById(stepData.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        const isInViewport =
          rect.top >= 40 &&
          rect.bottom <= window.innerHeight - 40 &&
          rect.left >= 0 &&
          rect.right <= window.innerWidth;

        if (!isInViewport) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        updatePosition();
      } else if (retries < 10) {
        retries++;
        setTimeout(locate, 80);
      }
    };

    locate();

    const handleUpdate = () => updatePosition();
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
    };
  }, [isOpen, activeStep, stepData, updatePosition]);

  // Mark initialized once targetRect is first available
  React.useEffect(() => {
    if (targetRect && !hasInitialized.current) {
      // Allow the first render to set coordinates instantly, then enable fluid transitions
      const t = setTimeout(() => {
        hasInitialized.current = true;
      }, 50);
      return () => clearTimeout(t);
    }
  }, [targetRect]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSkip();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (isLastStep) {
          onComplete();
        } else {
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (!isFirstStep) {
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFirstStep, isLastStep, activeStep]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      return;
    }
    const nextStep = activeStep + 1;
    if (onStepChange) onStepChange(nextStep);
    setInternalStep(nextStep);
  };

  const handlePrev = () => {
    if (isFirstStep) return;
    const prevStep = activeStep - 1;
    if (onStepChange) onStepChange(prevStep);
    setInternalStep(prevStep);
  };

  if (!isOpen || !stepData || typeof document === 'undefined') return null;

  const pad = 2;

  const arrowLeft =
    targetRect && popoverPos && popoverRef.current
      ? Math.max(16, Math.min(targetRect.left + targetRect.width / 2 - popoverPos.left, popoverRef.current.offsetWidth - 16))
      : 30;

  const fluidTransition = {
    duration: 0.28,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  const tourContent = (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-step-title"
      >
        {/* Backdrop click interceptor */}
        <div
          className="fixed inset-0 pointer-events-auto cursor-pointer"
          onClick={onSkip}
        />

        {/* Fluid Animated Spotlight Cutout (Instant on Step 1, Smooth Glide on Step 1 -> 2) */}
        {targetRect && (
          <motion.div
            initial={
              !hasInitialized.current
                ? {
                    opacity: 0,
                    top: targetRect.top - pad,
                    left: targetRect.left - pad,
                    width: targetRect.width + pad * 2,
                    height: targetRect.height + pad * 2,
                  }
                : false
            }
            animate={{
              opacity: 1,
              top: targetRect.top - pad,
              left: targetRect.left - pad,
              width: targetRect.width + pad * 2,
              height: targetRect.height + pad * 2,
            }}
            transition={{
              ...fluidTransition,
              opacity: { duration: 0.15 },
            }}
            className="fixed rounded-lg pointer-events-none z-[9992] border-2 border-accent"
            style={{
              boxShadow: '0 0 0 9999px rgba(15, 13, 11, 0.65)',
            }}
          />
        )}

        {/* Clickable proxy for direct button interaction */}
        {targetRect && (
          <div
            style={{
              position: 'fixed',
              top: targetRect.top,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height,
              zIndex: 9993,
            }}
            className="cursor-pointer pointer-events-auto"
            onClick={() => {
              const el = document.getElementById(stepData.targetId);
              if (el) el.click();
            }}
          />
        )}

        {/* Fluid Animated Tooltip Card */}
        {popoverPos && (
          <motion.div
            ref={popoverRef}
            initial={
              !hasInitialized.current
                ? {
                    opacity: 0,
                    y: popoverPos.placement === 'bottom' ? 4 : -4,
                    top: popoverPos.top,
                    left: popoverPos.left,
                  }
                : false
            }
            animate={{
              opacity: 1,
              y: 0,
              top: popoverPos.top,
              left: popoverPos.left,
            }}
            transition={{
              ...fluidTransition,
              opacity: { duration: 0.15 },
            }}
            style={{ position: 'fixed' }}
            className="pointer-events-auto z-[9995] w-[calc(100vw-24px)] max-w-sm rounded-xl border border-hairline-light bg-surface-light p-4 shadow-xl dark:border-hairline-dark dark:bg-surface-dark font-sans"
          >
            {/* Directional Arrow (Glides fluidly to match target button center) */}
            {popoverPos.placement === 'bottom' && (
              <motion.div
                animate={{ left: arrowLeft }}
                transition={fluidTransition}
                className="absolute -top-1.5 -translate-x-1/2 w-3 h-3 rotate-45 bg-surface-light dark:bg-surface-dark border-t border-l border-hairline-light dark:border-hairline-dark"
              />
            )}
            {popoverPos.placement === 'top' && (
              <motion.div
                animate={{ left: arrowLeft }}
                transition={fluidTransition}
                className="absolute -bottom-1.5 -translate-x-1/2 w-3 h-3 rotate-45 bg-surface-light dark:bg-surface-dark border-b border-r border-hairline-light dark:border-hairline-dark"
              />
            )}

            {/* Header: Step & Close */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted px-2 py-0.5 rounded bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark">
                {stepData.badge || `${activeStep + 1} / ${steps.length}`}
              </span>

              <button
                onClick={onSkip}
                className="p-1 rounded text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer"
                aria-label="Tutup panduan"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Title & Description with subtle crossfade */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15 }}
                className="space-y-1"
              >
                <h3
                  id="tour-step-title"
                  className="text-sm font-bold tracking-tight text-ink-heading dark:text-on-dark"
                >
                  {stepData.title}
                </h3>
                <p className="text-xs text-body dark:text-on-dark-soft leading-relaxed font-normal">
                  {stepData.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div className="mt-3.5 pt-2.5 border-t border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-between gap-2">
              {/* Dots */}
              <div className="flex items-center gap-1">
                {steps.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      idx === activeStep
                        ? 'w-4 bg-ink dark:bg-on-dark'
                        : 'w-1.5 bg-hairline-light dark:bg-hairline-dark'
                    }`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {!isFirstStep && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-1.5 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark transition-colors cursor-pointer"
                    aria-label="Langkah sebelumnya"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-body dark:text-on-dark-soft" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink text-on-ink hover:bg-ink-hover active:bg-ink-active dark:bg-on-dark dark:text-canvas-dark dark:hover:bg-on-dark-soft text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <span>{isLastStep ? 'Selesai' : 'Lanjut'}</span>
                  {isLastStep ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );

  return createPortal(tourContent, document.body);
}

export default GuidedTour;
