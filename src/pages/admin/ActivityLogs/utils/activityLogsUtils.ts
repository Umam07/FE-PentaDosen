import React from 'react';
import { 
  Activity, User as UserIcon, LogOut, RefreshCw, 
  Shield, FileText, BookOpen, Award, Beaker, Book
} from 'lucide-react';
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
  if (r.includes('penelitian') || r.includes('lppm')) {
    return 'bg-accent-soft text-accent border-accent/20 dark:bg-accent-soft/20 dark:text-accent-on-dark dark:border-accent/30';
  }
  if (r.includes('fakultas')) {
    return 'bg-chart-scholar/10 text-chart-scholar border-chart-scholar/20 dark:text-chart-scholar-dark dark:border-chart-scholar/30';
  }
  if (r.includes('dosen')) {
    return 'bg-success-soft text-success-dark border-success-border dark:bg-success/15 dark:text-success-on-dark dark:border-success/30';
  }
  return 'bg-surface-light-raised text-body border-hairline-light dark:bg-surface-dark-elevated dark:text-on-dark dark:border-hairline-dark';
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
      badge: 'bg-success-soft text-success-dark border-success-border dark:bg-success/15 dark:text-success-on-dark dark:border-success/30', 
      dot: 'bg-success', 
      icon: React.createElement(UserIcon, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-success/20', 
      iconBg: 'bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark' 
    };
  }
  
  if (a.includes('logout')) {
    return { 
      badge: 'bg-error-soft text-error border-error-border dark:bg-error/15 dark:text-error-on-dark dark:border-error/30', 
      dot: 'bg-error', 
      icon: React.createElement(LogOut, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-error/20', 
      iconBg: 'bg-error-soft dark:bg-error/15 text-error dark:text-error-on-dark' 
    };
  }
  
  if (a.includes('sync')) {
    return { 
      badge: 'bg-accent-soft text-accent border-accent/20 dark:bg-accent/15 dark:text-accent-on-dark dark:border-accent/30', 
      dot: 'bg-accent', 
      icon: React.createElement(RefreshCw, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-accent/20', 
      iconBg: 'bg-accent-soft dark:bg-accent/15 text-accent dark:text-accent-on-dark' 
    };
  }
  
  if (a.includes('verify')) {
    return { 
      badge: 'bg-warning-soft text-warning-dark border-warning-border dark:bg-warning/15 dark:text-warning dark:border-warning/30', 
      dot: 'bg-warning', 
      icon: React.createElement(Shield, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-warning/20', 
      iconBg: 'bg-warning-soft dark:bg-warning/15 text-warning-dark dark:text-warning' 
    };
  }
  
  if (a.includes('submit') || a.includes('upload')) {
    return { 
      badge: 'bg-accent-soft text-accent border-accent/20 dark:bg-accent/15 dark:text-accent-on-dark dark:border-accent/30', 
      dot: 'bg-accent', 
      icon: React.createElement(FileText, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-accent/20', 
      iconBg: 'bg-accent-soft dark:bg-accent/15 text-accent dark:text-accent-on-dark' 
    };
  }
  
  if (a.includes('journal')) {
    return { 
      badge: 'bg-chart-scholar/10 text-chart-scholar border-chart-scholar/20 dark:text-chart-scholar-dark dark:border-chart-scholar/30', 
      dot: 'bg-chart-scholar', 
      icon: React.createElement(BookOpen, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-chart-scholar/20', 
      iconBg: 'bg-chart-scholar/10 dark:bg-chart-scholar/20 text-chart-scholar dark:text-chart-scholar-dark' 
    };
  }
  
  if (a.includes('hki')) {
    return { 
      badge: 'bg-chart-hki/10 text-chart-hki border-chart-hki/20 dark:text-chart-hki-dark dark:border-chart-hki/30', 
      dot: 'bg-chart-hki', 
      icon: React.createElement(Award, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-chart-hki/20', 
      iconBg: 'bg-chart-hki/10 dark:bg-chart-hki/20 text-chart-hki dark:text-chart-hki-dark' 
    };
  }
  
  if (a.includes('research')) {
    return { 
      badge: 'bg-chart-penelitian/10 text-chart-penelitian border-chart-penelitian/20 dark:text-chart-penelitian-dark dark:border-chart-penelitian/30', 
      dot: 'bg-chart-penelitian', 
      icon: React.createElement(Beaker, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-chart-penelitian/20', 
      iconBg: 'bg-chart-penelitian/10 dark:bg-chart-penelitian/20 text-chart-penelitian dark:text-chart-penelitian-dark' 
    };
  }
  
  if (a.includes('book')) {
    return { 
      badge: 'bg-chart-buku/10 text-chart-buku border-chart-buku/20 dark:text-chart-buku-dark dark:border-chart-buku/30', 
      dot: 'bg-chart-buku', 
      icon: React.createElement(Book, { className: 'w-3.5 h-3.5' }), 
      ring: 'ring-chart-buku/20', 
      iconBg: 'bg-chart-buku/10 dark:bg-chart-buku/20 text-chart-buku dark:text-chart-buku-dark' 
    };
  }
  
  return { 
    badge: 'bg-surface-light-raised text-body border-hairline-light dark:bg-surface-dark-elevated dark:text-on-dark-soft dark:border-hairline-dark', 
    dot: 'bg-muted', 
    icon: React.createElement(Activity, { className: 'w-3.5 h-3.5' }), 
    ring: 'ring-hairline-light dark:ring-hairline-dark', 
    iconBg: 'bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted' 
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

  const ExcelJS = (await import('exceljs')).default;
  const { saveAs } = await import('file-saver');

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
