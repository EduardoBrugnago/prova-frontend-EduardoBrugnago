import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { authBridge } from '../authBridge';

type RetrialConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// aqui é para evitar chamadas paralelas darem 401 juntas, gerando multiplos refresh e deslogando o usuario
let refreshPromise: Promise<string> | null = null;

export function refreshQueue(client: AxiosInstance) {
  client.interceptors.response.use(undefined, async (error: AxiosError) => {
    const original = error.config as RetrialConfig | undefined;

    const shouldRenew =
      error.response?.status === 401 && !!original && !original._retry && authBridge.canRenew;

    if (!shouldRenew) {
      return Promise.reject(error);
    }

    original._retry = true;

    refreshPromise ??= authBridge.renew().finally(() => {
      refreshPromise = null;
    });

    try {
      const token = await refreshPromise;
      original.headers.Authorization = `Bearer ${token}`;
      return await client(original);
    } catch {
      authBridge.expire();
      return Promise.reject(error);
    }
  });
}
