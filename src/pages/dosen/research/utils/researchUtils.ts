import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * Menghasilkan file Excel template penelitian hibah dosen menggunakan ExcelJS
 */
export async function generateResearchExcelTemplate(): Promise<void> {
  try {
    const res = await fetch('/api/cms/templates');
    if (res.ok) {
      const data = await res.json();
      const template = data.templates?.find((t: any) => t.type === 'penelitian');
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
    { header: 'Judul Penelitian', key: 'judul', width: 40 },
    { header: 'Program Hibah', key: 'program', width: 25 },
    { header: 'Skema Penelitian', key: 'skema', width: 25 },
    { header: 'Fokus Bidang', key: 'fokus', width: 25 },
    { header: 'Dana Disetujui (Rp)', key: 'dana', width: 20 },
    { header: 'Tahun Pelaksanaan', key: 'tahun', width: 15 },
    { header: 'Tipe Dokumen', key: 'tipe', width: 15 },
  ];

  sheet.addRow({
    judul: 'Studi Pengembangan Smart Campus Berbasis IoT',
    program: 'hibah internal',
    skema: 'Penelitian Dasar',
    fokus: 'Teknologi Informasi dan Komunikasi',
    dana: 15000000,
    tahun: new Date().getFullYear(),
    tipe: 'kpi',
  });

  for (let i = 2; i <= 1000; i++) {
    sheet.getCell(`B${i}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"hibah internal,hibah dikti,hibah luar negeri"'],
      showErrorMessage: true,
      errorTitle: 'Input Tidak Valid',
      error: 'Pilih program hibah dari dropdown.',
    };

    sheet.getCell(`G${i}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"kpi,arsip"'],
      showErrorMessage: true,
      errorTitle: 'Input Tidak Valid',
      error: 'Pilih tipe dokumen (kpi / arsip).',
    };
  }

  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), 'Template_Import_Penelitian.xlsx');
}
