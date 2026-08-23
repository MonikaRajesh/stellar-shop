import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'stellar-compare';

function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

const compareSlice = createSlice({
  name: 'compare',
  initialState: load() as string[],
  reducers: {
    toggleCompare(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.includes(id)) {
        state = state.filter((x) => x !== id);
      } else {
        if (state.length >= 4) state.shift();
        state.push(id);
      }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
      return state;
    },
    removeFromCompare(state, action: PayloadAction<string>) {
      const i = state.indexOf(action.payload);
      if (i >= 0) state.splice(i, 1);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
    },
    clearCompare() {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      return [];
    },
  },
});

export const { toggleCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;
