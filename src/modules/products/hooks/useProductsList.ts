import { useMemo } from 'react';

import { useAppSelector } from '../../../app/store/hooks';
import { useDebounce } from '../../../generic/hooks';
import { isAppError } from '../../../services/api';
import { useListProductsQuery } from '../../../services/products';
import { useCategoryOptions } from '../../categories';
import { toProduct, toQueryParams } from '../mappers/product.mapper';
import { filterByPrice, paginate } from '../model/product.rules';
import { selectProductsFilters } from '../store/productsFilters.slice';

export function useProductsList() {
  const filters = useAppSelector(selectProductsFilters);
  const { categoryNames } = useCategoryOptions();

  // debounce nos campos de texto pra nao refazer a busca a cada tecla
  const name = useDebounce(filters.name);
  const priceMin = useDebounce(filters.priceMin);
  const priceMax = useDebounce(filters.priceMax);

  const params = useMemo(
    () => toQueryParams({ ...filters, name, priceMin, priceMax }),
    [filters, name, priceMin, priceMax],
  );

  const query = useListProductsQuery(params);

  const products = useMemo(
    () => query.data?.map((dto) => toProduct(dto, categoryNames[dto.category])) ?? [],
    [query.data, categoryNames],
  );

  const page = useMemo(
    () => paginate(filterByPrice(products, { priceMin, priceMax }), filters.page, filters.pageSize),
    [products, priceMin, priceMax, filters.page, filters.pageSize],
  );

  const isTyping =
    filters.name !== name || filters.priceMin !== priceMin || filters.priceMax !== priceMax;

  return {
    products: page.items,
    total: page.total,
    totalPages: Math.max(1, Math.ceil(page.total / filters.pageSize)),
    hasNextPage: page.hasNextPage,
    isLoading: query.isLoading,
    isFetching: query.isFetching || isTyping,
    error: isAppError(query.error) ? query.error.message : null,
    refetch: query.refetch,
  };
}
