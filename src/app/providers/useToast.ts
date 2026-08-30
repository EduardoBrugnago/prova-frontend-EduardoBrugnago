import { createContext, useContext } from 'react';

export type ToastSeverity = 'success' | 'error';

export interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast precisa estar dentro do ToastProvider');
  }

  return context;
}
