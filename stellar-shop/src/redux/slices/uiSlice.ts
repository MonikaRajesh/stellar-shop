import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UiState {
  toasts: Toast[];
  searchOpen: boolean;
  voiceSearchOpen: boolean;
  imageSearchOpen: boolean;
  scannerOpen: boolean;
  mobileMenuOpen: boolean;
  cartPreviewOpen: boolean;
  quickViewProductId: string | null;
}

const initialState: UiState = {
  toasts: [],
  searchOpen: false,
  voiceSearchOpen: false,
  imageSearchOpen: false,
  scannerOpen: false,
  mobileMenuOpen: false,
  cartPreviewOpen: false,
  quickViewProductId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
      const id = Math.random().toString(36).slice(2);
      state.toasts.push({ ...action.payload, id });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setSearchOpen(state, action: PayloadAction<boolean>) { state.searchOpen = action.payload; },
    setVoiceSearchOpen(state, action: PayloadAction<boolean>) { state.voiceSearchOpen = action.payload; },
    setImageSearchOpen(state, action: PayloadAction<boolean>) { state.imageSearchOpen = action.payload; },
    setScannerOpen(state, action: PayloadAction<boolean>) { state.scannerOpen = action.payload; },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) { state.mobileMenuOpen = action.payload; },
    setCartPreviewOpen(state, action: PayloadAction<boolean>) { state.cartPreviewOpen = action.payload; },
    setQuickView(state, action: PayloadAction<string | null>) { state.quickViewProductId = action.payload; },
  },
});

export const {
  addToast, removeToast,
  setSearchOpen, setVoiceSearchOpen, setImageSearchOpen, setScannerOpen,
  setMobileMenuOpen, setCartPreviewOpen, setQuickView,
} = uiSlice.actions;

export default uiSlice.reducer;
