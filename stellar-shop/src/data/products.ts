import type { Product, Review } from '@/types';

const img = (id: number) => `/products/${id}.svg`;

const reviewBank: Omit<Review, 'id'>[] = [
  { author: 'Aarav M.', rating: 5, date: '2026-07-22', title: 'Exceeded expectations', body: 'Build quality is exceptional and delivery was lightning fast. Stellar Shop has won me over.', helpful: 24 },
  { author: 'Priya S.', rating: 4, date: '2026-07-18', title: 'Great value', body: 'Solid product for the price. Packaging could be a touch more premium but the device itself is fantastic.', helpful: 12 },
  { author: 'Daniel R.', rating: 5, date: '2026-07-10', title: 'Worth every penny', body: 'I was hesitant at first but after a week of use I am completely satisfied. Highly recommend.', helpful: 31 },
  { author: 'Mei L.', rating: 4, date: '2026-06-30', title: 'Almost perfect', body: 'Feature set is excellent. One minor software quirk but Stellar Shop support resolved it quickly.', helpful: 8 },
  { author: 'Carlos T.', rating: 3, date: '2026-06-25', title: 'Decent, with caveats', body: 'Does the job well. Battery life is a little below what was advertised but otherwise fine.', helpful: 5 },
];

function makeReviews(seed: number, count: number): Review[] {
  const out: Review[] = [];
  for (let i = 0; i < count; i++) {
    const r = reviewBank[(seed + i) % reviewBank.length];
    out.push({ ...r, id: `r${seed}-${i}` });
  }
  return out;
}

interface Seed {
  name: string;
  slug: string;
  brand: string;
  category: string;
  categoryId: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: number[];
  colors: { name: string; hex: string }[];
  highlights: string[];
  specs: { label: string; value: string }[];
  description: string;
  tags: string[];
  badge?: string;
}

const seeds: Seed[] = [
  // Smartphones
  {
    name: 'Nuvora Pulse 14 Pro', slug: 'nuvora-pulse-14-pro', brand: 'Nuvora', category: 'Smartphones', categoryId: 'c1',
    price: 74999, mrp: 89999, rating: 4.7, reviewCount: 1284, stock: 24,
    images: [788946, 1092644, 47261, 1841841],
    colors: [{ name: 'Stellar Blue', hex: '#3366ff' }, { name: 'Graphite', hex: '#1a1e2a' }, { name: 'Silver', hex: '#d5d9e2' }],
    highlights: ['6.7" LTPO OLED 120Hz', 'Triple 50MP camera system', 'Titanium frame', '5000mAh, 100W charging'],
    specs: [
      { label: 'Display', value: '6.7" LTPO OLED, 120Hz' },
      { label: 'Processor', value: 'Stellar X1 Octa-core' },
      { label: 'RAM', value: '12GB LPDDR5X' },
      { label: 'Storage', value: '256GB UFS 4.0' },
      { label: 'Battery', value: '5000mAh, 100W' },
      { label: 'Camera', value: '50MP + 50MP + 12MP' },
      { label: 'OS', value: 'Nuvora OS 14' },
      { label: 'Weight', value: '198g' },
    ],
    description: 'The Nuvora Pulse 14 Pro redefines flagship performance with a titanium-grade frame, a pro-grade triple camera system, and blazing-fast 100W charging. Every detail is engineered for those who demand more.',
    tags: ['featured', 'trending', 'bestseller', 'new'],
    badge: 'Bestseller',
  },
  {
    name: 'Quantix Edge S22', slug: 'quantix-edge-s22', brand: 'Quantix', category: 'Smartphones', categoryId: 'c1',
    price: 52999, mrp: 64999, rating: 4.5, reviewCount: 842, stock: 31,
    images: [1841841, 47261, 788946, 1092644],
    colors: [{ name: 'Cyan', hex: '#06b6d4' }, { name: 'Black', hex: '#0a0c12' }],
    highlights: ['6.4" AMOLED 90Hz', '64MP main camera', '4500mAh, 67W charging', 'IP68 water resistance'],
    specs: [
      { label: 'Display', value: '6.4" AMOLED, 90Hz' },
      { label: 'Processor', value: 'Quantix Q7' },
      { label: 'RAM', value: '8GB' },
      { label: 'Storage', value: '128GB' },
      { label: 'Battery', value: '4500mAh, 67W' },
      { label: 'Camera', value: '64MP + 12MP + 5MP' },
    ],
    description: 'A balanced flagship killer with a vivid AMOLED display, dependable all-day battery, and an IP68 rating that keeps up with your adventures.',
    tags: ['trending', 'new'],
    badge: 'New',
  },
  {
    name: 'Helios Nova Lite', slug: 'helios-nova-lite', brand: 'Helios', category: 'Smartphones', categoryId: 'c1',
    price: 18999, mrp: 24999, rating: 4.2, reviewCount: 410, stock: 56,
    images: [47261, 788946, 1841841, 1092644],
    colors: [{ name: 'Amber', hex: '#f59e0b' }, { name: 'Mint', hex: '#10b981' }],
    highlights: ['6.5" HD+ display', '50MP camera', '5000mAh battery', '33W fast charge'],
    specs: [
      { label: 'Display', value: '6.5" HD+ IPS' },
      { label: 'Processor', value: 'Helios H4' },
      { label: 'RAM', value: '6GB' },
      { label: 'Storage', value: '128GB' },
      { label: 'Battery', value: '5000mAh, 33W' },
    ],
    description: 'An everyday phone that punches above its weight with a big battery and a capable camera at a price that makes sense.',
    tags: ['flash', 'today'],
    badge: 'Deal',
  },
  // Laptops
  {
    name: 'Orbital Book Pro 14', slug: 'orbital-book-pro-14', brand: 'Orbital', category: 'Laptops', categoryId: 'c2',
    price: 112999, mrp: 134999, rating: 4.8, reviewCount: 612, stock: 12,
    images: [18105, 7974, 1029757, 459653],
    colors: [{ name: 'Space Gray', hex: '#41495d' }, { name: 'Silver', hex: '#d5d9e2' }],
    highlights: ['14" Liquid Retina XDR', 'M-class 12-core chip', '18hr battery', '1.5kg ultralight'],
    specs: [
      { label: 'Display', value: '14.2" Liquid Retina XDR' },
      { label: 'Processor', value: 'Orbital M3 Pro' },
      { label: 'Memory', value: '16GB unified' },
      { label: 'Storage', value: '512GB SSD' },
      { label: 'Battery', value: '18 hours' },
      { label: 'Weight', value: '1.55kg' },
    ],
    description: 'A pro-grade laptop that blends raw power with a stunning mini-LED display and all-day battery life. Built for creators on the move.',
    tags: ['featured', 'bestseller', 'new'],
    badge: 'Bestseller',
  },
  {
    name: 'Vortex Blade 15 Gaming', slug: 'vortex-blade-15-gaming', brand: 'Vortex', category: 'Laptops', categoryId: 'c2',
    price: 134999, mrp: 159999, rating: 4.6, reviewCount: 388, stock: 9,
    images: [1029757, 18105, 7974, 459653],
    colors: [{ name: 'Vortex Red', hex: '#ef4444' }, { name: 'Black', hex: '#0a0c12' }],
    highlights: ['15.6" QHD 240Hz', 'RTX-class GPU', 'RGB per-key', 'Vapor chamber cooling'],
    specs: [
      { label: 'Display', value: '15.6" QHD, 240Hz' },
      { label: 'Processor', value: 'Vortex V9 14-core' },
      { label: 'GPU', value: 'RTX-class 12GB' },
      { label: 'RAM', value: '32GB DDR5' },
      { label: 'Storage', value: '1TB NVMe' },
    ],
    description: 'A no-compromise gaming laptop with desktop-class performance, a 240Hz panel, and a cooling system that keeps frame rates high and noise low.',
    tags: ['trending', 'flash'],
    badge: 'Hot',
  },
  {
    name: 'Lumen Air 13', slug: 'lumen-air-13', brand: 'Lumen', category: 'Laptops', categoryId: 'c2',
    price: 68999, mrp: 79999, rating: 4.4, reviewCount: 274, stock: 18,
    images: [459653, 18105, 1029757, 7974],
    colors: [{ name: 'Lilac', hex: '#8b5cf6' }, { name: 'Silver', hex: '#d5d9e2' }],
    highlights: ['13.3" OLED 2.8K', '16GB RAM', '1.1kg featherlight', 'Thunderbolt 4'],
    specs: [
      { label: 'Display', value: '13.3" OLED 2.8K' },
      { label: 'Processor', value: 'Lumen L5 8-core' },
      { label: 'RAM', value: '16GB' },
      { label: 'Storage', value: '512GB SSD' },
      { label: 'Weight', value: '1.1kg' },
    ],
    description: 'The ultraportable that goes anywhere. A gorgeous OLED panel, all-day endurance, and a chassis that disappears into your bag.',
    tags: ['new', 'trending'],
    badge: 'New',
  },
  // Tablets
  {
    name: 'Nuvora Tab S9', slug: 'nuvora-tab-s9', brand: 'Nuvora', category: 'Tablets', categoryId: 'c3',
    price: 54999, mrp: 64999, rating: 4.6, reviewCount: 321, stock: 22,
    images: [13378060, 42267, 1029757, 18105],
    colors: [{ name: 'Graphite', hex: '#1a1e2a' }, { name: 'Silver', hex: '#d5d9e2' }],
    highlights: ['11" Dynamic AMOLED', 'Stellar Pen included', 'Quad speakers', 'IP68 rated'],
    specs: [
      { label: 'Display', value: '11" Dynamic AMOLED' },
      { label: 'Processor', value: 'Stellar X1' },
      { label: 'RAM', value: '8GB' },
      { label: 'Storage', value: '256GB' },
      { label: 'Battery', value: '8400mAh' },
    ],
    description: 'A premium tablet for work and play with a stunning AMOLED display, included stylus, and quad speakers tuned for cinema-grade audio.',
    tags: ['featured', 'bestseller'],
    badge: 'Bestseller',
  },
  {
    name: 'Aether Slate 8', slug: 'aether-slate-8', brand: 'Aether', category: 'Tablets', categoryId: 'c3',
    price: 22999, mrp: 29999, rating: 4.1, reviewCount: 156, stock: 34,
    images: [42267, 13378060, 1029757, 18105],
    colors: [{ name: 'Sky', hex: '#0ea5e9' }, { name: 'Gray', hex: '#41495d' }],
    highlights: ['8.4" IPS 2K', 'Long battery life', 'Kids mode', 'Lightweight 320g'],
    specs: [
      { label: 'Display', value: '8.4" IPS 2K' },
      { label: 'Processor', value: 'Aether A4' },
      { label: 'RAM', value: '4GB' },
      { label: 'Storage', value: '64GB' },
    ],
    description: 'A compact, family-friendly tablet with a crisp display and a kids mode that gives parents peace of mind.',
    tags: ['today', 'flash'],
    badge: 'Deal',
  },
  // Smartwatches
  {
    name: 'Pulse Watch Series 7', slug: 'pulse-watch-series-7', brand: 'Pulse', category: 'Smartwatches', categoryId: 'c4',
    price: 28999, mrp: 34999, rating: 4.5, reviewCount: 502, stock: 28,
    images: [437037, 3930611, 437037, 267423],
    colors: [{ name: 'Rose Gold', hex: '#ec4899' }, { name: 'Black', hex: '#0a0c12' }, { name: 'Silver', hex: '#d5d9e2' }],
    highlights: ['Always-on Retina', 'ECG + SpO2', 'GPS + Cellular', '18hr battery'],
    specs: [
      { label: 'Display', value: 'Always-on Retina LTPO' },
      { label: 'Sensors', value: 'ECG, SpO2, HR, Accelerometer' },
      { label: 'Water', value: '50m' },
      { label: 'Battery', value: '18 hours' },
      { label: 'Connectivity', value: 'GPS + Cellular' },
    ],
    description: 'Your health, on your wrist. Advanced sensors, a bright always-on display, and seamless integration with your phone.',
    tags: ['trending', 'bestseller'],
    badge: 'Bestseller',
  },
  {
    name: 'Quantix Band Fit 5', slug: 'quantix-band-fit-5', brand: 'Quantix', category: 'Smartwatches', categoryId: 'c4',
    price: 8999, mrp: 12999, rating: 4.3, reviewCount: 921, stock: 64,
    images: [3930611, 437037, 267423, 437037],
    colors: [{ name: 'Cyan', hex: '#06b6d4' }, { name: 'Black', hex: '#0a0c12' }],
    highlights: ['AMOLED 1.62"', '100+ sport modes', '14-day battery', '5ATM water'],
    specs: [
      { label: 'Display', value: '1.62" AMOLED' },
      { label: 'Battery', value: '14 days' },
      { label: 'Water', value: '5ATM' },
      { label: 'GPS', value: 'Built-in' },
    ],
    description: 'A fitness band that keeps up. Long battery life, a vivid AMOLED screen, and over 100 sport modes to track every move.',
    tags: ['flash', 'today'],
    badge: 'Deal',
  },
  // Headphones
  {
    name: 'Orbital Studio Max', slug: 'orbital-studio-max', brand: 'Orbital', category: 'Headphones', categoryId: 'c5',
    price: 34999, mrp: 42999, rating: 4.7, reviewCount: 743, stock: 19,
    images: [3394651, 3394650, 3394651, 3394650],
    colors: [{ name: 'Space Gray', hex: '#41495d' }, { name: 'Silver', hex: '#d5d9e2' }, { name: 'Sky', hex: '#0ea5e9' }],
    highlights: ['Adaptive ANC', 'Spatial Audio', '40hr battery', 'USB-C fast charge'],
    specs: [
      { label: 'Type', value: 'Over-ear, wireless' },
      { label: 'ANC', value: 'Adaptive active noise cancel' },
      { label: 'Battery', value: '40 hours' },
      { label: 'Charging', value: 'USB-C, 5min = 5hr' },
    ],
    description: 'Immerse yourself in studio-grade sound with adaptive noise cancellation and spatial audio that places you in the center of the music.',
    tags: ['featured', 'trending', 'bestseller'],
    badge: 'Bestseller',
  },
  {
    name: 'Vortex Boom 7', slug: 'vortex-boom-7', brand: 'Vortex', category: 'Headphones', categoryId: 'c5',
    price: 12999, mrp: 19999, rating: 4.2, reviewCount: 388, stock: 42,
    images: [3394650, 3394651, 3394650, 3394651],
    colors: [{ name: 'Red', hex: '#ef4444' }, { name: 'Black', hex: '#0a0c12' }],
    highlights: ['50mm drivers', 'RGB lighting', 'Detachable mic', '72hr battery'],
    specs: [
      { label: 'Type', value: 'Over-ear, wireless' },
      { label: 'Drivers', value: '50mm' },
      { label: 'Battery', value: '72 hours' },
      { label: 'Mic', value: 'Detachable' },
    ],
    description: 'Gaming-grade audio with deep bass, a crystal-clear detachable mic, and battery life that outlasts your longest session.',
    tags: ['trending'],
    badge: 'Hot',
  },
  // Earbuds
  {
    name: 'Nuvora Buds Pro 3', slug: 'nuvora-buds-pro-3', brand: 'Nuvora', category: 'Wireless Earbuds', categoryId: 'c6',
    price: 18999, mrp: 24999, rating: 4.5, reviewCount: 1120, stock: 38,
    images: [3780681, 3780681, 3394651, 3394650],
    colors: [{ name: 'White', hex: '#f6f7f9' }, { name: 'Graphite', hex: '#1a1e2a' }],
    highlights: ['Adaptive ANC', 'Spatial audio', '30hr with case', 'IPX4 sweatproof'],
    specs: [
      { label: 'Type', value: 'True wireless' },
      { label: 'ANC', value: 'Adaptive' },
      { label: 'Battery', value: '6h + 24h case' },
      { label: 'Water', value: 'IPX4' },
    ],
    description: 'Tiny but mighty earbuds with adaptive noise cancellation, spatial audio, and a pocketable case that keeps you going all week.',
    tags: ['bestseller', 'trending', 'flash'],
    badge: 'Bestseller',
  },
  {
    name: 'Lumen Buds Lite', slug: 'lumen-buds-lite', brand: 'Lumen', category: 'Wireless Earbuds', categoryId: 'c6',
    price: 3999, mrp: 6999, rating: 4.0, reviewCount: 640, stock: 80,
    images: [3394651, 3780681, 3394650, 3780681],
    colors: [{ name: 'Lilac', hex: '#8b5cf6' }, { name: 'White', hex: '#f6f7f9' }],
    highlights: ['ENC calls', '32hr total', 'Low-latency mode', 'USB-C'],
    specs: [
      { label: 'Type', value: 'True wireless' },
      { label: 'Battery', value: '8h + 24h case' },
      { label: 'Latency', value: 'Low-latency mode' },
    ],
    description: 'Affordable wireless freedom with clear calls, low-latency gaming, and a battery that lasts.',
    tags: ['today', 'flash'],
    badge: 'Deal',
  },
  // Speakers
  {
    name: 'Pulse Boom XL', slug: 'pulse-boom-xl', brand: 'Pulse', category: 'Bluetooth Speakers', categoryId: 'c7',
    price: 8999, mrp: 12999, rating: 4.4, reviewCount: 412, stock: 30,
    images: [1279107, 1279107, 3394651, 3780681],
    colors: [{ name: 'Rose', hex: '#ec4899' }, { name: 'Black', hex: '#0a0c12' }],
    highlights: ['360° sound', 'IP67 waterproof', '24hr battery', 'Party pairing'],
    specs: [
      { label: 'Output', value: '40W RMS' },
      { label: 'Battery', value: '24 hours' },
      { label: 'Water', value: 'IP67' },
      { label: 'Connectivity', value: 'Bluetooth 5.3' },
    ],
    description: 'A rugged, waterproof speaker that fills any room — or beach — with rich 360° sound and a 24-hour battery.',
    tags: ['trending', 'today'],
    badge: 'Deal',
  },
  // Cameras
  {
    name: 'Helios Mirror M5', slug: 'helios-mirror-m5', brand: 'Helios', category: 'Cameras', categoryId: 'c8',
    price: 84999, mrp: 99999, rating: 4.6, reviewCount: 234, stock: 11,
    images: [90946, 90946, 90946, 90946],
    colors: [{ name: 'Black', hex: '#0a0c12' }, { name: 'Silver', hex: '#d5d9e2' }],
    highlights: ['26MP full-frame', '4K60 video', 'In-body stabilization', 'Weather sealed'],
    specs: [
      { label: 'Sensor', value: '26MP full-frame' },
      { label: 'Video', value: '4K 60fps' },
      { label: 'Stabilization', value: '5-axis IBIS' },
      { label: 'Mount', value: 'Helios E-mount' },
    ],
    description: 'A compact full-frame mirrorless that delivers stunning stills and cinematic 4K video in a weather-sealed body.',
    tags: ['featured', 'new'],
    badge: 'New',
  },
  {
    name: 'Aether Action Cam 4K', slug: 'aether-action-cam-4k', brand: 'Aether', category: 'Cameras', categoryId: 'c8',
    price: 24999, mrp: 31999, rating: 4.3, reviewCount: 521, stock: 26,
    images: [90946, 90946, 90946, 90946],
    colors: [{ name: 'Sky', hex: '#0ea5e9' }, { name: 'Black', hex: '#0a0c12' }],
    highlights: ['5.3K60 video', 'HyperSteady', 'Waterproof to 10m', 'Dual displays'],
    specs: [
      { label: 'Video', value: '5.3K 60fps' },
      { label: 'Stabilization', value: 'HyperSteady 6.0' },
      { label: 'Waterproof', value: '10m without case' },
    ],
    description: 'Capture every adventure in stunning 5.3K with class-leading stabilization and a rugged waterproof body.',
    tags: ['trending', 'flash'],
    badge: 'Hot',
  },
  // Gaming
  {
    name: 'Vortex Console X Pro', slug: 'vortex-console-x-pro', brand: 'Vortex', category: 'Gaming', categoryId: 'c9',
    price: 49999, mrp: 54999, rating: 4.7, reviewCount: 980, stock: 8,
    images: [2115256, 2115256, 2115256, 2115256],
    colors: [{ name: 'Vortex Red', hex: '#ef4444' }, { name: 'White', hex: '#f6f7f9' }],
    highlights: ['1TB SSD', '4K 120Hz gaming', 'Ray tracing', 'Quick resume'],
    specs: [
      { label: 'Storage', value: '1TB NVMe SSD' },
      { label: 'Resolution', value: '4K 120Hz' },
      { label: 'GPU', value: '12 TFLOPs, RDNA 3' },
      { label: 'Controller', value: 'Haptic, included' },
    ],
    description: 'Next-gen gaming at 4K 120Hz with ray tracing, lightning-fast load times, and a haptic controller that puts you in the game.',
    tags: ['featured', 'bestseller', 'trending'],
    badge: 'Bestseller',
  },
  // Monitors
  {
    name: 'Orbital Display 27 4K', slug: 'orbital-display-27-4k', brand: 'Orbital', category: 'Monitors', categoryId: 'c11',
    price: 38999, mrp: 45999, rating: 4.6, reviewCount: 318, stock: 15,
    images: [777001, 777001, 777001, 777001],
    colors: [{ name: 'Silver', hex: '#d5d9e2' }, { name: 'Space Gray', hex: '#41495d' }],
    highlights: ['27" 4K Retina', 'P3 wide color', 'USB-C 96W', 'True Tone'],
    specs: [
      { label: 'Size', value: '27"' },
      { label: 'Resolution', value: '5120 x 2880' },
      { label: 'Color', value: 'P3 wide gamut' },
      { label: 'Ports', value: 'USB-C 96W, 3x TB4' },
    ],
    description: 'A 5K-class monitor with stunning color accuracy, a single-cable USB-C connection, and enough power to charge your laptop.',
    tags: ['featured', 'new'],
    badge: 'New',
  },
  {
    name: 'Vortex Curved 34"', slug: 'vortex-curved-34', brand: 'Vortex', category: 'Monitors', categoryId: 'c11',
    price: 32999, mrp: 41999, rating: 4.4, reviewCount: 204, stock: 17,
    images: [777001, 777001, 777001, 777001],
    colors: [{ name: 'Black', hex: '#0a0c12' }],
    highlights: ['34" ultrawide', '165Hz curved', '1ms response', 'HDR400'],
    specs: [
      { label: 'Size', value: '34" ultrawide' },
      { label: 'Refresh', value: '165Hz' },
      { label: 'Response', value: '1ms' },
      { label: 'HDR', value: 'HDR400' },
    ],
    description: 'An immersive ultrawide curved monitor built for gaming and productivity, with a fast 165Hz panel and HDR400.',
    tags: ['trending'],
    badge: 'Hot',
  },
  // Keyboards
  {
    name: 'Quantix Mech K7', slug: 'quantix-mech-k7', brand: 'Quantix', category: 'Keyboards', categoryId: 'c12',
    price: 7999, mrp: 11999, rating: 4.5, reviewCount: 412, stock: 33,
    images: [2115256, 2115256, 2115256, 2115256],
    colors: [{ name: 'Cyan', hex: '#06b6d4' }, { name: 'Black', hex: '#0a0c12' }],
    highlights: ['Hot-swap switches', 'RGB per-key', 'Wireless + USB', 'Aluminum frame'],
    specs: [
      { label: 'Type', value: 'Mechanical, 75%' },
      { label: 'Switches', value: 'Hot-swap' },
      { label: 'Connectivity', value: 'BT 5.1 + 2.4G + USB' },
      { label: 'Battery', value: '4000mAh' },
    ],
    description: 'A compact mechanical keyboard with hot-swap switches, per-key RGB, and tri-mode connectivity in a premium aluminum frame.',
    tags: ['trending', 'today'],
    badge: 'Deal',
  },
  // Mice
  {
    name: 'Vortex Click M9', slug: 'vortex-click-m9', brand: 'Vortex', category: 'Mice', categoryId: 'c13',
    price: 5999, mrp: 8499, rating: 4.4, reviewCount: 286, stock: 47,
    images: [2115256, 2115256, 2115256, 2115256],
    colors: [{ name: 'Red', hex: '#ef4444' }, { name: 'Black', hex: '#0a0c12' }],
    highlights: ['26K DPI sensor', 'Lightweight 58g', '70hr battery', 'PTFE feet'],
    specs: [
      { label: 'Sensor', value: '26000 DPI' },
      { label: 'Weight', value: '58g' },
      { label: 'Battery', value: '70 hours' },
      { label: 'Polling', value: '1000Hz' },
    ],
    description: 'A featherweight gaming mouse with a flagship sensor, 70-hour battery, and PTFE feet for effortless gliding.',
    tags: ['flash'],
    badge: 'Deal',
  },
  // Chargers
  {
    name: 'Aether GaN 100W', slug: 'aether-gan-100w', brand: 'Aether', category: 'Chargers', categoryId: 'c14',
    price: 3499, mrp: 5999, rating: 4.6, reviewCount: 740, stock: 90,
    images: [45201, 45201, 45201, 45201],
    colors: [{ name: 'Sky', hex: '#0ea5e9' }, { name: 'White', hex: '#f6f7f9' }],
    highlights: ['100W GaN II', '4 ports', 'Foldable plug', 'Universal compat'],
    specs: [
      { label: 'Output', value: '100W max' },
      { label: 'Ports', value: '2x USB-C, 2x USB-A' },
      { label: 'Tech', value: 'GaN II' },
    ],
    description: 'One tiny charger to power your laptop, phone, and earbuds at once with 100W of GaN efficiency.',
    tags: ['bestseller', 'today'],
    badge: 'Bestseller',
  },
  // Power Banks
  {
    name: 'Pulse Power 20000', slug: 'pulse-power-20000', brand: 'Pulse', category: 'Power Banks', categoryId: 'c15',
    price: 2999, mrp: 4499, rating: 4.3, reviewCount: 560, stock: 75,
    images: [45201, 45201, 45201, 45201],
    colors: [{ name: 'Rose', hex: '#ec4899' }, { name: 'Black', hex: '#0a0c12' }],
    highlights: ['20000mAh', '30W PD', 'Charge 3 devices', 'LED display'],
    specs: [
      { label: 'Capacity', value: '20000mAh' },
      { label: 'Output', value: '30W PD' },
      { label: 'Ports', value: 'USB-C + 2x USB-A' },
    ],
    description: 'Keep everything charged on the go with 20000mAh, 30W fast charging, and a clear LED capacity display.',
    tags: ['today'],
    badge: 'Deal',
  },
  // Smart Home
  {
    name: 'Lumen Hub Mini', slug: 'lumen-hub-mini', brand: 'Lumen', category: 'Smart Home', categoryId: 'c16',
    price: 4999, mrp: 6999, rating: 4.2, reviewCount: 312, stock: 40,
    images: [1571460, 1571460, 1571460, 1571460],
    colors: [{ name: 'Lilac', hex: '#8b5cf6' }, { name: 'White', hex: '#f6f7f9' }],
    highlights: ['Voice + app control', 'Matter compatible', 'Automations', 'Privacy LED'],
    specs: [
      { label: 'Voice', value: 'Built-in assistant' },
      { label: 'Protocol', value: 'Matter, Thread' },
      { label: 'Speakers', value: 'Dual 1.6"' },
    ],
    description: 'A compact smart home hub that controls your lights, locks, and cameras with your voice or a tap, and respects your privacy.',
    tags: ['new', 'trending'],
    badge: 'New',
  },
  // Accessories
  {
    name: 'Nuvora Sleeve 14"', slug: 'nuvora-sleeve-14', brand: 'Nuvora', category: 'Accessories', categoryId: 'c17',
    price: 1999, mrp: 2999, rating: 4.5, reviewCount: 421, stock: 120,
    images: [18105, 18105, 18105, 18105],
    colors: [{ name: 'Stellar Blue', hex: '#3366ff' }, { name: 'Gray', hex: '#41495d' }],
    highlights: ['Vegan leather', 'Magnetic closure', 'Shock-absorbing', 'Fits 14" laptops'],
    specs: [
      { label: 'Material', value: 'Vegan leather' },
      { label: 'Fit', value: '14" laptops' },
      { label: 'Closure', value: 'Magnetic' },
    ],
    description: 'A premium vegan-leather sleeve that protects your laptop in style with a soft microfiber interior and magnetic closure.',
    tags: ['today'],
    badge: 'Deal',
  },
];

function build(seed: Seed, index: number): Product {
  const brandId = `b${['Nuvora','Quantix','Helios','Orbital','Vortex','Lumen','Aether','Pulse'].indexOf(seed.brand) + 1}`;
  return {
    id: `p${index + 1}`,
    name: seed.name,
    slug: seed.slug,
    brand: seed.brand,
    brandId,
    category: seed.category,
    categoryId: seed.categoryId,
    price: seed.price,
    mrp: seed.mrp,
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    stock: seed.stock,
    images: seed.images.map(img),
    colors: seed.colors,
    highlights: seed.highlights,
    specs: seed.specs,
    description: seed.description,
    warranty: '1 Year Manufacturer Warranty',
    returnPolicy: '10 days returnable',
    delivery: 'Delivery by tomorrow',
    tags: seed.tags,
    badge: seed.badge,
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    reviews: makeReviews(index, Math.min(4, seed.reviewCount > 500 ? 4 : 2)),
    frequentlyBoughtTogether: undefined,
  };
}

export const products: Product[] = seeds.map(build);

// Link frequently bought together
products[0].frequentlyBoughtTogether = [products[10].id, products[14].id];
products[3].frequentlyBoughtTogether = [products[16].id, products[18].id];

export const productMap: Record<string, Product> = Object.fromEntries(
  products.map((p) => [p.id, p])
);

export const productBySlug: Record<string, Product> = Object.fromEntries(
  products.map((p) => [p.slug, p])
);

export function productsByTag(tag: string): Product[] {
  return products.filter((p) => p.tags.includes(tag));
}

export function productsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function discountPercent(p: Product): number {
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}

export function formatINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}
