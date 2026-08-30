import { useCallback } from 'react';

import { useAppDispatch } from '../../../app/store/hooks';
import { authApi } from '../../../services/auth';
import { refreshStorage } from '../storage';
import { sessionEnded } from '../store/authSlice';

export function useLogout() {
  const dispatch = useAppDispatch();

  return useCallback(() => {
    refreshStorage.clear();
    dispatch(sessionEnded());
    // zera o cache do redux, senao sobra artefato do usuario anterior
    dispatch(authApi.util.resetApiState());
  }, [dispatch]);
}
