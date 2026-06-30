"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
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
}

const roleMenus: Record<string, { label: string; path: string; icon: React.ReactNode; category: string }[]> = {
  "dosen": [
    { label: "Dashboard Poin", path: "/lecturer-dashboard", icon: <Activity className="h-4 w-4 text-emerald-500" />, category: "Menu Utama" },
    { label: "Publikasi Jurnal Internasional", path: "/publication?kategori=Jurnal Internasional", icon: <FileText className="h-4 w-4 text-blue-500" />, category: "Publikasi" },
    { label: "Publikasi Jurnal Nasional", path: "/publication?kategori=Jurnal Nasional", icon: <FileText className="h-4 w-4 text-indigo-500" />, category: "Publikasi" },
    { label: "HKI (Hak Kekayaan Intelektual)", path: "/hki", icon: <Award className="h-4 w-4 text-amber-500" />, category: "Karya Ilmiah" },
    { label: "Penelitian Dosen", path: "/research", icon: <Beaker className="h-4 w-4 text-purple-500" />, category: "Karya Ilmiah" },
    { label: "Buku", path: "/buku", icon: <Book className="h-4 w-4 text-pink-500" />, category: "Karya Ilmiah" },
    { label: "Bantuan & FAQ", path: "/help", icon: <HelpCircle className="h-4 w-4 text-slate-500" />, category: "Layanan" },
  ],
  "admin lppm": [
    { label: "Semua Dokumen Dosen", path: "/admin/documents/all", icon: <FolderOpen className="h-4 w-4 text-cyan-500" />, category: "Manajemen Dokumen" },
    { label: "Verifikasi Dokumen", path: "/admin/verify", icon: <CheckSquare className="h-4 w-4 text-emerald-500" />, category: "Persetujuan" },
    { label: "Input Dosen Mandiri", path: "/admin/input-document", icon: <PlusCircle className="h-4 w-4 text-violet-500" />, category: "Dokumen" },
    { label: "Daftar Dosen Universitas", path: "/admin/lecturers", icon: <Users className="h-4 w-4 text-blue-500" />, category: "Keanggotaan" },
    { label: "Sinkronisasi Data API", path: "/admin/sync", icon: <RefreshCw className="h-4 w-4 text-orange-500" />, category: "Integrasi" },
    { label: "Log Aktivitas Sistem", path: "/admin/activity-logs", icon: <Activity className="h-4 w-4 text-rose-500" />, category: "Sistem Audit" },
    { label: "Bantuan & FAQ", path: "/help", icon: <HelpCircle className="h-4 w-4 text-slate-500" />, category: "Layanan" },
  ],
  "admin fakultas": [
    { label: "Semua Dokumen Dosen", path: "/admin/documents/all", icon: <FolderOpen className="h-4 w-4 text-cyan-500" />, category: "Manajemen Dokumen" },
    { label: "Verifikasi Dokumen", path: "/admin/verify", icon: <CheckSquare className="h-4 w-4 text-emerald-500" />, category: "Persetujuan" },
    { label: "Input Dosen Mandiri", path: "/admin/input-document", icon: <PlusCircle className="h-4 w-4 text-violet-500" />, category: "Dokumen" },
    { label: "Daftar Dosen Fakultas", path: "/admin/lecturers", icon: <Users className="h-4 w-4 text-blue-500" />, category: "Keanggotaan" },
    { label: "Log Aktivitas Sistem", path: "/admin/activity-logs", icon: <Activity className="h-4 w-4 text-rose-500" />, category: "Sistem Audit" },
    { label: "Bantuan & FAQ", path: "/help", icon: <HelpCircle className="h-4 w-4 text-slate-500" />, category: "Layanan" },
  ],
  "super admin": [
    { label: "Panel CMS (Manajemen User)", path: "/admin/cms", icon: <ShieldAlert className="h-4 w-4 text-red-500" />, category: "Administrator" },
    { label: "Bantuan & FAQ", path: "/help", icon: <HelpCircle className="h-4 w-4 text-slate-500" />, category: "Layanan" },
  ]
};

const roleLabels: Record<string, string> = {
  "dosen": "Dosen",
  "admin lppm": "Admin LPPM",
  "admin fakultas": "Admin Fak",
  "super admin": "Super Admin",
};

function ActionSearchBar({ actions = [], onSelect, placeholder = "Search...", className, user }: ActionSearchBarProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Determine current active role of the user (default to dosen if none)
  const userRole = user?.role?.toLowerCase() || "dosen";
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (roleMenus[userRole]) return userRole;
    return "dosen";
  });

  // Keep activeTab updated if user changes
  useEffect(() => {
    const role = user?.role?.toLowerCase() || "dosen";
    if (roleMenus[role]) {
      setActiveTab(role);
    }
  }, [user]);

  // Keyboard shortcut listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Toggle dialog: Ctrl+K
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
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
  }, [navigate]);

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

  // Get available tabs based on system roles
  const rolesList = ["dosen", "admin lppm", "admin fakultas", "super admin"];

  return (
    <div className={`w-full ${className}`}>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full h-9 flex items-center justify-between px-3 py-1.5 text-xs lg:text-sm rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 hover:bg-gray-100/60 dark:hover:bg-zinc-800/60 transition-all text-gray-400 dark:text-zinc-500 shadow-inner group overflow-hidden"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
          <Search className="h-4 w-4 text-gray-400 group-hover:text-primary-500 transition-colors shrink-0" />
          <span className="truncate">{placeholder}</span>
        </div>
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center justify-center rounded border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1.5 font-mono text-[9px] font-bold text-gray-400 dark:text-zinc-500 shadow-sm shrink-0">
          Ctrl+K
        </kbd>
      </button>

      {/* Command Dialog Modal */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Ketik perintah atau cari halaman..." />
        
        {/* Dynamic Role Tabs inside Command Menu */}
        <div className="px-4 py-2.5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {rolesList.map((roleKey) => {
              const isActive = activeTab === roleKey;
              return (
                <button
                  key={roleKey}
                  onClick={() => setActiveTab(roleKey)}
                  className={`relative px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                    isActive
                      ? "text-primary-600 dark:text-zinc-100"
                      : "text-gray-450 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-300 hover:bg-gray-100/50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeRoleTab"
                      className="absolute inset-0 bg-primary-50 dark:bg-zinc-850 rounded-lg -z-10 border border-primary-100/30 dark:border-zinc-700/50"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {roleLabels[roleKey]}
                </button>
              );
            })}
          </div>
          <div className="hidden xs:flex items-center gap-1.5 text-[10px] font-bold text-primary-500/80 dark:text-primary-450/80 bg-primary-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest shrink-0">
            <Sparkles className="w-3 h-3" />
            <span>Role Mode</span>
          </div>
        </div>

        <CommandList>
          <CommandEmpty>Hasil pencarian tidak ditemukan.</CommandEmpty>

          {/* Dynamic Role specific menus */}
          {roleMenus[activeTab] && (
            <CommandGroup heading={`Navigasi Menu ${roleLabels[activeTab]}`}>
              {roleMenus[activeTab].map((menu, idx) => (
                <CommandItem
                  key={`menu-${idx}`}
                  value={menu.label}
                  onSelect={() => handleItemSelect(menu.path)}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="p-2 rounded-xl bg-gray-55 dark:bg-zinc-800 text-gray-700 dark:text-zinc-350 shrink-0">
                      {menu.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold tracking-tight">{menu.label}</span>
                      <span className="text-xs font-medium text-gray-400 lowercase tracking-normal">
                        {menu.category}
                      </span>
                    </div>
                    <ChevronRight className="ml-auto w-4 h-4 text-gray-350 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Lecturers search (Visible on LPPM / Fakultas tabs) */}
          {(activeTab === "admin lppm" || activeTab === "admin fakultas") && lecturerActions.length > 0 && (
            <CommandGroup heading="Daftar Dosen Terkait">
              {lecturerActions.map((act) => (
                <CommandItem
                  key={act.id}
                  value={act.label}
                  onSelect={() => handleItemSelect(act.path || "", act)}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="p-2 rounded-xl bg-primary-500/10 text-primary-500 shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold tracking-tight">{act.label}</span>
                      {act.description && (
                        <span className="text-xs font-medium text-gray-400 lowercase tracking-normal">
                          {act.description}
                        </span>
                      )}
                    </div>
                    {act.end && (
                      <span className="ml-auto text-[9px] font-black tracking-widest text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded">
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
              <div className="flex items-center gap-4 w-full">
                <div className="p-2 rounded-xl bg-gray-55 dark:bg-zinc-800 text-gray-700 dark:text-zinc-350 shrink-0">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold tracking-tight">Pengaturan Profil Diri</span>
                  <span className="text-xs font-medium text-gray-400 lowercase tracking-normal">
                    kelola profil dan integrasi ID Scopus/Scholar
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
              <div className="flex items-center gap-4 w-full">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-500 shrink-0">
                  <LogOut className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-red-650 dark:text-red-400 tracking-tight">Keluar dari Sistem</span>
                  <span className="text-xs font-medium text-red-400/70 lowercase tracking-normal">
                    akhiri sesi login saat ini
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
