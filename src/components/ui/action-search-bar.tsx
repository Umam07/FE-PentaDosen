"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Activity,
  FileText,
  Award,
  Beaker,
  Book,
  FolderOpen,
  CheckSquare,
  PlusCircle,
  Users,
  RefreshCw,
  ShieldAlert,
  HelpCircle,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "./command";

export interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  short?: string;
  end?: string;
  path?: string;
}

interface ActionSearchBarProps {
  actions?: Action[];
  onSelect?: (action: Action) => void;
  placeholder?: string;
  className?: string;
  user?: {
    id?: string | number;
    name?: string;
    role?: string;
    avatar?: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

const roleMenus: Record<string, { label: string; path: string; icon: React.ReactNode; category: string }[]> = {
  "dosen": [
    { label: "Dashboard Poin", path: "/lecturer-dashboard", icon: <Activity className="h-4 w-4" />, category: "Menu Utama" },
    { label: "Publikasi Jurnal Internasional", path: "/publication?kategori=Jurnal Internasional", icon: <FileText className="h-4 w-4" />, category: "Publikasi" },
    { label: "Publikasi Jurnal Nasional", path: "/publication?kategori=Jurnal Nasional", icon: <FileText className="h-4 w-4" />, category: "Publikasi" },
    { label: "HKI (Hak Kekayaan Intelektual)", path: "/hki", icon: <Award className="h-4 w-4" />, category: "Karya Ilmiah" },
    { label: "Penelitian Dosen", path: "/research", icon: <Beaker className="h-4 w-4" />, category: "Karya Ilmiah" },
    { label: "Buku", path: "/buku", icon: <Book className="h-4 w-4" />, category: "Karya Ilmiah" },
    { label: "Panduan & Bantuan", path: "/help", icon: <HelpCircle className="h-4 w-4" />, category: "Layanan" },
  ],
  "admin penelitian": [
    { label: "Panel CMS (Master & User)", path: "/admin/cms", icon: <ShieldAlert className="h-4 w-4" />, category: "Administrator" },
    { label: "Semua Dokumen Dosen", path: "/admin/documents/all", icon: <FolderOpen className="h-4 w-4" />, category: "Manajemen Dokumen" },
    { label: "Verifikasi Dokumen", path: "/admin/verify", icon: <CheckSquare className="h-4 w-4" />, category: "Persetujuan" },
    { label: "Input Dosen Mandiri", path: "/admin/input-document", icon: <PlusCircle className="h-4 w-4" />, category: "Dokumen" },
    { label: "Daftar Dosen Universitas", path: "/admin/lecturers", icon: <Users className="h-4 w-4" />, category: "Keanggotaan" },
    { label: "Sinkronisasi Data API", path: "/admin/sync", icon: <RefreshCw className="h-4 w-4" />, category: "Integrasi" },
    { label: "Log Aktivitas Sistem", path: "/admin/activity-logs", icon: <Activity className="h-4 w-4" />, category: "Sistem Audit" },
    { label: "Panduan & Bantuan", path: "/help", icon: <HelpCircle className="h-4 w-4" />, category: "Layanan" },
  ],
  "admin fakultas": [
    { label: "Semua Dokumen Dosen", path: "/admin/documents/all", icon: <FolderOpen className="h-4 w-4" />, category: "Manajemen Dokumen" },
    { label: "Verifikasi Dokumen", path: "/admin/verify", icon: <CheckSquare className="h-4 w-4" />, category: "Persetujuan" },
    { label: "Input Dosen Mandiri", path: "/admin/input-document", icon: <PlusCircle className="h-4 w-4" />, category: "Dokumen" },
    { label: "Daftar Dosen Fakultas", path: "/admin/lecturers", icon: <Users className="h-4 w-4" />, category: "Keanggotaan" },
    { label: "Log Aktivitas Sistem", path: "/admin/activity-logs", icon: <Activity className="h-4 w-4" />, category: "Sistem Audit" },
    { label: "Panduan & Bantuan", path: "/help", icon: <HelpCircle className="h-4 w-4" />, category: "Layanan" },
  ]
};

const roleLabels: Record<string, string> = {
  "dosen": "Dosen",
  "admin penelitian": "Admin Penelitian",
  "admin fakultas": "Admin Fak",
};

function ActionSearchBar({ 
  actions = [], 
  onSelect, 
  placeholder = "Cari menu/dosen...", 
  className, 
  user,
  open: controlledOpen,
  onOpenChange,
  hideTrigger = false
}: ActionSearchBarProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const navigate = useNavigate();

  const isControlled = typeof controlledOpen !== 'undefined';
  const open = isControlled ? Boolean(controlledOpen) : internalOpen;

  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const setOpen = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    const current = openRef.current;
    const nextVal = typeof val === 'function' ? val(current) : val;
    if (isControlled && onOpenChange) {
      onOpenChange(nextVal);
    } else {
      setInternalOpen(nextVal);
    }
  }, [isControlled, onOpenChange]);

  // Tentukan role user yang sedang login (default: dosen)
  const userRole = user?.role?.toLowerCase() || "dosen";
  const resolvedRole = roleMenus[userRole] ? userRole : "dosen";

  // Keyboard shortcut listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Toggle dialog: Ctrl+K
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      // Navigate to profile: Ctrl+I
      if (e.key.toLowerCase() === "i" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(false);
        navigate("/profile");
      }

      // Logout: Ctrl+Shift+Q
      if (e.key.toLowerCase() === "q" && e.shiftKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(false);
        window.dispatchEvent(new CustomEvent("penta-logout"));
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [navigate, setOpen]);

  const handleItemSelect = (path: string, originalAction?: Action) => {
    setOpen(false);
    if (originalAction && onSelect) {
      onSelect(originalAction);
    } else {
      navigate(path);
    }
  };

  // Split lecturers actions from menu actions
  const lecturerActions = actions.filter((act) => act.end === "LECTURER");

  if (hideTrigger) {
    return (
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Ketik perintah atau cari halaman..." />

        <CommandList>
          <CommandEmpty>Hasil pencarian tidak ditemukan.</CommandEmpty>

          {/* Menu sesuai role user yang login */}
          {roleMenus[resolvedRole] && (
            <CommandGroup heading={`Menu ${roleLabels[resolvedRole]}`}>
              {roleMenus[resolvedRole].map((menu, idx) => (
                <CommandItem
                  key={`menu-${idx}`}
                  value={menu.label}
                  onSelect={() => handleItemSelect(menu.path)}
                >
                  <div className="flex items-center gap-3.5 w-full">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shrink-0">
                      {menu.icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {menu.label}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {menu.category}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Section Akses Cepat Dosen */}
          {lecturerActions.length > 0 && (
            <CommandGroup heading="Daftar Dosen">
              {lecturerActions.map((act) => (
                <CommandItem
                  key={act.id}
                  value={act.label}
                  onSelect={() => handleItemSelect(act.path || "", act)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shrink-0">
                      {act.icon}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {act.label}
                      </span>
                      {act.description && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {act.description}
                        </span>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    );
  }

  return (
    <div className={`w-full ${className || ''}`}>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full h-10 flex items-center justify-between px-3.5 py-2 text-xs rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800 transition-all text-slate-500 dark:text-slate-400 shadow-2xs group overflow-hidden cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
          <Search className="h-4 w-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors shrink-0" />
          <span className="truncate">{placeholder}</span>
        </div>
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center justify-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 font-mono text-[10px] font-semibold text-slate-500 dark:text-slate-400 shadow-2xs shrink-0">
          Ctrl+K
        </kbd>
      </button>

      {/* Command Dialog Modal */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Ketik perintah atau cari halaman..." />

        <CommandList>
          <CommandEmpty>Hasil pencarian tidak ditemukan.</CommandEmpty>

          {/* Menu sesuai role user yang login */}
          {roleMenus[resolvedRole] && (
            <CommandGroup heading={`Menu ${roleLabels[resolvedRole]}`}>
              {roleMenus[resolvedRole].map((menu, idx) => (
                <CommandItem
                  key={`menu-${idx}`}
                  value={menu.label}
                  onSelect={() => handleItemSelect(menu.path)}
                >
                  <div className="flex items-center gap-3.5 w-full">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shrink-0">
                      {menu.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white tracking-tight">{menu.label}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {menu.category}
                      </span>
                    </div>
                    <ChevronRight className="ml-auto w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Lecturers search (hanya untuk admin Penelitian / Fakultas) */}
          {(resolvedRole === "admin penelitian" || resolvedRole === "admin fakultas") && lecturerActions.length > 0 && (
            <CommandGroup heading="Daftar Dosen Terkait">
              {lecturerActions.map((act) => (
                <CommandItem
                  key={act.id}
                  value={act.label}
                  onSelect={() => handleItemSelect(act.path || "", act)}
                >
                  <div className="flex items-center gap-3.5 w-full">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white tracking-tight">{act.label}</span>
                      {act.description && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {act.description}
                        </span>
                      )}
                    </div>
                    {act.end && (
                      <span className="ml-auto text-[10px] font-semibold font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/80">
                        {act.end}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Account Settings / General commands */}
          <CommandGroup heading="Aksi & Sistem">
            <CommandItem
              value="Pengaturan Profil Diri"
              onSelect={() => handleItemSelect("/profile")}
            >
              <div className="flex items-center gap-3.5 w-full">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white tracking-tight">Pengaturan Profil Diri</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Kelola profil dan integrasi ID Scopus/Scholar
                  </span>
                </div>
                 <CommandShortcut>Ctrl+I</CommandShortcut>
              </div>
            </CommandItem>
            <CommandItem
              value="Keluar Logout Sistem"
               onSelect={() => {
                 setOpen(false);
                 window.dispatchEvent(new CustomEvent("penta-logout"));
               }}
            >
              <div className="flex items-center gap-3.5 w-full">
                <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-800/60 shrink-0">
                  <LogOut className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 tracking-tight">Keluar dari Sistem</span>
                  <span className="text-[11px] text-red-500/70 dark:text-red-400/70">
                    Akhiri sesi login saat ini
                  </span>
                </div>
                 <CommandShortcut>Ctrl+Shift+Q</CommandShortcut>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}

export { ActionSearchBar };

