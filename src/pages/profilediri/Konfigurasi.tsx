import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Hash } from 'lucide-react';
import { KonfigurasiProps } from './Konfigurasi/types/konfigurasi.types';
import { useKonfigurasi } from './Konfigurasi/hooks/useKonfigurasi';
import { DeleteConfirmModal } from './Konfigurasi/components/DeleteConfirmModal';
import { SyncBanner } from './Konfigurasi/components/SyncBanner';
import { IntegrationCard } from './Konfigurasi/components/IntegrationCard';

export default function Konfigurasi({
  user,
  scholarId,
  setScholarId,
  scopusId,
  setScopusId,
  scholarData,
  scopusData,
  loading,
  checkingInfo,
  checkingScopus,
  checkedAuthor,
  setCheckedAuthor,
  checkedScopusAuthor,
  setCheckedScopusAuthor,
  handleCheckId,
  handleSaveScholarId,
  handleCheckScopusId,
  handleSaveScopusId,
  handleSync,
  handleSyncScopus,
  handleSyncAll,
  handleDeleteScholarId,
  handleDeleteScopusId,
  tabVariants,
}: KonfigurasiProps) {
  // Menggunakan custom hook untuk mengelola state dan konfirmasi hapus
  const { showDeleteConfirm, setShowDeleteConfirm, confirmDelete } = useKonfigurasi(
    handleDeleteScholarId,
    handleDeleteScopusId
  );

  return (
    <motion.div
      key="integrasi"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Modal Konfirmasi Hapus */}
      <AnimatePresence>
        {showDeleteConfirm.type && (
          <DeleteConfirmModal
            type={showDeleteConfirm.type}
            onClose={() => setShowDeleteConfirm({ type: null })}
            onConfirm={confirmDelete}
          />
        )}
      </AnimatePresence>

      {/* Banner Sinkronisasi Publikasi */}
      <SyncBanner
        loading={loading}
        scholarId={scholarId}
        scopusId={scopusId}
        onSyncAll={handleSyncAll}
      />

      {/* Kartu Integrasi */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Google Scholar */}
        <IntegrationCard
          title="Google Scholar"
          description="Dipakai untuk mengambil sitasi, h-index, i10-index, dan daftar publikasi Scholar."
          type="scholar"
          icon={Globe}
          value={scholarId}
          savedValue={user?.scholar_id}
          placeholder="Contoh: xxxxxxxAAAAJ"
          data={scholarData}
          checkedAuthor={checkedAuthor}
          checking={checkingInfo}
          loading={loading}
          onChange={(nextValue) => {
            setScholarId(nextValue);
            setCheckedAuthor(null);
          }}
          onCheck={handleCheckId}
          onSave={handleSaveScholarId}
          onDelete={() => setShowDeleteConfirm({ type: 'scholar' })}
          onSync={handleSync}
        />

        {/* Scopus */}
        <IntegrationCard
          title="Scopus"
          description="Dipakai untuk mengambil dokumen terindeks, sitasi, h-index, dan basis penilaian Scopus."
          type="scopus"
          icon={Hash}
          value={scopusId}
          savedValue={user?.scopus_id}
          placeholder="Contoh: 57211234567"
          data={scopusData}
          checkedAuthor={checkedScopusAuthor}
          checking={checkingScopus}
          loading={loading}
          onChange={(nextValue) => {
            setScopusId(nextValue);
            setCheckedScopusAuthor(null);
          }}
          onCheck={handleCheckScopusId}
          onSave={handleSaveScopusId}
          onDelete={() => setShowDeleteConfirm({ type: 'scopus' })}
          onSync={handleSyncScopus}
        />
      </div>
    </motion.div>
  );
}
