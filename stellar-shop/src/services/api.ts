import axios from 'axios';

// Configured for a future Node/Express backend. Until the backend is live,
// the app uses the mock data in src/data. Components should call the typed
// wrappers below rather than axios directly so the data source can be
// swapped without touching the UI.

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT when available
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('stellar-auth');
    if (raw) {
      const token = JSON.parse(raw).token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch { /* ignore */ }
  return config;
});

export default api;
