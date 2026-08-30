export const productsEndpoints = {
  list: '/products',
  search: '/products/search',
  create: '/products/add',
  byId: (id: number) => `/products/${id}`,
} as const;
