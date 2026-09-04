import { Lecturer, SessionUser } from '../types/lecturers.types';

/**
 * Melakukan ekspor database dosen ke file Excel dengan pemformatan lengkap & profesional
 */
export async function exportToExcel(
  lecturers: Lecturer[],
  user: SessionUser,
  selectedFakultas: string,
  searchTerm: string
): Promise<void> {
  if (lecturers.length === 0) return;

  const ExcelJS = (await import('exceljs')).default;
  const { saveAs } = await import('file-saver');

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Daftar Dosen');

  // Freeze panes agar header tetap terlihat saat scroll ke bawah
  sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 5, activeCell: 'A6', showGridLines: true }];

  // 1. Bagian Judul (Merged A1:S1)
  sheet.mergeCells('A1:S1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'DATABASE DOSEN - PENTADOSEN';
  titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF1E293B' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(1).height = 32;

  // 2. Bagian Metadata (Merged A2:S2)
  sheet.mergeCells('A2:S2');
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

  // 3. Bagian Filter (Merged A3:S3)
  sheet.mergeCells('A3:S3');
  const filterCell = sheet.getCell('A3');
  filterCell.value = `Filter Fakultas : ${selectedFakultas || 'Semua Fakultas'}  |  Kata Kunci : "${searchTerm || '-'}"`;
  filterCell.font = { name: 'Segoe UI', size: 9.5, italic: true, color: { argb: 'FF64748B' } };
  filterCell.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(3).height = 20;

  // Baris pemisah kosong
  sheet.getRow(4).height = 12;

  // 4. Header dan lebar kolom (19 Kolom)
  const headers = [
    'No', 'Penta ID', 'NIDN', 'Nama Dosen', 'Fakultas', 'Program Studi', 'Email',
    'ID Scholar', 'ID Scopus', 'Total KPI', 'Poin Eksternal', 'Poin Internal',
    'Dokumen GS', 'Sitasi GS', 'H-Index GS', 'I10-Index GS',
    'Dokumen Scopus', 'Sitasi Scopus', 'H-Index Scopus'
  ];

  const colWidths = [
    { width: 6 },   // No
    { width: 14 },  // Penta ID
    { width: 16 },  // NIDN
    { width: 34 },  // Nama Dosen
    { width: 28 },  // Fakultas
    { width: 26 },  // Program Studi
    { width: 28 },  // Email
    { width: 18 },  // ID Scholar
    { width: 18 },  // ID Scopus
    { width: 14 },  // Total KPI
    { width: 15 },  // Poin Eksternal
    { width: 15 },  // Poin Internal
    { width: 14 },  // Dokumen GS
    { width: 13 },  // Sitasi GS
    { width: 13 },  // H-Index GS
    { width: 14 },  // I10-Index GS
    { width: 16 },  // Dokumen Scopus
    { width: 14 },  // Sitasi Scopus
    { width: 16 }   // H-Index Scopus
  ];

  // Atur baris header (Row 5)
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
  lecturers.forEach((lec, dataIdx) => {
    const rowNum = headerRowNumber + 1 + dataIdx;
    const row = sheet.getRow(rowNum);
    row.height = 24;

    const rowValues = [
      dataIdx + 1,
      lec.penta_id || '-',
      lec.nidn || '-',
      lec.name || '',
      lec.fakultas || '-',
      lec.program_studi || '-',
      lec.email || '-',
      lec.scholar_id || '-',
      lec.scopus_id || '-',
      Number(lec.total_kpi_points || 0),
      Number(lec.poin_external || 0),
      Number(lec.poin_internal || 0),
      Number(lec.scholar_document_count || 0),
      Number(lec.total_citations || 0),
      Number(lec.h_index || 0),
      Number(lec.i10_index || 0),
      Number(lec.scopus_document_count || 0),
      Number(lec.scopus_total_citations || 0),
      Number(lec.scopus_h_index || 0)
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

      // Alignment per kolom
      if ([0, 1, 2, 7, 8].includes(colIdx)) {
        // No, Penta ID, NIDN, ID Scholar, ID Scopus
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else if (colIdx === 3) {
        // Nama Dosen
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF1E293B' } };
      } else if ([4, 5, 6].includes(colIdx)) {
        // Fakultas, Program Studi, Email
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      } else if (colIdx === 9) {
        // Total KPI
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF1E293B' } };
        cell.numFmt = '#,##0.0;-#,##0.0;0.0';
      } else if (colIdx === 10 || colIdx === 11) {
        // Poin Eksternal & Internal
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.numFmt = '#,##0.0;-#,##0.0;0.0';
      } else {
        // Metrics GS & Scopus
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
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

  // 6. Summary / Total Row
  if (lecturers.length > 0) {
    const totalRowNumber = headerRowNumber + lecturers.length + 1;
    const totalRow = sheet.getRow(totalRowNumber);
    totalRow.height = 26;

    // Merge Kolom 1-9 (A-I) untuk label Total
    sheet.mergeCells(`A${totalRowNumber}:I${totalRowNumber}`);
    const labelCell = totalRow.getCell(1);
    labelCell.value = `TOTAL KESELURUHAN (${lecturers.length} DOSEN)`;
    labelCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
    labelCell.alignment = { vertical: 'middle', horizontal: 'right' };

    // Formula SUM untuk Total KPI (Col 10 / J)
    const sumKpiCell = totalRow.getCell(10);
    sumKpiCell.value = { formula: `SUM(J6:J${totalRowNumber - 1})` };
    sumKpiCell.numFmt = '#,##0.0';
    sumKpiCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
    sumKpiCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Formula SUM untuk Poin Eksternal (Col 11 / K)
    const sumPoinExtCell = totalRow.getCell(11);
    sumPoinExtCell.value = { formula: `SUM(K6:K${totalRowNumber - 1})` };
    sumPoinExtCell.numFmt = '#,##0.0';
    sumPoinExtCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
    sumPoinExtCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Formula SUM untuk Poin Internal (Col 12 / L)
    const sumPoinIntCell = totalRow.getCell(12);
    sumPoinIntCell.value = { formula: `SUM(L6:L${totalRowNumber - 1})` };
    sumPoinIntCell.numFmt = '#,##0.0';
    sumPoinIntCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
    sumPoinIntCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Formula SUM untuk Dokumen GS (Col 13 / M)
    const sumDocGsCell = totalRow.getCell(13);
    sumDocGsCell.value = { formula: `SUM(M6:M${totalRowNumber - 1})` };
    sumDocGsCell.numFmt = '#,##0';
    sumDocGsCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
    sumDocGsCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Formula SUM untuk Sitasi GS (Col 14 / N)
    const sumCitGsCell = totalRow.getCell(14);
    sumCitGsCell.value = { formula: `SUM(N6:N${totalRowNumber - 1})` };
    sumCitGsCell.numFmt = '#,##0';
    sumCitGsCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
    sumCitGsCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Average H-Index GS (Col 15 / O)
    const avgHGsCell = totalRow.getCell(15);
    avgHGsCell.value = { formula: `AVERAGE(O6:O${totalRowNumber - 1})` };
    avgHGsCell.numFmt = '0.0';
    avgHGsCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
    avgHGsCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Average I10-Index GS (Col 16 / P)
    const avgI10GsCell = totalRow.getCell(16);
    avgI10GsCell.value = { formula: `AVERAGE(P6:P${totalRowNumber - 1})` };
    avgI10GsCell.numFmt = '0.0';
    avgI10GsCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
    avgI10GsCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Formula SUM untuk Dokumen Scopus (Col 17 / Q)
    const sumDocScopusCell = totalRow.getCell(17);
    sumDocScopusCell.value = { formula: `SUM(Q6:Q${totalRowNumber - 1})` };
    sumDocScopusCell.numFmt = '#,##0';
    sumDocScopusCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
    sumDocScopusCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Formula SUM untuk Sitasi Scopus (Col 18 / R)
    const sumCitScopusCell = totalRow.getCell(18);
    sumCitScopusCell.value = { formula: `SUM(R6:R${totalRowNumber - 1})` };
    sumCitScopusCell.numFmt = '#,##0';
    sumCitScopusCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
    sumCitScopusCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Average H-Index Scopus (Col 19 / S)
    const avgHScopusCell = totalRow.getCell(19);
    avgHScopusCell.value = { formula: `AVERAGE(S6:S${totalRowNumber - 1})` };
    avgHScopusCell.numFmt = '0.0';
    avgHScopusCell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
    avgHScopusCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Terapkan border & styling background baris total
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

  const filename = `Daftar-Dosen_${YYYY}${MM}${DD}_${HH}${mm}.xlsx`;
  saveAs(new Blob([buffer]), filename);
}
