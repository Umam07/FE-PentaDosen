import { motion } from 'framer-motion';
import { DetailInformasiProps } from './DetailInformasi/types/detailInformasi.types';
import { useDetailInformasi } from './DetailInformasi/hooks/useDetailInformasi';
import { ProfileCompletion } from './DetailInformasi/components/ProfileCompletion';
import { AcademicInfo } from './DetailInformasi/components/AcademicInfo';
import { PublicationIdentity } from './DetailInformasi/components/PublicationIdentity';

export default function DetailInformasi({ user, tabVariants }: DetailInformasiProps) {
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
      />

      {/* Grid Informasi Utama */}
      <div className="space-y-6">
        {/* Informasi Akademik */}
        <AcademicInfo user={user} />

        {/* Identitas Publikasi */}
        <PublicationIdentity user={user} />
      </div>
    </motion.div>
  );
}
