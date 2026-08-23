import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, GitCompare, ShoppingCart, Zap, Check, Truck, RotateCcw, Shield,
  ChevronRight, Minus, Plus, Star, ThumbsUp, ChevronDown,
} from 'lucide-react';
import { productBySlug, products, formatINR } from '@/data/products';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { addToCart } from '@/redux/slices/cartSlice';
import { toggleWishlist } from '@/redux/slices/wishlistSlice';
import { toggleCompare } from '@/redux/slices/compareSlice';
import { addToast, setQuickView } from '@/redux/slices/uiSlice';
import { addRecentlyViewed } from '@/redux/slices/recentlyViewedSlice';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductSection } from '@/components/product/ProductSection';
import { classNames, discountPercent } from '@/utils/format';

export function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const product = slug ? productBySlug[slug] : undefined;
  const inWishlist = useAppSelector((s) => (product ? s.wishlist.includes(product.id) : false));
  const inCompare = useAppSelector((s) => (product ? s.compare.includes(product.id) : false));

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [openSpec, setOpenSpec] = useState<'specs' | 'reviews' | 'qa'>('specs');

  useEffect(() => {
    if (product) {
      dispatch(addRecentlyViewed(product.id));
      setActiveImage(0);
      setQuantity(1);
      setSelectedColor(0);
      window.scrollTo(0, 0);
    }
  }, [product, dispatch]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-lg font-semibold">Product not found</p>
        <Link to="/" className="mt-3 inline-block text-stellar-600 dark:text-stellar-300">Back to home</Link>
      </div>
    );
  }

  const off = discountPercent(product.mrp, product.price);
  const related = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 10);
  const fbt = (product.frequentlyBoughtTogether || []).map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;
  const fbtTotal = [product, ...fbt].reduce((s, p) => s + p.price, 0);

  const handleAdd = () => {
    dispatch(addToCart({ productId: product.id, quantity, color: product.colors[selectedColor].name }));
    dispatch(addToast({ message: `${product.name} added to cart`, type: 'success' }));
  };

  const handleBuyNow = () => {
    handleAdd();
    navigate('/checkout');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted">
        <Link to="/" className="hover:text-stellar-600">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-stellar-600">{product.category}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate font-medium text-base">{product.name}</span>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div
            className="relative aspect-square overflow-hidden rounded-card border border-base bg-soft"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img src={product.images[activeImage]} alt={product.name} className={`h-full w-full object-cover transition-transform duration-300 ${zoom ? 'scale-150' : 'scale-100'}`} />
            <div className="absolute left-4 top-4 flex flex-col gap-1.5">
              {off > 0 && <Badge variant="error">-{off}%</Badge>}
              {product.badge && <Badge variant="stellar">{product.badge}</Badge>}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={classNames(
                  'h-16 w-16 overflow-hidden rounded-lg border-2 transition',
                  activeImage === i ? 'border-stellar-500' : 'border-base hover:border-stellar-300',
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-medium text-stellar-600 dark:text-stellar-300">{product.brand}</p>
          <h1 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <Rating value={product.rating} count={product.reviewCount} size="md" />
            <span className="text-sm text-muted">|</span>
            <span className={classNames('text-sm font-medium', product.stock > 0 ? 'text-success-500' : 'text-error-500')}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatINR(product.price)}</span>
            {product.mrp > product.price && <span className="text-lg text-muted line-through">{formatINR(product.mrp)}</span>}
            {off > 0 && <Badge variant="error">{off}% off</Badge>}
          </div>
          <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>

          {/* Colors */}
          <div className="mt-5">
            <p className="text-sm font-semibold">Color: <span className="text-muted">{product.colors[selectedColor].name}</span></p>
            <div className="mt-2 flex gap-2">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(i)}
                  className={classNames(
                    'h-9 w-9 rounded-full border-2 transition',
                    selectedColor === i ? 'border-stellar-500 ring-2 ring-stellar-500/30' : 'border-base',
                  )}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-5">
            <p className="text-sm font-semibold">Quantity</p>
            <div className="mt-2 inline-flex items-center rounded-lg border border-base">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center hover:bg-soft"><Minus className="h-4 w-4" /></button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="grid h-10 w-10 place-items-center hover:bg-soft"><Plus className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={handleAdd} size="lg" className="flex-1 min-w-[160px]"><ShoppingCart className="h-5 w-5" /> Add to Cart</Button>
            <Button onClick={handleBuyNow} variant="secondary" size="lg" className="flex-1 min-w-[160px]"><Zap className="h-5 w-5" /> Buy Now</Button>
          </div>
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => { dispatch(toggleWishlist(product.id)); dispatch(addToast({ message: inWishlist ? 'Removed from wishlist' : 'Added to wishlist', type: inWishlist ? 'info' : 'success' })); }}
              className={classNames('flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-base text-sm font-semibold hover:bg-soft', inWishlist && 'text-error-500')}
            >
              <Heart className={classNames('h-4 w-4', inWishlist && 'fill-error-500')} /> Wishlist
            </button>
            <button
              onClick={() => { dispatch(toggleCompare(product.id)); dispatch(addToast({ message: inCompare ? 'Removed from compare' : 'Added to compare', type: inCompare ? 'info' : 'success' })); }}
              className={classNames('flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-base text-sm font-semibold hover:bg-soft', inCompare && 'text-stellar-500')}
            >
              {inCompare ? <Check className="h-4 w-4" /> : <GitCompare className="h-4 w-4" />} Compare
            </button>
          </div>

          {/* Offers */}
          <div className="mt-6 rounded-card border border-base bg-soft p-4">
            <p className="flex items-center gap-2 text-sm font-bold"><Zap className="h-4 w-4 text-warning-500" /> Available Offers</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-success-500" /> ₹500 off on first order with code STELLAR500</li>
              <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-success-500" /> Extra 10% off with credit cards</li>
              <li className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-success-500" /> No-cost EMI from ₹3,125/month</li>
            </ul>
          </div>

          {/* Delivery + policies */}
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, t: product.delivery, s: 'Free shipping' },
              { icon: RotateCcw, t: product.returnPolicy, s: 'Easy returns' },
              { icon: Shield, t: product.warranty, s: 'Official warranty' },
            ].map((x) => (
              <div key={x.t} className="rounded-xl border border-base bg-elevated p-3">
                <x.icon className="h-5 w-5 text-stellar-500" />
                <p className="mt-1.5 text-sm font-semibold">{x.t}</p>
                <p className="text-xs text-muted">{x.s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frequently bought together */}
      {fbt.length > 0 && (
        <section className="mt-10 rounded-card border border-base bg-elevated p-5">
          <h2 className="text-lg font-bold">Frequently Bought Together</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {[product, ...fbt].map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                {i > 0 && <span className="text-xl font-bold text-muted">+</span>}
                <Link to={`/product/${p.slug}`} className="flex items-center gap-2 rounded-xl border border-base p-2 hover:bg-soft">
                  <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div>
                    <p className="max-w-32 truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-sm font-bold">{formatINR(p.price)}</p>
                  </div>
                </Link>
              </div>
            ))}
            <div className="ml-auto text-right">
              <p className="text-sm text-muted">Total price</p>
              <p className="text-xl font-bold">{formatINR(fbtTotal)}</p>
              <Button size="sm" className="mt-2" onClick={() => { [product, ...fbt].forEach((p) => dispatch(addToCart({ productId: p.id }))); dispatch(addToast({ message: 'Bundle added to cart', type: 'success' })); }}>Add all to cart</Button>
            </div>
          </div>
        </section>
      )}

      {/* Highlights */}
      <section className="mt-8">
        <h2 className="text-lg font-bold">Highlights</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {product.highlights.map((h) => (
            <div key={h} className="flex items-center gap-2 rounded-lg border border-base bg-elevated p-3 text-sm">
              <Check className="h-4 w-4 shrink-0 text-success-500" /> {h}
            </div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section className="mt-8 rounded-card border border-base bg-elevated">
        <div className="flex border-b border-base">
          {(['specs', 'reviews', 'qa'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setOpenSpec(t)}
              className={classNames(
                'px-5 py-3 text-sm font-semibold transition',
                openSpec === t ? 'border-b-2 border-stellar-500 text-stellar-600 dark:text-stellar-300' : 'text-muted hover:text-base',
              )}
            >
              {t === 'specs' ? 'Specifications' : t === 'reviews' ? `Reviews (${product.reviewCount})` : 'Questions & Answers'}
            </button>
          ))}
        </div>
        <div className="p-5">
          {openSpec === 'specs' && (
            <div className="grid gap-2 sm:grid-cols-2">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between border-b border-base py-2 text-sm">
                  <span className="text-muted">{s.label}</span>
                  <span className="font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          )}
          {openSpec === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl bg-soft p-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{product.rating}</p>
                  <Rating value={product.rating} showCount={false} />
                  <p className="mt-1 text-xs text-muted">{product.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="w-4 text-xs">{star}</span>
                      <Star className="h-3 w-3 fill-warning-500 text-warning-500" />
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-base">
                        <div className="h-full bg-warning-500" style={{ width: `${star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : 3}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {product.reviews.map((r) => (
                <div key={r.id} className="border-b border-base pb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full gradient-stellar text-xs font-bold text-white">{r.author.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-semibold">{r.author}</p>
                      <Rating value={r.rating} showCount={false} />
                    </div>
                    <span className="ml-auto text-xs text-muted">{r.date}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold">{r.title}</p>
                  <p className="mt-1 text-sm text-muted">{r.body}</p>
                  <button className="mt-2 inline-flex items-center gap-1 text-xs text-muted hover:text-base"><ThumbsUp className="h-3.5 w-3.5" /> Helpful ({r.helpful})</button>
                </div>
              ))}
            </div>
          )}
          {openSpec === 'qa' && (
            <div className="space-y-3">
              {[
                { q: 'Is this product genuine and brand-new?', a: 'Yes, all products on Stellar Shop are 100% genuine and brand-new, sourced from authorized distributors.' },
                { q: 'Does it come with a warranty?', a: `Yes, this product includes ${product.warranty}.` },
                { q: 'What is the return policy?', a: `You can return this product within 10 days of delivery if it is in original condition.` },
              ].map((qa) => (
                <div key={qa.q} className="rounded-xl border border-base p-3">
                  <p className="flex items-center gap-2 text-sm font-semibold"><ChevronDown className="h-4 w-4" /> {qa.q}</p>
                  <p className="mt-2 pl-6 text-sm text-muted">{qa.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Description */}
      <section className="mt-8">
        <h2 className="text-lg font-bold">Description</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{product.description}</p>
      </section>

      {/* Related */}
      <ProductSection title="Related Products" products={related} viewAllTo={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`} />
    </div>
  );
}
