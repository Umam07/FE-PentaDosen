import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { UserSession } from './types/faqHelp.types';
import { useFaqHelp } from './hooks/useFaqHelp';
import FaqHelpHeader from './components/FaqHelpHeader';
import FaqHelpTabs from './components/FaqHelpTabs';
import FaqSearchInput from './components/FaqSearchInput';
import FaqAccordionList from './components/FaqAccordionList';
import MyTicketsList from './components/MyTicketsList';
import CreateTicketModal from './components/CreateTicketModal';
import ImagePreviewModal from './components/ImagePreviewModal';
import { PdfPreviewModal } from '../../../components/ui/pdf-preview-modal';
import AnnouncementsBanner from '../../../components/ui/AnnouncementsBanner';

export default function FaqHelp({ user }: { user: UserSession }) {
  const faqState = useFaqHelp(user);

  return (
    <div className="mx-auto min-h-screen max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 space-y-6 pb-20">

      {/* Toast Notification */}
      <AnimatePresence>
        {faqState.toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-5 z-[999] p-4 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-bold ${
              faqState.toast.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/90 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
            }`}
          >
            {faqState.toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{faqState.toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Halaman */}
      <FaqHelpHeader />

      {/* Konten Terpusat (max-width: 850px) */}
      <div className="max-w-[850px] mx-auto space-y-6">

        {/* Global Announcements Banner */}
        <AnnouncementsBanner announcements={faqState.announcements} />

        {/* Navigation Tabs (Panduan vs Pesan Saya) */}
        <FaqHelpTabs
          activeMainTab={faqState.activeMainTab}
          unreadTicketCount={faqState.unreadTicketCount}
          onTabSwitch={faqState.handleTabSwitch}
        />

        {/* TAB 1: PANDUAN & MANUAL BOOK */}
        {faqState.activeMainTab === 'panduan' && (
          <div className="space-y-6">
            <FaqSearchInput
              searchQuery={faqState.searchQuery}
              onSearchChange={faqState.setSearchQuery}
              onClear={() => faqState.setSearchQuery('')}
            />

            <FaqAccordionList
              loading={faqState.loading}
              filteredFaqs={faqState.filteredFaqs}
              expandedFaqId={faqState.expandedFaqId}
              searchQuery={faqState.searchQuery}
              onToggleExpand={faqState.toggleExpandFaq}
              onPreviewDoc={faqState.setPreviewDoc}
              onClearSearch={() => faqState.setSearchQuery('')}
            />
          </div>
        )}

        {/* TAB 2: PESAN SAYA */}
        {faqState.activeMainTab === 'pesan' && (
          <MyTicketsList
            loadingTickets={faqState.loadingTickets}
            myTickets={faqState.myTickets}
            expandedTicketId={faqState.expandedTicketId}
            onToggleTicketExpand={faqState.toggleTicketExpand}
            onOpenCreateModal={() => faqState.setIsTicketModalOpen(true)}
            onZoomImage={faqState.setFullViewImageUrl}
          />
        )}
      </div>

      {/* Modal Kirim Pesan Ke Admin */}
      <CreateTicketModal
        isOpen={faqState.isTicketModalOpen}
        ticketSubject={faqState.ticketSubject}
        ticketMessage={faqState.ticketMessage}
        ticketImageFile={faqState.ticketImageFile}
        ticketImagePreview={faqState.ticketImagePreview}
        submittingTicket={faqState.submittingTicket}
        onClose={() => faqState.setIsTicketModalOpen(false)}
        onSubjectChange={faqState.setTicketSubject}
        onMessageChange={faqState.setTicketMessage}
        onImageChange={faqState.handleImageFileChange}
        onRemoveImage={faqState.removeSelectedImage}
        onSubmit={faqState.handleCreateTicket}
      />

      {/* Modal Zoom Gambar Full */}
      <ImagePreviewModal
        fullViewImageUrl={faqState.fullViewImageUrl}
        onClose={() => faqState.setFullViewImageUrl(null)}
      />

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={!!faqState.previewDoc}
        onClose={() => faqState.setPreviewDoc(null)}
        fileUrl={faqState.previewDoc?.fileUrl ?? null}
        title={faqState.previewDoc?.title}
        category={faqState.previewDoc?.category}
      />
    </div>
  );
}
