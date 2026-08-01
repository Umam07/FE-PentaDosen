import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { DocTab, AllDocumentItem, AllResearchItem, SessionUser } from '../types/adminAllDocuments.types';

/**
 * Menentukan sumber data dokumen (Scopus, Scholar, atau Manual)
 */
export function getDocSource(doc: any): 'Scopus' | 'Scholar' | 'Manual' {
  const src = (doc?.source || '').toLowerCase();
  const idStr = String(doc?.id || '').toLowerCase();

  if (src === 'scopus' || idStr.startsWith('scopus_')) {
    return 'Scopus';
  }
  if (src === 'scholar' || src === 'google_scholar' || idStr.startsWith('scholar_')) {
    return 'Scholar';
  }
  return 'Manual';
}

/**
 * Menentukan kategori dokumen berdasarkan sumber data atau properti category
 */
export function getDocCategory(doc: any, tab: string): string {
  if (tab === 'penelitian') return doc?.program || '';
  const src = getDocSource(doc);
  if (src === 'Scopus') return 'Jurnal Internasional';
  if (src === 'Scholar') return 'Jurnal Nasional';
  return doc?.category || '';
}

/**
 * Menyaring data dokumen/penelitian berdasarkan tab aktif, pencarian, dan filter fakultas
 */
export function getFilteredDataForTab(
  tab: DocTab,
  documents: AllDocumentItem[],
  research: AllResearchItem[],
  searchTerm: string,
  selectedFakultas: string
): any[] {
  let baseData: any[] = [];
  if (tab === 'penelitian') {
    baseData = research;
  } else if (tab === 'hki') {
    baseData = documents.filter((doc) => getDocCategory(doc, tab).toLowerCase().includes('hki'));
  } else if (tab === 'buku') {
    baseData = documents.filter((doc) => getDocCategory(doc, tab).toLowerCase().includes('buku'));
  } else {
    baseData = documents.filter((doc) => {
      const cat = getDocCategory(doc, tab).toLowerCase();
      return !cat.includes('hki') && !cat.includes('buku');
    });
  }

  return baseData.filter((doc) => {
    const src = tab === 'penelitian' ? 'Manual' : getDocSource(doc);
    const titleText = tab === 'penelitian' ? doc.judul_penelitian : doc.title;
    const authorText = tab === 'penelitian' ? doc.user?.name : doc.user_name;
    const catText = getDocCategory(doc, tab);

    const matchSearch =
      (titleText || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (authorText || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (catText || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (src || '').toLowerCase().includes(searchTerm.toLowerCase());

    const itemFakultas = tab === 'penelitian' ? doc.user?.fakultas : doc.fakultas;
    const matchFakultas = selectedFakultas ? itemFakultas === selectedFakultas : true;

    return matchSearch && matchFakultas;
  });
}

/**
 * Ekspor laporan Excel 4 worksheet lengkap untuk Publikasi, HKI, Penelitian, dan Buku.
 */
export async function exportAllDocumentsToExcel(
  documents: AllDocumentItem[],
  research: AllResearchItem[],
  user: SessionUser,
  selectedFakultas: string,
  searchTerm: string
): Promise<void> {
  if (documents.length === 0 && research.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const tabs: DocTab[] = ['publikasi', 'hki', 'penelitian', 'buku'];

  tabs.forEach((tab) => {
    const data = getFilteredDataForTab(tab, documents, research, searchTerm, selectedFakultas);
    const sheetName = tab.charAt(0).toUpperCase() + tab.slice(1);
    const sheet = workbook.addWorksheet(sheetName);

    sheet.views = [{ showGridLines: true }];

    // Title Section
    sheet.mergeCells('A1:L1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `LAPORAN DATA ${sheetName.toUpperCase()} - PENTADOSEN`;
    titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF1E293B' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
    sheet.getRow(1).height = 30;

    // Metadata Section
    sheet.mergeCells('A2:L2');
    const metaCell = sheet.getCell('A2');
    const dateStr = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    metaCell.value = `Diekspor oleh : ${user?.name || 'Admin'}  |  Diekspor pada : ${dateStr}`;
    metaCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748B' } };
    metaCell.alignment = { vertical: 'middle', horizontal: 'left' };
    sheet.getRow(2).height = 20;

    // Filter Section
    sheet.mergeCells('A3:L3');
    const filterCell = sheet.getCell('A3');
    filterCell.value = `Filter Fakultas : ${selectedFakultas || 'Semua Fakultas'}  |  Kata Kunci : "${searchTerm || '-'}"`;
    filterCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748B' } };
    filterCell.alignment = { vertical: 'middle', horizontal: 'left' };
    sheet.getRow(3).height = 20;

    sheet.getRow(4).height = 10;

    let headers: string[] = [];
    let colWidths: { width: number }[] = [];

    if (tab === 'penelitian') {
      headers = [
        'No', 'ID Penelitian', 'Judul Penelitian', 'Program', 'Skema',
        'Fokus', 'Dosen Pengaju', 'Fakultas', 'Status', 'Dana Disetujui',
        'Poin Awarded', 'Tanggal Pelaksanaan'
      ];
      colWidths = [
        { width: 6 }, { width: 15 }, { width: 45 }, { width: 20 }, { width: 25 },
        { width: 20 }, { width: 25 }, { width: 25 }, { width: 15 }, { width: 20 },
        { width: 15 }, { width: 18 }
      ];
    } else {
      headers = [
        'No', 'ID Dokumen', `Judul ${sheetName}`, 'Kategori', 'Dosen Pengaju',
        'Fakultas', 'Status', 'Tanggal Publikasi', 'Sumber', 'Status KPI',
        'Poin Awarded', 'Tanggal Pengajuan'
      ];
      colWidths = [
        { width: 6 }, { width: 15 }, { width: 45 }, { width: 25 }, { width: 25 },
        { width: 25 }, { width: 15 }, { width: 18 }, { width: 12 }, { width: 15 },
        { width: 15 }, { width: 18 }
      ];
    }

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
        fgColor: { argb: 'FF4F46E5' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF312E81' } },
        bottom: { style: 'medium', color: { argb: 'FF312E81' } },
        left: { style: 'thin', color: { argb: 'FF312E81' } },
        right: { style: 'thin', color: { argb: 'FF312E81' } }
      };
    });

    data.forEach((item, dataIdx) => {
      const rowNum = headerRowNumber + 1 + dataIdx;
      const row = sheet.getRow(rowNum);
      row.height = 22;

      let rowValues: any[] = [];
      const num = dataIdx + 1;
      const createdAt = item.created_at ? new Date(item.created_at) : null;

      if (tab === 'penelitian') {
        const author = item.user?.name || '';
        const fakultasVal = item.user?.fakultas || '';
        const dana = item.dana_disetujui || 0;
        const tanggalPelaksanaan = item.tahun ? new Date(item.tahun) : null;
        rowValues = [
          num,
          item.id,
          item.judul_penelitian || '',
          item.program || '',
          item.skema || '',
          item.fokus || '',
          author,
          fakultasVal,
          item.status || 'Pending',
          dana,
          Math.round(item.awarded_points || 0),
          tanggalPelaksanaan
        ];
      } else {
        const author = item.user_name || '';
        const publishedAt = item.published_at ? new Date(item.published_at) : null;
        const docSource = getDocSource(item);
        const category = getDocCategory(item, tab);
        const kpiStatus = item.is_kpi_counted ? 'KPI Aktif' : 'Arsip';
        rowValues = [
          num,
          item.id,
          item.title || '',
          category,
          author,
          item.fakultas || '',
          item.status || 'Pending',
          publishedAt,
          docSource,
          kpiStatus,
          Math.round(item.awarded_points || 0),
          createdAt
        ];
      }

      rowValues.forEach((val, colIdx) => {
        const cell = row.getCell(colIdx + 1);

        if (val instanceof Date) {
          cell.value = val;
          cell.numFmt = 'yyyy-mm-dd';
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.value = val ?? '-';

          if (tab === 'penelitian') {
            if ([2, 3, 4, 5, 6, 7].includes(colIdx)) {
              cell.alignment = { vertical: 'middle', horizontal: 'left' };
            } else if (colIdx === 9) {
              cell.numFmt = '"Rp"#,##0';
              cell.alignment = { vertical: 'middle', horizontal: 'right' };
            } else if (colIdx === 10) {
              cell.numFmt = '#,##0;-#,##0;0';
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            } else {
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            }
          } else {
            if ([2, 3, 4, 5].includes(colIdx)) {
              cell.alignment = { vertical: 'middle', horizontal: 'left' };
            } else if (colIdx === 10) {
              cell.numFmt = '#,##0;-#,##0;0';
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            } else {
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            }
          }
        }

        cell.font = { name: 'Arial', size: 10, color: { argb: 'FF334155' } };

        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };

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
  });

  const buffer = await workbook.xlsx.writeBuffer();

  const now = new Date();
  const YYYY = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const DD = String(now.getDate()).padStart(2, '0');
  const HH = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');

  const filename = `Semua-Dokumen_${YYYY}${MM}${DD}_${HH}${mm}.xlsx`;
  saveAs(new Blob([buffer]), filename);
}
