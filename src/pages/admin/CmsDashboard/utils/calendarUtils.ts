import { Announcement } from '../types/cmsDashboard.types';

export type AnnouncementStatus = 'active' | 'scheduled' | 'expired';

export interface CalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface SlotAllocation {
  announcement: Announcement;
  slotIndex: number; // 0 or 1
  isStartOfSpan: boolean; // Awal event atau awal baris minggu
  isEndOfSpan: boolean; // Akhir event atau akhir baris minggu
  shouldShowLabel: boolean; // Tampilkan label & dot jika awal event atau awal minggu (bila event dimulai sebelum minggu ini)
}

export const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const DAY_NAMES_ID = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

/**
 * Format objek Date menjadi string YYYY-MM-DD (menggunakan waktu lokal)
 */
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Mengubah ISO Date string atau YYYY-MM-DD string menjadi Date object lokal
 */
export function parseDateString(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  const cleanStr = dateStr.substring(0, 10);
  const parts = cleanStr.split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

/**
 * Memformat string tanggal menjadi tampilan Indonesia singkat (cth: 2 Agt 2026)
 */
export function formatDateID(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  const date = parseDateString(dateStr);
  if (!date) return dateStr;
  const day = date.getDate();
  const monthShort = MONTH_NAMES_ID[date.getMonth()].substring(0, 3);
  const year = date.getFullYear();
  return `${day} ${monthShort} ${year}`;
}

/**
 * Memformat tanggal lengkap dalam Bahasa Indonesia (cth: Minggu, 2 Agustus 2026)
 */
export function formatDateFullID(dateStr: string): string {
  const date = parseDateString(dateStr);
  if (!date) return dateStr;
  
  const dayNamesFull = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayOfWeek = dayNamesFull[date.getDay()];
  const day = date.getDate();
  const month = MONTH_NAMES_ID[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayOfWeek}, ${day} ${month} ${year}`;
}

/**
 * Menghitung status pengumuman (Aktif, Terjadwal, Kadaluarsa)
 */
export function getAnnouncementStatus(announcement: Announcement, referenceDate: Date = new Date()): AnnouncementStatus {
  if (!announcement.is_active) {
    return 'expired';
  }

  const todayStr = formatDateToISO(referenceDate);
  const startDateStr = announcement.created_at ? announcement.created_at.substring(0, 10) : todayStr;
  const endDateStr = announcement.expires_at ? announcement.expires_at.substring(0, 10) : null;

  if (endDateStr && endDateStr < todayStr) {
    return 'expired';
  }

  if (startDateStr > todayStr) {
    return 'scheduled';
  }

  return 'active';
}

/**
 * Memeriksa apakah suatu pengumuman tayang/berlaku pada tanggal tertentu (dateString: YYYY-MM-DD)
 */
export function isAnnouncementOnDate(announcement: Announcement, dateString: string): boolean {
  const startDateStr = announcement.created_at ? announcement.created_at.substring(0, 10) : dateString;
  const endDateStr = announcement.expires_at ? announcement.expires_at.substring(0, 10) : null;

  if (dateString < startDateStr) {
    return false;
  }

  if (endDateStr && dateString > endDateStr) {
    return false;
  }

  return true;
}

/**
 * Mengalokasikan slot vertikal global konsisten untuk seluruh pengumuman di kalender.
 * Menjamin event tidak pernah 'melompat' slot secara tiba-tiba dan penabelan label presisi.
 */
export function getGlobalSlotAllocations(
  monthDays: CalendarDay[],
  announcements: Announcement[]
): Map<string, { slots: (SlotAllocation | null)[]; overflowCount: number; totalCount: number }> {
  const result = new Map<string, { slots: (SlotAllocation | null)[]; overflowCount: number; totalCount: number }>();
  monthDays.forEach(d => {
    result.set(d.dateString, { slots: [null, null], overflowCount: 0, totalCount: 0 });
  });

  if (monthDays.length === 0) return result;

  const gridStartStr = monthDays[0].dateString;
  const gridEndStr = monthDays[monthDays.length - 1].dateString;

  // 1. Filter pengumuman yang bersinggungan dengan grid kalender
  const activeAnnouncements = announcements.filter(a => {
    const startStr = a.created_at ? a.created_at.substring(0, 10) : gridStartStr;
    const endStr = a.expires_at ? a.expires_at.substring(0, 10) : startStr;
    return startStr <= gridEndStr && endStr >= gridStartStr;
  });

  // 2. Urutkan pengumuman: Tanggal Mulai (terawal), Durasi (terpanjang), ID
  activeAnnouncements.sort((a, b) => {
    const aStart = a.created_at ? a.created_at.substring(0, 10) : '';
    const bStart = b.created_at ? b.created_at.substring(0, 10) : '';
    if (aStart !== bStart) return aStart.localeCompare(bStart);
    const aEnd = a.expires_at ? a.expires_at.substring(0, 10) : aStart;
    const bEnd = b.expires_at ? b.expires_at.substring(0, 10) : bStart;
    return bEnd.localeCompare(aEnd);
  });

  // 3. Alokasikan slot vertikal (0 atau 1) konsisten sepanjang durasi event
  activeAnnouncements.forEach(a => {
    const aStart = a.created_at ? a.created_at.substring(0, 10) : gridStartStr;
    const aEnd = a.expires_at ? a.expires_at.substring(0, 10) : aStart;

    let chosenSlot = -1;
    for (let slot = 0; slot < 2; slot++) {
      let isFree = true;
      for (const d of monthDays) {
        if (d.dateString >= aStart && d.dateString <= aEnd) {
          const entry = result.get(d.dateString);
          if (entry && entry.slots[slot] !== null) {
            isFree = false;
            break;
          }
        }
      }
      if (isFree) {
        chosenSlot = slot;
        break;
      }
    }

    if (chosenSlot !== -1) {
      monthDays.forEach((d, dayIndex) => {
        if (d.dateString >= aStart && d.dateString <= aEnd) {
          const weekRowIndex = Math.floor(dayIndex / 7);
          const dayInWeekIndex = dayIndex % 7;
          const weekStartStr = monthDays[weekRowIndex * 7].dateString;

          const isStartOfSpan = d.dateString === aStart || dayInWeekIndex === 0;
          const isEndOfSpan = d.dateString === aEnd || dayInWeekIndex === 6;

          // Tampilkan label HANYA jika:
          // 1. Hari ini adalah tanggal mulai asli pengumuman
          // 2. ATAU awal baris minggu (Senin) DAN tanggal mulai asli terjadi SEBELUM minggu ini (aStart < weekStartStr)
          const shouldShowLabel = d.dateString === aStart || (dayInWeekIndex === 0 && aStart < weekStartStr);

          const entry = result.get(d.dateString)!;
          entry.slots[chosenSlot] = {
            announcement: a,
            slotIndex: chosenSlot,
            isStartOfSpan,
            isEndOfSpan,
            shouldShowLabel
          };
        }
      });
    }
  });

  // 4. Hitung total pengumuman dan overflow count per tanggal
  monthDays.forEach(d => {
    const totalActive = announcements.filter(a => isAnnouncementOnDate(a, d.dateString));
    const entry = result.get(d.dateString)!;
    entry.totalCount = totalActive.length;
    const placedCount = entry.slots.filter(s => s !== null).length;
    entry.overflowCount = Math.max(0, totalActive.length - placedCount);
  });

  return result;
}

/**
 * Membuat matriks hari untuk tampilan kalender 1 bulan
 */
export function generateMonthGrid(year: number, month: number): CalendarDay[] {
  const todayStr = formatDateToISO(new Date());
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let firstDayOfWeekIndex = firstDayOfMonth.getDay() - 1;
  if (firstDayOfWeekIndex === -1) firstDayOfWeekIndex = 6;

  const days: CalendarDay[] = [];

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeekIndex - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
    const dateString = formatDateToISO(prevDate);
    days.push({
      date: prevDate,
      dateString,
      dayNumber: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: dateString === todayStr
    });
  }

  for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
    const currentDate = new Date(year, month, d);
    const dateString = formatDateToISO(currentDate);
    days.push({
      date: currentDate,
      dateString,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateString === todayStr
    });
  }

  const remainingCells = (7 - (days.length % 7)) % 7;
  const totalTargetCells = days.length + remainingCells < 35 ? 35 : (days.length + remainingCells);
  const finalNeeded = totalTargetCells - days.length;

  for (let i = 1; i <= finalNeeded; i++) {
    const nextDate = new Date(year, month + 1, i);
    const dateString = formatDateToISO(nextDate);
    days.push({
      date: nextDate,
      dateString,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: dateString === todayStr
    });
  }

  return days;
}
