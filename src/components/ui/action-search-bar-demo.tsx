import { useState } from "react";
import { ActionSearchBar, Action } from "./action-search-bar";
import { motion } from "framer-motion";
import {
  PlaneTakeoff,
  BarChart2,
  Video,
  AudioLines,
  Globe,
  User,
  ShieldCheck,
  Award,
} from "lucide-react";

export function ActionSearchBarDemo() {
  const [selectedRole, setSelectedRole] = useState<string>("dosen");
  const [selectedActionMessage, setSelectedActionMessage] = useState<string>("");

  const mockUsers: Record<string, { id: number; name: string; role: string; avatar?: string }> = {
    dosen: {
      id: 1,
      name: "Dr. Eko Prasetyo, M.T.",
      role: "dosen",
      avatar: "",
    },
    "admin penelitian": {
      id: 2,
      name: "Siti Rahma, S.Kom. (Penelitian)",
      role: "admin penelitian",
      avatar: "",
    },
    "admin fakultas": {
      id: 3,
      name: "Budi Santoso (Fakultas Teknik)",
      role: "admin fakultas",
      avatar: "",
    },
    "super admin": {
      id: 4,
      name: "Achmad Yusuf (Super Admin)",
      role: "super admin",
      avatar: "",
    },
  };

  // Mock list of lecturer actions passed to topbar
  const mockLecturerActions: Action[] = [
    {
      id: "lecturer-1",
      label: "Prof. Dr. Ir. Riri Fitri Sari",
      icon: <User className="h-4 w-4 text-primary-500" />,
      description: "Teknik Elektro",
      path: "/admin/lecturers/1",
      end: "LECTURER",
    },
    {
      id: "lecturer-2",
      label: "Dr. Eng. Wahyu Caesarendra",
      icon: <User className="h-4 w-4 text-primary-500" />,
      description: "Teknik Mesin",
      path: "/admin/lecturers/2",
      end: "LECTURER",
    },
    {
      id: "lecturer-3",
      label: "Diana Purwitasari, S.Kom., M.Sc.",
      icon: <User className="h-4 w-4 text-primary-500" />,
      description: "Teknik Informatika",
      path: "/admin/lecturers/3",
      end: "LECTURER",
    },
  ];

  const handleActionSelect = (action: Action) => {
    setSelectedActionMessage(`Selected Action: ${action.label} (ID: ${action.id})`);
  };

  return (
    <div className="p-8 sm:p-16 bg-gray-50 dark:bg-zinc-950 min-h-screen flex flex-col items-center justify-start gap-8">
      <div className="max-w-2xl w-full text-center space-y-4">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-zinc-100 flex items-center justify-center gap-2 uppercase">
          <Award className="w-8 h-8 text-primary-500" />
          PentaDosen Search Demo
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Uji coba Command Menu Dialog berbasis Role. Silakan pilih role simulasi di bawah untuk
          melihat respons search bar secara langsung. Tekan <kbd className="bg-white dark:bg-zinc-850 border px-1 rounded shadow-sm">Ctrl+K</kbd> untuk membuka.
        </p>
      </div>

      {/* Role Selector Panel */}
      <div className="w-full max-w-xl p-6 bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-3xl shadow-xl space-y-4">
        <h2 className="text-xs font-black tracking-widest text-gray-400 dark:text-zinc-500 uppercase flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary-500" />
          Pilih User Simulasi
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(mockUsers).map((key) => {
            const user = mockUsers[key];
            const isSelected = selectedRole === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedRole(key);
                  setSelectedActionMessage("");
                }}
                className={`p-3 text-left rounded-2xl border text-xs font-bold transition-all uppercase tracking-wide flex flex-col gap-1 ${
                  isSelected
                    ? "bg-primary-500 border-primary-600 text-white shadow-lg"
                    : "bg-gray-50/50 hover:bg-gray-150/40 dark:bg-zinc-900/50 dark:hover:bg-zinc-855/50 border-gray-150 dark:border-zinc-800 text-gray-700 dark:text-zinc-300"
                }`}
              >
                <span>{user.name}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full w-fit ${
                  isSelected 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-200/50 text-gray-550 dark:bg-zinc-800 dark:text-zinc-400"
                }`}>
                  {user.role}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actual Demo Search Trigger */}
      <div className="w-full max-w-xl flex flex-col gap-4">
        <div className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 text-center">
          Tampilan Search Bar
        </div>
        <ActionSearchBar
          actions={mockLecturerActions}
          onSelect={handleActionSelect}
          placeholder="Cari menu/dosen..."
          user={mockUsers[selectedRole]}
        />
      </div>

      {/* Selected Action Info */}
      {selectedActionMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-sm"
        >
          {selectedActionMessage}
        </motion.div>
      )}
    </div>
  );
}
