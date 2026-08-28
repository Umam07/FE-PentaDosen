import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, Search, Plus, X, UserCheck, GraduationCap, 
  Building2, AlertCircle, GripVertical, ChevronUp, ChevronDown 
} from 'lucide-react';
import type { UserSession } from '../types/publication.types';

export interface CoAuthorItem {
  id?: number | string;
  name: string;
  isInternal: boolean;
  nidn?: string;
  fakultas?: string;
  prodi?: string;
}

export interface UnifiedAuthorItem {
  id: string | number;
  name: string;
  isSelf: boolean;
  isInternal: boolean;
  nidn?: string;
  fakultas?: string;
  prodi?: string;
}

interface CoAuthorsSelectorProps {
  currentUser: UserSession;
  coAuthors: CoAuthorItem[];
  onChange: (coAuthors: CoAuthorItem[]) => void;
  authorRole: string;
  authorOrder: number;
  onOrderChange: (newRole: 'Single Author' | 'First Author' | 'Member Author', newOrder: number, newCoAuthors: CoAuthorItem[]) => void;
  disabled?: boolean;
}

export default function CoAuthorsSelector({
  currentUser,
  coAuthors,
  onChange,
  authorRole,
  authorOrder,
  onOrderChange,
  disabled = false,
}: CoAuthorsSelectorProps) {
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [loadingLecturers, setLoadingLecturers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [externalName, setExternalName] = useState('');
  const [isAddingExternal, setIsAddingExternal] = useState(false);

  // Drag-and-drop tracking
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch simple lecturers list from database
  useEffect(() => {
    let isMounted = true;
    const fetchLecturers = async () => {
      setLoadingLecturers(true);
      try {
        const res = await fetch('/api/lecturers/simple-list');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.lecturers) {
            setLecturers(data.lecturers);
            return;
          }
        }
        // Fallback to admin lecturers
        const fallbackRes = await fetch('/api/admin/lecturers');
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (isMounted && fallbackData.lecturers) {
            setLecturers(fallbackData.lecturers);
          }
        }
      } catch (err) {
        console.error('Failed to fetch lecturers list', err);
      } finally {
        if (isMounted) setLoadingLecturers(false);
      }
    };

    fetchLecturers();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter out current user and already added co-authors
  const addedIds = useMemo(() => {
    return new Set(coAuthors.filter((a) => a.isInternal && a.id).map((a) => String(a.id)));
  }, [coAuthors]);

  const filteredLecturers = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().trim();

    return lecturers
      .filter((lec) => {
        if (lec.id === currentUser.id) return false;
        if (addedIds.has(String(lec.id))) return false;
        const nameMatch = (lec.name || '').toLowerCase().includes(term);
        const nidnMatch = (lec.nidn || '').toLowerCase().includes(term);
        const prodiMatch = (lec.program_studi || '').toLowerCase().includes(term);
        return nameMatch || nidnMatch || prodiMatch;
      })
      .slice(0, 10);
  }, [lecturers, searchTerm, currentUser.id, addedIds]);

  const handleAddLecturer = (lec: any) => {
    const newItem: CoAuthorItem = {
      id: lec.id,
      name: lec.name,
      isInternal: true,
      nidn: lec.nidn,
      fakultas: lec.fakultas,
      prodi: lec.program_studi,
    };
    const updated = [...coAuthors, newItem];
    onChange(updated);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleAddExternal = () => {
    if (!externalName.trim()) return;
    const newItem: CoAuthorItem = {
      id: `ext_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: externalName.trim(),
      isInternal: false,
    };
    const updated = [...coAuthors, newItem];
    onChange(updated);
    setExternalName('');
    setIsAddingExternal(false);
  };

  const handleRemoveCoAuthor = (targetId: string | number) => {
    const updated = coAuthors.filter((c) => String(c.id) !== String(targetId));
    onChange(updated);
  };

  // Construct combined unified list based on actual positions
  const fullUnifiedList = useMemo<UnifiedAuthorItem[]>(() => {
    const total = coAuthors.length + 1;
    const effectiveOrder = authorRole === 'Member Author' 
      ? Math.min(Math.max(2, authorOrder), total)
      : 1;

    const list: UnifiedAuthorItem[] = [];
    let coIdx = 0;

    for (let pos = 1; pos <= total; pos++) {
      if (pos === effectiveOrder) {
        list.push({
          id: 'self',
          name: currentUser.name || 'Anda (Dosen Pengunggah)',
          isSelf: true,
          isInternal: true,
        });
      } else if (coIdx < coAuthors.length) {
        const co = coAuthors[coIdx];
        list.push({
          id: co.id || `co_${coIdx}`,
          name: co.name,
          isSelf: false,
          isInternal: co.isInternal,
          nidn: co.nidn,
          fakultas: co.fakultas,
          prodi: co.prodi,
        });
        coIdx++;
      }
    }
    return list;
  }, [coAuthors, currentUser, authorRole, authorOrder]);

  // Reorder list handler (called by Drag-and-Drop or Arrow buttons)
  const applyNewOrder = (newList: UnifiedAuthorItem[]) => {
    const selfIndex = newList.findIndex((item) => item.isSelf);
    const newCoAuthors: CoAuthorItem[] = newList
      .filter((item) => !item.isSelf)
      .map((item) => ({
        id: item.id,
        name: item.name,
        isInternal: item.isInternal,
        nidn: item.nidn,
        fakultas: item.fakultas,
        prodi: item.prodi,
      }));

    let newRole: 'Single Author' | 'First Author' | 'Member Author' = 'First Author';
    let newOrder = 1;

    if (newCoAuthors.length === 0) {
      newRole = 'Single Author';
      newOrder = 1;
    } else if (selfIndex === 0) {
      newRole = 'First Author';
      newOrder = 1;
    } else {
      newRole = 'Member Author';
      newOrder = selfIndex + 1;
    }

    onOrderChange(newRole, newOrder, newCoAuthors);
  };

  // Move item up / down
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (disabled) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fullUnifiedList.length) return;

    const listCopy = [...fullUnifiedList];
    const [moved] = listCopy.splice(index, 1);
    listCopy.splice(targetIndex, 0, moved);
    applyNewOrder(listCopy);
  };

  // HTML5 Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (disabled) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex === null || draggedIndex === index) return;

    const listCopy = [...fullUnifiedList];
    const [draggedItem] = listCopy.splice(draggedIndex, 1);
    listCopy.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    applyNewOrder(listCopy);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-body dark:text-on-dark-soft flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />
          <span>Anggota Penulis / Rekan Penulis (Co-Authors)</span>
        </label>
        <span className="text-[11px] font-mono text-muted dark:text-on-dark-muted">
          +{coAuthors.length} Rekan Ditambahkan
        </span>
      </div>

      {/* Selector: Internal Dosen Search & External Author */}
      <div className="space-y-2">
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-muted dark:text-on-dark-muted absolute left-3 pointer-events-none" />
            <input
              type="text"
              disabled={disabled}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Cari dosen rekanan dari database universitas (nama / NIDN)..."
              className="w-full pl-9 pr-24 py-2 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-xs text-ink-heading dark:text-on-dark placeholder:text-muted dark:placeholder:text-on-dark-muted focus:ring-2 focus:ring-accent/15 focus:border-accent outline-none transition-all"
            />
            <button
              type="button"
              disabled={disabled}
              onClick={() => setIsAddingExternal(!isAddingExternal)}
              className="absolute right-1.5 px-2.5 py-1 text-[10px] font-semibold rounded-md border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark text-body dark:text-on-dark-soft transition-colors cursor-pointer"
            >
              {isAddingExternal ? 'Batal' : '+ Penulis Luar'}
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && searchTerm.trim().length > 0 && (
            <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y divide-hairline-light-soft dark:divide-hairline-dark-soft">
              {loadingLecturers ? (
                <div className="p-3 text-center text-xs text-muted dark:text-on-dark-muted">
                  Memuat data dosen...
                </div>
              ) : filteredLecturers.length > 0 ? (
                filteredLecturers.map((lec) => (
                  <button
                    key={lec.id}
                    type="button"
                    onClick={() => handleAddLecturer(lec)}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors flex items-center justify-between gap-2 group cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-ink-heading dark:text-on-dark truncate group-hover:text-accent">
                        {lec.name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-muted dark:text-on-dark-muted mt-0.5">
                        {lec.nidn && <span className="font-mono">NIDN: {lec.nidn}</span>}
                        {lec.program_studi && (
                          <span className="truncate flex items-center gap-1">
                            <Building2 className="w-2.5 h-2.5 shrink-0" />
                            {lec.program_studi}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] px-2 py-0.5 rounded bg-surface-light-raised dark:bg-surface-dark text-muted group-hover:text-ink-heading dark:group-hover:text-on-dark border border-hairline-light dark:border-hairline-dark font-medium flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Tambah
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-muted dark:text-on-dark-muted">
                  Dosen tidak ditemukan di database. Anda bisa menambahkannya sebagai Penulis Luar.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Form Penulis Luar / Non-Database */}
        {isAddingExternal && (
          <div className="p-3 rounded-xl bg-surface-light-raised/60 dark:bg-surface-dark-elevated/40 border border-hairline-light dark:border-hairline-dark space-y-2">
            <p className="text-[11px] font-semibold text-ink-heading dark:text-on-dark flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-muted" /> Tambah Penulis Luar / Mahasiswa / Mitra Eksternal
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={externalName}
                onChange={(e) => setExternalName(e.target.value)}
                placeholder="Masukkan nama lengkap penulis luar..."
                className="flex-1 px-3 py-1.5 bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-xs text-ink-heading dark:text-on-dark placeholder:text-muted outline-none focus:ring-1 focus:ring-accent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddExternal();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddExternal}
                disabled={!externalName.trim()}
                className="px-3 py-1.5 bg-ink hover:bg-ink-hover dark:bg-on-dark dark:hover:bg-white text-on-ink dark:text-ink rounded-lg text-xs font-semibold disabled:opacity-40 transition-all cursor-pointer"
              >
                Tambahkan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* List of Authors with Drag-and-Drop Ordering */}
      <div className="p-3 rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised/40 dark:bg-surface-dark-elevated/30 space-y-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-ink-heading dark:text-on-dark flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-accent" />
            Susunan Penulis Terdata (Bisa di-Drag & Drop / Geser Urutan):
          </span>
          <span className="text-[10px] text-muted dark:text-on-dark-muted font-mono">
            Total {fullUnifiedList.length} Penulis
          </span>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {fullUnifiedList.map((item, index) => {
            const orderNum = index + 1;
            const isFirst = index === 0;
            const isLast = index === fullUnifiedList.length - 1;
            const isDraggingThis = draggedIndex === index;

            if (item.isSelf) {
              return (
                <div
                  key="self-author"
                  draggable={!disabled && fullUnifiedList.length > 1}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`p-2 rounded-lg border flex items-center justify-between gap-2 text-xs transition-all ${
                    isDraggingThis
                      ? 'opacity-40 scale-[0.98] border-dashed border-accent bg-accent-soft/40'
                      : 'bg-accent-soft/30 dark:bg-accent/15 border-accent/40 dark:border-accent/30 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Drag Grip Handle */}
                    {fullUnifiedList.length > 1 && (
                      <div 
                        className="cursor-grab active:cursor-grabbing text-accent/70 hover:text-accent p-0.5"
                        title="Tahan & geser untuk mengubah urutan"
                      >
                        <GripVertical className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <span className="w-5 h-5 rounded-md bg-accent text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
                      {orderNum}
                    </span>

                    <div className="min-w-0">
                      <p className="font-semibold text-ink-heading dark:text-on-dark truncate">
                        {item.name}
                      </p>
                      <span className="text-[10px] text-accent dark:text-accent-on-dark font-medium">
                        {isFirst ? 'Penulis Utama (First Author)' : `Penulis Anggota ke-${orderNum}`} · Akun Anda
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Move Up/Down arrows */}
                    {fullUnifiedList.length > 1 && (
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          disabled={disabled || isFirst}
                          onClick={() => moveItem(index, 'up')}
                          title="Pindah ke atas"
                          className="w-5 h-5 rounded flex items-center justify-center text-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light dark:hover:bg-surface-dark disabled:opacity-20 cursor-pointer"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={disabled || isLast}
                          onClick={() => moveItem(index, 'down')}
                          title="Pindah ke bawah"
                          className="w-5 h-5 rounded flex items-center justify-center text-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light dark:hover:bg-surface-dark disabled:opacity-20 cursor-pointer"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-accent text-white shrink-0 shadow-2xs">
                      Anda
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                draggable={!disabled && fullUnifiedList.length > 1}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-2 rounded-lg border flex items-center justify-between gap-2 text-xs transition-all group ${
                  isDraggingThis
                    ? 'opacity-40 scale-[0.98] border-dashed border-accent bg-surface-light-raised'
                    : 'bg-surface-light dark:bg-surface-dark border-hairline-light dark:border-hairline-dark'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Drag Grip Handle */}
                  {fullUnifiedList.length > 1 && (
                    <div 
                      className="cursor-grab active:cursor-grabbing text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark p-0.5"
                      title="Tahan & geser untuk mengubah urutan"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <span className="w-5 h-5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted font-mono font-bold text-[10px] flex items-center justify-center shrink-0 border border-hairline-light dark:border-hairline-dark">
                    {orderNum}
                  </span>

                  <div className="min-w-0">
                    <p className="font-semibold text-ink-heading dark:text-on-dark truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted dark:text-on-dark-muted">
                      {isFirst && (
                        <span className="text-warning font-semibold">★ Penulis Utama</span>
                      )}
                      {item.isInternal ? (
                        <span className="text-success font-medium">✓ Dosen Terdaftar</span>
                      ) : (
                        <span className="text-muted">Penulis Luar / Mitra</span>
                      )}
                      {item.nidn && <span className="font-mono">NIDN: {item.nidn}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Move Up/Down arrows */}
                  {fullUnifiedList.length > 1 && (
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={disabled || isFirst}
                        onClick={() => moveItem(index, 'up')}
                        title="Pindah ke atas"
                        className="w-5 h-5 rounded flex items-center justify-center text-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={disabled || isLast}
                        onClick={() => moveItem(index, 'down')}
                        title="Pindah ke bawah"
                        className="w-5 h-5 rounded flex items-center justify-center text-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleRemoveCoAuthor(item.id)}
                    title="Hapus rekan penulis"
                    className="w-6 h-6 rounded-md hover:bg-error-soft text-muted hover:text-error dark:text-on-dark-muted dark:hover:text-error transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {coAuthors.length === 0 && (
          <p className="text-[11px] text-muted dark:text-on-dark-muted italic flex items-center gap-1.5 pt-1">
            <AlertCircle className="w-3 h-3 text-muted shrink-0" />
            Jika paper memiliki penulis rekanan, silakan cari nama dosen di atas atau tambahkan penulis luar.
          </p>
        )}
      </div>
    </div>
  );
}
