import { createApi } from '@reduxjs/toolkit/query/react';
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

import { axiosBaseQuery } from '../api/axiosBaseQuery';
import { productsClient } from './client';
import { productsEndpoints } from './endpoints';
import { productDtoSchema, productListDtoSchema } from './products.dto';
import type { ProductDTO, ProductPayloadDTO } from './products.dto';

export interface ProductsQueryParams {
  q?: string;
  sortBy?: 'title' | 'category' | 'price' | 'stock';
  order?: 'asc' | 'desc';
}

export type UpdateProductArg = { id: number } & ProductPayloadDTO;

// limit=0 traz o resultado inteiro. paginaçao e faixa de preço é feita local.
function toRequest({ q, sortBy, order }: ProductsQueryParams) {
  const params = { limit: 0, ...(sortBy ? { sortBy, order } : {}) };

  return q
    ? { url: productsEndpoints.search, params: { ...params, q } }
    : { url: productsEndpoints.list, params };
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: axiosBaseQuery(productsClient),
  endpoints: (builder) => ({
    listProducts: builder.query<ProductDTO[], ProductsQueryParams>({
      query: toRequest,
      transformResponse: (raw: unknown) => productListDtoSchema.parse(raw).products,
    }),

    // a API simula o POST/PUT, entao um refetch traria a
    // lista original e desfaria o que o usuario acabou de fazer. ediçao e exclusao
    // aplicam o resultado direto no cache; cadastro nao, o item so existe no servidor.
    createProduct: builder.mutation<ProductDTO, ProductPayloadDTO>({
      query: (body) => ({ url: productsEndpoints.create, method: 'POST', data: body }),
      transformResponse: (raw: unknown) => productDtoSchema.parse(raw),
    }),

    updateProduct: builder.mutation<ProductDTO, UpdateProductArg>({
      query: ({ id, ...body }) => ({ url: productsEndpoints.byId(id), method: 'PUT', data: body }),
      transformResponse: (raw: unknown) => productDtoSchema.parse(raw),
      async onQueryStarted({ id, ...body }, { dispatch, queryFulfilled }) {
        const patches = dispatch(patchCachedLists(editProduct(id, body)));

        try {
          await queryFulfilled;
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),

    deleteProduct: builder.mutation<ProductDTO, number>({
      query: (id) => ({ url: productsEndpoints.byId(id), method: 'DELETE' }),
      transformResponse: (raw: unknown) => productDtoSchema.parse(raw),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patches = dispatch(patchCachedLists(dropProduct(id)));

        try {
          await queryFulfilled;
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
  }),
});

type ProductsRootState = Parameters<typeof productsApi.util.selectCachedArgsForQuery>[0];
type ProductsDispatch = ThunkDispatch<ProductsRootState, unknown, UnknownAction>;

export type ListRecipe = (draft: ProductDTO[]) => void;

export const editProduct =
  (id: number, body: ProductPayloadDTO): ListRecipe =>
  (draft) => {
    const product = draft.find((item) => item.id === id);
    if (product) Object.assign(product, body);
  };

export const dropProduct =
  (id: number): ListRecipe =>
  (draft) => {
    const index = draft.findIndex((item) => item.id === id);
    if (index !== -1) draft.splice(index, 1);
  };

export const patchCachedLists =
  (recipe: ListRecipe) => (dispatch: ProductsDispatch, getState: () => ProductsRootState) =>
    productsApi.util
      .selectCachedArgsForQuery(getState(), 'listProducts')
      .map((args) => dispatch(productsApi.util.updateQueryData('listProducts', args, recipe)));

export const {
  useListProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
