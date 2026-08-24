import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Smartphone, Building2, Wallet, Banknote, Check, MapPin, Shield, Lock, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { productMap } from '@/data/products';
import { formatINR, generateOrderId, classNames } from '@/utils/format';
import { placeOrder } from '@/redux/slices/ordersSlice';
import { clearCart } from '@/redux/slices/cartSlice';
import { addToast } from '@/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import { fetchSavedAddresses, saveOrderToSupabase, type SavedAddress } from '@/services/supabase';

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm and more' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All supported banks' },
  { id: 'wallet', label: 'Wallets', icon: Wallet, desc: 'Supported Razorpay wallets' },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
] as const;

type RazorpayInstance = { open: () => void; on: (event: string, handler: (response: unknown) => void) => void };
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;
declare global { interface Window { Razorpay?: RazorpayConstructor } }

async function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return true;
  return await new Promise((resolve) => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(Boolean(window.Razorpay)), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function Checkout() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const buyNowId = params.get('buyNow');
  const cartItems = useAppSelector((s) => s.cart.items.filter((i) => !i.savedForLater));
  const couponDiscount = useAppSelector((s) => s.cart.couponDiscount);
  const couponCode = useAppSelector((s) => s.cart.coupon);

  const buyNowItem = buyNowId ? productMap[buyNowId] : null;
  const items = buyNowItem
    ? [{ productId: buyNowItem.id, quantity: 1, product: buyNowItem }]
    : cartItems.map((i) => ({ ...i, product: productMap[i.productId] })).filter((i) => i.product);

  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [addressId, setAddressId] = useState('');
  const [method, setMethod] = useState<(typeof paymentMethods)[number]['id']>('upi');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    void fetchSavedAddresses().then((r) => {
      if (!r.error) {
        const list = r.data.length ? r.data : (user?.address ? [{
          id: 'profile-address', user_id: user.id, label: 'Default', full_address: user.address,
          phone: user.mobile || null, is_default: true, created_at: new Date().toISOString(),
        }] : []);
        setAddresses(list);
        const selected = list.find((a) => a.is_default) || list[0];
        if (selected) setAddressId(selected.id);
      }
    });
  }, []);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const gst = Math.round((subtotal - couponDiscount + shipping) * 0.18);
  const total = Math.max(0, subtotal - couponDiscount + shipping + gst);

  const saveSuccessfulOrder = async (paymentMethod: string, paymentId?: string, paymentOrderId?: string) => {
    const address = addresses.find((a) => a.id === addressId);
    if (!address) throw new Error('Please add and select a delivery address in Profile → Saved Addresses before ordering.');
    const order = {
      id: generateOrderId(),
      items: items.map((i) => ({ productId: i.product.id, name: i.product.name, image: i.product.images[0], price: i.product.price, quantity: i.quantity })),
      total,
      status: 'Processing' as const,
      placedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 4 * 86400000).toISOString(),
      address: `${address.label}: ${address.full_address}${address.phone ? `, ${address.phone}` : ''}`,
      paymentMethod,
      ...(paymentId ? { razorpayPaymentId: paymentId } : {}),
      ...(paymentOrderId ? { razorpayOrderId: paymentOrderId } : {}),
    };
    dispatch(placeOrder(order));
    await saveOrderToSupabase(order, user?.id);
    if (!buyNowItem) dispatch(clearCart());
    dispatch(addToast({ message: 'Order placed successfully!', type: 'success' }));
    navigate('/orders');
  };

  const placeOrderHandler = async () => {
    setError('');
    setPlacing(true);
    try {
      if (method === 'cod') {
        await saveSuccessfulOrder('Cash on Delivery');
        return;
      }

      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded || !window.Razorpay) throw new Error('Razorpay Checkout could not be loaded. Check your internet connection and try again.');

      const receipt = generateOrderId();
      const createResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receipt,
          couponCode,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          customer: { id: user?.id, email: user?.email, mobile: user?.mobile },
        }),
      });
      const created = await createResponse.json();
      if (!createResponse.ok) throw new Error(created?.error || 'Unable to start payment.');

      const address = addresses.find((a) => a.id === addressId);
    if (!address) throw new Error('Please add and select a delivery address in Profile → Saved Addresses before ordering.');
      const razorpay = new window.Razorpay({
        key: created.keyId,
        amount: created.amount,
        currency: created.currency,
        name: 'StellarShop',
        description: 'StellarShop order payment',
        order_id: created.orderId,
        prefill: {
          name: user?.name || address.label,
          email: user?.email || '',
          contact: user?.mobile || address.phone || '',
          method,
        },
        notes: { address: address.full_address },
        theme: { color: '#315efb' },
        config: {
          display: {
            blocks: {
              all_methods: {
                name: 'All payment options',
                instruments: [{ method: 'upi' }, { method: 'card' }, { method: 'netbanking' }, { method: 'wallet' }],
              },
            },
            sequence: ['block.all_methods'],
            preferences: { show_default_blocks: true },
          },
        },
        handler: async (response: unknown) => {
          try {
            const r = response as { razorpay_payment_id?: string; razorpay_order_id?: string; razorpay_signature?: string };
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: r.razorpay_order_id,
                razorpay_payment_id: r.razorpay_payment_id,
                razorpay_signature: r.razorpay_signature,
                receipt,
                expected_amount: created.amount,
              }),
            });
            const verified = await verifyResponse.json();
            if (!verifyResponse.ok || !verified.verified) throw new Error(verified?.error || 'Payment verification failed.');
            await saveSuccessfulOrder(`Razorpay ${String(method).toUpperCase()}`, verified.paymentId, verified.orderId);
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Payment verification failed. Your order was not placed.');
            setPlacing(false);
          }
        },
        modal: {
          confirm_close: true,
          ondismiss: () => setPlacing(false),
        },
      });
      razorpay.on('payment.failed', (response: unknown) => {
        const r = response as { error?: { description?: string } };
        setError(r.error?.description || 'Payment failed. Your order was not placed.');
        setPlacing(false);
      });
      razorpay.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to start payment.');
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">Nothing to check out</h1><p className="mt-2 text-muted">Add items to your cart first.</p><Button className="mt-5" onClick={() => navigate('/')}>Browse products</Button></div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-card border border-base bg-elevated p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold"><MapPin className="h-5 w-5 text-stellar-500" /> Delivery Address</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {addresses.map((a) => <button key={a.id} onClick={() => setAddressId(a.id)} className={classNames('rounded-xl border-2 p-4 text-left transition', addressId === a.id ? 'border-stellar-500 bg-stellar-500/5' : 'border-base hover:border-stellar-300')}>
                <div className="flex items-center justify-between"><span className="text-sm font-bold">{a.label}</span>{a.is_default && <span className="rounded-full bg-success-500/10 px-2 py-0.5 text-xs text-success-500">Default</span>}</div>
                <p className="mt-1 text-sm text-muted">{a.full_address}</p><p className="mt-1 text-xs text-muted">{a.phone || ''}</p>
                {addressId === a.id && <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-success-500"><Check className="h-3.5 w-3.5" /> Deliver here</p>}
              </button>)}
              {addresses.length===0 && <div className="rounded-xl border border-dashed border-base p-5 text-sm text-muted">No saved address found. Go to <button type="button" onClick={() => navigate('/profile/settings')} className="font-semibold text-stellar-500">Profile → Settings</button> and add your delivery address.</div>}
            </div>
          </section>

          <section className="rounded-card border border-base bg-elevated p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold"><Lock className="h-5 w-5 text-stellar-500" /> Payment Method</h2>
            <p className="mt-1 text-xs text-muted">Secure Razorpay checkout. Your card/UPI details are entered only in Razorpay.</p>
            <div className="mt-4 space-y-2">
              {paymentMethods.map((m) => <button key={m.id} onClick={() => setMethod(m.id)} className={classNames('flex w-full items-center gap-3 rounded-xl border-2 p-3 transition', method === m.id ? 'border-stellar-500 bg-stellar-500/5' : 'border-base hover:border-stellar-300')}>
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-soft"><m.icon className="h-5 w-5 text-stellar-500" /></div>
                <div className="text-left"><p className="text-sm font-semibold">{m.label}</p><p className="text-xs text-muted">{m.desc}</p></div>
                <div className={classNames('ml-auto grid h-5 w-5 place-items-center rounded-full border-2', method === m.id ? 'border-stellar-500 bg-stellar-500 text-white' : 'border-base')}>{method === m.id && <Check className="h-3 w-3" />}</div>
              </button>)}
            </div>
            {error && <div className="mt-4 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span></div>}
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-card border border-base bg-elevated p-5">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <ul className="mt-4 space-y-3">{items.map((i) => <li key={i.productId} className="flex gap-3"><img src={i.product.images[0]} onError={fallbackProductImage} alt={i.product.name} className="h-14 w-14 rounded-lg object-cover" /><div className="flex-1"><p className="line-clamp-1 text-sm font-semibold">{i.product.name}</p><p className="text-xs text-muted">Qty {i.quantity}</p><p className="text-sm font-bold">{formatINR(i.product.price * i.quantity)}</p></div></li>)}</ul>
            <div className="mt-4 space-y-2 border-t border-base pt-4 text-sm"><div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatINR(subtotal)}</span></div>{couponDiscount > 0 && <div className="flex justify-between text-success-500"><span>Discount</span><span>- {formatINR(couponDiscount)}</span></div>}<div className="flex justify-between"><span className="text-muted">Shipping</span><span>{shipping === 0 ? 'FREE' : formatINR(shipping)}</span></div><div className="flex justify-between"><span className="text-muted">GST (18%)</span><span>{formatINR(gst)}</span></div><div className="flex justify-between border-t border-base pt-2 text-lg font-bold"><span>Total</span><span>{formatINR(total)}</span></div></div>
            <Button className="mt-5 w-full" size="lg" loading={placing} onClick={placeOrderHandler}><Shield className="h-4 w-4" /> {method === 'cod' ? 'Place COD order' : `Pay ${formatINR(total)}`}</Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted"><Lock className="h-3.5 w-3.5" /> Razorpay secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}


function fallbackProductImage(e: React.SyntheticEvent<HTMLImageElement>) { e.currentTarget.onerror = null; e.currentTarget.src = "/branding/product-placeholder.svg"; }
