import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DepartmentItem } from '../types';
import { fetchFakultasStats } from '../services/departementService';
import { FAKULTAS_METADATA, DEFAULT_NAMES } from '../constants';

export const useDepartementList = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mengambil dan menggabungkan data statistik dari API dengan metadata statis
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const result = await fetchFakultasStats();
        const apiData = result.data || [];

        const statsMap = new Map<string, any>(
          apiData.map(d => [d.fakultas, d])
        );

        const merged: DepartmentItem[] = DEFAULT_NAMES.map(name => {
          const stats = statsMap.get(name) || { dosen_count: 0, research_count: 0, total_points: 0 };
          const meta = FAKULTAS_METADATA[name];
          
          return {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            ...meta,
            lecturerCount: stats.dosen_count || 0,
            researchCount: stats.research_count || 0,
            totalKPI: stats.total_points || 0
          };
        });

        setDepartments(merged);
      } catch (error) {
        console.error('Failed to fetch department stats', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Sinkronisasi kata kunci pencarian dari query params URL
  useEffect(() => {
    const searchVal = searchParams.get('search');
    if (searchVal !== null) {
      setSearch(searchVal);
    }
  }, [searchParams]);

  // Melakukan filter fakultas berdasarkan nama
  const filteredDepartments = useMemo(() => {
    return departments.filter(d => 
      d.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [departments, search]);

  return {
    search,
    setSearch,
    departments,
    filteredDepartments,
    loading
  };
};
