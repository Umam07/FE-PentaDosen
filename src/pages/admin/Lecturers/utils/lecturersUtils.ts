import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Lecturer, SessionUser } from '../types/lecturers.types';

/**
 * Melakukan ekspor database dosen ke file Excel dengan pemformatan lengkap
 */
export async function exportToExcel(
  lecturers: Lecturer[],
  user: SessionUser,
  selectedFakultas: string,
  searchTerm: string
): Promise<void> {
  if (lecturers.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Daftar Dosen');

  // Menampilkan grid lines
  sheet.views = [{ showGridLines: true }];

  // Bagian Judul
  sheet.mergeCells('A1:Q1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'DATABASE DOSEN - PENTADOSEN';
  titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF1E293B' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(1).height = 30;

  // Bagian Metadata
  sheet.mergeCells('A2:Q2');
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
  sheet.mergeCells('A3:Q3');
  const filterCell = sheet.getCell('A3');
  filterCell.value = `Filter Fakultas : ${selectedFakultas || 'Semua Fakultas'}  |  Kata Kunci : "${searchTerm || '-'}"`;
  filterCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748B' } };
  filterCell.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(3).height = 20;

  // Baris kosong
  sheet.getRow(4).height = 10;

  // Header dan lebar kolom
  const headers = [
    'No', 'Penta ID', 'NIDN', 'Nama', 'Prodi', 'ID Scholar', 'ID Scopus',
    'Total KPI', 'Poin External', 'Poin Internal', 'Dokumen GS', 'Sitasi GS',
    'H-Index GS', 'I10-Index GS', 'Dokumen Scopus', 'Sitasi Scopus', 'H-Index Scopus'
  ];

  const colWidths = [
    { width: 6 }, { width: 14 }, { width: 16 }, { width: 35 }, { width: 25 }, 
    { width: 18 }, { width: 18 }, { width: 12 }, { width: 15 }, { width: 15 }, 
    { width: 14 }, { width: 12 }, { width: 12 }, { width: 14 }, { width: 16 }, 
    { width: 14 }, { width: 16 }
  ];

  // Atur baris header
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
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF312E81' } },
      bottom: { style: 'medium', color: { argb: 'FF312E81' } },
      left: { style: 'thin', color: { argb: 'FF312E81' } },
      right: { style: 'thin', color: { argb: 'FF312E81' } }
    };
  });

  // Isi data baris
  lecturers.forEach((lec, dataIdx) => {
    const rowNum = headerRowNumber + 1 + dataIdx;
    const row = sheet.getRow(rowNum);
    row.height = 22;

    const rowValues = [
      dataIdx + 1,
      lec.penta_id || '-',
      lec.nidn || '-',
      lec.name || '',
      lec.program_studi || '-',
      lec.scholar_id || '-',
      lec.scopus_id || '-',
      Math.round(lec.total_kpi_points || 0),
      Math.round(lec.poin_external || 0),
      Math.round(lec.poin_internal || 0),
      lec.scholar_document_count || 0,
      lec.total_citations || 0,
      lec.h_index || 0,
      lec.i10_index || 0,
      lec.scopus_document_count || 0,
      lec.scopus_total_citations || 0,
      lec.scopus_h_index || 0
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

      // Alignment per kolom
      if (colIdx === 0 || colIdx === 1 || colIdx === 2) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else if (colIdx === 3 || colIdx === 4) {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      } else if (colIdx === 5 || colIdx === 6) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }

      // Formats angka desimal dan ribuan
      if (colIdx === 7 || colIdx === 8 || colIdx === 9) {
        cell.numFmt = '#,##0.0;-#,##0.0;0.0';
      } else if (colIdx >= 10) {
        cell.numFmt = '#,##0';
      }

      // Desain baris belang-belang (zebra striping)
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

  const filename = `Daftar-Dosen_${YYYY}${MM}${DD}_${HH}${mm}.xlsx`;
  saveAs(new Blob([buffer]), filename);
}
