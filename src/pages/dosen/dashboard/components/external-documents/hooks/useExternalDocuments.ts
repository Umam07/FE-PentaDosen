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
  const [filterYearExt, setFilterYearExt] = useState<number | null>(isPublic ? null : currentYear);

  // Reset page and year filter when switching tabs
  useEffect(() => {
    setCurrentPage(1);
    setFilterYearExt(isPublic ? null : new Date().getFullYear());
  }, [publicationSubTab, isPublic]);

  const availableYearsScopus = useMemo(() => {
    return [currentYear];
  }, [currentYear, currentYear]);

  const availableYearsScholar = useMemo(() => {
    return [currentYear];
  }, [currentYear, currentYear]);

  const availableYearsCross = useMemo(() => {
    return [currentYear];
  }, [currentYear, currentYear]);

  const scopusList = scopusPublications || [];
  const scholarList = publications || [];

  const crossIndexedDocs = useMemo(() => {
    return scholarList.filter(scholarDoc => {
      const scholarTitle = normalizeTitle(scholarDoc.title);
      return scopusList.some(scopusDoc => normalizeTitle(scopusDoc.title) === scholarTitle);
    });
  }, [scholarList, scopusList]);

  const filteredScopusList = useMemo(() => {
    let result = scopusList;

    // Year filter
    if (filterYearExt) {
      result = result.filter((doc: any) => Number(doc.year) === filterYearExt);
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
    return scholarList.filter((doc: any) => Number(doc.year) === filterYearExt);
  }, [scholarList, filterYearExt]);

  const filteredCrossIndexedDocs = useMemo(() => {
    if (!filterYearExt) return crossIndexedDocs;
    return crossIndexedDocs.filter((doc: any) => Number(doc.year) === filterYearExt);
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
