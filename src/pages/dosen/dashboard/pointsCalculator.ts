/**
 * Calculate Scopus/SINTA points using the 60/40 author-role schema.
 *
 * Schema:
 *   Max base points: Article = 40 pts, Non-Article = 30 pts
 *   - Single Author  : 100% of max base points
 *   - First Author   : 60% of max base points
 *   - Member Author  : 40% of max base points ÷ number of member authors (totalAuthors - 1)
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
  const isArticle = !pub.subtype || pub.subtype.toLowerCase() === 'ar' || pub.subtype.toLowerCase() === 'article';

  const maxPoints = isArticle ? 40 : 30;

  let awardedPoints = 0;
  if (isHyper) {
    if (role === 'Single Author') awardedPoints = maxPoints;
    else if (role === 'First Author') awardedPoints = 2;
    else awardedPoints = 0.5;
  } else if (role === 'Single Author') {
    awardedPoints = maxPoints;        // 100%
  } else if (role === 'First Author') {
    awardedPoints = maxPoints * 0.60; // 60%
  } else {
    // Member Authors share 40% equally
    const memberCount = Math.max(1, totalAuthors - 1);
    awardedPoints = (maxPoints * 0.40) / memberCount;
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
