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

  const ExcelJS = (await import('exceljs')).default;
  const { saveAs } = await import('file-saver');

  const workbook = new ExcelJS.Workbook();
  const tabs: DocTab[] = ['publikasi', 'hki', 'penelitian', 'buku'];

  tabs.forEach((tab) => {
    const data = getFilteredDataForTab(tab, documents, research, searchTerm, selectedFakultas);
    const sheetName = tab.charAt(0).toUpperCase() + tab.slice(1);
    const sheet = workbook.addWorksheet(sheetName);

    // Freeze panes agar baris header tetap terlihat saat scroll ke bawah
    sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 5, activeCell: 'A6', showGridLines: true }];

    // 1. Title Section (Merged A1:K1)
    sheet.mergeCells('A1:K1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `LAPORAN DATA ${sheetName.toUpperCase()} - PENTADOSEN`;
    titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF1E293B' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
    sheet.getRow(1).height = 32;

    // 2. Metadata Section (Merged A2:K2)
    sheet.mergeCells('A2:K2');
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
    metaCell.font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: 'FF64748B' } };
    metaCell.alignment = { vertical: 'middle', horizontal: 'left' };
    sheet.getRow(2).height = 20;

    // 3. Filter Section (Merged A3:K3)
    sheet.mergeCells('A3:K3');
    const filterCell = sheet.getCell('A3');
    filterCell.value = `Filter Fakultas : ${selectedFakultas || 'Semua Fakultas'}  |  Kata Kunci : "${searchTerm || '-'}"`;
    filterCell.font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: 'FF64748B' } };
    filterCell.alignment = { vertical: 'middle', horizontal: 'left' };
    sheet.getRow(3).height = 20;

    // Baris pemisah kosong
    sheet.getRow(4).height = 12;

    let headers: string[] = [];
    let colWidths: { width: number }[] = [];

    if (tab === 'penelitian') {
      headers = [
        'No', 'Judul Penelitian', 'Program', 'Skema',
        'Fokus', 'Dosen Pengaju', 'Fakultas', 'Status', 'Dana Disetujui',
        'Poin KPI', 'Tanggal Pelaksanaan'
      ];
      colWidths = [
        { width: 6 }, { width: 50 }, { width: 22 }, { width: 24 },
        { width: 22 }, { width: 28 }, { width: 28 }, { width: 16 }, { width: 22 },
        { width: 14 }, { width: 20 }
      ];
    } else {
      headers = [
        'No', `Judul ${sheetName}`, 'Kategori', 'Dosen Pengaju',
        'Fakultas', 'Status', 'Tanggal Publikasi', 'Sumber', 'Status KPI',
        'Poin KPI', 'Tanggal Pengajuan'
      ];
      colWidths = [
        { width: 6 }, { width: 50 }, { width: 24 }, { width: 28 },
        { width: 28 }, { width: 16 }, { width: 18 }, { width: 14 }, { width: 14 },
        { width: 14 }, { width: 18 }
      ];
    }

    // 4. Header Row (Row 5)
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
        fgColor: { argb: 'FF1E293B' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF0F172A' } },
        bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
        left: { style: 'thin', color: { argb: 'FF334155' } },
        right: { style: 'thin', color: { argb: 'FF334155' } }
      };
    });

    // AutoFilter
    sheet.autoFilter = {
      from: { row: headerRowNumber, column: 1 },
      to: { row: headerRowNumber, column: headers.length }
    };

    // 5. Data Rows
    data.forEach((item, dataIdx) => {
      const rowNum = headerRowNumber + 1 + dataIdx;
      const row = sheet.getRow(rowNum);
      row.height = 24;

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

        // Default font & border
        cell.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF334155' } };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };

        // Zebra striping
        if (dataIdx % 2 === 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8FAFC' }
          };
        }

        if (val instanceof Date) {
          cell.value = val;
          cell.numFmt = 'yyyy-mm-dd';
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.value = val ?? '-';

          if (tab === 'penelitian') {
            if ([1, 2, 3, 4, 5, 6].includes(colIdx)) {
              cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: colIdx === 1 };
            } else if (colIdx === 7) {
              // Status Badge
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
              const statusStr = String(val || '');
              if (statusStr === 'Approved') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
                cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF15803D' } };
              } else if (statusStr === 'Rejected') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
                cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FFB91C1C' } };
              } else if (statusStr === 'Verified by Fakultas') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } };
                cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF1D4ED8' } };
              } else {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
                cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FFB45309' } };
              }
            } else if (colIdx === 8) {
              // Dana Disetujui
              cell.numFmt = '"Rp"#,##0';
              cell.alignment = { vertical: 'middle', horizontal: 'right' };
            } else if (colIdx === 9) {
              // Poin KPI
              cell.numFmt = '#,##0;-#,##0;0';
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
              cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF1E293B' } };
            } else {
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            }
          } else {
            if ([1, 2, 3, 4].includes(colIdx)) {
              cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: colIdx === 1 };
            } else if (colIdx === 5) {
              // Status Badge
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
              const statusStr = String(val || '');
              if (statusStr === 'Approved') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
                cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF15803D' } };
              } else if (statusStr === 'Rejected') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
                cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FFB91C1C' } };
              } else if (statusStr === 'Verified by Fakultas') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } };
                cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF1D4ED8' } };
              } else {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
                cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FFB45309' } };
              }
            } else if (colIdx === 8) {
              // Status KPI
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
              if (val === 'KPI Aktif') {
                cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0284C7' } };
              } else {
                cell.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF64748B' } };
              }
            } else if (colIdx === 9) {
              // Poin KPI
              cell.numFmt = '#,##0;-#,##0;0';
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
              cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF1E293B' } };
            } else {
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
            }
          }
        }
      });
    });

    // 6. Summary / Total Row
    if (data.length > 0) {
      const totalRowNumber = headerRowNumber + data.length + 1;
      const totalRow = sheet.getRow(totalRowNumber);
      totalRow.height = 26;

      if (tab === 'penelitian') {
        sheet.mergeCells(`A${totalRowNumber}:H${totalRowNumber}`);
        const labelCell = totalRow.getCell(1);
        labelCell.value = `TOTAL KESELURUHAN (${data.length} DATA)`;
        labelCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
        labelCell.alignment = { vertical: 'middle', horizontal: 'right' };

        const sumDanaCell = totalRow.getCell(9);
        sumDanaCell.value = { formula: `SUM(I6:I${totalRowNumber - 1})` };
        sumDanaCell.numFmt = '"Rp"#,##0';
        sumDanaCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
        sumDanaCell.alignment = { vertical: 'middle', horizontal: 'right' };

        const sumPoinCell = totalRow.getCell(10);
        sumPoinCell.value = { formula: `SUM(J6:J${totalRowNumber - 1})` };
        sumPoinCell.numFmt = '#,##0';
        sumPoinCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
        sumPoinCell.alignment = { vertical: 'middle', horizontal: 'center' };

        const endCell = totalRow.getCell(11);
        endCell.value = '';
      } else {
        sheet.mergeCells(`A${totalRowNumber}:I${totalRowNumber}`);
        const labelCell = totalRow.getCell(1);
        labelCell.value = `TOTAL KESELURUHAN (${data.length} DATA)`;
        labelCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
        labelCell.alignment = { vertical: 'middle', horizontal: 'right' };

        const sumPoinCell = totalRow.getCell(10);
        sumPoinCell.value = { formula: `SUM(J6:J${totalRowNumber - 1})` };
        sumPoinCell.numFmt = '#,##0';
        sumPoinCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
        sumPoinCell.alignment = { vertical: 'middle', horizontal: 'center' };

        const endCell = totalRow.getCell(11);
        endCell.value = '';
      }

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
    } else {
      const emptyRowNumber = headerRowNumber + 1;
      sheet.mergeCells(`A${emptyRowNumber}:K${emptyRowNumber}`);
      const emptyCell = sheet.getCell(`A${emptyRowNumber}`);
      emptyCell.value = 'Tidak ada dokumen yang ditemukan sesuai kriteria filter.';
      emptyCell.font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: 'FF94A3B8' } };
      emptyCell.alignment = { vertical: 'middle', horizontal: 'center' };
      sheet.getRow(emptyRowNumber).height = 28;
      for (let c = 1; c <= headers.length; c++) {
        sheet.getRow(emptyRowNumber).getCell(c).border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
      }
    }

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
