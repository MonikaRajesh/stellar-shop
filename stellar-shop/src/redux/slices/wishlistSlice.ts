import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'stellar-wishlist';

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: load() as string[],
  reducers: {
    toggleWishlist(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.includes(id)) {
        const i = state.indexOf(id);
        state.splice(i, 1);
      } else {
        state.push(id);
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      const i = state.indexOf(action.payload);
      if (i >= 0) state.splice(i, 1);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
    },
    clearWishlist() {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      return [];
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
