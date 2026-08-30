import type { ReactNode } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { Theme } from '../../generic/theme';

export interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Ponto unico de provider da aplicacao. Por enquanto so tema e reset, o store do
 * Redux e o router entram aqui quando a integracao comecar.
 */
function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider theme={Theme.Light}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default AppProviders;
