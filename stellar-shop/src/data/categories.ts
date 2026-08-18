import type { Category, Brand } from '@/types';

export const categories: Category[] = [
  { id: 'c1', name: 'Smartphones', slug: 'smartphones', icon: 'Smartphone', image: '/products/788946.svg', productCount: 48 },
  { id: 'c2', name: 'Laptops', slug: 'laptops', icon: 'Laptop', image: '/products/18105.svg', productCount: 36 },
  { id: 'c3', name: 'Tablets', slug: 'tablets', icon: 'Tablet', image: '/products/13378060.svg', productCount: 22 },
  { id: 'c4', name: 'Smartwatches', slug: 'smartwatches', icon: 'Watch', image: '/products/437037.svg', productCount: 18 },
  { id: 'c5', name: 'Headphones', slug: 'headphones', icon: 'Headphones', image: '/products/3394651.svg', productCount: 30 },
  { id: 'c6', name: 'Wireless Earbuds', slug: 'wireless-earbuds', icon: 'Ear', image: '/products/3780681.svg', productCount: 24 },
  { id: 'c7', name: 'Bluetooth Speakers', slug: 'bluetooth-speakers', icon: 'Speaker', image: '/products/1279107.svg', productCount: 20 },
  { id: 'c8', name: 'Cameras', slug: 'cameras', icon: 'Camera', image: '/products/90946.svg', productCount: 26 },
  { id: 'c9', name: 'Gaming', slug: 'gaming', icon: 'Gamepad2', image: '/products/2115256.svg', productCount: 34 },
  { id: 'c10', name: 'Gaming Accessories', slug: 'gaming-accessories', icon: 'Joystick', image: '/products/2115256.svg', productCount: 28 },
  { id: 'c11', name: 'Monitors', slug: 'monitors', icon: 'Monitor', image: '/products/777001.svg', productCount: 16 },
  { id: 'c12', name: 'Keyboards', slug: 'keyboards', icon: 'Keyboard', image: '/products/2115256.svg', productCount: 19 },
  { id: 'c13', name: 'Mice', slug: 'mice', icon: 'Mouse', image: '/products/2115256.svg', productCount: 15 },
  { id: 'c14', name: 'Chargers', slug: 'chargers', icon: 'PlugZap', image: '/products/45201.svg', productCount: 21 },
  { id: 'c15', name: 'Power Banks', slug: 'power-banks', icon: 'BatteryCharging', image: '/products/45201.svg', productCount: 12 },
  { id: 'c16', name: 'Smart Home', slug: 'smart-home', icon: 'House', image: '/products/1571460.svg', productCount: 23 },
  { id: 'c17', name: 'Accessories', slug: 'accessories', icon: 'Cable', image: '/products/45201.svg', productCount: 40 },
];

export const brands: Brand[] = [
  { id: 'b1', name: 'Nuvora', slug: 'nuvora', logoColor: '#3366ff' },
  { id: 'b2', name: 'Quantix', slug: 'quantix', logoColor: '#06b6d4' },
  { id: 'b3', name: 'Helios', slug: 'helios', logoColor: '#f59e0b' },
  { id: 'b4', name: 'Orbital', slug: 'orbital', logoColor: '#10b981' },
  { id: 'b5', name: 'Vortex', slug: 'vortex', logoColor: '#ef4444' },
  { id: 'b6', name: 'Lumen', slug: 'lumen', logoColor: '#8b5cf6' },
  { id: 'b7', name: 'Aether', slug: 'aether', logoColor: '#0ea5e9' },
  { id: 'b8', name: 'Pulse', slug: 'pulse', logoColor: '#ec4899' },
];

export const brandMap: Record<string, Brand> = Object.fromEntries(
  brands.map((b) => [b.name, b])
);
