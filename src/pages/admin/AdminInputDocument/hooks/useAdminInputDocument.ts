import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { formatToYYYYMMDD } from '../../../../components/ui/DatePicker';
import {
  Award, Zap, Shield, FileText, Home, Landmark, Globe, Book, BookMarked
} from 'lucide-react';
import type {
  AdminUser, LecturerUser, CategoryWeight, MainCategoryOption,
  SubCategoryOption, ImportProgress, ImportResult, ImportErrorDetail
} from '../types/adminInputDocument.types';
import {
  fetchAdminLecturers, fetchCategoryWeights, submitDocument, importBatchRow
} from '../services/adminInputDocumentService';
import {
  downloadExcelTemplate, calculateScoringPreview
} from '../utils/adminInputDocumentUtils';

export function useAdminInputDocument(adminUser: AdminUser) {
  const [users, setUsers] = useState<LecturerUser[]>([]);
  const [weights, setWeights] = useState<CategoryWeight[]>([]);

  // Form States
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState('');
  const [mainCategory, setMainCategory] = useState('Penelitian');
  const [isMainCategoryDropdownOpen, setIsMainCategoryDropdownOpen] = useState(false);
  const [subCategory, setSubCategory] = useState('');
  const [hkiType, setHkiType] = useState('');
  const [inventorName, setInventorName] = useState('');
  const [dateVal, setDateVal] = useState<Date | undefined>(new Date());
  const [docType, setDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [file, setFile] = useState<File | null>(null);

  // Penelitian Specific States
  const [danaDisetujui, setDanaDisetujui] = useState('');
  const [fokus, setFokus] = useState('kesehatan');

  // UI States
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isDragging, setIsDragging] = useState(false);

  // Tab State
  const [activeInputTab, setActiveInputTab] = useState<'manual' | 'import'>('manual');

  // Import States
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<ImportProgress>({ total: 0, current: 0 });
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  // Initial Data Fetching
  useEffect(() => {
    const loadData = async () => {
      try {
        setFetchingUsers(true);
        const [usersData, weightsData] = await Promise.all([
          fetchAdminLecturers(adminUser.role, adminUser.id),
          fetchCategoryWeights()
        ]);
        setUsers(usersData);
        setWeights(weightsData);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingUsers(false);
      }
    };
    loadData();
  }, [adminUser.role, adminUser.id]);

  // Click Outside Handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsMainCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered Users for Searchable Dropdown
  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.fakultas && u.fakultas.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm]);

  // Sub-category Options
  const subCategoryOptions: SubCategoryOption[] = useMemo(() => {
    if (mainCategory === 'HKI') {
      return [
        { id: 'HKI Paten', label: 'Paten', pts: 40, icon: Award },
        { id: 'HKI Paten Sederhana', label: 'Paten Sederhana', pts: 28, icon: Zap },
        { id: 'HKI Merk', label: 'Merk', pts: 12, icon: Shield },
        { id: 'HKI Hak Cipta', label: 'Hak Cipta', pts: 5, icon: FileText },
      ];
    }
    if (mainCategory === 'Penelitian') {
      return [
        { id: 'hibah internal', label: 'Internal Institusi', pts: 3, icon: Home },
        { id: 'hibah dikti', label: 'Eksternal (Dikti)', pts: 6, icon: Landmark },
        { id: 'hibah luar negeri', label: 'Luar Negeri', pts: 10, icon: Globe },
      ];
    }
    if (mainCategory === 'Buku') {
      return [
        { id: 'Buku Referensi', label: 'Buku Referensi', pts: 40, icon: Book },
        { id: 'Buku Ajar', label: 'Buku Ajar', pts: 20, icon: Book },
        { id: 'Buku Monograf', label: 'Buku Monograf', pts: 20, icon: Book },
      ];
    }
    return weights
      .filter(w => w.category.toLowerCase().includes(mainCategory.toLowerCase()))
      .map(w => ({
        id: w.category,
        label: w.category,
        pts: w.weight_value,
        icon: mainCategory === 'Jurnal Internasional' ? Globe : BookMarked
      }));
  }, [mainCategory, weights]);

  // Sync Sub-category on Main Category change
  useEffect(() => {
    if (subCategoryOptions.length > 0) {
      setSubCategory(subCategoryOptions[0].id);
    } else {
      setSubCategory('');
    }
  }, [subCategoryOptions]);

  // Scoring Preview
  const scoringPreview = useMemo(() => {
    return calculateScoringPreview(mainCategory, subCategory, subCategoryOptions, docType);
  }, [mainCategory, subCategory, subCategoryOptions, docType]);

  // Handlers
  const handleDownloadTemplate = useCallback(async () => {
    await downloadExcelTemplate(mainCategory, users, weights);
  }, [mainCategory, users, weights]);

  const processFileImport = useCallback(async (importFile: File) => {
    setIsImporting(true);
    setImportResult(null);
    setMessage('Membaca file excel...');
    setMessageType('success');

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          setMessage('File excel kosong.');
          setMessageType('error');
          setIsImporting(false);
          return;
        }

        setImportProgress({ total: data.length, current: 0 });
        let successCount = 0;
        let failCount = 0;
        const errorList: ImportErrorDetail[] = [];

        for (let i = 0; i < data.length; i++) {
          const row: any = data[i];
          const rowNum = i + 2;

          let titleVal = '';
          let endpoint = '';
          const formData = new FormData();

          const rowPentaId = (row['Penta ID'] || '').toString().trim();

          if (!rowPentaId) {
            failCount++;
            errorList.push({
              row: rowNum,
              title: row['Judul Penelitian'] || row['Judul Publikasi'] || row['Judul HKI'] || row['Judul Buku'] || `Baris ${rowNum}`,
              reason: 'Penta ID kosong'
            });
            setImportProgress({ total: data.length, current: i + 1 });
            continue;
          }

          const matchedUser = users.find(u => u.penta_id && u.penta_id.toLowerCase() === rowPentaId.toLowerCase());

          if (!matchedUser) {
            failCount++;
            errorList.push({
              row: rowNum,
              title: row['Judul Penelitian'] || row['Judul Publikasi'] || row['Judul HKI'] || row['Judul Buku'] || `Baris ${rowNum}`,
              reason: `Dosen dengan Penta ID "${rowPentaId}" tidak ditemukan`
            });
            setImportProgress({ total: data.length, current: i + 1 });
            continue;
          }

          formData.append('user_id', matchedUser.id);
          formData.append('status', 'Approved');

          if (mainCategory === 'Penelitian') {
            titleVal = row['Judul Penelitian'] || '';
            formData.append('judul_penelitian', titleVal);
            formData.append('dana_disetujui', (row['Dana Disetujui'] || '').toString().replace(/\D/g, ''));
            formData.append('program', (row['Program'] || '').toLowerCase());
            formData.append('skema', (row['Skema'] || 'kompetisi').toLowerCase());
            formData.append('fokus', (row['Fokus'] || 'kesehatan').toLowerCase());
            formData.append('tahun', (row['Tahun'] || new Date().getFullYear()).toString());
            endpoint = '/api/penelitian';
          } else {
            let titleKey = 'Judul Publikasi';
            let catKey = 'Kategori';
            let yearKey = 'Tahun Terbit';
            let defaultCat = 'Jurnal Internasional';

            if (mainCategory === 'HKI') {
              titleKey = 'Judul HKI';
              catKey = 'Kategori HKI';
              yearKey = 'Tahun Perolehan';
              defaultCat = 'HKI Paten';
            } else if (mainCategory === 'Buku') {
              titleKey = 'Judul Buku';
              catKey = 'Kategori';
              yearKey = 'Tahun Terbit';
              defaultCat = 'Buku Referensi';
            }

            titleVal = row[titleKey] || '';
            formData.append('title', titleVal);
            formData.append('category', row[catKey] || defaultCat);
            formData.append('published_at', `${row[yearKey] || new Date().getFullYear()}-01-01`);
            formData.append('doc_type', (row['Tipe Dokumen'] || 'kpi').toLowerCase());
            endpoint = '/api/documents';
          }

          const result = await importBatchRow(endpoint, formData);

          if (result.ok) {
            successCount++;
          } else {
            failCount++;
            let reason = 'Gagal menyimpan ke database';
            if (result.data?.errors) {
              const firstErrorKey = Object.keys(result.data.errors)[0];
              reason = result.data.errors[firstErrorKey][0];
            } else if (result.data?.message) {
              reason = result.data.message;
            }
            errorList.push({
              row: rowNum,
              title: titleVal || `Baris ${rowNum}`,
              reason
            });
          }

          setImportProgress({ total: data.length, current: i + 1 });
        }

        setImportResult({
          success: successCount,
          failed: failCount,
          errors: errorList
        });

        if (failCount === 0) {
          setMessage(`Import selesai! Semua data (${successCount}) berhasil diimpor.`);
          setMessageType('success');
        } else {
          setMessage(`Import selesai. Berhasil: ${successCount}, Gagal: ${failCount}. Detail kesalahan di bawah.`);
          setMessageType('error');
        }
      } catch (err) {
        console.error(err);
        setMessage('Terjadi kesalahan saat mengimpor excel.');
        setMessageType('error');
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsBinaryString(importFile);
  }, [users, mainCategory]);

  const handleImportExcel = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const importFile = e.target.files?.[0];
    if (!importFile) return;
    await processFileImport(importFile);
    if (e.target) e.target.value = '';
  }, [processFileImport]);

  const handleUploadManual = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !file || !title || !mainCategory || !dateVal) {
      setMessage('Harap lengkapi semua field.');
      setMessageType('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', selectedUserId);
    formData.append('status', 'Approved');

    let endpoint = '/api/documents';

    if (mainCategory === 'Penelitian') {
      endpoint = '/api/penelitian';
      formData.append('judul_penelitian', title);
      formData.append('dana_disetujui', danaDisetujui.replace(/\D/g, ''));
      formData.append('program', subCategory);
      formData.append('skema', 'kompetisi');
      formData.append('fokus', fokus);
      formData.append('tahun', dateVal ? formatToYYYYMMDD(dateVal) : '');
    } else {
      formData.append('title', title);
      formData.append('category', subCategory);
      if (mainCategory === 'HKI') {
        formData.append('hki_type', hkiType);
        formData.append('inventor_name', inventorName);
      }
      formData.append('published_at', dateVal ? formatToYYYYMMDD(dateVal) : '');
      formData.append('doc_type', docType);
    }

    try {
      setLoading(true);
      const result = await submitDocument(endpoint, formData);
      if (result.ok) {
        setMessage('Dokumen/Penelitian dosen berhasil diinput dan disetujui otomatis!');
        setMessageType('success');
        setTitle('');
        setFile(null);
        setDanaDisetujui('');
        setHkiType('');
        setInventorName('');
        setDateVal(new Date());
      } else {
        setMessage(result.data?.message || 'Gagal menginput data.');
        setMessageType('error');
      }
    } catch {
      setMessage('Terjadi kesalahan saat menginput.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, [selectedUserId, file, title, mainCategory, dateVal, danaDisetujui, subCategory, fokus, hkiType, inventorName, docType]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDropManual = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDropImport = useCallback((importFile: File) => {
    setIsDragging(false);
    processFileImport(importFile);
  }, [processFileImport]);

  return {
    users,
    filteredUsers,
    weights,
    selectedUserId,
    setSelectedUserId,
    searchTerm,
    setSearchTerm,
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef,
    categoryDropdownRef,
    title,
    setTitle,
    mainCategory,
    setMainCategory,
    isMainCategoryDropdownOpen,
    setIsMainCategoryDropdownOpen,
    subCategory,
    setSubCategory,
    subCategoryOptions,
    hkiType,
    setHkiType,
    inventorName,
    setInventorName,
    dateVal,
    setDateVal,
    docType,
    setDocType,
    file,
    setFile,
    danaDisetujui,
    setDanaDisetujui,
    fokus,
    setFokus,
    loading,
    fetchingUsers,
    message,
    messageType,
    isDragging,
    activeInputTab,
    setActiveInputTab,
    isImporting,
    importProgress,
    importResult,
    scoringPreview,
    handleDownloadTemplate,
    handleImportExcel,
    handleUploadManual,
    handleDragOver,
    handleDragLeave,
    handleDropManual,
    handleDropImport,
  };
}
