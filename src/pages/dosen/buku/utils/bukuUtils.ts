import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * Menghasilkan file Excel template publikasi buku menggunakan ExcelJS
 */
export async function generateBukuExcelTemplate(): Promise<void> {
  try {
    const res = await fetch('/api/cms/templates');
    if (res.ok) {
      const data = await res.json();
      const template = data.templates?.find((t: any) => t.type === 'buku');
      if (template && template.file_url) {
        window.open(template.file_url, '_blank');
        return;
      }
    }
  } catch (e) {
    console.error('Failed to fetch custom template, falling back to generated template', e);
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Template');

  sheet.columns = [
    { header: 'Judul Buku', key: 'judul', width: 40 },
    { header: 'Kategori', key: 'kategori', width: 25 },
    { header: 'Tahun Terbit', key: 'tahun', width: 15 },
    { header: 'Tipe Dokumen', key: 'tipe', width: 20 },
  ];

  sheet.addRow({
    judul: 'Dasar-Dasar Kecerdasan Buatan',
    kategori: 'Buku Referensi',
    tahun: new Date().getFullYear(),
    tipe: 'kpi',
  });

  for (let i = 2; i <= 1000; i++) {
    sheet.getCell(`B${i}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"Buku Referensi,Buku Ajar,Buku Monograf"'],
      showErrorMessage: true,
      errorTitle: 'Input Tidak Valid',
      error: 'Silakan pilih kategori dari daftar dropdown.',
    };

    sheet.getCell(`D${i}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"kpi,arsip"'],
      showErrorMessage: true,
      errorTitle: 'Input Tidak Valid',
      error: 'Silakan pilih tipe dokumen (kpi / arsip).',
    };
  }

  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), 'Template_Import_Buku.xlsx');
}
