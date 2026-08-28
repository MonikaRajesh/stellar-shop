import type { Product } from '@/types';

// The CSV files used by Stellar Shop have historically contained category names
// that did not match the application's category IDs. Keep the mapping in one
// place so imported and database products behave exactly like built-in products.
const categoryAliases: Record<string, { name: string; id: string }> = {
  mobile: { name: 'Smartphones', id: 'c1' },
  mobiles: { name: 'Smartphones', id: 'c1' },
  smartphone: { name: 'Smartphones', id: 'c1' },
  smartphones: { name: 'Smartphones', id: 'c1' },
  laptop: { name: 'Laptops', id: 'c2' },
  laptops: { name: 'Laptops', id: 'c2' },
  tablet: { name: 'Tablets', id: 'c3' },
  tablets: { name: 'Tablets', id: 'c3' },
  smartwatch: { name: 'Smartwatches', id: 'c4' },
  smartwatches: { name: 'Smartwatches', id: 'c4' },
  headphone: { name: 'Headphones', id: 'c5' },
  headphones: { name: 'Headphones', id: 'c5' },
  earbuds: { name: 'Wireless Earbuds', id: 'c6' },
  'wireless earbuds': { name: 'Wireless Earbuds', id: 'c6' },
  speaker: { name: 'Bluetooth Speakers', id: 'c7' },
  speakers: { name: 'Bluetooth Speakers', id: 'c7' },
  'bluetooth speakers': { name: 'Bluetooth Speakers', id: 'c7' },
  camera: { name: 'Cameras', id: 'c8' },
  cameras: { name: 'Cameras', id: 'c8' },
  gaming: { name: 'Gaming', id: 'c9' },
  'gaming accessories': { name: 'Gaming Accessories', id: 'c10' },
  monitor: { name: 'Monitors', id: 'c11' },
  monitors: { name: 'Monitors', id: 'c11' },
  keyboard: { name: 'Keyboards', id: 'c12' },
  keyboards: { name: 'Keyboards', id: 'c12' },
  mouse: { name: 'Mice', id: 'c13' },
  mice: { name: 'Mice', id: 'c13' },
  charger: { name: 'Chargers', id: 'c14' },
  chargers: { name: 'Chargers', id: 'c14' },
  'power bank': { name: 'Power Banks', id: 'c15' },
  'power banks': { name: 'Power Banks', id: 'c15' },
  'smart home': { name: 'Smart Home', id: 'c16' },
  accessories: { name: 'Accessories', id: 'c17' },
  accessory: { name: 'Accessories', id: 'c17' },
  televisions: { name: 'Televisions', id: 'c18' },
  television: { name: 'Televisions', id: 'c18' },
  tv: { name: 'Televisions', id: 'c18' },
  'home appliances': { name: 'Home Appliances', id: 'c19' },
  'home appliance': { name: 'Home Appliances', id: 'c19' },
  networking: { name: 'Networking', id: 'c20' },
  storage: { name: 'Storage', id: 'c21' },
  fashion: { name: 'Fashion', id: 'c22' },
};

const fallbackImages: Record<string, string[]> = {
  c1: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c2: ['https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900'],
  c3: ['https://images.pexels.com/photos/13378060/pexels-photo-13378060.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c4: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c5: ['https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c6: ['https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c7: ['https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c8: ['https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c9: ['https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c10: ['https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c11: ['https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c12: ['https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c13: ['https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c14: ['https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c15: ['https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c16: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c17: ['https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c18: ['https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c19: ['https://images.pexels.com/photos/1084540/pexels-photo-1084540.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c20: ['https://images.pexels.com/photos/2881232/pexels-photo-2881232.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c21: ['https://images.pexels.com/photos/4792733/pexels-photo-4792733.jpeg?auto=compress&cs=tinysrgb&w=900'],
  c22: ['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=900'],
};

function cleanText(value: unknown): string {
  return String(value ?? '').trim();
}

function parseArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  const text = cleanText(value);
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch { /* use separator fallback */ }
  return text.split(/\s*\|\s*|\s*;\s*|\r?\n/).map((x) => x.trim()).filter(Boolean);
}

function normalizeImages(value: unknown, categoryId: string): string[] {
  const images = parseArray(value)
    .map((item) => cleanText(item))
    .filter(Boolean)
    // source.unsplash.com was retired and returns broken images. Never store it.
    .filter((url) => !/source\.unsplash\.com/i.test(url))
    .filter((url) => /^(https?:\/\/|\/)/i.test(url));
  return images.length ? images : (fallbackImages[categoryId] ?? fallbackImages.c17);
}

export function normalizeProduct(raw: Partial<Product> & Record<string, any>): Product {
  const rawCategory = cleanText(raw.category) || 'Accessories';
  const alias = categoryAliases[rawCategory.toLowerCase()];
  const category = alias?.name ?? rawCategory;
  const categoryId = alias?.id ?? (cleanText(raw.categoryId) || 'c17');
  const brand = cleanText(raw.brand) || 'Brand';
  const now = new Date().toISOString();

  const colors = parseArray(raw.colors).filter((x): x is { name: string; hex: string } => Boolean(x && typeof x === 'object' && 'name' in x && 'hex' in x));
  const specs = parseArray(raw.specs).map((x) => {
    if (x && typeof x === 'object' && 'label' in x) return { label: cleanText((x as any).label), value: cleanText((x as any).value) };
    const [label, ...rest] = cleanText(x).split('|');
    return { label: cleanText(label), value: cleanText(rest.join('|')) };
  }).filter((x) => x.label);

  const name = cleanText(raw.name) || 'Unnamed Product';
  const slug = cleanText(raw.slug) || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return {
    id: cleanText(raw.id) || `p-import-${slug}`,
    name,
    slug,
    brand,
    brandId: cleanText(raw.brandId ?? raw.brand_id) || 'b1',
    category,
    categoryId,
    price: Number(raw.price) || 0,
    mrp: Number(raw.mrp) || Number(raw.price) || 0,
    rating: Math.min(5, Math.max(0, Number(raw.rating) || 0)),
    reviewCount: Math.max(0, Number(raw.reviewCount ?? raw.review_count) || 0),
    stock: Math.max(0, Number(raw.stock) || 0),
    images: normalizeImages(raw.images, categoryId),
    colors,
    highlights: parseArray(raw.highlights).map(cleanText).filter(Boolean),
    specs,
    description: cleanText(raw.description),
    warranty: cleanText(raw.warranty),
    returnPolicy: cleanText(raw.returnPolicy ?? raw.return_policy),
    delivery: cleanText(raw.delivery),
    tags: parseArray(raw.tags).map(cleanText).filter(Boolean).map((x) => x.toLowerCase()),
    badge: cleanText(raw.badge) || undefined,
    createdAt: cleanText(raw.createdAt ?? raw.created_at) || now,
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
    frequentlyBoughtTogether: Array.isArray(raw.frequentlyBoughtTogether ?? raw.frequently_bought_together)
      ? (raw.frequentlyBoughtTogether ?? raw.frequently_bought_together)
      : undefined,
  };
}

export function productFallbackImage(product: Pick<Product, 'categoryId'>): string {
  return fallbackImages[product.categoryId] ?? fallbackImages.c17[0];
}
