'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import Toast, { ToastProps } from '@/components/ui/Toast';

interface ToastContextType {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    addToast({ type: 'success', message, title });
  }, [addToast]);

  const showError = useCallback((message: string, title?: string) => {
    addToast({ type: 'error', message, title });
  }, [addToast]);

  const showWarning = useCallback((message: string, title?: string) => {
    addToast({ type: 'warning', message, title });
  }, [addToast]);

  const showInfo = useCallback((message: string, title?: string) => {
    addToast({ type: 'info', message, title });
  }, [addToast]);

  const contextValue: ToastContextType = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast Container <div className="fixed top-6 right-6 z-50 space-y-3 max-w-md">*/}
      <div>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;