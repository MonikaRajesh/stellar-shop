import type { Category, Brand } from '@/types';

export const categories: Category[] = [
  { id: 'c1', name: 'Smartphones', slug: 'smartphones', icon: 'Smartphone', image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 48 },
  { id: 'c2', name: 'Laptops', slug: 'laptops', icon: 'Laptop', image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600', productCount: 36 },
  { id: 'c3', name: 'Tablets', slug: 'tablets', icon: 'Tablet', image: 'https://images.pexels.com/photos/13378060/pexels-photo-13378060.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 22 },
  { id: 'c4', name: 'Smartwatches', slug: 'smartwatches', icon: 'Watch', image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 18 },
  { id: 'c5', name: 'Headphones', slug: 'headphones', icon: 'Headphones', image: 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 30 },
  { id: 'c6', name: 'Wireless Earbuds', slug: 'wireless-earbuds', icon: 'Ear', image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 24 },
  { id: 'c7', name: 'Bluetooth Speakers', slug: 'bluetooth-speakers', icon: 'Speaker', image: 'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 20 },
  { id: 'c8', name: 'Cameras', slug: 'cameras', icon: 'Camera', image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 26 },
  { id: 'c9', name: 'Gaming', slug: 'gaming', icon: 'Gamepad2', image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 34 },
  { id: 'c10', name: 'Gaming Accessories', slug: 'gaming-accessories', icon: 'Joystick', image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 28 },
  { id: 'c11', name: 'Monitors', slug: 'monitors', icon: 'Monitor', image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 16 },
  { id: 'c12', name: 'Keyboards', slug: 'keyboards', icon: 'Keyboard', image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 19 },
  { id: 'c13', name: 'Mice', slug: 'mice', icon: 'Mouse', image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 15 },
  { id: 'c14', name: 'Chargers', slug: 'chargers', icon: 'PlugZap', image: 'https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 21 },
  { id: 'c15', name: 'Power Banks', slug: 'power-banks', icon: 'BatteryCharging', image: 'https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 12 },
  { id: 'c16', name: 'Smart Home', slug: 'smart-home', icon: 'House', image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 23 },
  { id: 'c17', name: 'Accessories', slug: 'accessories', icon: 'Cable', image: 'https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 40 },
  { id: 'c18', name: 'Televisions', slug: 'televisions', icon: 'Tv', image: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 0 },
  { id: 'c19', name: 'Home Appliances', slug: 'home-appliances', icon: 'HousePlug', image: 'https://images.pexels.com/photos/1084540/pexels-photo-1084540.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 0 },
  { id: 'c20', name: 'Networking', slug: 'networking', icon: 'Wifi', image: 'https://images.pexels.com/photos/2881232/pexels-photo-2881232.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 0 },
  { id: 'c21', name: 'Storage', slug: 'storage', icon: 'HardDrive', image: 'https://images.pexels.com/photos/4792733/pexels-photo-4792733.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 0 },
  { id: 'c22', name: 'Fashion', slug: 'fashion', icon: 'Shirt', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600', productCount: 0 },
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
