import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '../../modules/auth/store/authSlice';
import productsFiltersReducer from '../../modules/products/store/productsFilters.slice';
import { categoriesApi } from '../../services/categories';
import { authApi } from '../../services/auth';
import { productsApi } from '../../services/products';

export const rootReducer = combineReducers({
  auth: authReducer,
  productsFilters: productsFiltersReducer,
  [authApi.reducerPath]: authApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [categoriesApi.reducerPath]: categoriesApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
