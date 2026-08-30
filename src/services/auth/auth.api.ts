import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from '../api/axiosBaseQuery';
import { authTokensDtoSchema, profileDtoSchema } from './auth.dto';
import type { AuthTokensDTO, LoginPayloadDTO, ProfileDTO } from './auth.dto';
import { authClient } from './client';
import { authEndpoints } from './endpoints';

// devolve DTO validado, nao modelo. O tratamento do dado fica em modules/auth/mappers.
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(authClient),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthTokensDTO, LoginPayloadDTO>({
      query: (body) => ({ url: authEndpoints.login, method: 'POST', data: body }),
      transformResponse: (raw: unknown) => authTokensDtoSchema.parse(raw),
    }),

    getProfile: builder.query<ProfileDTO, void>({
      query: () => ({ url: authEndpoints.profile }),
      transformResponse: (raw: unknown) => profileDtoSchema.parse(raw),
      providesTags: ['Profile'],
    }),
  }),
});

export const { useLoginMutation, useGetProfileQuery } = authApi;
