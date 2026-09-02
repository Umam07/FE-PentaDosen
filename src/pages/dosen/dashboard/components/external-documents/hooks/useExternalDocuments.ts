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
  const [searchTerm, setSearchTerm] = useState('');
  const [scopusFilter, setScopusFilter] = useState<'all' | 'unconfirmed' | 'confirmed'>('all');
  const [articleFilter, setArticleFilter] = useState<'all' | 'article' | 'non-article'>('all');
  const currentYear = new Date().getFullYear();
  const [filterYearExt, setFilterYearExt] = useState<number | null>(null);

  // Reset page and year/search filter when switching tabs
  useEffect(() => {
    setCurrentPage(1);
    setFilterYearExt(null);
    setSearchTerm('');
  }, [publicationSubTab]);

  const allScopus = scopusPublications || [];
  const allScholar = publications || [];

  const crossIndexedTitles = useMemo(() => {
    const scopusTitleSet = new Set(allScopus.map(s => normalizeTitle(s.title)));
    return new Set(
      allScholar
        .filter(sch => scopusTitleSet.has(normalizeTitle(sch.title)))
        .map(sch => normalizeTitle(sch.title))
    );
  }, [allScopus, allScholar]);

  const scopusList = useMemo(() => {
    return allScopus.filter(doc => !crossIndexedTitles.has(normalizeTitle(doc.title)));
  }, [allScopus, crossIndexedTitles]);

  const scholarList = useMemo(() => {
    return allScholar.filter(doc => !crossIndexedTitles.has(normalizeTitle(doc.title)));
  }, [allScholar, crossIndexedTitles]);

  const crossIndexedDocs = useMemo(() => {
    return allScholar.filter(scholarDoc => crossIndexedTitles.has(normalizeTitle(scholarDoc.title)));
  }, [allScholar, crossIndexedTitles]);

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

    // Search filter: hanya judul artikel / publikasi
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((doc: any) =>
        Boolean(doc.title && doc.title.toLowerCase().includes(q))
      );
    }

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
  }, [scopusList, scopusFilter, articleFilter, filterYearExt, searchTerm]);

  const filteredScholarList = useMemo(() => {
    let result = scholarList;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((doc: any) =>
        Boolean(doc.title && doc.title.toLowerCase().includes(q))
      );
    }
    if (filterYearExt) {
      result = result.filter((doc: any) => extractDocYear(doc) === filterYearExt);
    }
    return result;
  }, [scholarList, filterYearExt, searchTerm]);

  const filteredCrossIndexedDocs = useMemo(() => {
    let result = crossIndexedDocs;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((doc: any) =>
        Boolean(doc.title && doc.title.toLowerCase().includes(q))
      );
    }
    if (filterYearExt) {
      result = result.filter((doc: any) => extractDocYear(doc) === filterYearExt);
    }
    return result;
  }, [crossIndexedDocs, filterYearExt, searchTerm]);

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
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
