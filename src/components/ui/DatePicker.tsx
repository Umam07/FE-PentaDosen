import * as React from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pilih tanggal",
  className
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(date ? new Date(date) : new Date())
  const popoverRef = React.useRef<HTMLDivElement>(null)

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  // Sync current month view when date prop changes externally
  React.useEffect(() => {
    if (date) {
      setCurrentMonth(new Date(date))
    } else {
      setCurrentMonth(new Date())
    }
  }, [date])


  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]

  const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const cells: { date?: Date; isCurrentMonth: boolean; key: string }[] = []

  // Prev month padding
  const prevMonthDays = getDaysInMonth(year, month - 1)
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
      key: `prev-${i}`
    })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
      key: `curr-${d}`
    })
  }

  // Next month padding to complete grid
  const totalCells = Math.ceil(cells.length / 7) * 7
  const nextDays = totalCells - cells.length
  for (let d = 1; d <= nextDays; d++) {
    cells.push({
      date: new Date(year, month + 1, d),
      isCurrentMonth: false,
      key: `next-${d}`
    })
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  // When user changes the month dropdown, update view AND update selected date
  const handleMonthChange = (newMonth: number) => {
    const newView = new Date(year, newMonth, 1)
    setCurrentMonth(newView)
    if (onDateChange) {
      const currentDay = date ? date.getDate() : 1
      const maxDay = getDaysInMonth(year, newMonth)
      const safeDay = Math.min(currentDay, maxDay)
      onDateChange(new Date(year, newMonth, safeDay))
    }
  }

  // When user changes the year dropdown, update view AND update selected date
  const handleYearChange = (newYear: number) => {
    const newView = new Date(newYear, month, 1)
    setCurrentMonth(newView)
    if (onDateChange) {
      const currentDay = date ? date.getDate() : 1
      const maxDay = getDaysInMonth(newYear, month)
      const safeDay = Math.min(currentDay, maxDay)
      onDateChange(new Date(newYear, month, safeDay))
    }
  }

  const handleDateSelect = (selectedDate: Date) => {
    if (onDateChange) {
      onDateChange(selectedDate)
    }
    setIsOpen(false)
  }

  const isToday = (d: Date) => {
    const today = new Date()
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
  }

  const isSelected = (d: Date) => {
    if (!date) return false
    return d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
  }

  const formatDateLabel = (d: Date) => {
    const day = d.getDate()
    const m = monthNames[d.getMonth()]
    const y = d.getFullYear()
    return `${day} ${m} ${y}`
  }

  return (
    <div className="relative w-full" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={placeholder}
        className={cn(
          "w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg font-medium transition-all outline-none text-xs sm:text-sm text-left flex justify-between items-center text-ink-heading dark:text-on-dark hover:border-ink-border/60 dark:hover:border-hairline-dark-soft focus:bg-surface-light dark:focus:bg-surface-dark-soft focus:ring-2 focus:ring-accent/15 focus:border-accent",
          !date && "text-muted-soft dark:text-on-dark-muted",
          className
        )}
      >
        <div className="flex items-center min-w-0 pr-2">
          <CalendarIcon className="mr-2 h-4 w-4 text-muted dark:text-on-dark-muted shrink-0" />
          <span className="truncate">{date ? formatDateLabel(date) : placeholder}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-muted dark:text-on-dark-muted shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-label="Pilih tanggal"
            className="absolute left-0 z-50 mt-2 p-3.5 w-76 sm:w-80 bg-surface-light dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-2xl shadow-xl shadow-ink/5 dark:shadow-black/50 select-none motion-reduce:animate-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Bulan sebelumnya"
                className="p-1.5 rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1.5">
                <select
                  value={month}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  aria-label="Pilih bulan"
                  className="bg-surface-light-raised/70 dark:bg-surface-dark border border-hairline-light/80 dark:border-hairline-dark text-xs font-semibold text-ink-heading dark:text-on-dark outline-none cursor-pointer rounded-md py-1 px-2 hover:bg-surface-light-raised dark:hover:bg-surface-dark-soft focus:ring-2 focus:ring-accent/15 focus:border-accent transition-colors"
                >
                  {monthNames.map((name, i) => (
                    <option key={name} value={i} className="bg-surface-light dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark text-xs font-medium">
                      {name}
                    </option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  aria-label="Pilih tahun"
                  className="bg-surface-light-raised/70 dark:bg-surface-dark border border-hairline-light/80 dark:border-hairline-dark text-xs font-semibold font-mono text-ink-heading dark:text-on-dark outline-none cursor-pointer rounded-md py-1 px-2 hover:bg-surface-light-raised dark:hover:bg-surface-dark-soft focus:ring-2 focus:ring-accent/15 focus:border-accent transition-colors"
                >
                  {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - 35 + i).map((y) => (
                    <option key={y} value={y} className="bg-surface-light dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark text-xs font-medium font-mono">
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Bulan berikutnya"
                className="p-1.5 rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
              {daysOfWeek.map((day, i) => (
                <span key={i} className="text-[11px] font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider py-1">
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell) => {
                const isDaySelected = isSelected(cell.date!)
                const isDayToday = isToday(cell.date!)
                return (
                  <button
                    key={cell.key}
                    type="button"
                    onClick={() => handleDateSelect(cell.date!)}
                    aria-label={cell.date ? formatDateLabel(cell.date) : undefined}
                    className={cn(
                      "h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all border border-transparent cursor-pointer",
                      cell.isCurrentMonth 
                        ? "text-body-strong dark:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark hover:text-ink-heading dark:hover:text-on-dark" 
                        : "text-muted-soft/60 dark:text-on-dark-muted/40 hover:bg-surface-light-raised/40 dark:hover:bg-surface-dark/40",
                      isDayToday && !isDaySelected && "border-ink-border dark:border-hairline-dark font-bold text-ink-heading dark:text-on-dark",
                      isDaySelected && "bg-ink border-ink text-on-ink font-bold hover:bg-ink-hover dark:bg-on-dark dark:border-on-dark dark:text-canvas-dark dark:hover:bg-on-dark-soft"
                    )}
                  >
                    {cell.date!.getDate()}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const formatToYYYYMMDD = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
