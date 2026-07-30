import { useState, useEffect, useMemo } from 'react';
import { ScholarDocument, ScopusDocument } from '../external-documents.types';
import { normalizeTitle } from '../utils/calculations';

interface UseExternalDocumentsProps {
  publicationSubTab: 'scopus' | 'scholar' | 'cross_indexed' | 'metriks';
  publications: ScholarDocument[];
  scopusPublications: ScopusDocument[];
  isPublic?: boolean;
}

export function useExternalDocuments({
  publicationSubTab,
  publications,
  scopusPublications,
  isPublic = false,
}: UseExternalDocumentsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [scopusFilter, setScopusFilter] = useState<'all' | 'unconfirmed' | 'confirmed'>('all');
  const [articleFilter, setArticleFilter] = useState<'all' | 'article' | 'non-article'>('all');
  const currentYear = new Date().getFullYear();
  const [filterYearExt, setFilterYearExt] = useState<number | null>(null);

  // Reset page and year filter when switching tabs
  useEffect(() => {
    setCurrentPage(1);
    setFilterYearExt(null);
  }, [publicationSubTab]);

  const scopusList = scopusPublications || [];
  const scholarList = publications || [];

  const crossIndexedDocs = useMemo(() => {
    return scholarList.filter(scholarDoc => {
      const scholarTitle = normalizeTitle(scholarDoc.title);
      return scopusList.some(scopusDoc => normalizeTitle(scopusDoc.title) === scholarTitle);
    });
  }, [scholarList, scopusList]);

  const extractDocYear = (doc: any): number | null => {
    if (doc.year) {
      const y = typeof doc.year === 'number' ? doc.year : parseInt(doc.year, 10);
      if (!isNaN(y) && y > 1900 && y <= 2100) return y;
    }
    if (doc.published_at) {
      const y = new Date(doc.published_at).getFullYear();
      if (!isNaN(y) && y > 1900 && y <= 2100) return y;
    }
    if (doc.coverDate) {
      const y = new Date(doc.coverDate).getFullYear();
      if (!isNaN(y) && y > 1900 && y <= 2100) return y;
    }
    return null;
  };

  const availableYearsScopus = useMemo(() => {
    const yearsSet = new Set<number>();
    scopusList.forEach((d: any) => {
      const y = extractDocYear(d);
      if (y) yearsSet.add(y);
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [scopusList]);

  const availableYearsScholar = useMemo(() => {
    const yearsSet = new Set<number>();
    scholarList.forEach((d: any) => {
      const y = extractDocYear(d);
      if (y) yearsSet.add(y);
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [scholarList]);

  const availableYearsCross = useMemo(() => {
    const yearsSet = new Set<number>();
    crossIndexedDocs.forEach((d: any) => {
      const y = extractDocYear(d);
      if (y) yearsSet.add(y);
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [crossIndexedDocs]);

  const filteredScopusList = useMemo(() => {
    let result = scopusList;

    // Year filter
    if (filterYearExt) {
      result = result.filter((doc: any) => extractDocYear(doc) === filterYearExt);
    }

    // Korespondensi Filter
    if (scopusFilter === 'unconfirmed') {
      result = result.filter((doc: any) => {
        const totalAuthors = Number(doc.total_authors) || 1;
        const isArticle = !doc.subtype || doc.subtype.toLowerCase() === 'ar' || doc.subtype.toLowerCase() === 'article';
        return isArticle && totalAuthors > 1 && !doc.is_corresponding_confirmed;
      });
    } else if (scopusFilter === 'confirmed') {
      result = result.filter((doc: any) => {
        const totalAuthors = Number(doc.total_authors) || 1;
        const isArticle = !doc.subtype || doc.subtype.toLowerCase() === 'ar' || doc.subtype.toLowerCase() === 'article';
        return !isArticle || totalAuthors <= 1 || doc.is_corresponding_confirmed;
      });
    }

    // Article/Non-Article Filter
    if (articleFilter === 'article') {
      result = result.filter((doc: any) => {
        return !doc.subtype || doc.subtype.toLowerCase() === 'ar' || doc.subtype.toLowerCase() === 'article';
      });
    } else if (articleFilter === 'non-article') {
      result = result.filter((doc: any) => {
        return doc.subtype && doc.subtype.toLowerCase() !== 'ar' && doc.subtype.toLowerCase() !== 'article';
      });
    }

    return result;
  }, [scopusList, scopusFilter, articleFilter, filterYearExt]);

  const filteredScholarList = useMemo(() => {
    if (!filterYearExt) return scholarList;
    return scholarList.filter((doc: any) => extractDocYear(doc) === filterYearExt);
  }, [scholarList, filterYearExt]);

  const filteredCrossIndexedDocs = useMemo(() => {
    if (!filterYearExt) return crossIndexedDocs;
    return crossIndexedDocs.filter((doc: any) => extractDocYear(doc) === filterYearExt);
  }, [crossIndexedDocs, filterYearExt]);

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    scopusFilter,
    setScopusFilter,
    articleFilter,
    setArticleFilter,
    filterYearExt,
    setFilterYearExt,
    availableYearsScopus,
    availableYearsScholar,
    availableYearsCross,
    scopusList,
    scholarList,
    crossIndexedDocs,
    filteredScopusList,
    filteredScholarList,
    filteredCrossIndexedDocs,
  };
}
