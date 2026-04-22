import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Activity, Clock, ShieldAlert, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminActivityLogs() {
  const { user } = useOutletContext<{ user: any }>();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/activity-logs');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin lppm') {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Akses Ditolak</h1>
        <p className="text-gray-500 mt-2">Halaman ini hanya dapat diakses oleh Admin LPPM.</p>
      </div>
    );
  }

  return (
    <div className="max-w-none space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Log Aktivitas</h1>
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Riwayat Tindakan Dosen & Admin
          </p>
        </div>
        <div className="flex bg-primary-50 dark:bg-primary-900/20 px-5 py-3 rounded-2xl border border-primary-100 dark:border-primary-900/30">
          <Activity className="text-primary-500 w-5 h-5 mr-3" />
          <span className="text-[11px] font-black text-primary-700 dark:text-primary-400 uppercase tracking-[0.2em]">
            {logs.length} Aktivitas Tercatat
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
            <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Waktu</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Pengguna</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Aksi</th>
                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em]">Deskripsi Detail</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-primary-50/[0.03] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-2" />
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <UserIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{log.user?.name || 'Sistem / Anonim'}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{log.user?.role || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-[10px] leading-5 font-black rounded-full bg-primary-50 text-primary-700 uppercase tracking-widest border border-primary-100">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {log.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-500">Belum ada log aktivitas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
