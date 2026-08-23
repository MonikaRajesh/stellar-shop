// WhatsApp preview image is provided by the site's Open Graph metadata in index.html.\nimport type { Product } from '@/types';

export interface WhatsAppItem {
  product: Product;
  quantity: number;
}

const DEFAULT_WHATSAPP_NUMBER = '919876543210';

export function getWhatsAppNumber() {
  return String(import.meta.env.VITE_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, '');
}

export function buildWhatsAppOrderMessage(items: WhatsAppItem[], total?: number) {
  const lines = items.map(
    ({ product, quantity }) => `• ${product.name} × ${quantity} — ₹${(product.price * quantity).toLocaleString('en-IN')}`,
  );
  const totalLine = typeof total === 'number'
    ? `\nEstimated total: ₹${total.toLocaleString('en-IN')}`
    : '';
  return [
    'Hello Stellar Shop 👋',
    '',
    'I want to place this order through WhatsApp:',
    ...lines,
    totalLine,
    '',
    'Please confirm availability, delivery charges and payment options.',
  ].join('\n');
}

export function getWhatsAppOrderUrl(items: WhatsAppItem[], total?: number) {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(buildWhatsAppOrderMessage(items, total))}`;
}
