import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

import { toAppError } from './errors';
import type { AppError } from './errors';

export interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: unknown;
  params?: AxiosRequestConfig['params'];
}

// axios no lugar do fetchBaseQuery por causa dos interceptors. de brinde, o
// error de qualquer hook do redux ja chega como AppError.
export const axiosBaseQuery =
  (client: AxiosInstance): BaseQueryFn<AxiosBaseQueryArgs, unknown, AppError> =>
  async ({ url, method = 'GET', data, params }) => {
    try {
      const response = await client({ url, method, data, params });
      return { data: response.data };
    } catch (error) {
      return { error: toAppError(error) };
    }
  };
