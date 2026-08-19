import React from 'react';
import { GraduationCap, Mail, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { LecturerManagementPanelProps } from '../types/adminSync.types';
import ScholarIntegrationCard from './ScholarIntegrationCard';
import ScopusIntegrationCard from './ScopusIntegrationCard';

export default function LecturerManagementPanel({
  scholarUser,
  scholarData,
  scopusData,
  scholarId,
  scopusId,
  loadingScholar,
  loadingScopus,
  checkingInfoScholar,
  checkingInfoScopus,
  checkedAuthorScholar,
  checkedAuthorScopus,
  messageScholar,
  messageScopus,
  onScholarIdChange,
  onScopusIdChange,
  onCheckScholar,
  onSaveScholar,
  onSyncScholar,
  onCheckScopus,
  onSaveScopus,
  onSyncScopus,
  onClose,
  onClearCheckedScholar,
  onClearCheckedScopus,
}: LecturerManagementPanelProps) {
  return (
    <AnimatePresence mode="wait">
      {scholarUser && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Lecturer Management Header */}
          <div className="bg-surface-light dark:bg-surface-dark shadow-xs rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden relative">
             <div className="p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div className="h-16 w-16 rounded-2xl bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center justify-center text-ink-heading dark:text-on-dark text-2xl font-bold font-mono border border-hairline-light dark:border-hairline-dark shadow-xs overflow-hidden shrink-0">
                    {scholarData?.thumbnail ? (
                      <img src={scholarData.thumbnail} alt={scholarUser.name} className="w-full h-full object-cover" />
                    ) : (
                      scholarUser.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold text-ink-heading dark:text-on-dark tracking-tight">{scholarUser.name}</h4>
                    <div className="mt-1 flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4">
                      <p className="text-xs font-semibold text-muted dark:text-on-dark-muted flex items-center">
                        <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-muted-soft dark:text-on-dark-muted" />
                        {scholarUser.program_studi || 'N/A'}
                      </p>
                      <p className="text-xs font-mono font-medium text-muted dark:text-on-dark-muted flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-soft dark:text-on-dark-muted" />
                        {scholarUser.email}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark border border-hairline-light dark:border-hairline-dark hover:border-error/30 dark:hover:border-error/30 rounded-xl text-xs font-semibold text-muted dark:text-on-dark-muted hover:text-error dark:hover:text-error uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" /> Tutup Panel
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <ScholarIntegrationCard
              scholarId={scholarId}
              scholarData={scholarData}
              scholarUser={scholarUser}
              loadingScholar={loadingScholar}
              checkingInfoScholar={checkingInfoScholar}
              checkedAuthorScholar={checkedAuthorScholar}
              messageScholar={messageScholar}
              onScholarIdChange={onScholarIdChange}
              onCheck={onCheckScholar}
              onSave={onSaveScholar}
              onSync={onSyncScholar}
              onClearChecked={onClearCheckedScholar}
            />

            <ScopusIntegrationCard
              scopusId={scopusId}
              scopusData={scopusData}
              scholarUser={scholarUser}
              loadingScopus={loadingScopus}
              checkingInfoScopus={checkingInfoScopus}
              checkedAuthorScopus={checkedAuthorScopus}
              messageScopus={messageScopus}
              onScopusIdChange={onScopusIdChange}
              onCheck={onCheckScopus}
              onSave={onSaveScopus}
              onSync={onSyncScopus}
              onClearChecked={onClearCheckedScopus}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
