import { ScopusBreakdown } from '../external-documents.types';

/**
 * Normalizes title string by lowercasing and removing non-alphanumeric characters.
 */
export const normalizeTitle = (title: string): string => {
  return title?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
};

/**
 * Detailed Scopus breakdown calculation (60/40 schema + quartile)
 * Quartile determines max base points:
 *   Q1 = 40 pts, Q2 = 38 pts, Q3 = 35 pts, Q4 = 33 pts, None = 33 pts
 * Then: Single = 100%, First = 60%, Member = 40% / (totalAuthors - 1)
 */
export const calculateScopusBreakdown = (pub: any): ScopusBreakdown => {
  const role = pub.author_role === 'Member Author' || pub.author_role === 'Co-Author' 
    ? 'Member Author' 
    : (pub.author_role || 'Member Author');
  const totalAuthors = Number(pub.total_authors) || 1;
  const authorOrder = Number(pub.author_order) || (role === 'First Author' || role === 'Single Author' ? 1 : 2);
  const isCorresponding = !!pub.is_corresponding;
  const isCorrespondingConfirmed = !!pub.is_corresponding_confirmed;
  const isHyper = !!pub.is_hyperauthor || totalAuthors > 16;
  const q = pub.quartile && ['Q1', 'Q2', 'Q3', 'Q4'].includes(pub.quartile) ? pub.quartile : 'None';
  const isArticle = !pub.subtype || pub.subtype.toLowerCase() === 'ar' || pub.subtype.toLowerCase() === 'article';
  const docType = isArticle ? `Article ${q !== 'None' ? q : '(Tanpa Quartile)'}` : 'Non-Article';

  let awardedPoints = 0;
  let detailStr = '';
  let pctStr = '';
  const maxPoints = isArticle ? (q === 'Q1' ? 40 : q === 'Q2' ? 38 : q === 'Q3' ? 35 : 33) : 30;

  if (isArticle) {
    if (isHyper) {
      if (role === 'Single Author') {
        awardedPoints = 40;
        detailStr = `Scopus ${docType} Hyperauthor (Single Author)`;
        pctStr = '100% · >16 penulis = 40 pts';
      } else if (role === 'First Author') {
        awardedPoints = 24;
        detailStr = `Scopus ${docType} Hyperauthor (First Author)`;
        pctStr = 'Flat 24 pts · >16 penulis';
      } else {
        awardedPoints = 1;
        detailStr = `Scopus ${docType} Hyperauthor (Member Author)`;
        pctStr = 'Flat 1 pt · >16 penulis';
      }
    } else {
      // Base SKS points
      const basePointsMap: Record<string, number> = { Q1: 40, Q2: 38, Q3: 35, Q4: 33, None: 33 };
      const basePoints = basePointsMap[q] ?? 33;

      if (totalAuthors === 1 || (authorOrder === 1 && totalAuthors === 1)) {
        awardedPoints = basePoints;
        detailStr = `Scopus ${docType} (Single Author)`;
        pctStr = `100% dari ${basePoints} pts`;
      } else if (totalAuthors === 2) {
        if (authorOrder === 1) {
          if (isCorresponding) {
            awardedPoints = 0.6 * basePoints;
            detailStr = `Scopus ${docType} (First & Corresponding Author)`;
            pctStr = `Skenario 1: 60% dari ${basePoints} pts`;
          } else {
            awardedPoints = 0.5 * basePoints;
            detailStr = `Scopus ${docType} (First Author)`;
            pctStr = `Skenario 2: 50% dari ${basePoints} pts`;
          }
        } else {
          if (isCorresponding) {
            awardedPoints = 0.5 * basePoints;
            detailStr = `Scopus ${docType} (2nd Author + Corresponding)`;
            pctStr = `Skenario 2: 50% dari ${basePoints} pts`;
          } else {
            awardedPoints = 0.4 * basePoints;
            detailStr = `Scopus ${docType} (2nd Author)`;
            pctStr = `Skenario 1: 40% dari ${basePoints} pts`;
          }
        }
      } else {
        // > 2 Authors
        if (authorOrder === 1) {
          if (isCorresponding) {
            awardedPoints = 0.6 * basePoints;
            detailStr = `Scopus ${docType} (First & Corresponding Author)`;
            pctStr = `Skenario 1: 60% dari ${basePoints} pts`;
          } else {
            awardedPoints = 0.4 * basePoints;
            detailStr = `Scopus ${docType} (First Author)`;
            pctStr = `Skenario 2: 40% dari ${basePoints} pts`;
          }
        } else {
          // Member Author (2nd, 3rd, etc.)
          if (isCorresponding) {
            awardedPoints = 0.4 * basePoints;
            detailStr = `Scopus ${docType} (Member Author + Corresponding)`;
            pctStr = `Skenario 2: 40% dari ${basePoints} pts`;
          } else {
            // Default Scenario 1
            awardedPoints = (0.4 * basePoints) / (totalAuthors - 1);
            detailStr = `Scopus ${docType} (Member Author)`;
            pctStr = `Skenario 1 (Default): 40% dari ${basePoints} pts ÷ ${totalAuthors - 1} anggota`;
          }
        }
      }
    }
  } else {
    // Non-Article
    if (role === 'Single Author') {
      awardedPoints = 30;
      detailStr = `Scopus ${docType} (Single Author)`;
      pctStr = '100% dari 30 pts';
    } else if (role === 'First Author') {
      awardedPoints = 18;
      detailStr = `Scopus ${docType} (First Author)`;
      pctStr = 'Flat 18 pts';
    } else {
      const memberCount = Math.max(1, totalAuthors - 1);
      awardedPoints = 12 / memberCount;
      detailStr = `Scopus ${docType} (Member Author)`;
      pctStr = `Pool 12 pts ÷ ${memberCount} anggota = ${(12 / memberCount).toFixed(2)} pts`;
    }
  }

  const totalPoints = Math.round(awardedPoints * 100) / 100;

  return {
    basePoints: totalPoints,
    totalPoints,
    maxPoints,
    detailStr,
    pctStr,
    totalAuthors,
    authorOrder,
    citations: Number(pub.citations) || 0,
    isArticle,
    isHyper,
    role,
    q,
    isCorresponding,
    isCorrespondingConfirmed
  };
};
