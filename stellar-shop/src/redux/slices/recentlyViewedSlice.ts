import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'stellar-recently-viewed';
const MAX = 12;

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState: load() as string[],
  reducers: {
    addRecentlyViewed(state, action: PayloadAction<string>) {
      const id = action.payload;
      const filtered = state.filter((x) => x !== id);
      filtered.unshift(id);
      const next = filtered.slice(0, MAX);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    },
    clearRecentlyViewed() {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      return [];
    },
  },
});

export const { addRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;
