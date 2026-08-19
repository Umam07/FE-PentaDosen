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
        className={cn(
          "w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold transition-all outline-none text-sm text-left flex justify-between items-center text-gray-900 dark:text-zinc-100 focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20",
          !date && "text-gray-400 dark:text-zinc-500",
          className
        )}
      >
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-primary-500 shrink-0" />
          <span>{date ? formatDateLabel(date) : placeholder}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 z-50 mt-2 p-4 w-80 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                <select
                  value={month}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="bg-transparent text-sm font-extrabold text-gray-900 dark:text-zinc-100 outline-none cursor-pointer uppercase tracking-wider dark:bg-zinc-900 border-0 py-0.5 px-1 rounded hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  {monthNames.map((name, i) => (
                    <option key={name} value={i} className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 text-xs font-bold uppercase">{name}</option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="bg-transparent text-sm font-extrabold text-gray-900 dark:text-zinc-100 outline-none cursor-pointer font-mono dark:bg-zinc-900 border-0 py-0.5 px-1 rounded hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - 35 + i).map((y) => (
                    <option key={y} value={y} className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 text-xs font-bold font-mono">{y}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {daysOfWeek.map((day, i) => (
                <span key={i} className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{day}</span>
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
                    className={cn(
                      "h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all border border-transparent",
                      cell.isCurrentMonth 
                        ? "text-gray-800 dark:text-zinc-200 hover:bg-ink-soft dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark" 
                        : "text-gray-300 dark:text-zinc-600 hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated",
                      isDayToday && "border-ink-border dark:border-hairline-dark text-ink-heading dark:text-on-dark font-extrabold",
                      isDaySelected && "bg-ink border-ink text-on-ink font-black hover:bg-ink-hover dark:bg-ink dark:border-ink dark:text-on-ink hover:text-on-ink"
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
