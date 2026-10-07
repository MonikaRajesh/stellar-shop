import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  productId: string;
  quantity: number;
  color?: string;
  giftWrap?: boolean;
  savedForLater?: boolean;
}

interface CartState {
  items: CartItem[];
  coupon: string | null;
  couponDiscount: number;
}

const STORAGE_KEY = 'stellar-cart';

function load(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { items: [], coupon: null, couponDiscount: 0 };
}

const initialState: CartState = load();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ productId: string; quantity?: number; color?: string }>) {
      const { productId, quantity = 1, color } = action.payload;
      const existing = state.items.find((i) => i.productId === productId && !i.savedForLater && i.color === color);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ productId, quantity, color, savedForLater: false });
      }
      persist(state);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((i) => i.productId === action.payload.productId && !i.savedForLater);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
        persist(state);
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      persist(state);
    },
    saveForLater(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) {
        item.savedForLater = true;
        persist(state);
      }
    },
    moveToCart(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) {
        item.savedForLater = false;
        persist(state);
      }
    },
    toggleGiftWrap(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.productId === action.payload);
      if (item) {
        item.giftWrap = !item.giftWrap;
        persist(state);
      }
    },
    applyCoupon(state, action: PayloadAction<{ code: string; discount: number }>) {
      state.coupon = action.payload.code;
      state.couponDiscount = action.payload.discount;
      persist(state);
    },
    removeCoupon(state) {
      state.coupon = null;
      state.couponDiscount = 0;
      persist(state);
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
      state.couponDiscount = 0;
      persist(state);
    },
  },
});

function persist(state: CartState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export const {
  addToCart, updateQuantity, removeFromCart, saveForLater, moveToCart,
  toggleGiftWrap, applyCoupon, removeCoupon, clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
