import React from 'react';
import { 
  Activity, User as UserIcon, LogOut, RefreshCw, 
  Shield, FileText, BookOpen, Award, Beaker, Book
} from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ActivityLog, ActionConfig, SessionUser } from '../types/activityLogs.types';

/**
 * Mendapatkan inisial nama untuk avatar
 */
export const getInitials = (name: string): string => {
  if (!name) return 'SYS';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

/**
 * Mendapatkan className warna latar belakang berdasarkan peran user
 */
export const getUserBg = (role: string): string => {
  const r = role?.toLowerCase() || '';
  if (r.includes('lppm')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
  if (r.includes('fakultas')) return 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300';
  if (r.includes('dosen')) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
  return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';
};

/**
 * Memeriksa apakah log baru saja dibuat (kurang dari 1 jam)
 */
export const isRecent = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return now.getTime() - date.getTime() < 60 * 60 * 1000;
};

/**
 * Mendapatkan konfigurasi visual lencana (badge, icon, warna dot, dll) berdasarkan tipe aksi
 */
export const getActionConfig = (action: string): ActionConfig => {
  const a = action.toLowerCase();
  
  if (a.includes('login')) {
    return { 
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20', 
      dot: 'bg-emerald-500', 
      icon: React.createElement(UserIcon, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-emerald-100 dark:ring-emerald-900/30', 
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
    };
  }
  
  if (a.includes('logout')) {
    return { 
      badge: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20', 
      dot: 'bg-rose-500', 
      icon: React.createElement(LogOut, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-rose-100 dark:ring-rose-900/30', 
      iconBg: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' 
    };
  }
  
  if (a.includes('sync')) {
    return { 
      badge: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20', 
      dot: 'bg-blue-500', 
      icon: React.createElement(RefreshCw, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-blue-100 dark:ring-blue-900/30', 
      iconBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
    };
  }
  
  if (a.includes('verify')) {
    return { 
      badge: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20', 
      dot: 'bg-amber-500', 
      icon: React.createElement(Shield, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-amber-100 dark:ring-amber-900/30', 
      iconBg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' 
    };
  }
  
  if (a.includes('submit') || a.includes('upload')) {
    return { 
      badge: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20', 
      dot: 'bg-amber-500', 
      icon: React.createElement(FileText, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-amber-100 dark:ring-amber-900/30', 
      iconBg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' 
    };
  }
  
  if (a.includes('journal')) {
    return { 
      badge: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20', 
      dot: 'bg-sky-500', 
      icon: React.createElement(BookOpen, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-sky-100 dark:ring-sky-900/30', 
      iconBg: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400' 
    };
  }
  
  if (a.includes('hki')) {
    return { 
      badge: 'bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20', 
      dot: 'bg-cyan-500', 
      icon: React.createElement(Award, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-cyan-100 dark:ring-cyan-900/30', 
      iconBg: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400' 
    };
  }
  
  if (a.includes('research')) {
    return { 
      badge: 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20', 
      dot: 'bg-teal-500', 
      icon: React.createElement(Beaker, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-teal-100 dark:ring-teal-900/30', 
      iconBg: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' 
    };
  }
  
  if (a.includes('book')) {
    return { 
      badge: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20', 
      dot: 'bg-orange-500', 
      icon: React.createElement(Book, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-orange-100 dark:ring-orange-900/30', 
      iconBg: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' 
    };
  }
  
  return { 
    badge: 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700', 
    dot: 'bg-gray-400', 
    icon: React.createElement(Activity, { className: 'w-3.5 h-3.5' }), 
    ring: 'ring-gray-100 dark:ring-zinc-800', 
    iconBg: 'bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400' 
  };
};

/**
 * Memformat detail log aktivitas untuk disalin ke clipboard
 */
export const formatLogForCopy = (log: ActivityLog): string => {
  const formattedDate = new Date(log.created_at).toLocaleString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const userName = log.user?.name || 'Sistem / Anonim';
  const userRole = log.user?.role || 'System';
  const action = log.action || '-';
  const description = log.description || '-';

  return [
    `--- DETAIL LOG AKTIVITAS ---`,
    `Tanggal   : ${formattedDate}`,
    `Pengguna  : ${userName} (${userRole})`,
    `Aksi      : ${action}`,
    `Deskripsi : ${description}`,
    `----------------------------`
  ].join('\n');
};

/**
 * Melakukan ekspor data log aktivitas ke Excel
 */
export const exportToExcel = async (
  logs: ActivityLog[],
  user: SessionUser,
  selectedAction: string,
  searchTerm: string
): Promise<void> => {
  // Filter secara lokal berdasarkan kata kunci (search term)
  const filteredAllLogs = logs.filter((log) => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredAllLogs.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Log Aktivitas');

  sheet.views = [{ showGridLines: true }];

  // Bagian Judul
  sheet.mergeCells('A1:F1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'LOG AKTIVITAS SISTEM - PENTADOSEN';
  titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF1E293B' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(1).height = 30;

  // Bagian Metadata
  sheet.mergeCells('A2:F2');
  const metaCell = sheet.getCell('A2');
  const dateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  metaCell.value = `Diekspor oleh : ${user?.name || 'Admin'}  |  Diekspor pada : ${dateStr}`;
  metaCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748B' } };
  metaCell.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(2).height = 20;

  // Bagian Filter
  sheet.mergeCells('A3:F3');
  const filterCell = sheet.getCell('A3');
  filterCell.value = `Filter Aksi : ${selectedAction || 'Semua Aksi'}  |  Kata Kunci : "${searchTerm || '-'}"`;
  filterCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748B' } };
  filterCell.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(3).height = 20;

  // Spasi kosong
  sheet.getRow(4).height = 10;

  // Tabel Header
  const headers = ['No', 'Waktu', 'Nama Pengguna', 'Peran', 'Aksi', 'Deskripsi Detail'];
  const colWidths = [
    { width: 6 },
    { width: 22 },
    { width: 25 },
    { width: 16 },
    { width: 18 },
    { width: 65 }
  ];

  const headerRowNumber = 5;
  const headerRow = sheet.getRow(headerRowNumber);
  headerRow.height = 28;

  headers.forEach((h, colIdx) => {
    const cell = headerRow.getCell(colIdx + 1);
    cell.value = h;
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' } // Indigo 600
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF312E81' } },
      bottom: { style: 'medium', color: { argb: 'FF312E81' } },
      left: { style: 'thin', color: { argb: 'FF312E81' } },
      right: { style: 'thin', color: { argb: 'FF312E81' } }
    };
  });

  // Isi data baris demi baris
  filteredAllLogs.forEach((log, dataIdx) => {
    const rowNum = headerRowNumber + 1 + dataIdx;
    const row = sheet.getRow(rowNum);
    row.height = 22;

    const formattedTime = new Date(log.created_at).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const rowValues = [
      dataIdx + 1,
      formattedTime,
      log.user?.name || 'Sistem / Anonim',
      log.user?.role || 'System',
      log.action || '-',
      log.description || '-'
    ];

    rowValues.forEach((val, colIdx) => {
      const cell = row.getCell(colIdx + 1);
      cell.value = val;
      cell.font = { name: 'Arial', size: 10, color: { argb: 'FF334155' } };
      
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };

      // Alignment khusus per kolom
      if (colIdx === 0 || colIdx === 1 || colIdx === 3 || colIdx === 4) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: colIdx === 5 };
      }

      // Desain zebra striping
      if (dataIdx % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8FAFC' }
        };
      }
    });
  });

  colWidths.forEach((col, idx) => {
    sheet.getColumn(idx + 1).width = col.width;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const now = new Date();
  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const DD = String(now.getDate()).padStart(2, '0');
  const HH = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');

  const filename = `Log-Aktivitas_${YYYY}${MM}${DD}_${HH}${mm}.xlsx`;
  saveAs(new Blob([buffer]), filename);
};
