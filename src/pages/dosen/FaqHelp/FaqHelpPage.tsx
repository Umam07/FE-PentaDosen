import React, { useEffect, lazy, Suspense } from 'react';
import type { UserSession } from './types/faqHelp.types';
import { useFaqHelp } from './hooks/useFaqHelp';
import { toast } from '@/components/ui/toast';
import FaqHelpHeader from './components/FaqHelpHeader';
import FaqHelpTabs from './components/FaqHelpTabs';
import FaqRightSidebar from './components/FaqRightSidebar';
import FaqCategoryFilter from './components/FaqCategoryFilter';
import FaqSearchInput from './components/FaqSearchInput';
import FaqAccordionList from './components/FaqAccordionList';
import MyTicketsList from './components/MyTicketsList';
import CreateTicketModal from './components/CreateTicketModal';
import ImagePreviewModal from './components/ImagePreviewModal';
const PdfPreviewModal = lazy(() => import('../../../components/features/documents').then(m => ({ default: m.PdfPreviewModal })));

export default function FaqHelp({ user }: { user: UserSession }) {
  const faqState = useFaqHelp(user);

  // Manual book PDF finding
  const manualBookFaq = faqState.faqs.find(f => f.file_url);

  const handleOpenManualBookPdf = manualBookFaq ? () => {
    faqState.setPreviewDoc({
      fileUrl: manualBookFaq.file_url!,
      title: manualBookFaq.question,
      category: manualBookFaq.category || 'Manual Book'
    });
  } : undefined;

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
    <main id="main-content" className="w-full space-y-5 pb-20">
      {/* Accessible Skip to Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Lewati ke Konten Utama
      </a>

      {/* Header Halaman */}
      <FaqHelpHeader />

      {/* Konten Terpusat & Luas */}
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Navigation Tabs (Panduan vs Pesan Saya) */}
        <FaqHelpTabs
          activeMainTab={faqState.activeMainTab}
          unreadTicketCount={faqState.unreadTicketCount}
          onTabSwitch={faqState.handleTabSwitch}
        />

        {/* TAB 1: PANDUAN & MANUAL BOOK (2-COLUMN DENSE LAYOUT) */}
        {faqState.activeMainTab === 'panduan' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Kolom Kiri: Search, Category Filter, Accordion FAQ (8 Cols) */}
            <div className="lg:col-span-8 space-y-3.5">
              <FaqSearchInput
                searchQuery={faqState.searchQuery}
                onSearchChange={faqState.setSearchQuery}
                onClear={() => faqState.setSearchQuery('')}
              />

              <FaqCategoryFilter
                categories={faqState.categories}
                selectedCategory={faqState.selectedCategory}
                onSelectCategory={faqState.setSelectedCategory}
              />

              <FaqAccordionList
                loading={faqState.loading}
                filteredFaqs={faqState.filteredFaqs}
                expandedFaqId={faqState.expandedFaqId}
                searchQuery={faqState.searchQuery}
                onToggleExpand={faqState.toggleExpandFaq}
                onPreviewDoc={faqState.setPreviewDoc}
                onClearSearch={() => {
                  faqState.setSearchQuery('');
                  faqState.setSelectedCategory('semua');
                }}
              />
            </div>

            {/* Kolom Kanan: Pengumuman & Akses Cepat Panduan (4 Cols) */}
            <div className="lg:col-span-4">
              <FaqRightSidebar
                onSelectCategory={(catId) => {
                  faqState.setSelectedCategory(catId);
                  faqState.setSearchQuery('');
                }}
                onPreviewManualBookPdf={handleOpenManualBookPdf}
                announcements={faqState.announcements}
              />
            </div>
          </div>
        )}

        {/* TAB 2: PESAN SAYA (DISCORD SUPPORT TICKET DESK) */}
        {faqState.activeMainTab === 'pesan' && (
          <MyTicketsList
            loadingTickets={faqState.loadingTickets}
            myTickets={faqState.myTickets}
            selectedTicketId={faqState.selectedTicketId}
            user={user}
            onSelectTicket={faqState.setSelectedTicketId}
            onUpdateTicketStatus={faqState.handleUpdateTicketStatus}
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
