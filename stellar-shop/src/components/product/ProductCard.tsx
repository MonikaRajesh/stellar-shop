import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, GitCompare, Eye, ShoppingCart, Zap, Check } from 'lucide-react';
import type { Product } from '@/types';
import { formatINR, discountPercent, classNames } from '@/utils/format';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { addToCart } from '@/redux/slices/cartSlice';
import { toggleWishlist } from '@/redux/slices/wishlistSlice';
import { toggleCompare } from '@/redux/slices/compareSlice';
import { addToast, setQuickView } from '@/redux/slices/uiSlice';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const dispatch = useAppDispatch();
  const inWishlist = useAppSelector((s) => s.wishlist.includes(product.id));
  const inCompare = useAppSelector((s) => s.compare.includes(product.id));
  const off = discountPercent(product.mrp, product.price);
  const lowStock = product.stock > 0 && product.stock <= 10;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
    dispatch(addToast({ message: `${product.name} added to cart`, type: 'success' }));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product.id));
    dispatch(addToast({
      message: inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      type: inWishlist ? 'info' : 'success',
    }));
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleCompare(product.id));
    dispatch(addToast({
      message: inCompare ? 'Removed from compare' : 'Added to compare',
      type: inCompare ? 'info' : 'success',
    }));
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setQuickView(product.id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="group relative flex flex-col overflow-hidden rounded-card border border-base bg-elevated transition-all duration-300 hover:shadow-float hover:-translate-y-1 hover:border-stellar-300"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-soft">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {off > 0 && <Badge variant="error">-{off}%</Badge>}
            {product.badge && <Badge variant="stellar">{product.badge}</Badge>}
          </div>
          {/* Hover actions */}
          <div className="absolute right-3 top-3 flex flex-col gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              className={classNames(
                'glass-strong grid h-9 w-9 place-items-center rounded-full border border-base transition hover:scale-110',
                inWishlist && 'text-error-500',
              )}
            >
              <Heart className={classNames('h-4 w-4', inWishlist && 'fill-error-500')} />
            </button>
            <button
              onClick={handleCompare}
              aria-label="Compare"
              className={classNames(
                'glass-strong grid h-9 w-9 place-items-center rounded-full border border-base transition hover:scale-110',
                inCompare && 'text-stellar-500',
              )}
            >
              {inCompare ? <Check className="h-4 w-4" /> : <GitCompare className="h-4 w-4" />}
            </button>
            <button
              onClick={handleQuickView}
              aria-label="Quick view"
              className="glass-strong grid h-9 w-9 place-items-center rounded-full border border-base transition hover:scale-110"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
          {product.stock === 0 && (
            <div className="absolute inset-0 grid place-items-center bg-ink-900/40">
              <span className="rounded-lg bg-ink-900 px-4 py-1.5 text-sm font-semibold text-white">Out of stock</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-3.5">
          <p className="text-xs font-medium text-muted">{product.brand}</p>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug group-hover:text-stellar-600 dark:group-hover:text-stellar-300">
            {product.name}
          </h3>
          <div className="mt-1.5">
            <Rating value={product.rating} count={product.reviewCount} />
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold">{formatINR(product.price)}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-muted line-through">{formatINR(product.mrp)}</span>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-1.5">
            {product.stock > 0 ? (
              lowStock ? (
                <span className="text-xs font-medium text-warning-500">Only {product.stock} left</span>
              ) : (
                <span className="text-xs font-medium text-success-500">In stock</span>
              )
            ) : (
              <span className="text-xs font-medium text-error-500">Out of stock</span>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-base bg-soft text-sm font-semibold transition hover:bg-stellar-50 dark:hover:bg-stellar-950/40 hover:border-stellar-300 disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />
              Add
            </button>
            <Link
              to={`/checkout?buyNow=${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg gradient-stellar text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              <Zap className="h-4 w-4" />
              Buy Now
            </Link>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
