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
  cancellationReason?: string;
  cancelledAt?: string;
  placedAt: string;
  estimatedDelivery: string;
  address: string;
  paymentMethod: string;
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
        { productId: 'p1', name: 'Nuvora Pulse 14 Pro', image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400', price: 74999, quantity: 1 },
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
        { productId: 'p11', name: 'Orbital Studio Max', image: 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=400', price: 34999, quantity: 1 },
        { productId: 'p13', name: 'Nuvora Buds Pro 3', image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=400', price: 18999, quantity: 1 },
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
        { productId: 'p17', name: 'Vortex Console X Pro', image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400', price: 49999, quantity: 1 },
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
      if (order && ['Processing', 'Shipped'].includes(order.status)) {
        order.status = 'Cancelled';
        order.cancellationReason = action.payload.reason || 'Cancelled by customer';
        order.cancelledAt = new Date().toISOString();
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
      }
    },
  },
});

export const { placeOrder, updateOrderStatus, cancelOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
