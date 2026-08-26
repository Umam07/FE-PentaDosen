import type { LecturerUser, CategoryWeight, SubCategoryOption, ScoringPreview } from '../types/adminInputDocument.types';

/**
 * Menghasilkan file Excel template interaktif berbasis ExcelJS dengan data validation dropdown.
 */
export async function downloadExcelTemplate(
  mainCategory: string,
  users: LecturerUser[],
  weights: CategoryWeight[]
): Promise<void> {
  const ExcelJS = (await import('exceljs')).default;
  const { saveAs } = await import('file-saver');

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Template');
  const refSheet = workbook.addWorksheet('Referensi');
  refSheet.state = 'hidden';

  const samplePentaId = users.find(u => u.penta_id)?.penta_id || 'PNT0001';

  if (mainCategory === 'Penelitian') {
    sheet.columns = [
      { header: 'Penta ID', key: 'penta_id', width: 15 },
      { header: 'Judul Penelitian', key: 'judul', width: 45 },
      { header: 'Dana Disetujui', key: 'dana', width: 20 },
      { header: 'Program', key: 'program', width: 25 },
      { header: 'Skema', key: 'skema', width: 20 },
      { header: 'Fokus', key: 'fokus', width: 20 },
      { header: 'Tahun', key: 'tahun', width: 15 },
    ];

    sheet.addRow({
      penta_id: samplePentaId,
      judul: 'Analisis Sistem AI',
      dana: 10000000,
      program: 'hibah internal',
      skema: 'kompetisi',
      fokus: 'kesehatan',
      tahun: 2026,
    });

    for (let i = 2; i <= 1000; i++) {
      sheet.getCell(`D${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"hibah internal,hibah dikti,hibah luar negeri"'],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih program dari daftar dropdown.',
      };

      sheet.getCell(`E${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"kompetisi,pembinaan"'],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih skema dari daftar dropdown.',
      };

      sheet.getCell(`F${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"kesehatan,ekonomi"'],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih fokus dari daftar dropdown.',
      };
    }
  } else {
    let titleHeader = 'Judul Publikasi';
    let catHeader = 'Kategori';
    let yearHeader = 'Tahun Terbit';
    let sampleTitle = 'Implementasi AI dalam Pendidikan';
    let sampleCat = 'Jurnal Internasional';
    let validCategories: string[] = [];

    if (mainCategory === 'HKI') {
      titleHeader = 'Judul HKI';
      catHeader = 'Kategori HKI';
      yearHeader = 'Tahun Perolehan';
      sampleTitle = 'Sistem Deteksi Hama Tanaman berbasis AI';
      sampleCat = 'HKI Paten';
      validCategories = ['HKI Paten', 'HKI Paten Sederhana', 'HKI Merk', 'HKI Hak Cipta'];
    } else if (mainCategory === 'Buku') {
      titleHeader = 'Judul Buku';
      catHeader = 'Kategori';
      yearHeader = 'Tahun Terbit';
      sampleTitle = 'Dasar-Dasar Kecerdasan Buatan';
      sampleCat = 'Buku Referensi';
      validCategories = ['Buku Referensi', 'Buku Ajar', 'Buku Monograf'];
    } else {
      validCategories = weights.map((w) => w.category);
      if (validCategories.length === 0) {
        validCategories = ['Jurnal Internasional', 'Jurnal Nasional'];
      }
    }

    validCategories.forEach((cat, idx) => {
      refSheet.getCell(`A${idx + 1}`).value = cat;
    });

    sheet.columns = [
      { header: 'Penta ID', key: 'penta_id', width: 15 },
      { header: titleHeader, key: 'judul', width: 45 },
      { header: catHeader, key: 'kategori', width: 30 },
      { header: yearHeader, key: 'tahun', width: 15 },
      { header: 'Tipe Dokumen', key: 'tipe', width: 20 },
    ];

    sheet.addRow({
      penta_id: samplePentaId,
      judul: sampleTitle,
      kategori: sampleCat,
      tahun: new Date().getFullYear(),
      tipe: 'kpi',
    });

    for (let i = 2; i <= 1000; i++) {
      if (validCategories.length > 0) {
        sheet.getCell(`C${i}`).dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [`Referensi!$A$1:$A$${validCategories.length}`],
          showErrorMessage: true,
          errorTitle: 'Input Tidak Valid',
          error: 'Silakan pilih kategori dari daftar dropdown.',
        };
      }

      sheet.getCell(`E${i}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"kpi,arsip"'],
        showErrorMessage: true,
        errorTitle: 'Input Tidak Valid',
        error: 'Silakan pilih tipe dokumen (kpi / arsip).',
      };
    }
  }

  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `Template_Import_${mainCategory}.xlsx`);
}

/**
 * Menghitung estimasi poin KPI berdasarkan kategori & sub-kategori
 */
export function calculateScoringPreview(
  mainCategory: string,
  subCategory: string,
  subCategoryOptions: SubCategoryOption[],
  docType: 'kpi' | 'arsip'
): ScoringPreview {
  if (mainCategory === 'Penelitian') {
    const selectedOption = subCategoryOptions.find(opt => opt.id === subCategory);
    const basePoints = selectedOption ? selectedOption.pts : 0;
    return {
      message: `Estimasi: +${basePoints} Poin KPI (Hibah)`,
      points: basePoints
    };
  }
  if (docType === 'arsip') {
    return { message: 'Arsip (0 Poin)', points: 0 };
  }

  const selectedOption = subCategoryOptions.find(opt => opt.id === subCategory);
  const pts = selectedOption ? selectedOption.pts : 0;
  return {
    message: `Estimasi: +${pts} Poin KPI`,
    points: pts
  };
}
