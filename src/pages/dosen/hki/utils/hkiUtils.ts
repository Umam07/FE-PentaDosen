import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { HKI_CATEGORIES } from '../constants';

/**
 * Menghasilkan file Excel template Hak Kekayaan Intelektual (HKI) menggunakan ExcelJS
 */
export async function generateHkiExcelTemplate(): Promise<void> {
  try {
    const res = await fetch('/api/cms/templates');
    if (res.ok) {
      const data = await res.json();
      const template = data.templates?.find((t: any) => t.type === 'hki');
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
  const refSheet = workbook.addWorksheet('Referensi');
  refSheet.state = 'hidden';

  const validCategories = HKI_CATEGORIES.map((h) => h.id);
  validCategories.forEach((cat, idx) => {
    refSheet.getCell(`A${idx + 1}`).value = cat;
  });

  sheet.columns = [
    { header: 'Judul HKI', key: 'judul', width: 40 },
    { header: 'Kategori HKI', key: 'kategori', width: 30 },
    { header: 'Tahun Perolehan', key: 'tahun', width: 15 },
    { header: 'Tipe Dokumen', key: 'tipe', width: 20 },
  ];

  sheet.addRow({
    judul: 'Sistem Deteksi Hama Tanaman berbasis AI',
    kategori: 'HKI Paten',
    tahun: new Date().getFullYear(),
    tipe: 'kpi',
  });

  for (let i = 2; i <= 1000; i++) {
    sheet.getCell(`B${i}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [`Referensi!$A$1:$A$${validCategories.length}`],
      showErrorMessage: true,
      errorTitle: 'Input Tidak Valid',
      error: 'Silakan pilih kategori HKI dari daftar dropdown.',
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
  saveAs(new Blob([buffer]), 'Template_Import_HKI.xlsx');
}
