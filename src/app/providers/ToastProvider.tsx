import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { ToastContext } from './useToast';
import type { ToastSeverity } from './useToast';

interface ToastState {
  message: string;
  severity: ToastSeverity;
}

export interface ToastProviderProps {
  children: ReactNode;
}

// snackbar pra aplicacao inteira
function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => {
    const show = (message: string, severity: ToastSeverity) => {
      setToast({ message, severity });
      setIsOpen(true);
    };

    return {
      success: (message: string) => show(message, 'success'),
      error: (message: string) => show(message, 'error'),
    };
  }, []);

  return (
    <ToastContext value={value}>
      {children}

      <Snackbar
        open={isOpen}
        autoHideDuration={4000}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast?.severity ?? 'success'} variant="filled" onClose={close}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext>
  );
}

export default ToastProvider;
