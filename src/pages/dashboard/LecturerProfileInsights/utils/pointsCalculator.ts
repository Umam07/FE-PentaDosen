import { ScopusDocument } from '../../../dosen/dashboard/components/external-documents/external-documents.types';

// Membersihkan dan menormalisasi string judul untuk pencocokan silang (cross-match)
export const normalizeTitle = (title: string): string => {
  return (title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
};

// Menghitung poin SKS/SINTA publikasi Scopus berdasarkan peran penulis, jumlah penulis, urutan penulis, status corresponding, dll.
export const calculateScopusSintaPoints = (pub: ScopusDocument): number => {
  if (pub.awarded_points !== undefined && pub.awarded_points !== null) {
    return Number(pub.awarded_points);
  }

  const role = pub.author_role === 'Member Author' || pub.author_role === 'Co-Author'
    ? 'Member Author'
    : (pub.author_role || 'Member Author');
  const totalAuthors = Number(pub.total_authors) || 1;
  const authorOrder = Number(pub.author_order) || (role === 'First Author' || role === 'Single Author' ? 1 : 2);
  const isCorresponding = !!pub.is_corresponding;
  const isHyper = !!pub.is_hyperauthor || totalAuthors > 16;
  const q = ['Q1', 'Q2', 'Q3', 'Q4'].includes(pub.quartile || '') ? pub.quartile! : 'None';
  const isArticle = !pub.subtype || pub.subtype.toLowerCase() === 'ar' || pub.subtype.toLowerCase() === 'article';

  let awardedPoints = 0;

  if (isArticle) {
    if (isHyper) {
      if (role === 'Single Author') {
        awardedPoints = 40;
      } else if (role === 'First Author') {
        awardedPoints = 24;
      } else {
        awardedPoints = 1; // Hyperauthor Member = 1 pt flat
      }
    } else {
      // Base SKS points
      const basePointsMap: Record<string, number> = { Q1: 40, Q2: 38, Q3: 35, Q4: 33, None: 33 };
      const basePoints = basePointsMap[q] ?? 33;

      if (totalAuthors === 1 || (authorOrder === 1 && totalAuthors === 1)) {
        awardedPoints = basePoints;
      } else if (totalAuthors === 2) {
        if (authorOrder === 1) {
          awardedPoints = isCorresponding ? (0.6 * basePoints) : (0.5 * basePoints);
        } else {
          awardedPoints = isCorresponding ? (0.5 * basePoints) : (0.4 * basePoints);
        }
      } else {
        // > 2 Authors
        if (authorOrder === 1) {
          awardedPoints = isCorresponding ? (0.6 * basePoints) : (0.4 * basePoints);
        } else {
          // Member Author (2nd, 3rd, etc.)
          if (isCorresponding) {
            awardedPoints = 0.4 * basePoints;
          } else {
            // Default is Scenario 1: First Author is corresponding, so members get 40% / (n - 1)
            awardedPoints = (0.4 * basePoints) / (totalAuthors - 1);
          }
        }
      }
    }
  } else {
    // Non-Article
    if (role === 'Single Author') {
      awardedPoints = 30;
    } else if (role === 'First Author') {
      awardedPoints = 18;
    } else {
      const memberCount = Math.max(1, totalAuthors - 1);
      awardedPoints = 12 / memberCount;
    }
  }

  return Math.round(awardedPoints);
};
