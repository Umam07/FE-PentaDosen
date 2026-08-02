import React, { useEffect } from 'react';
import { ToastMessage } from '../types/profile.types';
import { toast } from '@/components/ui/toast';

interface ToastContainerProps {
  message: ToastMessage;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ message }) => {
  useEffect(() => {
    if (message.text) {
      toast.show({
        title: message.type === 'success' ? 'Sukses' : 'Gagal',
        message: message.text,
        variant: message.type === 'success' ? 'success' : 'error',
        position: 'bottom-right',
      });
    }
  }, [message.text, message.type]);

  return null;
};
