import { useCallback, useState } from 'react';

import { useAppDispatch } from '../../../app/store/hooks';
import { isAppError } from '../../../services/api';
import { authApi, useLoginMutation } from '../../../services/auth';
import { toAuthUser, toLoginPayload } from '../mappers/session.mapper';
import type { Credentials } from '../model/session';
import { refreshStorage } from '../storage';
import { sessionEnded, sessionStarted, tokensRenewed } from '../store/authSlice';

export function useLogin() {
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState<string | null>(null);

  // troca credencial por token, guarda o refresh, busca o perfil e so entao marca como autenticado
  const signIn = useCallback(
    async (credentials: Credentials): Promise<boolean> => {
      setError(null);

      try {
        const tokens = await login(toLoginPayload(credentials)).unwrap();

        refreshStorage.set(tokens.refresh_token);
        dispatch(tokensRenewed({ accessToken: tokens.access_token }));

        const profile = await dispatch(
          authApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true }),
        ).unwrap();

        dispatch(sessionStarted({ accessToken: tokens.access_token, user: toAuthUser(profile) }));

        return true;
      } catch (caught) {
        refreshStorage.clear();
        dispatch(sessionEnded());
        setError(toLoginMessage(caught));
        return false;
      }
    },
    [dispatch, login],
  );

  return { signIn, isLoading, error };
}

// "401: credencial errada" o interceptor foi configurado pra logado, aqui gera uma mensagem pra essa situaçao de deslogado
function toLoginMessage(caught: unknown): string {
  if (!isAppError(caught)) {
    return 'Não foi possível entrar. Tente de novo.';
  }

  return caught.kind === 'auth' ? 'E-mail ou senha inválidos.' : caught.message;
}
