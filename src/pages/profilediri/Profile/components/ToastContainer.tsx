import React, { useEffect } from 'react';
import { ToastMessage } from '../types/profile.types';
import { toast } from '@/components/ui/toast';

interface ToastContainerProps {
  message: ToastMessage;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ message }) => {
  useEffect(() => {
    if (!message.text) return;

    if (message.type === 'success') {
      toast.success(message.text, 'Sukses');
    } else if (message.type === 'error') {
      toast.error(message.text, 'Gagal');
    } else {
      toast.info(message.text, 'Informasi');
    }
  }, [message.text, message.type]);

  return null;
};
