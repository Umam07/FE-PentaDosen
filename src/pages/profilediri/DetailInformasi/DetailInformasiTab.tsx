import { motion } from 'framer-motion';
import { DetailInformasiProps } from './types/detailInformasi.types';
import { useDetailInformasi } from './hooks/useDetailInformasi';
import { ProfileCompletion } from './components/ProfileCompletion';
import { AcademicInfo } from './components/AcademicInfo';
import { PublicationIdentity } from './components/PublicationIdentity';

export default function DetailInformasi({
  user,
  tabVariants,
  onNavigateTab,
}: DetailInformasiProps) {
  // Menggunakan custom hook untuk menghitung data kelengkapan profil
  const { completionItems, completionPercent } = useDetailInformasi(user);

  return (
    <motion.div
      key="info"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Kelengkapan Profil */}
      <ProfileCompletion
        completionPercent={completionPercent}
        completionItems={completionItems}
        onNavigateTab={onNavigateTab}
      />

      {/* Grid Informasi Utama */}
      <div className="space-y-6">
        {/* Informasi Akademik & Identitas Dosen */}
        <AcademicInfo user={user} />

        {/* Identitas Publikasi & Riset Ilmiah (Google Scholar & Scopus only) */}
        <PublicationIdentity user={user} onNavigateTab={onNavigateTab} />
      </div>
    </motion.div>
  );
}

