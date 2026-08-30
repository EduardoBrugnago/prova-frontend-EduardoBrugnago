import { configureStore } from '@reduxjs/toolkit';

import { refreshStorage } from '../../modules/auth/storage';
import { sessionEnded, tokensRenewed } from '../../modules/auth/store/authSlice';
import { authBridge } from '../../services/api';
import { authApi, refreshSession } from '../../services/auth';
import { categoriesApi } from '../../services/categories';
import { productsApi } from '../../services/products';
import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productsApi.middleware,
      categoriesApi.middleware,
    ),
});

authBridge.register({
  getAccessToken: () => store.getState().auth.accessToken,

  hasRefreshToken: () => refreshStorage.get() !== null,

  renewSession: async () => {
    const savedToken = refreshStorage.get();

    if (!savedToken) {
      throw new Error('sem refresh token');
    }

    const tokens = await refreshSession(savedToken);
    refreshStorage.set(tokens.refreshToken);
    store.dispatch(tokensRenewed({ accessToken: tokens.accessToken }));

    return tokens.accessToken;
  },

  onSessionExpired: () => {
    refreshStorage.clear();
    store.dispatch(sessionEnded());
  },
});

export type { RootState } from './rootReducer';
export type AppDispatch = typeof store.dispatch;
