import type { AxiosInstance } from 'axios';

import { authBridge } from '../authBridge';

export function attachToken(client: AxiosInstance) {
  client.interceptors.request.use((config) => {
    const token = authBridge.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}
