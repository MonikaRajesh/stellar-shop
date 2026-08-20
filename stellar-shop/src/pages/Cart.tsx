import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, Gift, Tag, Truck, ShoppingBag, ArrowRight, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { productMap } from '@/data/products';
import { formatINR } from '@/utils/format';
import {
  updateQuantity, removeFromCart, saveForLater, moveToCart, toggleGiftWrap,
  applyCoupon, removeCoupon,
} from '@/redux/slices/cartSlice';
import { addToast } from '@/redux/slices/uiSlice';
import { coupons } from '@/data/offers';
import { Button } from '@/components/ui/Button';
import { getWhatsAppOrderUrl } from '@/utils/whatsapp';
import { Badge } from '@/components/ui/Badge';

const SHIPPING = 49;
const GST_RATE = 0.18;

export function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector((s) => s.cart.items);
  const coupon = useAppSelector((s) => s.cart.coupon);
  const couponDiscount = useAppSelector((s) => s.cart.couponDiscount);
  const [couponCode, setCouponCode] = useState('');

  const active = items.filter((i) => !i.savedForLater);
  const saved = items.filter((i) => i.savedForLater);

  const activeItems = active.map((i) => ({ ...i, product: productMap[i.productId] })).filter((i) => i.product);
  const savedItems = saved.map((i) => ({ ...i, product: productMap[i.productId] })).filter((i) => i.product);

  const subtotal = activeItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const giftWrapFee = activeItems.reduce((s, i) => s + (i.giftWrap ? 49 : 0), 0);
  const discount = couponDiscount;
  const shipping = subtotal > 499 || subtotal === 0 ? 0 : SHIPPING;
  const taxable = Math.max(0, subtotal - discount + shipping + giftWrapFee);
  const gst = Math.round(taxable * GST_RATE);
  const total = taxable + gst;

  const applyCode = () => {
    const c = coupons.find((x) => x.code === couponCode.trim().toUpperCase());
    if (!c) { dispatch(addToast({ message: 'Invalid coupon code', type: 'error' })); return; }
    const disc = c.code === 'STELLAR500' ? Math.min(500, subtotal) : Math.round(subtotal * 0.1);
    dispatch(applyCoupon({ code: c.code, discount: disc }));
    dispatch(addToast({ message: `Coupon ${c.code} applied`, type: 'success' }));
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted">Browse our deals and find something you love.</p>
        <Link to="/offers"><Button className="mt-5">Explore offers <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-bold">Shopping Cart</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {activeItems.map((i) => (
            <div key={i.productId} className="flex gap-4 rounded-card border border-base bg-elevated p-4">
              <Link to={`/product/${i.product.slug}`} className="shrink-0">
                <img src={i.product.images[0]} alt={i.product.name} className="h-24 w-24 rounded-xl object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted">{i.product.brand}</p>
                    <Link to={`/product/${i.product.slug}`} className="text-sm font-semibold hover:text-stellar-600">{i.product.name}</Link>
                    {i.color && <p className="mt-0.5 text-xs text-muted">Color: {i.color}</p>}
                  </div>
                  <button onClick={() => dispatch(removeFromCart(i.productId))} className="text-muted hover:text-error-500"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-bold">{formatINR(i.product.price)}</span>
                  <span className="text-sm text-muted line-through">{formatINR(i.product.mrp)}</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="inline-flex items-center rounded-lg border border-base">
                    <button onClick={() => dispatch(updateQuantity({ productId: i.productId, quantity: i.quantity - 1 }))} className="grid h-8 w-8 place-items-center hover:bg-soft"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-10 text-center text-sm font-semibold">{i.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ productId: i.productId, quantity: i.quantity + 1 }))} className="grid h-8 w-8 place-items-center hover:bg-soft"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => dispatch(toggleGiftWrap(i.productId))}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${i.giftWrap ? 'border-stellar-500 bg-stellar-500/10 text-stellar-600' : 'border-base hover:bg-soft'}`}
                    >
                      <Gift className="h-3.5 w-3.5" /> Gift wrap {i.giftWrap && <X className="h-3 w-3" />}
                    </button>
                    <button onClick={() => dispatch(saveForLater(i.productId))} className="text-xs font-medium text-stellar-600 dark:text-stellar-300 hover:underline">Save for later</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {savedItems.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold">Saved for later ({savedItems.length})</h2>
              <div className="mt-3 space-y-3">
                {savedItems.map((i) => (
                  <div key={i.productId} className="flex items-center gap-4 rounded-card border border-base bg-soft p-3">
                    <img src={i.product.images[0]} alt={i.product.name} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <Link to={`/product/${i.product.slug}`} className="text-sm font-semibold">{i.product.name}</Link>
                      <p className="font-bold">{formatINR(i.product.price)}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => dispatch(moveToCart(i.productId))}>Move to cart</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
          <div className="rounded-card border border-base bg-elevated p-5">
            <h2 className="text-lg font-bold">Price Details</h2>
            <div className="mt-4 space-y-2.5 text-sm">
              <Row label={`Price (${activeItems.length} items)`} value={formatINR(subtotal)} />
              {discount > 0 && <Row label="Discount" value={`- ${formatINR(discount)}`} green />}
              <Row label="Shipping" value={shipping === 0 ? 'FREE' : formatINR(shipping)} green={shipping === 0} />
              {giftWrapFee > 0 && <Row label="Gift wrap" value={formatINR(giftWrapFee)} />}
              <Row label="GST (18%)" value={formatINR(gst)} />
              <div className="border-t border-base pt-2.5">
                <Row label="Total" value={formatINR(total)} bold />
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-5">
              {coupon ? (
                <div className="flex items-center justify-between rounded-lg bg-success-500/10 px-3 py-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-success-500"><Tag className="h-4 w-4" /> {coupon} applied</span>
                  <button onClick={() => dispatch(removeCoupon())} className="text-xs text-error-500 hover:underline">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-base px-3">
                    <Tag className="h-4 w-4 text-muted" />
                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code" className="w-full bg-transparent text-sm outline-none" />
                  </div>
                  <Button size="sm" variant="outline" onClick={applyCode}>Apply</Button>
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {coupons.slice(0, 3).map((c) => (
                  <button key={c.code} onClick={() => { setCouponCode(c.code); }} className="rounded-md border border-dashed border-base px-2 py-1 text-xs text-muted hover:text-stellar-600">{c.code}</button>
                ))}
              </div>
            </div>

            <Button className="mt-5 w-full" size="lg" onClick={() => navigate('/checkout')}>Proceed to checkout <ArrowRight className="h-4 w-4" /></Button>
            <a
              href={getWhatsAppOrderUrl(activeItems.map((i) => ({ product: i.product, quantity: i.quantity })), total)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-green-500/40 bg-green-500/10 text-sm font-semibold text-green-600 transition hover:bg-green-500/20 dark:text-green-400"
            >
              Order through WhatsApp
            </a>
          </div>

          <div className="rounded-card border border-base bg-elevated p-4">
            <p className="flex items-center gap-2 text-sm font-semibold"><Truck className="h-4 w-4 text-stellar-500" /> Estimated delivery</p>
            <p className="mt-1 text-sm text-muted">Delivery by tomorrow for most pin codes. Free shipping over ₹499.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, green }: { label: string; value: string; bold?: boolean; green?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? 'font-bold' : 'text-muted'}>{label}</span>
      <span className={`${bold ? 'text-lg font-bold' : 'font-medium'} ${green ? 'text-success-500' : ''}`}>{value}</span>
    </div>
  );
}
