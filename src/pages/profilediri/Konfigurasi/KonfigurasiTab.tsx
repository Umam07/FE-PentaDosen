import { motion } from 'framer-motion';
import { Globe, Hash, ShieldCheck } from 'lucide-react';
import { KonfigurasiProps } from './types/konfigurasi.types';
import { SyncBanner } from './components/SyncBanner';
import { IntegrationCard } from './components/IntegrationCard';

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
  handleSyncSinta,
  tabVariants,
}: KonfigurasiProps) {
  return (
    <motion.div
      key="integrasi"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Banner Sinkronisasi Publikasi */}
      <SyncBanner
        loading={loading}
        scholarId={scholarId}
        scopusId={scopusId}
        onSyncAll={handleSyncAll}
        onSyncSinta={handleSyncSinta}
      />

      {/* Kartu Integrasi */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Google Scholar */}
        <IntegrationCard
          title="Google Scholar"
          description="Dipakai untuk mengambil dokumen, sitasi, h-index, dan daftar publikasi Scholar."
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
          onSync={handleSyncScopus}
        />
      </div>
    </motion.div>
  );
}
