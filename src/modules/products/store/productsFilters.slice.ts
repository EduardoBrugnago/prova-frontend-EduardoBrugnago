import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { SortDirection, SortField } from '../model/product.rules';

export interface ProductsFiltersState {
  name: string;
  priceMin: string;
  priceMax: string;
  sortBy: SortField | null;
  sortDirection: SortDirection;
  page: number;
  pageSize: number;
}

const initialState: ProductsFiltersState = {
  name: '',
  priceMin: '',
  priceMax: '',
  sortBy: null,
  sortDirection: 'asc',
  page: 1,
  pageSize: 10,
};

const productsFiltersSlice = createSlice({
  name: 'productsFilters',
  initialState,
  reducers: {
    nameChanged: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      state.page = 1;
    },
    priceMinChanged: (state, action: PayloadAction<string>) => {
      state.priceMin = action.payload;
      state.page = 1;
    },
    priceMaxChanged: (state, action: PayloadAction<string>) => {
      state.priceMax = action.payload;
      state.page = 1;
    },
    sortChanged: (state, action: PayloadAction<SortField>) => {
      if (state.sortBy !== action.payload) {
        state.sortBy = action.payload;
        state.sortDirection = 'asc';
      } else if (state.sortDirection === 'asc') {
        state.sortDirection = 'desc';
      } else {
        state.sortBy = null;
        state.sortDirection = 'asc';
      }

      state.page = 1;
    },
    pageSizeChanged: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
    pageChanged: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    filtersCleared: (state) => {
      state.name = '';
      state.priceMin = '';
      state.priceMax = '';
      state.page = 1;
    },
  },
  selectors: {
    selectProductsFilters: (state) => state,
  },
});

export const {
  nameChanged,
  priceMinChanged,
  priceMaxChanged,
  sortChanged,
  pageChanged,
  pageSizeChanged,
  filtersCleared,
} = productsFiltersSlice.actions;

export const { selectProductsFilters } = productsFiltersSlice.selectors;

export default productsFiltersSlice.reducer;
