import type { AxiosError, AxiosInstance } from 'axios';

import type { AppError, ErrorKind } from '../errors';

const MESSAGES: Record<ErrorKind, string> = {
  validation: 'Verifique os campos destacados.',
  auth: 'Sua sessão expirou. Faça login novamente.',
  notFound: 'Usuario não encontrado.',
  server: 'O serviço está indisponível no momento.',
  network: 'Sem conexão com o servidor.',
  timeout: 'A requisição demorou demais para responder.',
};

function kindByStatus(status?: number): ErrorKind {
  if (!status) return 'network';
  if (status === 400 || status === 422) return 'validation';
  if (status === 401) return 'auth';
  if (status === 404) return 'notFound';
  return 'server';
}

interface ApiErrorBody {
  message?: string | string[];
}

// So usa mensagem do servidor quando ela vem como lista
function extractMessage(kind: ErrorKind, body: ApiErrorBody | undefined): string | undefined {
  if (kind !== 'validation') return undefined;
  if (!Array.isArray(body?.message)) return undefined;

  return body.message.join(' ');
}

// trata o status da requisiçao, e devolver normalizado sem 401/404/etc.
export function normalizeError(client: AxiosInstance, service: string) {
  client.interceptors.response.use(undefined, (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status;
    const kind: ErrorKind = error.code === 'ECONNABORTED' ? 'timeout' : kindByStatus(status);

    const appError: AppError = {
      kind,
      status,
      service,
      message: extractMessage(kind, error.response?.data) ?? MESSAGES[kind],
    };

    return Promise.reject(appError);
  });
}
