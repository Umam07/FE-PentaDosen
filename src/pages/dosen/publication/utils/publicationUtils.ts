import type { WeightCategory } from '../types/publication.types';

/**
 * Menghasilkan file Excel template publikasi ilmiah dosen menggunakan ExcelJS
 */
export async function generatePublicationExcelTemplate(weights: WeightCategory[]): Promise<void> {
  try {
    const res = await fetch('/api/cms/templates');
    if (res.ok) {
      const data = await res.json();
      const template = data.templates?.find((t: any) => t.type === 'publication');
      if (template && template.file_url) {
        window.open(template.file_url, '_blank');
        return;
      }
    }
  } catch (e) {
    console.error('Failed to fetch custom template, falling back to generated template', e);
  }

  const ExcelJS = (await import('exceljs')).default;
  const { saveAs } = await import('file-saver');

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Template');
  const refSheet = workbook.addWorksheet('Referensi');
  refSheet.state = 'hidden';

  const validCategories = weights
    .map((w) => w.category)
    .filter((cat: string) => {
      const catLower = (cat || '').toLowerCase();
      return (
        !catLower.includes('hki') &&
        !catLower.includes('paten') &&
        !catLower.includes('cipta') &&
        !catLower.includes('merk') &&
        !catLower.includes('merek') &&
        !catLower.includes('buku') &&
        !catLower.includes('monograf') &&
        !catLower.includes('ajar') &&
        !catLower.includes('referensi') &&
        !catLower.includes('laporan') &&
        !catLower.includes('proposal')
      );
    });

  const fallbackCategories = [
    'Jurnal Internasional Bereputasi',
    'Jurnal Internasional',
    'Jurnal Nasional Terakreditasi',
    'Jurnal Nasional Tidak Terakreditasi',
    'Prosiding Internasional',
    'Prosiding Nasional'
  ];

  const categoriesForTemplate = validCategories.length > 0 ? validCategories : fallbackCategories;

  categoriesForTemplate.forEach((cat, idx) => {
    refSheet.getCell(`A${idx + 1}`).value = cat;
  });

  sheet.columns = [
    { header: 'Judul Publikasi', key: 'judul', width: 40 },
    { header: 'Kategori', key: 'kategori', width: 30 },
    { header: 'Tahun Terbit', key: 'tahun', width: 15 },
    { header: 'Tipe Dokumen', key: 'tipe', width: 20 },
  ];

  sheet.addRow({
    judul: 'Implementasi AI dalam Pendidikan',
    kategori: categoriesForTemplate[0] || 'Jurnal Internasional',
    tahun: new Date().getFullYear(),
    tipe: 'kpi'
  });

  for (let i = 2; i <= 1000; i++) {
    if (categoriesForTemplate.length > 0) {
      sheet.getCell(`B${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`Referensi!$A$1:$A$${categoriesForTemplate.length}`],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih kategori publikasi dari daftar dropdown.',
      };
    }

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
  saveAs(new Blob([buffer]), 'Template_Import_Publikasi.xlsx');
}
