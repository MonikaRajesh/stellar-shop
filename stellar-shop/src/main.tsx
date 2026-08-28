import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './admin-session';
import App from './App.tsx';
import { store } from '@/redux/store';

// Prevent broken remote product/category images from rendering as empty boxes.
// Pexels hotlinks can occasionally fail on production/CDN requests, so every
// failed image gets a local, branded fallback that is guaranteed to render.
const installImageFallback = () => {
  const fallback = (img: HTMLImageElement) => {
    if (img.dataset.imageFallback === '1') return;
    img.dataset.imageFallback = '1';
    const label = (img.alt || 'StellarShop').slice(0, 34).replace(/[<>]/g, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#f4f6fb"/><rect x="120" y="120" width="560" height="420" rx="40" fill="#e7ebf7"/><circle cx="400" cy="320" r="82" fill="#335cff" opacity=".14"/><path d="M350 320h100M400 270v100" stroke="#335cff" stroke-width="22" stroke-linecap="round"/><text x="400" y="625" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#111827">${label}</text><text x="400" y="670" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#64748b">StellarShop</text></svg>`;
    img.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };
  window.addEventListener('error', (event) => {
    const target = event.target;
    if (target instanceof HTMLImageElement) fallback(target);
  }, true);
};

installImageFallback();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
