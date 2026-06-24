/**
 * Calculate Scopus/SINTA points using the 60/40 author-role schema.
 *
 * Schema:
 *   Max base points per Quartile (Article only):
 *     Q1 = 40 pts, Q2 = 30 pts, Q3 = 20 pts, Q4/None = 10 pts
 *   Non-Article max = 30 pts (flat)
 *   - Single Author  : 100% of max
 *   - First Author   : 60% of max
 *   - Member Author  : 40% of max ÷ number of member authors (totalAuthors - 1)
 *   - Hyperauthor (>16 authors):
 *       First Author  = 2 pts flat
 *       Member Author = 0.5 pts flat
 */

export const calculateScopusSintaPoints = (pub: any): number => {
  if (pub.awarded_points !== undefined && pub.awarded_points !== null) {
    return Number(pub.awarded_points);
  }

  const role = pub.author_role === 'Member Author' || pub.author_role === 'Co-Author'
    ? 'Member Author'
    : (pub.author_role || 'Member Author');
  const totalAuthors = Number(pub.total_authors) || 1;
  const isHyper = !!pub.is_hyperauthor || totalAuthors > 16;
  const q = ['Q1','Q2','Q3','Q4'].includes(pub.quartile) ? pub.quartile : 'None';
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
    } else if (role === 'Single Author') {
      awardedPoints = 40;
    } else if (role === 'First Author') {
      const qFirstPoints: Record<string, number> = { Q1: 24, Q2: 22, Q3: 20, Q4: 18, None: 18 };
      awardedPoints = qFirstPoints[q] ?? 18;
    } else {
      // Member Author
      const qMemberPool: Record<string, number> = { Q1: 16, Q2: 14, Q3: 12, Q4: 10, None: 10 };
      const pool = qMemberPool[q] ?? 10;
      const memberCount = Math.max(1, totalAuthors - 1);
      awardedPoints = pool / memberCount;
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

  return Math.round(awardedPoints * 100) / 100;
};

export const calculateScholarPoints = (pub: any): number => {
  const citations = Number(pub.citations) || 0;
  const docPoints = 0.5;
  const citationBonus = citations > 0 ? 0.5 : 0;
  const citationPoints = Math.min(citations, 500) * 0.25;
  return docPoints + citationBonus + citationPoints;
};

export const normalizeTitle = (title: string): string => {
  return (title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
};
