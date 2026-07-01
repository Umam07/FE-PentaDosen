import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitize a document title for use as a filename.
 * Strips special characters, replaces spaces with underscores.
 */
function sanitizeFilename(title: string): string {
  return title
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove chars other than word chars, spaces, hyphens
    .replace(/\s+/g, '_')       // spaces → underscores
    .replace(/-+/g, '_')        // hyphens → underscores
    .replace(/_+/g, '_')        // collapse multiple underscores
    .replace(/^_|_$/g, '');     // trim leading/trailing underscores
}

/**
 * Format current date-time as YYYYMMDD_HHMM.
 */
function formatDatetime(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}${MM}${dd}_${hh}${mm}`;
}

/**
 * Build a download filename in the format: Judul_YYYYMMDD_HHMM.ext
 * Falls back to 'dokumen_YYYYMMDD_HHMM.pdf' if title is empty.
 */
export function buildDownloadFilename(title: string, fileUrl?: string): string {
  const sanitized = sanitizeFilename(title) || 'dokumen';
  const datetime = formatDatetime();

  // Infer extension from URL (default .pdf)
  let ext = '.pdf';
  if (fileUrl) {
    const urlPath = fileUrl.split('?')[0]; // strip query string
    const dotIdx = urlPath.lastIndexOf('.');
    if (dotIdx !== -1) {
      const candidate = urlPath.substring(dotIdx).toLowerCase();
      // Only keep common document extensions
      if (['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'].includes(candidate)) {
        ext = candidate;
      }
    }
  }

  return `${sanitized}_${datetime}${ext}`;
}

/**
 * Programmatically download a file from `url` with a custom `filename`.
 * Uses fetch + Blob so the browser respects the given filename regardless
 * of the Content-Disposition header or URL path.
 * Falls back to a plain anchor click if fetch fails.
 */
export async function downloadWithFilename(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    // Fallback: open in new tab (browser will use its own name)
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
