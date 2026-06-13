export const calculateScopusSintaPoints = (pub: any): number => {
  if (pub.awarded_points !== undefined && pub.awarded_points !== null) {
    return Number(pub.awarded_points);
  }

  const role = pub.author_role === 'Member Author' || pub.author_role === 'Co-Author' 
    ? 'Member Author' 
    : (pub.author_role || 'Member Author');
  const totalAuthors = Number(pub.total_authors) || 1;
  const isHyper = !!pub.is_hyperauthor || totalAuthors > 16;
  const q = pub.quartile || 'Q4';
  
  const isArticle = !pub.subtype || pub.subtype.toLowerCase() === 'ar' || pub.subtype.toLowerCase() === 'article';
  
  let basePoints = 0;
  if (isArticle) {
    if (role === 'Single Author') {
      basePoints = 40;
    } else if (isHyper) {
      basePoints = role === 'First Author' ? 24 : 1;
    } else {
      const quartile = ['Q1', 'Q2', 'Q3', 'Q4'].includes(q) ? q : 'Q4';
      if (role === 'First Author') {
        if (quartile === 'Q1') basePoints = 24;
        else if (quartile === 'Q2') basePoints = 22;
        else if (quartile === 'Q3') basePoints = 20;
        else basePoints = 18;
      } else {
        if (quartile === 'Q1') basePoints = 16;
        else if (quartile === 'Q2') basePoints = 14;
        else if (quartile === 'Q3') basePoints = 12;
        else basePoints = 10;
      }
    }
  } else {
    if (role === 'Single Author') basePoints = 30;
    else if (role === 'First Author') basePoints = 18;
    else basePoints = 12;
  }
  
  const citations = Number(pub.citations) || 0;
  const citationPoints = totalAuthors > 0 ? (citations / totalAuthors) : 0;
  const citationBonus = citations > 0 ? 5 : 0;
  
  return basePoints + citationPoints + citationBonus;
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
