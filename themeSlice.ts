import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'stellar-theme';

type Theme = 'light' | 'dark';

function load(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
  } catch { /* ignore */ }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function apply(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

const initial = load();
apply(initial);

const themeSlice = createSlice({
  name: 'theme',
  initialState: initial as Theme,
  reducers: {
    toggleTheme(state) {
      const next: Theme = state === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
      return next;
    },
    setTheme(state, action) {
      const next: Theme = action.payload;
      apply(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
      return next;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
