import { useEffect } from 'react';
import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { restoreSession, useSession } from '../../modules/auth';
import { useAppDispatch } from '../store/hooks';

export interface SessionGateProps {
  children: ReactNode;
}

function SessionGate({ children }: SessionGateProps) {
  const dispatch = useAppDispatch();
  const { status, isResolving } = useSession();

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(restoreSession());
    }
  }, [status, dispatch]);

  if (isResolving) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return children;
}

export default SessionGate;
