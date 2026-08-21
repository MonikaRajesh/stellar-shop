import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Smartphone, Building2, Wallet, Banknote, Check, MapPin, Tag, Shield, Lock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { productMap } from '@/data/products';
import { formatINR, generateOrderId } from '@/utils/format';
import { placeOrder } from '@/redux/slices/ordersSlice';
import { clearCart } from '@/redux/slices/cartSlice';
import { addToast } from '@/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import { classNames } from '@/utils/format';
import { saveOrderToSupabase } from '@/services/supabase';

const addresses = [
  { id: 'a1', name: 'Aarav Mehta', line: '12 Orion Lane, Indiranagar', city: 'Bengaluru, KA 560038', phone: '+91 98765 43210', tag: 'Home' },
  { id: 'a2', name: 'Aarav Mehta', line: '447 Galaxy Towers, Bandra West', city: 'Mumbai, MH 400050', phone: '+91 98765 43210', tag: 'Work' },
];

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Pay using any UPI app' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks' },
  { id: 'wallet', label: 'Wallets', icon: Wallet, desc: 'Paytm, Amazon Pay, more' },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
];

export function Checkout() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const buyNowId = params.get('buyNow');
  const cartItems = useAppSelector((s) => s.cart.items.filter((i) => !i.savedForLater));
  const couponDiscount = useAppSelector((s) => s.cart.couponDiscount);

  const buyNowItem = buyNowId ? productMap[buyNowId] : null;
  const items = buyNowItem
    ? [{ productId: buyNowItem.id, quantity: 1, product: buyNowItem }]
    : cartItems.map((i) => ({ ...i, product: productMap[i.productId] })).filter((i) => i.product);

  const [addressId, setAddressId] = useState(addresses[0].id);
  const [method, setMethod] = useState('upi');
  const [placing, setPlacing] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const gst = Math.round((subtotal - couponDiscount + shipping) * 0.18);
  const total = Math.max(0, subtotal - couponDiscount + shipping + gst);

  const placeOrderHandler = async () => {
    setPlacing(true);
    const address = addresses.find((a) => a.id === addressId)!;
    setTimeout(async () => {
      const order = {
        id: generateOrderId(),
        items: items.map((i) => ({ productId: i.product.id, name: i.product.name, image: i.product.images[0], price: i.product.price, quantity: i.quantity })),
        total,
        status: 'Processing' as const,
        placedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 4 * 86400000).toISOString(),
        address: `${address.name}, ${address.line}, ${address.city}`,
        paymentMethod: paymentMethods.find((m) => m.id === method)!.label,
      };
      dispatch(placeOrder(order));
      await saveOrderToSupabase(order, user?.id);
      if (!buyNowItem) dispatch(clearCart());
      dispatch(addToast({ message: 'Order placed successfully!', type: 'success' }));
      navigate('/orders');
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Nothing to check out</h1>
        <p className="mt-2 text-muted">Add items to your cart first.</p>
        <Button className="mt-5" onClick={() => navigate('/')}>Browse products</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Address */}
          <section className="rounded-card border border-base bg-elevated p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold"><MapPin className="h-5 w-5 text-stellar-500" /> Delivery Address</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {addresses.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAddressId(a.id)}
                  className={classNames(
                    'rounded-xl border-2 p-4 text-left transition',
                    addressId === a.id ? 'border-stellar-500 bg-stellar-500/5' : 'border-base hover:border-stellar-300',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{a.name}</span>
                    <span className="rounded-full bg-soft px-2 py-0.5 text-xs text-muted">{a.tag}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{a.line}</p>
                  <p className="text-sm text-muted">{a.city}</p>
                  <p className="mt-1 text-xs text-muted">{a.phone}</p>
                  {addressId === a.id && <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-success-500"><Check className="h-3.5 w-3.5" /> Deliver here</p>}
                </button>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-card border border-base bg-elevated p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold"><Lock className="h-5 w-5 text-stellar-500" /> Payment Method</h2>
            <p className="mt-1 text-xs text-muted">Demo mode — no real payment is processed. Do not enter real card details.</p>
            <div className="mt-4 space-y-2">
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={classNames(
                    'flex w-full items-center gap-3 rounded-xl border-2 p-3 transition',
                    method === m.id ? 'border-stellar-500 bg-stellar-500/5' : 'border-base hover:border-stellar-300',
                  )}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-soft"><m.icon className="h-5 w-5 text-stellar-500" /></div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{m.label}</p>
                    <p className="text-xs text-muted">{m.desc}</p>
                  </div>
                  <div className={classNames('ml-auto grid h-5 w-5 place-items-center rounded-full border-2', method === m.id ? 'border-stellar-500 bg-stellar-500 text-white' : 'border-base')}>
                    {method === m.id && <Check className="h-3 w-3" />}
                  </div>
                </button>
              ))}
            </div>
            {method === 'card' && (
              <div className="mt-4 rounded-xl border border-base bg-soft p-4">
                <p className="text-xs font-semibold text-muted">Card details (demo only — do not enter real numbers)</p>
                <div className="mt-3 space-y-2">
                  <input placeholder="Card number" className="h-10 w-full rounded-lg border border-base bg-elevated px-3 text-sm outline-none" />
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="MM/YY" className="h-10 rounded-lg border border-base bg-elevated px-3 text-sm outline-none" />
                    <input placeholder="CVV" className="h-10 rounded-lg border border-base bg-elevated px-3 text-sm outline-none" />
                  </div>
                </div>
              </div>
            )}
            {method === 'upi' && (
              <div className="mt-4 rounded-xl border border-base bg-soft p-4">
                <p className="text-xs font-semibold text-muted">Enter your UPI ID (demo only)</p>
                <input placeholder="yourname@upi" className="mt-2 h-10 w-full rounded-lg border border-base bg-elevated px-3 text-sm outline-none" />
              </div>
            )}
          </section>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-base bg-elevated p-5">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <ul className="mt-4 space-y-3">
              {items.map((i) => (
                <li key={i.productId} className="flex gap-3">
                  <img src={i.product.images[0]} alt={i.product.name} className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-semibold">{i.product.name}</p>
                    <p className="text-xs text-muted">Qty {i.quantity}</p>
                    <p className="text-sm font-bold">{formatINR(i.product.price * i.quantity)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-base pt-4 text-sm">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatINR(subtotal)}</span></div>
              {couponDiscount > 0 && <div className="flex justify-between text-success-500"><span>Discount</span><span>- {formatINR(couponDiscount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{shipping === 0 ? 'FREE' : formatINR(shipping)}</span></div>
              <div className="flex justify-between"><span className="text-muted">GST (18%)</span><span>{formatINR(gst)}</span></div>
              <div className="flex justify-between border-t border-base pt-2 text-lg font-bold"><span>Total</span><span>{formatINR(total)}</span></div>
            </div>
            <Button className="mt-5 w-full" size="lg" loading={placing} onClick={placeOrderHandler}>
              <Shield className="h-4 w-4" /> Place order
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted"><Lock className="h-3.5 w-3.5" /> Secure checkout · Demo payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
