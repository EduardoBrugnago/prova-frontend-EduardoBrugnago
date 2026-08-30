import type { ReactNode } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { Theme } from '../../generic/theme';
import { store } from '../store';
import SessionGate from './SessionGate';
import ToastProvider from './ToastProvider';

export interface AppProvidersProps {
  children: ReactNode;
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={Theme.Light}>
        <CssBaseline />
        <ToastProvider>
          <BrowserRouter>
            <SessionGate>{children}</SessionGate>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default AppProviders;
