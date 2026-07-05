/**
 * Format nilai tanggal/tahun ke string yang readable.
 * Kalau input berupa 4 digit tahun (misal "2023"), dikembalikan apa adanya.
 * Selain itu diparse sebagai Date dan diformat ke locale id-ID.
 */
export function formatTanggal(dateStr: string | number | null | undefined): string {
  if (!dateStr) return '-';
  const str = String(dateStr);
  if (str.length === 4 && !isNaN(Number(str))) return str;
  try {
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return str;
  }
}

/** Format angka ke string Rupiah (IDR, tanpa desimal). */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
