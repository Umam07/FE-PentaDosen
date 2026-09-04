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

  // Freeze panes agar header tetap terlihat saat scroll ke bawah
  sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 5, activeCell: 'A6', showGridLines: true }];

  // 1. Bagian Judul (Merged A1:F1)
  sheet.mergeCells('A1:F1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'LOG AKTIVITAS SISTEM - PENTADOSEN';
  titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF1E293B' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(1).height = 32;

  // 2. Bagian Metadata (Merged A2:F2)
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
  metaCell.font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: 'FF64748B' } };
  metaCell.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(2).height = 20;

  // 3. Bagian Filter (Merged A3:F3)
  sheet.mergeCells('A3:F3');
  const filterCell = sheet.getCell('A3');
  filterCell.value = `Filter Aksi : ${selectedAction || 'Semua Aksi'}  |  Kata Kunci : "${searchTerm || '-'}"`;
  filterCell.font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: 'FF64748B' } };
  filterCell.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(3).height = 20;

  // Baris pemisah kosong
  sheet.getRow(4).height = 12;

  // 4. Tabel Header (Row 5)
  const headers = ['No', 'Waktu', 'Nama Pengguna', 'Peran', 'Aksi', 'Deskripsi Detail'];
  const colWidths = [
    { width: 6 },
    { width: 22 },
    { width: 28 },
    { width: 18 },
    { width: 20 },
    { width: 65 }
  ];

  const headerRowNumber = 5;
  const headerRow = sheet.getRow(headerRowNumber);
  headerRow.height = 32;

  headers.forEach((h, colIdx) => {
    const cell = headerRow.getCell(colIdx + 1);
    cell.value = h;
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' } // Slate 800 premium dark corporate
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF0F172A' } },
      bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
      left: { style: 'thin', color: { argb: 'FF334155' } },
      right: { style: 'thin', color: { argb: 'FF334155' } }
    };
  });

  // AutoFilter pada baris header
  sheet.autoFilter = {
    from: { row: headerRowNumber, column: 1 },
    to: { row: headerRowNumber, column: headers.length }
  };

  // 5. Isi data baris
  filteredAllLogs.forEach((log, dataIdx) => {
    const rowNum = headerRowNumber + 1 + dataIdx;
    const row = sheet.getRow(rowNum);
    row.height = 24;

    const formattedTime = new Date(log.created_at).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const actionStr = log.action || '-';
    const roleStr = log.user?.role || 'System';

    const rowValues = [
      dataIdx + 1,
      formattedTime,
      log.user?.name || 'Sistem / Anonim',
      roleStr,
      actionStr,
      log.description || '-'
    ];

    rowValues.forEach((val, colIdx) => {
      const cell = row.getCell(colIdx + 1);
      cell.value = val;
      cell.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF334155' } };
      
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };

      // Alignment khusus per kolom
      if (colIdx === 0 || colIdx === 1) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else if (colIdx === 2) {
        // Nama Pengguna
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF1E293B' } };
      } else if (colIdx === 3) {
        // Peran / Role badge
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        const r = String(val || '').toLowerCase();
        if (r.includes('admin') || r.includes('fakultas')) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF1D4ED8' } };
        } else if (r.includes('dosen')) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF15803D' } };
        } else if (r.includes('lppm') || r.includes('penelitian')) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEDE9FE' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF6D28D9' } };
        }
      } else if (colIdx === 4) {
        // Aksi badge
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        const a = String(val || '').toLowerCase();
        if (a.includes('login')) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF15803D' } };
        } else if (a.includes('logout')) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FFB91C1C' } };
        } else if (a.includes('verify')) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FFB45309' } };
        } else if (a.includes('sync') || a.includes('submit') || a.includes('upload')) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF1D4ED8' } };
        }
      } else {
        // Deskripsi Detail
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      }

      // Desain zebra striping
      if (dataIdx % 2 === 1) {
        if (!cell.fill) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8FAFC' }
          };
        }
      }
    });
  });

  // 6. Summary / Total Row
  if (filteredAllLogs.length > 0) {
    const totalRowNumber = headerRowNumber + filteredAllLogs.length + 1;
    const totalRow = sheet.getRow(totalRowNumber);
    totalRow.height = 26;

    sheet.mergeCells(`A${totalRowNumber}:E${totalRowNumber}`);
    const labelCell = totalRow.getCell(1);
    labelCell.value = `TOTAL AKTIVITAS TERCATAT: ${filteredAllLogs.length} LOG`;
    labelCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
    labelCell.alignment = { vertical: 'middle', horizontal: 'right' };

    const endCell = totalRow.getCell(6);
    endCell.value = '';

    for (let c = 1; c <= headers.length; c++) {
      const cell = totalRow.getCell(c);
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF1F5F9' }
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF94A3B8' } },
        bottom: { style: 'double', color: { argb: 'FF0F172A' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };
    }
  }

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
