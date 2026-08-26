import { AnimatePresence, motion, Variants } from 'framer-motion';
import DetailInformasi from '../DetailInformasi/DetailInformasiTab';
import Konfigurasi from '../Konfigurasi/KonfigurasiTab';
import { useProfile } from './hooks/useProfile';
import { WarningModal } from './components/WarningModal';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileTabs } from './components/ProfileTabs';
import { ToastContainer } from './components/ToastContainer';

export default function Profile({ user, setUser }: { user: any; setUser: any }) {
  // Menggunakan custom hook untuk mengelola logic profile
  const {
    scholarId,
    setScholarId,
    scopusId,
    setScopusId,
    scholarData,
    setScholarData,
    scopusData,
    setScopusData,
    loading,
    setLoading,
    checkingInfo,
    setCheckingInfo,
    checkingScopus,
    setCheckingScopus,
    checkedAuthor,
    setCheckedAuthor,
    checkedScopusAuthor,
    setCheckedScopusAuthor,
    message,
    setMessage,
    showWarningModal,
    setShowWarningModal,
    warningDismissedRef,
    activeTab,
    setActiveTab,
    stats,
    handleCheckId,
    handleSaveScholarId,
    handleCheckScopusId,
    handleSaveScopusId,
    handleDeleteScholarId,
    handleDeleteScopusId,
    handleSync,
    handleSyncScopus,
    handleSyncAll,
    handleSyncSinta,
  } = useProfile(user, setUser);

  const tabVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <div className="w-full min-h-screen pb-20">
      {/* Warning Modal */}
      <AnimatePresence>
        {showWarningModal && (
          <WarningModal
            show={showWarningModal}
            onLengkapi={() => {
              setShowWarningModal(false);
              setActiveTab('integrasi');
            }}
            onNanti={() => {
              warningDismissedRef.current = true;
              setShowWarningModal(false);
            }}
          />
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Profile Header */}
        <ProfileHeader user={user} stats={stats} />

        {/* Tab Navigation */}
        <ProfileTabs
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Active Tab Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            className="w-full"
          >
            {activeTab === 'info' ? (
              <DetailInformasi
                user={user}
                tabVariants={tabVariants}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            ) : (
              <Konfigurasi
                user={user}
                setUser={setUser}
                scholarId={scholarId}
                setScholarId={setScholarId}
                scopusId={scopusId}
                setScopusId={setScopusId}
                scholarData={scholarData}
                setScholarData={setScholarData}
                scopusData={scopusData}
                setScopusData={setScopusData}
                loading={loading}
                setLoading={setLoading}
                checkingInfo={checkingInfo}
                setCheckingInfo={setCheckingInfo}
                checkingScopus={checkingScopus}
                setCheckingScopus={setCheckingScopus}
                checkedAuthor={checkedAuthor}
                setCheckedAuthor={setCheckedAuthor}
                checkedScopusAuthor={checkedScopusAuthor}
                setCheckedScopusAuthor={setCheckedScopusAuthor}
                message={message}
                setMessage={setMessage}
                handleCheckId={handleCheckId}
                handleSaveScholarId={handleSaveScholarId}
                handleCheckScopusId={handleCheckScopusId}
                handleSaveScopusId={handleSaveScopusId}
                handleDeleteScholarId={handleDeleteScholarId}
                handleDeleteScopusId={handleDeleteScopusId}
                handleSync={handleSync}
                handleSyncScopus={handleSyncScopus}
                handleSyncAll={handleSyncAll}
                handleSyncSinta={handleSyncSinta}
                tabVariants={tabVariants}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Notifications */}
      <ToastContainer message={message} />
    </div>
  );
}
