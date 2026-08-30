import axios from 'axios';
import type { AxiosInstance } from 'axios';

import { attachToken } from './interceptors/attachToken';
import { normalizeError } from './interceptors/normalizeError';
import { refreshQueue } from './interceptors/refreshQueue';

export interface CreateClientOptions {
  service: string;
  withRefresh?: boolean;
}

export function createClient(baseURL: string, options: CreateClientOptions): AxiosInstance {
  const client = axios.create({ baseURL, timeout: 15_000 });

  attachToken(client);

  // ordem importa: o refresh precisa ver o erro bruto do axios, antes do normalizeError
  if (options.withRefresh !== false) {
    refreshQueue(client);
  }

  normalizeError(client, options.service);

  return client;
}
