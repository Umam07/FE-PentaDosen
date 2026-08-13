import React, { useRef, useEffect } from 'react';
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
import Toaster, { ToasterRef } from '@/components/ui/toast';

export default function FaqHelp({ user }: { user: UserSession }) {
  const faqState = useFaqHelp(user);
  const toasterRef = useRef<ToasterRef>(null);

  useEffect(() => {
    if (faqState.toast.message) {
      toasterRef.current?.show({
        title: faqState.toast.type === 'success' ? 'Sukses' : 'Gagal',
        message: faqState.toast.message,
        variant: faqState.toast.type === 'success' ? 'success' : 'error',
        position: 'bottom-right',
      });
    }
  }, [faqState.toast]);

  return (
    <div className="w-full min-h-screen space-y-6 pb-20">

      {/* Toast Notification */}
      <Toaster ref={toasterRef} defaultPosition="bottom-right" />

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
            user={user}
            onToggleTicketExpand={faqState.toggleTicketExpand}
            onOpenCreateModal={() => faqState.setIsTicketModalOpen(true)}
            onZoomImage={faqState.setFullViewImageUrl}
            onRefreshTickets={faqState.loadMyTickets}
            showToast={faqState.showToast}
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
