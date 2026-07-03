import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check } from "lucide-react";

export interface Option<T extends string | number = string | number> {
  value: T;
  label: string;
}

export interface DropdownSelectProps<T extends string | number = string | number> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  icon?: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export function DropdownSelect<T extends string | number = string | number>({
  value,
  onChange,
  options,
  icon,
  className = "",
  size = "md"
}: DropdownSelectProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const buttonClasses = size === "sm"
    ? "w-full flex items-center justify-between px-3 py-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-[10px] font-extrabold uppercase tracking-wider focus:ring-4 focus:ring-primary-100/50 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-zinc-200 shadow-sm cursor-pointer"
    : "w-full flex items-center justify-between px-5 py-3.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 transition-all outline-none text-gray-700 dark:text-zinc-200 shadow-sm cursor-pointer";

  const optionClasses = size === "sm"
    ? "w-full text-left px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-wider transition-all duration-150 flex items-center justify-between cursor-pointer"
    : "w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-150 flex items-center justify-between cursor-pointer";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-400 dark:text-zinc-500 shrink-0">{icon}</span>}
          <span className="truncate">{selectedOption?.label}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-gray-400 dark:text-zinc-500 shrink-0 ml-1.5"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden py-1.5 max-h-[250px] overflow-y-auto"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`${optionClasses} ${
                    isSelected
                      ? "bg-primary-50/70 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/60 hover:text-gray-900 dark:hover:text-zinc-100"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
