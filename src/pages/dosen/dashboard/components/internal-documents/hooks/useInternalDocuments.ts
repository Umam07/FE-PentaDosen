import { useState } from 'react';
import type { InternalDocument, DocPreview, MainTab } from '../internal-documents.types';

interface UseInternalDocumentsReturn {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  selectedDocForDetail: InternalDocument | null;
  setSelectedDocForDetail: (doc: InternalDocument | null) => void;
  previewDoc: DocPreview | null;
  setPreviewDoc: (preview: DocPreview | null) => void;
}

/**
 * Mengelola state UI lokal di InternalDocumentsView:
 * tab aktif, dokumen yang dipilih untuk drawer detail, dan dokumen untuk preview PDF.
 */
export function useInternalDocuments(): UseInternalDocumentsReturn {
  const [activeTab, setActiveTab] = useState<MainTab>('dokumen');
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<InternalDocument | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocPreview | null>(null);

  return {
    activeTab,
    setActiveTab,
    selectedDocForDetail,
    setSelectedDocForDetail,
    previewDoc,
    setPreviewDoc,
  };
}
