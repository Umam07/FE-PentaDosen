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
  position?: "top" | "bottom";
  disabled?: boolean;
  variant?: "default" | "borderless";
}

export function DropdownSelect<T extends string | number = string | number>({
  value,
  onChange,
  options,
  icon,
  className = "",
  size = "md",
  position = "bottom",
  disabled = false,
  variant = "default"
}: DropdownSelectProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropPosition, setDropPosition] = React.useState<"top" | "bottom">(position);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (position === "bottom" && spaceBelow < 260 && spaceAbove > 200) {
        setDropPosition("top");
      } else if (position === "top" && spaceAbove < 260 && spaceBelow > 200) {
        setDropPosition("bottom");
      } else {
        setDropPosition(position);
      }
    }
  }, [isOpen, position]);

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

  const getButtonClasses = () => {
    if (variant === "borderless") {
      return `w-full h-11 flex items-center justify-between px-4 bg-transparent text-[11px] font-black uppercase tracking-widest outline-none text-gray-700 dark:text-zinc-200 transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50/80 dark:hover:bg-zinc-700/40 cursor-pointer"
      }`;
    }
    if (size === "sm") {
      return `w-full flex items-center justify-between px-3 py-1.5 bg-surface-light dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all outline-none text-body-strong dark:text-on-dark shadow-sm ${
        disabled ? "opacity-50 cursor-not-allowed" : "focus:ring-2 focus:ring-accent/20 focus:border-accent cursor-pointer"
      }`;
    }
    return `w-full h-11 flex items-center justify-between px-5 bg-surface-light dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-lg text-[11px] font-black uppercase tracking-widest transition-all outline-none text-body-strong dark:text-on-dark shadow-sm ${
      disabled ? "opacity-50 cursor-not-allowed" : "focus:ring-2 focus:ring-accent/20 focus:border-accent cursor-pointer"
    }`;
  };

  const optionClasses = size === "sm"
    ? "w-full text-left px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-wider transition-all duration-150 flex items-center justify-between cursor-pointer"
    : "w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-150 flex items-center justify-between cursor-pointer";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={getButtonClasses()}
        title={selectedOption?.label}
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-muted dark:text-on-dark-muted shrink-0">{icon}</span>}
          <span className="truncate">{selectedOption?.label}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-muted dark:text-on-dark-muted shrink-0 ml-1.5"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropPosition === "top" ? 8 : -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropPosition === "top" ? 8 : -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute left-0 min-w-full z-50 bg-surface-light dark:bg-surface-dark backdrop-blur-md border border-hairline-light dark:border-hairline-dark rounded-xl shadow-xl overflow-hidden py-1.5 max-h-[250px] overflow-y-auto ${
              dropPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
            }`}
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
                      ? "bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark font-black"
                      : "text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark"
                  }`}
                  title={opt.label}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-on-ink dark:text-on-dark shrink-0 ml-2" />
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

