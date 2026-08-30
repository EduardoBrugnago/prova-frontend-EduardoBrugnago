import { combineReducers } from '@reduxjs/toolkit';

import { authApi } from '../../services/auth';
import authReducer from '../../modules/auth/store/authSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
