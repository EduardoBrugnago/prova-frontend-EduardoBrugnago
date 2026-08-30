import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from '../api/axiosBaseQuery';
import { categoriesClient } from './client';
import { categoryDtoListSchema } from './categories.dto';
import type { CategoryDTO } from './categories.dto';
import { categoriesEndpoints } from './endpoints';

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: axiosBaseQuery(categoriesClient),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    listCategories: builder.query<CategoryDTO[], void>({
      query: () => ({ url: categoriesEndpoints.list }),
      transformResponse: (raw: unknown) => categoryDtoListSchema.parse(raw),
      providesTags: ['Category'],
    }),
  }),
});

export const { useListCategoriesQuery } = categoriesApi;
