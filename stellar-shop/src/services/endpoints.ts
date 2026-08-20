import api from './api';

// Typed service wrappers. Each method maps to a future backend endpoint.
// Today the UI consumes mock data directly; these are here so the swap to a
// real backend is a one-file change.

export const productService = {
  list: (params?: { category?: string; q?: string; page?: number }) =>
    api.get('/products', { params }),
  get: (slug: string) => api.get(`/products/${slug}`),
  related: (id: string) => api.get(`/products/${id}/related`),
  reviews: (id: string) => api.get(`/products/${id}/reviews`),
};

export const categoryService = {
  list: () => api.get('/categories'),
};

export const orderService = {
  list: () => api.get('/orders'),
  get: (id: string) => api.get(`/orders/${id}`),
  place: (payload: unknown) => api.post('/orders', payload),
  cancel: (id: string) => api.post(`/orders/${id}/cancel`),
};

export const authService = {
  login: (payload: unknown) => api.post('/auth/login', payload),
  register: (payload: unknown) => api.post('/auth/register', payload),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const couponService = {
  validate: (code: string, cartTotal: number) =>
    api.post('/coupons/validate', { code, cartTotal }),
};

export const paymentService = {
  createIntent: (payload: unknown) => api.post('/payments/intent', payload),
  // Stripe and Razorpay integration will be added when credentials are configured.
};
