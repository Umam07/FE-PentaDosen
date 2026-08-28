import React, { useEffect, lazy, Suspense } from 'react';
import type { UserSession } from './types/faqHelp.types';
import { useFaqHelp } from './hooks/useFaqHelp';
import { toast } from '@/components/ui/toast';
import FaqHelpHeader from './components/FaqHelpHeader';
import FaqHelpTabs from './components/FaqHelpTabs';
import FaqSearchInput from './components/FaqSearchInput';
import FaqAccordionList from './components/FaqAccordionList';
import MyTicketsList from './components/MyTicketsList';
import CreateTicketModal from './components/CreateTicketModal';
import ImagePreviewModal from './components/ImagePreviewModal';
const PdfPreviewModal = lazy(() => import('../../../components/features/documents').then(m => ({ default: m.PdfPreviewModal })));
import AnnouncementsBanner from '../../../components/shared/AnnouncementsBanner';

export default function FaqHelp({ user }: { user: UserSession }) {
  const faqState = useFaqHelp(user);

  useEffect(() => {
    if (faqState.toast.message) {
      toast.show({
        title: faqState.toast.type === 'success' ? 'Sukses' : 'Gagal',
        message: faqState.toast.message,
        variant: faqState.toast.type === 'success' ? 'success' : 'error',
      });
    }
  }, [faqState.toast]);

  return (
    <main id="main-content" className="w-full space-y-6 pb-20">
      {/* Accessible Skip to Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Lewati ke Konten Utama
      </a>

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
      {faqState.previewDoc && (
        <Suspense fallback={null}>
          <PdfPreviewModal
            isOpen={!!faqState.previewDoc}
            onClose={() => faqState.setPreviewDoc(null)}
            fileUrl={faqState.previewDoc?.fileUrl ?? null}
            title={faqState.previewDoc?.title}
            category={faqState.previewDoc?.category}
          />
        </Suspense>
      )}
    </main>
  );
}
