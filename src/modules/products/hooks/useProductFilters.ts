import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import type { SortField } from '../model/product.rules';
import {
  filtersCleared,
  nameChanged,
  pageChanged,
  pageSizeChanged,
  priceMaxChanged,
  priceMinChanged,
  selectProductsFilters,
  sortChanged,
} from '../store/productsFilters.slice';

export function useProductFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectProductsFilters);

  return {
    filters,
    setName: useCallback((value: string) => dispatch(nameChanged(value)), [dispatch]),
    setPriceMin: useCallback((value: string) => dispatch(priceMinChanged(value)), [dispatch]),
    setPriceMax: useCallback((value: string) => dispatch(priceMaxChanged(value)), [dispatch]),
    setSort: useCallback((field: SortField) => dispatch(sortChanged(field)), [dispatch]),
    setPage: useCallback((value: number) => dispatch(pageChanged(value)), [dispatch]),
    setPageSize: useCallback((value: number) => dispatch(pageSizeChanged(value)), [dispatch]),
    clear: useCallback(() => dispatch(filtersCleared()), [dispatch]),
  };
}
