import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Returned' | 'Cancelled';
  placedAt: string;
  estimatedDelivery: string;
  address: string;
  paymentMethod: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

const STORAGE_KEY = 'stellar-orders';

function load(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function seedOrders(): Order[] {
  return [
    {
      id: 'STL-2026-0421',
      items: [
        { productId: 'p1', name: 'Nuvora Pulse 14 Pro', image: '/products/788946.svg', price: 74999, quantity: 1 },
      ],
      total: 75899,
      status: 'Delivered',
      placedAt: '2026-07-12T10:30:00Z',
      estimatedDelivery: '2026-07-14',
      address: '12 Orion Lane, Bengaluru, KA 560001',
      paymentMethod: 'UPI',
    },
    {
      id: 'STL-2026-0438',
      items: [
        { productId: 'p11', name: 'Orbital Studio Max', image: '/products/3394651.svg', price: 34999, quantity: 1 },
        { productId: 'p13', name: 'Nuvora Buds Pro 3', image: '/products/3780681.svg', price: 18999, quantity: 1 },
      ],
      total: 54498,
      status: 'Shipped',
      placedAt: '2026-08-01T14:15:00Z',
      estimatedDelivery: '2026-08-09',
      address: '12 Orion Lane, Bengaluru, KA 560001',
      paymentMethod: 'Credit Card',
    },
    {
      id: 'STL-2026-0445',
      items: [
        { productId: 'p17', name: 'Vortex Console X Pro', image: '/products/2115256.svg', price: 49999, quantity: 1 },
      ],
      total: 50899,
      status: 'Processing',
      placedAt: '2026-08-05T09:00:00Z',
      estimatedDelivery: '2026-08-12',
      address: '12 Orion Lane, Bengaluru, KA 560001',
      paymentMethod: 'Cash on Delivery',
    },
  ];
}

const initialState: Order[] = load().length ? load() : seedOrders();

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    hydrateOrders(_state, action: PayloadAction<Order[]>) {
      return action.payload;
    },
    placeOrder(state, action: PayloadAction<Order>) {
      state.unshift(action.payload);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
    },
    updateOrderStatus(state, action: PayloadAction<{ id: string; status: Order['status'] }>) {
      const order = state.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
      }
    },
    cancelOrder(state, action: PayloadAction<{ id: string; reason?: string }>) {
      const order = state.find((o) => o.id === action.payload.id);
      if (order && ['Processing'].includes(order.status)) {
        order.status = 'Cancelled';
        order.cancelledAt = new Date().toISOString();
        order.cancellationReason = action.payload.reason || 'Customer requested cancellation';
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
      }
    },
  },
});

export const { hydrateOrders, placeOrder, updateOrderStatus, cancelOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
