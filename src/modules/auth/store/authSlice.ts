import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { authApi, refreshSession } from '../../../services/auth';
import { toAuthUser } from '../mappers/session.mapper';
import type { AuthUser, SessionStatus } from '../model/session';
import { refreshStorage } from '../storage';

export interface AuthState {
  status: SessionStatus;
  // so em memoria, F5 e o refresh fica no storage
  accessToken: string | null;
  user: AuthUser | null;
}

export interface RestoredSession {
  accessToken: string;
  user: AuthUser;
}

const initialState: AuthState = {
  status: 'idle',
  accessToken: null,
  user: null,
};

// atualiza a sessao no F5, senao a tela de login flinka  antes do guard decidir
export const restoreSession = createAsyncThunk<RestoredSession>(
  'auth/restoreSession',
  async (_, { dispatch }) => {
    const savedToken = refreshStorage.get();

    if (!savedToken) {
      throw new Error('sem sessão salva');
    }

    const tokens = await refreshSession(savedToken);
    refreshStorage.set(tokens.refresh_token);

    // o token tem que estar no store antes do profile, para o interceptor
    dispatch(tokensRenewed({ accessToken: tokens.access_token }));

    const profile = await dispatch(
      authApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true }),
    ).unwrap();

    return { accessToken: tokens.access_token, user: toAuthUser(profile) };
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionStarted: (state, action: PayloadAction<RestoredSession>) => {
      state.status = 'authenticated';
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    // refresh troca so o access, sem mexer no status nem no usuario
    tokensRenewed: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
    },
    sessionEnded: (state) => {
      state.status = 'unauthenticated';
      state.accessToken = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.status = 'restoring';
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = 'unauthenticated';
        state.accessToken = null;
        state.user = null;
      });
  },
  // redux resolve o state.auth sozinho, restante recebe o slice
  selectors: {
    selectAuthStatus: (state) => state.status,
    selectAuthUser: (state) => state.user,
    selectAccessToken: (state) => state.accessToken,
    selectIsAuthenticated: (state) => state.status === 'authenticated',
  },
});

export const { sessionStarted, tokensRenewed, sessionEnded } = authSlice.actions;

export const { selectAccessToken, selectAuthStatus, selectAuthUser, selectIsAuthenticated } =
  authSlice.selectors;

export default authSlice.reducer;
