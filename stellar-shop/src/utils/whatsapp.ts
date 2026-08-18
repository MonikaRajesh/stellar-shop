import type { Order } from '@/redux/slices/ordersSlice';
import type { Product } from '@/types';

const WHATSAPP_NUMBER = '919876543210';

export function openWhatsApp(message: string): void {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function orderProductOnWhatsApp(product: Product, quantity: number): void {
  openWhatsApp(
    `Hello Stellar Shop! I want to order:\n\nProduct: ${product.name}\nQuantity: ${quantity}\nPrice: ₹${product.price.toLocaleString('en-IN')}\n\nPlease confirm availability and delivery details.`
  );
}

export function cartOnWhatsApp(items: Array<{ product: Product; quantity: number }>, total: number): void {
  const lines = items.map((i) => `• ${i.product.name} × ${i.quantity} — ₹${(i.product.price * i.quantity).toLocaleString('en-IN')}`).join('\n');
  openWhatsApp(
    `Hello Stellar Shop! I want to place this order through WhatsApp:\n\n${lines}\n\nEstimated total: ₹${total.toLocaleString('en-IN')}\n\nPlease confirm the order and payment/delivery options.`
  );
}

export function orderOnWhatsApp(order: Order): void {
  const lines = order.items.map((i) => `• ${i.name} × ${i.quantity} — ₹${(i.price * i.quantity).toLocaleString('en-IN')}`).join('\n');
  openWhatsApp(
    `Hello Stellar Shop! I need help with order ${order.id}.\n\n${lines}\n\nOrder total: ₹${order.total.toLocaleString('en-IN')}\nStatus: ${order.status}\n\nPlease assist me.`
  );
}
