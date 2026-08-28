import React, { useState, useMemo } from 'react';
import { 
  Upload, Sparkles, Archive, AlertCircle, 
  CalendarDays, Award, FileText, XCircle, BarChart3,
  Globe, BookOpen, UserCheck, Link as LinkIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BaseFormModal } from '../../../../components/shared/BaseFormModal';
import { DatePicker, formatToYYYYMMDD } from '../../../../components/ui/DatePicker';
import { uploadWithProgress } from '../../../../lib/utils';
import type { UserSession, PublicationDoc, WeightCategory } from '../types/publication.types';
import CoAuthorsSelector, { CoAuthorItem } from './CoAuthorsSelector';

interface PublicationUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession;
  documents: PublicationDoc[];
  category: string;
  weights: WeightCategory[];
  isWeightsLoading?: boolean;
  fetchDocuments: () => Promise<void>;
  setIsTableLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onShowMessage: (msg: string, type: 'success' | 'error') => void;
}

export default function PublicationUploadModal({
  isOpen,
  onClose,
  user,
  documents,
  category,
  weights,
  fetchDocuments,
  setIsTableLoading,
  setCurrentPage,
  onShowMessage
}: PublicationUploadModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [docType, setDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [sintaRank, setSintaRank] = useState<string>('Non-SINTA');
  const [citations, setCitations] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  // Field Khusus Jurnal Internasional (Scopus Metrics)
  const [quartile, setQuartile] = useState<string>('Q1');
  const [subtype, setSubtype] = useState<'Article' | 'Non-Article'>('Article');
  const [authorRole, setAuthorRole] = useState<'Single Author' | 'First Author' | 'Member Author'>('Single Author');
  const [authorOrder, setAuthorOrder] = useState<number>(1);
  const [isCorresponding, setIsCorresponding] = useState<boolean>(true);
  const [isHyperauthor, setIsHyperauthor] = useState<boolean>(false);
  const [journal, setJournal] = useState<string>('');
  const [doi, setDoi] = useState<string>('');
  const [coAuthors, setCoAuthors] = useState<CoAuthorItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const isNationalJournal = useMemo(() => {
    return (category || '').toLowerCase().includes('jurnal nasional');
  }, [category]);

  const isInternationalJournal = useMemo(() => {
    return (category || '').toLowerCase().includes('jurnal internasional');
  }, [category]);

  // Total jumlah penulis dihitung otomatis dari akun pengunggah (1) + jumlah rekan yang ditambahkan
  const calculatedTotalAuthors = useMemo(() => {
    return coAuthors.length + 1;
  }, [coAuthors]);

  // Handler saat rekan ditambah/dihapus secara langsung
  const handleCoAuthorsChange = (newCoAuthors: CoAuthorItem[]) => {
    setCoAuthors(newCoAuthors);
    const newTotal = newCoAuthors.length + 1;
    if (newCoAuthors.length > 0) {
      if (authorRole === 'Single Author') {
        setAuthorRole('First Author');
        setAuthorOrder(1);
      } else if (authorRole === 'Member Author' && authorOrder > newTotal) {
        setAuthorOrder(newTotal);
      }
    } else {
      setAuthorRole('Single Author');
      setAuthorOrder(1);
    }
    if (newTotal > 16) {
      setIsHyperauthor(true);
    }
  };

  // Handler saat urutan penulis di-Drag-and-Drop atau digeser Up/Down
  const handleOrderChange = (
    newRole: 'Single Author' | 'First Author' | 'Member Author',
    newOrder: number,
    newCoAuthors: CoAuthorItem[]
  ) => {
    setAuthorRole(newRole);
    setAuthorOrder(newOrder);
    setCoAuthors(newCoAuthors);
  };

  const modalSubtitle = useMemo(() => {
    if (!category) return 'Daftarkan Jurnal Ilmiah, Prosiding, atau Book Chapter';
    const catLower = category.toLowerCase();

    if (isNationalJournal) {
      const sintaPointsMap: Record<string, number> = {
        S1: 25,
        S2: 25,
        S3: 20,
        S4: 20,
        S5: 15,
        S6: 15,
        'Non-SINTA': 10
      };
      const pts = sintaPointsMap[sintaRank] ?? 10;
      return `Daftarkan ${catLower} Anda · Max +${pts} pts (${sintaRank})`;
    }

    const activeWeight = weights.find((w) => w.category === category);
    const points = activeWeight?.weight_value;

    if (points !== undefined && points !== null) {
      return `Daftarkan ${catLower} Anda · +${points} pts otomatis`;
    }
    return `Daftarkan ${catLower} Anda`;
  }, [category, isNationalJournal, sintaRank, weights]);

  const duplicateFound = useMemo(() => {
    if (!title || title.length < 5) return null;
    return documents.find((doc: PublicationDoc) => 
      doc.title.toLowerCase().trim() === title.toLowerCase().trim() && 
      doc.is_kpi_counted
    );
  }, [title, documents]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        onShowMessage('Hanya file PDF yang diperbolehkan.', 'error');
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !category || !date) {
      onShowMessage('Harap lengkapi semua field yang berbintang.', 'error');
      return;
    }

    if (duplicateFound) {
      onShowMessage('Dokumen ini sudah terdata dalam sistem.', 'error');
      return;
    }

    const effectiveOrder = authorRole === 'Single Author' || authorRole === 'First Author'
      ? 1
      : Math.min(Math.max(2, authorOrder), calculatedTotalAuthors);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('user_id', String(user.id));
    formData.append('published_at', date ? formatToYYYYMMDD(date) : '');
    formData.append('doc_type', docType);

    if (isNationalJournal) {
      if (sintaRank) formData.append('sinta_rank', sintaRank);
      if (citations !== '') formData.append('citations', citations);
    } else if (isInternationalJournal) {
      formData.append('quartile', quartile);
      formData.append('subtype', subtype);
      formData.append('author_role', authorRole);
      formData.append('author_order', String(effectiveOrder));
      formData.append('total_authors', String(calculatedTotalAuthors));
      formData.append('is_corresponding', isCorresponding ? '1' : '0');
      formData.append('is_hyperauthor', isHyperauthor ? '1' : '0');
      if (journal) formData.append('journal', journal);
      if (doi) formData.append('doi', doi);
      if (citations !== '') formData.append('citations', citations);

      // Susun urutan penulis sesuai posisi persis yang terlihat di layar
      const fullList: string[] = [];
      const internalCoAuthorsData: Array<{ user_id: number | string; name: string; order: number; role: string }> = [];
      let coIdx = 0;
      for (let pos = 1; pos <= calculatedTotalAuthors; pos++) {
        if (pos === effectiveOrder) {
          fullList.push(user.name || 'Penulis');
        } else if (coIdx < coAuthors.length) {
          const co = coAuthors[coIdx];
          fullList.push(co.name);
          if (co.isInternal && co.id && String(co.id).length > 0) {
            internalCoAuthorsData.push({
              user_id: co.id,
              name: co.name,
              order: pos,
              role: pos === 1 ? 'First Author' : 'Member Author',
            });
          }
          coIdx++;
        }
      }
      formData.append('authors', fullList.join('; '));
      if (internalCoAuthorsData.length > 0) {
        formData.append('co_authors_data', JSON.stringify(internalCoAuthorsData));
      }
    }

    try {
      setLoading(true);
      setUploadProgress(0);
      const res = await uploadWithProgress('/api/documents', 'POST', formData, setUploadProgress);
      
      if (res.ok) {
        await new Promise((r) => setTimeout(r, 400));
        onShowMessage(res.data?.message || 'Publikasi berhasil diunggah!', 'success');
        setTitle('');
        setFile(null);
        setDate(new Date());
        setSintaRank('Non-SINTA');
        setCitations('');
        setJournal('');
        setDoi('');
        setCoAuthors([]);
        setQuartile('Q1');
        setSubtype('Article');
        setAuthorRole('Single Author');
        setAuthorOrder(1);
        setIsCorresponding(true);
        setIsHyperauthor(false);
        onClose();
        
        setIsTableLoading(true);
        await fetchDocuments();
        setCurrentPage(1);
        setIsTableLoading(false);
      } else {
        onShowMessage(res.data?.message || 'Gagal mengunggah dokumen.', 'error');
      }
    } catch {
      onShowMessage('Terjadi kesalahan saat mengunggah.', 'error');
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Unggah Publikasi Baru"
      subtitle={modalSubtitle}
      icon={Upload}
      maxWidthClass="max-w-4xl"
    >
      <form onSubmit={handleUpload} className="space-y-4 sm:space-y-5">
        {duplicateFound && (
          <div className="p-3 rounded-xl bg-warning-soft dark:bg-warning/15 border border-warning-border dark:border-warning/30 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-warning dark:text-warning-on-dark shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-ink-heading dark:text-on-dark">Dokumen Sudah Terdata</p>
              <p className="text-[11px] text-body dark:text-on-dark-soft leading-relaxed mt-0.5">
                Dokumen dengan judul ini sudah terhitung dalam poin KPI.
              </p>
            </div>
          </div>
        )}

        {/* Tipe Penilaian Dokumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDocType('kpi')}
            className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
              docType === 'kpi'
                ? 'border-ink dark:border-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated ring-2 ring-ink/10 dark:ring-on-dark/10'
                : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-ink-border dark:hover:border-hairline-light'
            }`}
          >
            <Sparkles className="w-4 h-4 text-warning dark:text-warning-on-dark" />
            <div className="text-left">
              <p className="text-xs font-bold text-ink-heading dark:text-on-dark">KPI Dosen</p>
              <p className="text-[10px] text-muted dark:text-on-dark-muted">Automated Scoring Masuk KPI</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDocType('arsip')}
            className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
              docType === 'arsip'
                ? 'border-ink dark:border-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated ring-2 ring-ink/10 dark:ring-on-dark/10'
                : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark hover:border-ink-border dark:hover:border-hairline-light'
            }`}
          >
            <Archive className="w-4 h-4 text-muted dark:text-on-dark-muted" />
            <div className="text-left">
              <p className="text-xs font-bold text-ink-heading dark:text-on-dark">Arsip Umum</p>
              <p className="text-[10px] text-muted dark:text-on-dark-muted">Penyimpanan Saja (0 Poin)</p>
            </div>
          </button>
        </div>

        {/* Judul Publikasi */}
        <div className="space-y-1.5">
          <label htmlFor="pub-title" className="text-xs font-semibold text-body dark:text-on-dark-soft">
            Judul Publikasi <span className="text-error ml-0.5">*</span>
          </label>
          <input 
            type="text"
            id="pub-title"
            required
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Masukkan judul publikasi..."
            className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark" 
          />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            KHUSUS JURNAL INTERNASIONAL (SCOPUS METRICS)
           ══════════════════════════════════════════════════════════════ */}
        {isInternationalJournal && (
          <div className="p-4 sm:p-5 rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised/40 dark:bg-surface-dark-elevated/20 space-y-4">
            <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-2.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent dark:text-accent-on-dark" />
                <h4 className="text-xs font-bold text-ink-heading dark:text-on-dark tracking-tight">
                  Parameter Publikasi Jurnal Internasional (Scopus)
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-accent-soft dark:bg-accent/20 text-accent dark:text-accent-on-dark font-semibold border border-accent/20">
                Total {calculatedTotalAuthors} Penulis
              </span>
            </div>

            {/* Row 1: Quartile & Subtype */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label htmlFor="pub-quartile" className="text-xs font-semibold text-body dark:text-on-dark-soft flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-warning dark:text-warning-on-dark" />
                  Quartile Scopus <span className="text-error ml-0.5">*</span>
                </label>
                <select
                  id="pub-quartile"
                  value={quartile}
                  onChange={(e) => setQuartile(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:ring-2 focus:ring-accent/15 focus:border-accent outline-none text-xs text-ink-heading dark:text-on-dark cursor-pointer font-mono"
                >
                  <option value="Q1">Q1 — Quartile 1 (Base 40 Pts)</option>
                  <option value="Q2">Q2 — Quartile 2 (Base 38 Pts)</option>
                  <option value="Q3">Q3 — Quartile 3 (Base 35 Pts)</option>
                  <option value="Q4">Q4 — Quartile 4 (Base 33 Pts)</option>
                  <option value="None">Tanpa Quartile / Scopus Non-Q (Base 33 Pts)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="pub-subtype" className="text-xs font-semibold text-body dark:text-on-dark-soft flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted" />
                  Tipe Dokumen (Subtype) <span className="text-error ml-0.5">*</span>
                </label>
                <select
                  id="pub-subtype"
                  value={subtype}
                  onChange={(e) => setSubtype(e.target.value as 'Article' | 'Non-Article')}
                  className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:ring-2 focus:ring-accent/15 focus:border-accent outline-none text-xs text-ink-heading dark:text-on-dark cursor-pointer"
                >
                  <option value="Article">Article (Artikel Jurnal Ilmiah)</option>
                  <option value="Non-Article">Non-Article (Conference Proceeding / Review / Book Chapter)</option>
                </select>
              </div>
            </div>

            {/* Row 2: Peran Penulis & Penulis Korespondensi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label htmlFor="pub-author-role" className="text-xs font-semibold text-body dark:text-on-dark-soft">
                  Peran Penulis Anda <span className="text-error ml-0.5">*</span>
                </label>
                <select
                  id="pub-author-role"
                  value={authorRole}
                  onChange={(e) => {
                    const role = e.target.value as 'Single Author' | 'First Author' | 'Member Author';
                    setAuthorRole(role);
                    if (role === 'Single Author' || role === 'First Author') {
                      setAuthorOrder(1);
                    } else if (role === 'Member Author') {
                      if (authorOrder <= 1) setAuthorOrder(2);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:ring-2 focus:ring-accent/15 focus:border-accent outline-none text-xs text-ink-heading dark:text-on-dark cursor-pointer"
                >
                  <option value="Single Author">Single Author (Penulis Tunggal)</option>
                  <option value="First Author">First Author (Penulis Pertama / Utama)</option>
                  <option value="Member Author">Member Author (Penulis Anggota / Rekan)</option>
                </select>
              </div>

              {/* Status Corresponding Author */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-body dark:text-on-dark-soft flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-accent" />
                  Penulis Korespondensi (Corresponding Author)?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCorresponding(true)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isCorresponding
                        ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs'
                        : 'bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark'
                    }`}
                  >
                    ✓ Ya
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCorresponding(false)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      !isCorresponding
                        ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs'
                        : 'bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark'
                    }`}
                  >
                    ✕ Bukan
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Susunan & Anggota Penulis dengan Drag & Drop Reordering */}
            <CoAuthorsSelector
              currentUser={user}
              coAuthors={coAuthors}
              onChange={handleCoAuthorsChange}
              authorRole={authorRole}
              authorOrder={authorOrder}
              onOrderChange={handleOrderChange}
            />

            {/* Row 4: Metadata Jurnal & DOI & Citations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              <div className="space-y-1.5">
                <label htmlFor="pub-journal" className="text-xs font-semibold text-body dark:text-on-dark-soft">
                  Nama Jurnal Ilmiah (Opsional)
                </label>
                <input
                  type="text"
                  id="pub-journal"
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  placeholder="Contoh: IEEE Access / Nature..."
                  className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:ring-2 focus:ring-accent/15 focus:border-accent outline-none text-xs text-ink-heading dark:text-on-dark"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="pub-doi" className="text-xs font-semibold text-body dark:text-on-dark-soft flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-muted" /> DOI Publikasi (Opsional)
                </label>
                <input
                  type="text"
                  id="pub-doi"
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  placeholder="10.xxxx/xxxxxxx"
                  className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:ring-2 focus:ring-accent/15 focus:border-accent outline-none text-xs text-ink-heading dark:text-on-dark font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="pub-citations-international" className="text-xs font-semibold text-body dark:text-on-dark-soft flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" /> Jumlah Sitasi (Opsional)
                </label>
                <input
                  type="number"
                  id="pub-citations-international"
                  min="0"
                  value={citations}
                  onChange={(e) => setCitations(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:ring-2 focus:ring-accent/15 focus:border-accent outline-none text-xs text-ink-heading dark:text-on-dark font-mono"
                />
              </div>
            </div>

            {/* Checkbox Hyperauthorship */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="pub-hyperauthor"
                checked={isHyperauthor}
                onChange={(e) => setIsHyperauthor(e.target.checked)}
                className="w-4 h-4 rounded text-accent focus:ring-accent cursor-pointer"
              />
              <label htmlFor="pub-hyperauthor" className="text-xs text-body dark:text-on-dark-soft cursor-pointer">
                Publikasi Kolaborasi Masif / Hyperauthor (&gt;16 Penulis — Flat Rate 40/24/1 Pts)
              </label>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            KHUSUS JURNAL NASIONAL (SINTA & CITATIONS)
           ══════════════════════════════════════════════════════════════ */}
        {isNationalJournal && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label htmlFor="pub-sinta-rank" className="text-xs font-semibold text-body dark:text-on-dark-soft flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-warning dark:text-warning-on-dark" />
                Akreditasi SINTA <span className="text-error ml-0.5">*</span>
              </label>
              <select
                id="pub-sinta-rank"
                value={sintaRank}
                onChange={(e) => setSintaRank(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark cursor-pointer font-mono"
              >
                <option value="Non-SINTA">Non-SINTA (Tidak Terakreditasi — 10 Pts)</option>
                <option value="S1">SINTA 1 (S1 — 25 Pts)</option>
                <option value="S2">SINTA 2 (S2 — 25 Pts)</option>
                <option value="S3">SINTA 3 (S3 — 20 Pts)</option>
                <option value="S4">SINTA 4 (S4 — 20 Pts)</option>
                <option value="S5">SINTA 5 (S5 — 15 Pts)</option>
                <option value="S6">SINTA 6 (S6 — 15 Pts)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pub-citations" className="text-xs font-semibold text-body dark:text-on-dark-soft flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />
                Jumlah Sitasi (Opsional)
              </label>
              <input
                type="number"
                id="pub-citations"
                min="0"
                value={citations}
                onChange={(e) => setCitations(e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-2.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg font-medium focus:bg-surface-light dark:focus:bg-surface-dark focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all outline-none text-xs text-ink-heading dark:text-on-dark font-mono"
              />
            </div>
          </div>
        )}

        {/* Tanggal Terbit */}
        <div className="space-y-1.5 relative">
          <label className="text-xs font-semibold text-body dark:text-on-dark-soft flex items-center">
            <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted dark:text-on-dark-muted" />
            Tanggal Terbit <span className="text-error ml-0.5">*</span>
          </label>
          <DatePicker date={date} onDateChange={setDate} placeholder="Pilih tanggal terbit" />
        </div>

        {/* Upload File PDF */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-body dark:text-on-dark-soft">
            File Publikasi (PDF) <span className="text-error ml-0.5">*</span>
          </label>
          {file ? (
            <div className="relative p-4 bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark rounded-2xl flex flex-col gap-3">
              <button 
                type="button" 
                onClick={() => setFile(null)}
                disabled={loading}
                className="absolute top-3.5 right-3.5 text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
                  <FileText className="w-5 h-5 text-muted dark:text-on-dark-muted" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-ink-heading dark:text-on-dark truncate pr-6">
                    {file.name}
                  </p>
                  <p className="text-[11px] font-mono text-muted dark:text-on-dark-muted mt-0.5">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 bg-surface-light dark:bg-surface-dark h-1.5 rounded-full overflow-hidden border border-hairline-light dark:border-hairline-dark">
                  <motion.div 
                    className="bg-ink dark:bg-on-dark h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress !== null ? uploadProgress : 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-xs font-mono font-semibold text-muted dark:text-on-dark-muted min-w-[30px] text-right">
                  {uploadProgress !== null ? `${uploadProgress}%` : '100%'}
                </span>
              </div>
            </div>
          ) : (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('pub-file-input-modal')?.click()}
              className="relative group mt-1 flex justify-center px-6 py-6 border-2 border-dashed rounded-2xl transition-all cursor-pointer border-hairline-light dark:border-hairline-dark bg-surface-light-raised/40 dark:bg-surface-dark-elevated/40 hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:border-ink-border dark:hover:border-hairline-light"
            >
              <input
                id="pub-file-input-modal"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="space-y-2 text-center">
                <div className="mx-auto h-10 w-10 rounded-xl flex items-center justify-center transition-all bg-surface-light dark:bg-surface-dark shadow-2xs border border-hairline-light dark:border-hairline-dark">
                  <Upload className="h-5 w-5 text-muted dark:text-on-dark-muted" />
                </div>
                <div className="flex flex-col gap-0.5 px-4">
                  <p className="text-xs font-semibold text-ink-heading dark:text-on-dark">
                    Pilih File PDF Dokumen Publikasi
                  </p>
                  <p className="text-[11px] text-muted dark:text-on-dark-muted truncate max-w-[250px]">
                    Klik atau seret file dokumen ke sini (maks. 10MB)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tombol Action */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-hairline-light dark:border-hairline-dark">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-surface-light dark:bg-surface-dark-elevated hover:bg-surface-light-raised dark:hover:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading || !!duplicateFound}
            className="px-5 py-2.5 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-lg text-xs font-semibold shadow-2xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Mengunggah...' : 'Unggah Publikasi'}
          </button>
        </div>
      </form>
    </BaseFormModal>
  );
}
