import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Announcement } from '../types/cmsDashboard.types';
import {
  generateMonthGrid,
  DAY_NAMES_ID,
  MONTH_NAMES_ID,
  getAnnouncementStatus,
  getGlobalSlotAllocations,
  isAnnouncementOnDate,
  CalendarDay
} from '../utils/calendarUtils';

interface AnnouncementsCalendarProps {
  announcements: Announcement[];
  loading: boolean;
  onOpenCreate: (defaultDate?: string) => void;
  onSelectDate: (dateString: string) => void;
}

export default function AnnouncementsCalendar({
  announcements,
  loading,
  onOpenCreate,
  onSelectDate
}: AnnouncementsCalendarProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());

  // Navigasi Bulan
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const daysGrid = generateMonthGrid(currentYear, currentMonth);

  // Bagi sel kalender menjadi baris-baris minggu (7 hari per minggu)
  const weeksGrid: CalendarDay[][] = [];
  for (let i = 0; i < daysGrid.length; i += 7) {
    weeksGrid.push(daysGrid.slice(i, i + 7));
  }

  // Hitung alokasi slot vertikal global konsisten untuk seluruh hari dalam kalender
  const slotAllocations = getGlobalSlotAllocations(daysGrid, announcements);

  return (
    <div className="space-y-4">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-hairline-light dark:border-hairline-dark shadow-xs">
        {/* Navigasi Bulan & Hari Ini */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl p-1 border border-hairline-light-soft dark:border-hairline-dark-soft">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg transition-colors cursor-pointer"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg transition-colors cursor-pointer"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight min-w-44">
            {MONTH_NAMES_ID[currentMonth]} {currentYear}
          </h2>

          <button
            onClick={handleGoToToday}
            className="px-3.5 py-2 bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light-soft dark:border-hairline-dark-soft text-ink-heading dark:text-on-dark rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Hari Ini
          </button>
        </div>

        {/* Legenda Warna Status (Di Atas) & Tombol Aksi Utama */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-3 px-3.5 py-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light-soft dark:border-hairline-dark-soft text-[10px] font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-success" />
              <span className="text-ink-heading dark:text-on-dark">Aktif</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-ink-heading dark:text-on-dark">Terjadwal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-muted-soft" />
              <span className="text-ink-heading dark:text-on-dark">Kadaluarsa</span>
            </div>
          </div>

          <button
            onClick={() => onOpenCreate()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-ink hover:bg-ink/90 dark:bg-surface-dark-elevated dark:hover:bg-surface-dark-elevated/80 text-on-ink dark:text-on-dark rounded-xl text-xs font-semibold uppercase tracking-wider shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Terbitkan Pengumuman
          </button>
        </div>
      </div>

      {/* Grid Utama Kalender */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark p-4 sm:p-6 shadow-xs overflow-hidden">
        {/* Header Nama Hari (7 Kolom: Sen - Min) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
          {DAY_NAMES_ID.map((dayName, idx) => (
            <div
              key={dayName}
              className={`py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                idx >= 5 ? 'text-muted-soft dark:text-on-dark-muted font-bold' : 'text-muted dark:text-on-dark-muted'
              }`}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Skeleton Loader ketika data sedang dimuat */}
        {loading ? (
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="h-24 sm:h-28 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          /* Grid Kalender per Baris Minggu */
          <div className="space-y-1 sm:space-y-2">
            {weeksGrid.map((weekDays, weekIdx) => {
              return (
                <div key={weekIdx} className="grid grid-cols-7 gap-1 sm:gap-2">
                  {weekDays.map((dayItem, dayIdx) => {
                    const isWeekend = dayIdx >= 5;
                    const dayAllocation = slotAllocations.get(dayItem.dateString)!;
                    const { slots, overflowCount, totalCount } = dayAllocation;
                    const isCellEmpty = totalCount === 0;

                    const handleCellClick = () => {
                      if (isCellEmpty) {
                        onOpenCreate(dayItem.dateString);
                      } else {
                        onSelectDate(dayItem.dateString);
                      }
                    };

                    return (
                      <div
                        key={dayItem.dateString}
                        onClick={handleCellClick}
                        className={`min-h-24 sm:min-h-28 p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-start gap-1 group relative overflow-visible ${
                          !dayItem.isCurrentMonth
                            ? 'bg-surface-light-raised/40 dark:bg-surface-dark-elevated/40 text-muted-soft dark:text-on-dark-muted/40 border-transparent hover:border-hairline-light dark:hover:border-hairline-dark'
                            : dayItem.isToday
                            ? 'bg-accent-soft/30 dark:bg-accent-soft/10 text-ink-heading dark:text-on-dark border-accent/60 ring-2 ring-accent/20'
                            : isCellEmpty
                            ? 'bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark border-hairline-light-soft dark:border-hairline-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:border-hairline-light dark:hover:border-hairline-dark border-dashed'
                            : isWeekend
                            ? 'bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 text-ink-heading dark:text-on-dark border-hairline-light-soft dark:border-hairline-dark-soft hover:border-hairline-light dark:hover:border-hairline-dark'
                            : 'bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark border-hairline-light-soft dark:border-hairline-dark-soft hover:border-hairline-light dark:hover:border-hairline-dark'
                        }`}
                      >
                        {/* Angka Tanggal Header Sel */}
                        <div className="flex justify-between items-center px-1">
                          <span
                            className={`text-xs sm:text-sm font-bold font-mono ${
                              dayItem.isToday
                                ? 'w-6 h-6 rounded-full bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark flex items-center justify-center text-xs shadow-xs'
                                : dayItem.isCurrentMonth
                                ? isWeekend
                                  ? 'text-muted dark:text-on-dark-muted font-bold'
                                  : 'text-ink-heading dark:text-on-dark'
                                : 'text-muted-soft dark:text-on-dark-muted/50'
                            }`}
                          >
                            {dayItem.dayNumber}
                          </span>

                          {/* Indicator hover untuk sel kosong atau ringkasan info */}
                          {isCellEmpty ? (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus className="w-3 h-3" />
                              Tambah
                            </span>
                          ) : (
                            <span className="hidden sm:inline-block text-[9px] font-mono font-medium text-muted dark:text-on-dark-muted">
                              {totalCount} info
                            </span>
                          )}
                        </div>

                        {/* Render Slot Bar Multi-Day Menyambung (Desktop) & Dot Indicators (Mobile) */}
                        <div className="flex-1 flex flex-col justify-start gap-1 mt-1">
                          {/* Tampilan Desktop: Slot Bar Horizontal Menyambung */}
                          <div className="hidden sm:flex flex-col gap-1">
                            {slots.map((slotItem, slotIndex) => {
                              if (!slotItem) {
                                // Spacer kosong untuk menjaga alur baris vertikal tetap lurus presisi
                                return <div key={slotIndex} className="h-5 sm:h-6" />;
                              }

                              const { announcement, isStartOfSpan, isEndOfSpan, shouldShowLabel } = slotItem;
                              const status = getAnnouncementStatus(announcement);

                              let statusBgClass = '';
                              if (status === 'active') {
                                statusBgClass = 'bg-success-soft text-success-dark dark:text-success-on-dark border-y border-success-border dark:border-success/30';
                              } else if (status === 'scheduled') {
                                statusBgClass = 'bg-accent-soft text-accent dark:text-accent-on-dark border-y border-accent/20 dark:border-accent/30';
                              } else {
                                statusBgClass = 'bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted border-y border-hairline-light dark:border-hairline-dark';
                              }

                              // Penataan rounded border & negative margin untuk menyambung tanpa jeda
                              let roundedMarginClass = '';
                              if (isStartOfSpan && isEndOfSpan) {
                                roundedMarginClass = 'rounded-md mx-0.5 border-x';
                              } else if (isStartOfSpan && !isEndOfSpan) {
                                roundedMarginClass = 'rounded-l-md rounded-r-none border-l border-r-0 ml-0.5 -mr-2 sm:-mr-3 z-10';
                              } else if (!isStartOfSpan && isEndOfSpan) {
                                roundedMarginClass = 'rounded-r-md rounded-l-none border-r border-l-0 mr-0.5 -ml-2 sm:-ml-3 z-10';
                              } else {
                                roundedMarginClass = 'rounded-none border-x-0 -mx-2 sm:-mx-3 z-10';
                              }

                              return (
                                <div
                                  key={`${announcement.id}-${slotIndex}`}
                                  className={`h-5 sm:h-6 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-tight truncate border ${statusBgClass} ${roundedMarginClass} transition-opacity hover:opacity-90 flex items-center gap-1 select-none`}
                                  title={`${announcement.title} (${status})`}
                                >
                                  {shouldShowLabel && (
                                    <>
                                      <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current opacity-80" />
                                      <span className="truncate">{announcement.title}</span>
                                    </>
                                  )}
                                </div>
                              );
                            })}

                            {/* Tombol "+N lainnya" jika pengumuman lebih dari 2 */}
                            {overflowCount > 0 && (
                              <div className="px-1.5 py-0.5 text-[9px] font-semibold font-mono text-muted dark:text-on-dark-muted bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md border border-hairline-light-soft dark:border-hairline-dark-soft hover:bg-surface-light dark:hover:bg-surface-dark transition-colors text-center truncate mt-0.5">
                                +{overflowCount} lainnya
                              </div>
                            )}
                          </div>

                          {/* Tampilan Mobile (< md): Dot indicators berwarna ringkas */}
                          <div className="flex sm:hidden flex-wrap items-center gap-1 mt-auto pt-1">
                            {announcements.filter(a => isAnnouncementOnDate(a, dayItem.dateString)).slice(0, 3).map((a) => {
                              const status = getAnnouncementStatus(a);
                              let dotColor = 'bg-muted';
                              if (status === 'active') dotColor = 'bg-success';
                              if (status === 'scheduled') dotColor = 'bg-accent';
                              if (status === 'expired') dotColor = 'bg-muted-soft dark:bg-muted';

                              return (
                                <span
                                  key={a.id}
                                  className={`w-2 h-2 rounded-full ${dotColor}`}
                                  title={a.title}
                                />
                              );
                            })}
                            {totalCount > 3 && (
                              <span className="text-[8px] font-mono font-bold text-muted">
                                +{totalCount - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
