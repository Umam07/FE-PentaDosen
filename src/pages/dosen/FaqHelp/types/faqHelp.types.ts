export type MainTab = 'panduan' | 'pesan';

export interface UserSession {
  id: number;
  role?: string;
  name?: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
  file_url?: string;
}

export interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  type?: string;
  created_at?: string;
}

export interface TicketMessage {
  id: string;
  sender: 'user' | 'admin';
  sender_id?: number;
  sender_name?: string;
  sender_role?: string;
  message: string;
  image_url?: string;
  created_at: string;
}

export interface SupportTicketItem {
  id: number;
  user_id: number;
  subject?: string;
  message: string;
  image_url?: string;
  status: string;
  admin_reply?: string;
  replied_at?: string;
  messages?: TicketMessage[];
  created_at: string;
}

export interface PreviewDocState {
  fileUrl: string;
  title: string;
  category?: string;
}

export interface ToastState {
  message: string | null;
  type: 'success' | 'error';
}

// Sub-component Props Interfaces

export interface FaqHelpHeaderProps {
  title?: string;
  subtitle?: string;
}

export interface FaqHelpTabsProps {
  activeMainTab: MainTab;
  unreadTicketCount: number;
  onTabSwitch: (tab: MainTab) => void;
}

export interface FaqSearchInputProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onClear: () => void;
}

export interface FaqAccordionListProps {
  loading: boolean;
  filteredFaqs: FaqItem[];
  expandedFaqId: number | null;
  searchQuery: string;
  onToggleExpand: (id: number) => void;
  onPreviewDoc: (doc: PreviewDocState) => void;
  onClearSearch: () => void;
}

export interface MyTicketsListProps {
  loadingTickets: boolean;
  myTickets: SupportTicketItem[];
  expandedTicketId?: number | null;
  selectedTicketId?: number | null;
  user?: UserSession;
  onToggleTicketExpand?: (id: number) => void;
  onSelectTicket?: (id: number | null) => void;
  onUpdateTicketStatus?: (id: number, status: string) => Promise<void>;
  onOpenCreateModal: () => void;
  onZoomImage: (url: string) => void;
  onRefreshTickets?: () => void;
  showToast?: (msg: string, type?: 'success' | 'error') => void;
}

export interface CreateTicketModalProps {
  isOpen: boolean;
  ticketSubject: string;
  ticketMessage: string;
  ticketImageFile: File | null;
  ticketImagePreview: string | null;
  submittingTicket: boolean;
  onClose: () => void;
  onSubjectChange: (val: string) => void;
  onMessageChange: (val: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface ImagePreviewModalProps {
  fullViewImageUrl: string | null;
  onClose: () => void;
}

export interface FaqCategoryOption {
  id: string;
  name: string;
  count?: number;
}

export interface FaqCategoryFilterProps {
  categories: FaqCategoryOption[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export interface FaqRightSidebarProps {
  onSelectCategory: (catId: string) => void;
  onPreviewManualBookPdf?: () => void;
  announcements?: AnnouncementItem[];
}
