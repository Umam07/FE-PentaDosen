import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Beaker, Shield, Book, Globe, BookMarked } from 'lucide-react';
import type { AdminUser, MainCategoryOption } from './types/adminInputDocument.types';
import { useAdminInputDocument } from './hooks/useAdminInputDocument';
import InputDocumentHeader from './components/InputDocumentHeader';
import InputTabSelector from './components/InputTabSelector';
import ManualDocumentForm from './components/ManualDocumentForm';
import BatchExcelImportPanel from './components/BatchExcelImportPanel';

export default function AdminInputDocument() {
  const { user: adminUser } = useOutletContext<{ user: AdminUser }>();

  const docState = useAdminInputDocument(adminUser);

  const mainCategories: MainCategoryOption[] = [
    { id: 'Penelitian', label: 'Penelitian', icon: Beaker },
    { id: 'HKI', label: 'HKI', icon: Shield },
    { id: 'Buku', label: 'Buku', icon: Book },
    { id: 'Jurnal Internasional', label: 'Jurnal Internasional', icon: Globe },
    { id: 'Jurnal Nasional', label: 'Jurnal Nasional', icon: BookMarked },
  ];

  return (
    <div className="max-w-none space-y-8 pb-12">
      {/* Header Halaman */}
      <InputDocumentHeader />

      {/* Kartu Utama Input Dokumen */}
      <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-[2.5rem] border border-gray-100 dark:border-zinc-800">
        <div className="p-8 lg:p-12 space-y-10">
          
          {/* Tab Selector di Bagian Atas Card */}
          <InputTabSelector
            activeTab={docState.activeInputTab}
            onTabChange={(tab) => {
              docState.setActiveInputTab(tab);
            }}
          />

          {/* Tab 1: Input Manual */}
          {docState.activeInputTab === 'manual' && (
            <ManualDocumentForm
              users={docState.filteredUsers}
              selectedUserId={docState.selectedUserId}
              searchTerm={docState.searchTerm}
              isDropdownOpen={docState.isDropdownOpen}
              dropdownRef={docState.dropdownRef}
              title={docState.title}
              mainCategory={docState.mainCategory}
              subCategoryOptions={docState.subCategoryOptions}
              subCategory={docState.subCategory}
              hkiType={docState.hkiType}
              inventorName={docState.inventorName}
              dateVal={docState.dateVal}
              docType={docState.docType}
              danaDisetujui={docState.danaDisetujui}
              fokus={docState.fokus}
              file={docState.file}
              loading={docState.loading}
              message={docState.message}
              messageType={docState.messageType}
              isDragging={docState.isDragging}
              scoringPreview={docState.scoringPreview}
              mainCategories={mainCategories}
              onSearchUserChange={docState.setSearchTerm}
              onSelectUser={(id) => {
                docState.setSelectedUserId(id);
                docState.setIsDropdownOpen(false);
              }}
              onToggleDropdown={() => docState.setIsDropdownOpen(!docState.isDropdownOpen)}
              onTitleChange={docState.setTitle}
              onSelectMainCategory={docState.setMainCategory}
              onSelectSubCategory={docState.setSubCategory}
              onHkiTypeChange={docState.setHkiType}
              onInventorNameChange={docState.setInventorName}
              onDateChange={docState.setDateVal}
              onDocTypeChange={docState.setDocType}
              onDanaDisetujuiChange={docState.setDanaDisetujui}
              onFokusChange={docState.setFokus}
              onFileChange={docState.setFile}
              onDragOver={docState.handleDragOver}
              onDragLeave={docState.handleDragLeave}
              onDrop={docState.handleDropManual}
              onSubmit={docState.handleUploadManual}
            />
          )}

          {/* Tab 2: Import Excel Massal */}
          {docState.activeInputTab === 'import' && (
            <BatchExcelImportPanel
              mainCategory={docState.mainCategory}
              isImporting={docState.isImporting}
              importProgress={docState.importProgress}
              importResult={docState.importResult}
              message={docState.message}
              messageType={docState.messageType}
              isDragging={docState.isDragging}
              onDownloadTemplate={docState.handleDownloadTemplate}
              onImportExcel={docState.handleImportExcel}
              onDragOver={docState.handleDragOver}
              onDragLeave={docState.handleDragLeave}
              onDropFile={docState.handleDropImport}
            />
          )}

        </div>
      </section>
    </div>
  );
}
