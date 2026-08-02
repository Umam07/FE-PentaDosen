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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-xs">
        {/* Navigasi Bulan & Hari Ini */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl p-1 border border-gray-100 dark:border-zinc-700">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-700 rounded-xl transition-colors"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-700 rounded-xl transition-colors"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight min-w-44">
            {MONTH_NAMES_ID[currentMonth]} {currentYear}
          </h2>

          <button
            onClick={handleGoToToday}
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors"
          >
            Hari Ini
          </button>
        </div>

        {/* Legenda Warna Status (Di Atas) & Tombol Aksi Utama */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-3 px-3.5 py-2 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-gray-700 dark:text-zinc-300">Aktif</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-gray-700 dark:text-zinc-300">Terjadwal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
              <span className="text-gray-700 dark:text-zinc-300">Kadaluarsa</span>
            </div>
          </div>

          <button
            onClick={() => onOpenCreate()}
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Terbitkan Pengumuman
          </button>
        </div>
      </div>

      {/* Grid Utama Kalender */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 p-4 sm:p-6 shadow-sm overflow-hidden">
        {/* Header Nama Hari (7 Kolom: Sen - Min) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
          {DAY_NAMES_ID.map((dayName, idx) => (
            <div
              key={dayName}
              className={`py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                idx >= 5 ? 'text-slate-600 dark:text-zinc-400 font-bold' : 'text-gray-400 dark:text-zinc-500'
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
                className="h-24 sm:h-28 bg-gray-50 dark:bg-zinc-850 border border-gray-100 dark:border-zinc-800 rounded-2xl animate-pulse"
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
                        className={`min-h-24 sm:min-h-28 p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-start gap-1 group relative overflow-visible ${
                          !dayItem.isCurrentMonth
                            ? 'bg-gray-50/40 dark:bg-zinc-900/40 text-gray-300 dark:text-zinc-700 border-transparent hover:border-gray-200 dark:hover:border-zinc-800'
                            : dayItem.isToday
                            ? 'bg-primary-50/50 dark:bg-primary-950/20 text-gray-900 dark:text-zinc-100 border-primary-500/60 ring-2 ring-primary-500/30'
                            : isCellEmpty
                            ? 'bg-white dark:bg-zinc-850/60 text-gray-900 dark:text-zinc-100 border-gray-100 dark:border-zinc-800/80 hover:bg-primary-50/40 dark:hover:bg-zinc-800/80 hover:border-primary-300 dark:hover:border-zinc-700 hover:shadow-xs border-dashed'
                            : isWeekend
                            ? 'bg-slate-50/50 dark:bg-zinc-850/40 text-gray-900 dark:text-zinc-100 border-slate-100 dark:border-zinc-800/80 hover:border-gray-300 dark:hover:border-zinc-700 hover:shadow-xs'
                            : 'bg-white dark:bg-zinc-850/60 text-gray-900 dark:text-zinc-100 border-gray-100 dark:border-zinc-800/80 hover:border-gray-300 dark:hover:border-zinc-700 hover:shadow-xs'
                        }`}
                      >
                        {/* Angka Tanggal Header Sel */}
                        <div className="flex justify-between items-center px-1">
                          <span
                            className={`text-xs sm:text-sm font-black ${
                              dayItem.isToday
                                ? 'w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs shadow-xs'
                                : dayItem.isCurrentMonth
                                ? isWeekend
                                  ? 'text-slate-700 dark:text-zinc-300 font-bold'
                                  : 'text-gray-800 dark:text-zinc-200'
                                : 'text-gray-400 dark:text-zinc-600'
                            }`}
                          >
                            {dayItem.dayNumber}
                          </span>

                          {/* Indicator hover untuk sel kosong atau ringkasan info */}
                          {isCellEmpty ? (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-bold text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus className="w-3 h-3" />
                              Tambah
                            </span>
                          ) : (
                            <span className="hidden sm:inline-block text-[9px] font-bold text-gray-400 group-hover:text-gray-600 dark:group-hover:text-zinc-300">
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
                                statusBgClass = 'bg-emerald-100 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border-y border-emerald-200 dark:border-emerald-800';
                              } else if (status === 'scheduled') {
                                statusBgClass = 'bg-blue-100 dark:bg-blue-950/90 text-blue-800 dark:text-blue-300 border-y border-blue-200 dark:border-blue-800';
                              } else {
                                statusBgClass = 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-y border-gray-200 dark:border-zinc-700';
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
                                  className={`h-5 sm:h-6 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-tight truncate border ${statusBgClass} ${roundedMarginClass} transition-opacity hover:opacity-90 flex items-center gap-1 select-none`}
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
                              <div className="px-1.5 py-0.5 text-[9px] font-black text-gray-500 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-center truncate mt-0.5">
                                +{overflowCount} lainnya
                              </div>
                            )}
                          </div>

                          {/* Tampilan Mobile (< md): Dot indicators berwarna ringkas */}
                          <div className="flex sm:hidden flex-wrap items-center gap-1 mt-auto pt-1">
                            {announcements.filter(a => isAnnouncementOnDate(a, dayItem.dateString)).slice(0, 3).map((a) => {
                              const status = getAnnouncementStatus(a);
                              let dotColor = 'bg-gray-400';
                              if (status === 'active') dotColor = 'bg-emerald-500';
                              if (status === 'scheduled') dotColor = 'bg-blue-500';
                              if (status === 'expired') dotColor = 'bg-gray-400 dark:bg-zinc-600';

                              return (
                                <span
                                  key={a.id}
                                  className={`w-2 h-2 rounded-full ${dotColor}`}
                                  title={a.title}
                                />
                              );
                            })}
                            {totalCount > 3 && (
                              <span className="text-[8px] font-bold text-gray-400">
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
