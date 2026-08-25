import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  address?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const STORAGE_KEY = 'stellar-auth';

function load(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { user: parsed.user, token: parsed.token, status: 'idle', error: null };
    }
  } catch { /* ignore */ }
  return { user: null, token: null, status: 'idle', error: null };
}

const initialState: AuthState = load();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.status = 'loading';
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'succeeded';
      state.error = null;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user, token: state.token })); } catch { /* ignore */ }
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    },
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user, token: state.token })); } catch { /* ignore */ }
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailed, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
