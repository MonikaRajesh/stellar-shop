import { AnimatePresence, motion } from 'framer-motion';
import { X, Heart, GitCompare, ShoppingCart, Zap, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { productMap } from '@/data/products';
import { formatINR, discountPercent, classNames } from '@/utils/format';
import { addToCart } from '@/redux/slices/cartSlice';
import { toggleWishlist } from '@/redux/slices/wishlistSlice';
import { toggleCompare } from '@/redux/slices/compareSlice';
import { setQuickView, addToast } from '@/redux/slices/uiSlice';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function QuickViewModal() {
  const productId = useAppSelector((s) => s.ui.quickViewProductId);
  const dispatch = useAppDispatch();
  const product = productId ? productMap[productId] : null;
  const inWishlist = useAppSelector((s) => (product ? s.wishlist.includes(product.id) : false));
  const inCompare = useAppSelector((s) => (product ? s.compare.includes(product.id) : false));

  const close = () => dispatch(setQuickView(null));

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[90] grid place-items-center bg-ink-950/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl overflow-hidden rounded-card border border-base bg-elevated shadow-float max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={close}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full glass-strong border border-base hover:scale-110 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative aspect-square bg-soft">
                <img src={product.images[0]} onError={fallbackProductImage} alt={product.name} className="h-full w-full object-cover" />
                {product.badge && (
                  <div className="absolute left-4 top-4">
                    <Badge variant="stellar">{product.badge}</Badge>
                  </div>
                )}
              </div>

              <div className="flex flex-col p-6">
                <p className="text-xs font-medium text-muted">{product.brand}</p>
                <h2 className="mt-1 text-xl font-bold leading-snug">{product.name}</h2>
                <div className="mt-2">
                  <Rating value={product.rating} count={product.reviewCount} size="md" />
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{formatINR(product.price)}</span>
                  {product.mrp > product.price && (
                    <span className="text-sm text-muted line-through">{formatINR(product.mrp)}</span>
                  )}
                  {discountPercent(product.mrp, product.price) > 0 && (
                    <Badge variant="error">-{discountPercent(product.mrp, product.price)}%</Badge>
                  )}
                </div>

                <ul className="mt-4 space-y-1.5">
                  {product.highlights.slice(0, 4).map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-500" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex gap-2">
                  <Button
                    onClick={() => {
                      dispatch(addToCart({ productId: product.id }));
                      dispatch(addToast({ message: 'Added to cart', type: 'success' }));
                      close();
                    }}
                    className="flex-1"
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </Button>
                  <Link
                    to={`/checkout?buyNow=${product.id}`}
                    onClick={close}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl gradient-stellar text-sm font-semibold text-white transition hover:-translate-y-0.5"
                  >
                    <Zap className="h-4 w-4" /> Buy Now
                  </Link>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      dispatch(toggleWishlist(product.id));
                      dispatch(addToast({ message: inWishlist ? 'Removed from wishlist' : 'Added to wishlist', type: inWishlist ? 'info' : 'success' }));
                    }}
                    className={classNames(
                      'flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-base text-sm font-medium transition hover:bg-soft',
                      inWishlist && 'text-error-500',
                    )}
                  >
                    <Heart className={classNames('h-4 w-4', inWishlist && 'fill-error-500')} /> Wishlist
                  </button>
                  <button
                    onClick={() => {
                      dispatch(toggleCompare(product.id));
                      dispatch(addToast({ message: inCompare ? 'Removed from compare' : 'Added to compare', type: inCompare ? 'info' : 'success' }));
                    }}
                    className={classNames(
                      'flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-base text-sm font-medium transition hover:bg-soft',
                      inCompare && 'text-stellar-500',
                    )}
                  >
                    {inCompare ? <Check className="h-4 w-4" /> : <GitCompare className="h-4 w-4" />} Compare
                  </button>
                </div>

                <Link
                  to={`/product/${product.slug}`}
                  onClick={close}
                  className="mt-4 text-center text-sm font-semibold text-stellar-600 dark:text-stellar-300 hover:underline"
                >
                  View full details
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function fallbackProductImage(e: React.SyntheticEvent<HTMLImageElement>) { e.currentTarget.onerror = null; e.currentTarget.src = "/branding/product-placeholder.svg"; }
