export type ErrorKind = 'validation' | 'auth' | 'notFound' | 'server' | 'network' | 'timeout';

export interface AppError {
  kind: ErrorKind;
  message: string;
  status?: number;
  service?: string;
}

export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'kind' in error &&
    'message' in error &&
    typeof (error as AppError).message === 'string'
  );
}

// seguranca - nada sai de services/ sem ser AppError
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  return {
    kind: 'server',
    message: error instanceof Error ? error.message : 'Algo deu errado. Tente de novo.',
  };
}
