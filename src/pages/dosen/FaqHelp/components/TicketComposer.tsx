import React, { useRef, useEffect } from 'react';
import { Paperclip, Send, X } from 'lucide-react';

interface TicketComposerProps {
  replyText: string;
  replyImagePreview: string | null;
  replyImageFile: File | null;
  submittingReply: boolean;
  onReplyTextChange: (text: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const QUICK_SUGGESTIONS = [
  'Bisa tolong dicek kembali?',
  'Sudah saya lampirkan tangkapan layar.',
  'Mohon update statusnya.',
  'Terima kasih banyak!',
];

export default function TicketComposer({
  replyText,
  replyImagePreview,
  replyImageFile,
  submittingReply,
  onReplyTextChange,
  onImageChange,
  onRemoveImage,
  onSubmit,
}: TicketComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea height secara stabil tanpa pergeseran layout mendadak
  useEffect(() => {
    if (textareaRef.current) {
      if (!replyText.trim()) {
        textareaRef.current.style.height = '36px';
      } else {
        textareaRef.current.style.height = '36px';
        const scrollH = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${Math.max(36, Math.min(scrollH, 96))}px`;
      }
    }
  }, [replyText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (replyText.trim() && !submittingReply) {
        onSubmit(e);
      }
    }
  };

  const handleSuggestionClick = (text: string) => {
    onReplyTextChange(replyText ? `${replyText} ${text}` : text);
    textareaRef.current?.focus();
  };

  return (
    <div className="shrink-0 border-t border-hairline-light dark:border-hairline-dark px-4 py-3 bg-surface-light dark:bg-surface-dark space-y-2">
      
      {/* Preview Lampiran Gambar jika dipilih */}
      {replyImagePreview && (
        <div className="relative group inline-flex items-center gap-2.5 p-1.5 pr-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl border border-hairline-light dark:border-hairline-dark shadow-2xs">
          <img
            src={replyImagePreview}
            alt="Pratinjau lampiran balasan"
            className="w-10 h-10 object-cover rounded-lg border border-hairline-light dark:border-hairline-dark shrink-0"
          />
          <div className="text-[11px] min-w-0">
            <p className="font-semibold text-ink-heading dark:text-on-dark truncate max-w-[160px]">
              {replyImageFile?.name || 'Screenshot'}
            </p>
            <p className="text-[9.5px] text-muted dark:text-on-dark-muted font-mono">
              {replyImageFile ? (replyImageFile.size / (1024 * 1024)).toFixed(2) : 0} MB
            </p>
          </div>
          <button
            type="button"
            onClick={onRemoveImage}
            aria-label="Hapus gambar lampiran"
            className="p-1 rounded-full bg-error text-white hover:bg-error/90 transition-colors cursor-pointer ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Input Bar Compact */}
      <form
        onSubmit={onSubmit}
        className="flex items-center gap-2 rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated px-3 py-1.5 focus-within:border-accent dark:focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/15 transition-all shadow-2xs"
      >
        {/* Tombol Lampirkan File */}
        <label
          aria-label="Lampirkan tangkapan layar"
          title="Lampirkan tangkapan layar"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors cursor-pointer shrink-0"
        >
          <Paperclip className="w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
            aria-label="Pilih file gambar screenshot"
          />
        </label>

        {/* Textarea Balasan 1 Baris */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={replyText}
          onChange={(e) => onReplyTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tulis balasan atau pertanyaan susulan ke admin..."
          aria-label="Tulis balasan pesan"
          style={{ height: '36px' }}
          className="flex-1 resize-none text-[13px] bg-transparent py-1.5 text-ink-heading dark:text-on-dark placeholder-muted dark:placeholder-on-dark-muted outline-hidden leading-snug overflow-y-auto"
        />

        {/* Tombol Kirim */}
        <button
          type="submit"
          disabled={submittingReply || !replyText.trim()}
          aria-label="Kirim pesan balasan"
          className="w-7 h-7 rounded-lg bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink dark:bg-on-dark dark:hover:bg-white dark:text-ink flex items-center justify-center shrink-0 transition-all shadow-2xs active:scale-95 disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-muted dark:text-on-dark-muted font-medium mr-0.5 hidden sm:inline">
          Saran:
        </span>
        {QUICK_SUGGESTIONS.map((text, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSuggestionClick(text)}
            className="text-[10.5px] px-2.5 py-0.5 rounded-full border border-hairline-light-soft dark:border-hairline-dark-soft hover:border-ink-border dark:hover:border-hairline-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark bg-surface-light dark:bg-surface-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer"
          >
            {text}
          </button>
        ))}
      </div>

    </div>
  );
}
