import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { productMap } from '@/data/products';
import { removeFromWishlist } from '@/redux/slices/wishlistSlice';
import { addToCart } from '@/redux/slices/cartSlice';
import { addToast } from '@/redux/slices/uiSlice';
import { formatINR, discountPercent } from '@/utils/format';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function Wishlist() {
  const ids = useAppSelector((s) => s.wishlist);
  const dispatch = useAppDispatch();
  const items = ids.map((id) => productMap[id]).filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Heart className="mx-auto h-16 w-16 text-muted" />
        <h1 className="mt-4 text-2xl font-bold">Your wishlist is empty</h1>
        <p className="mt-2 text-muted">Tap the heart on any product to save it here.</p>
        <Link to="/"><Button className="mt-5">Continue shopping <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-bold">My Wishlist ({items.length})</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => {
          if (!p) return null;
          const off = discountPercent(p.mrp, p.price);
          return (
            <div key={p.id} className="flex flex-col rounded-card border border-base bg-elevated p-3">
              <Link to={`/product/${p.slug}`} className="relative overflow-hidden rounded-xl bg-soft">
                <img src={p.images[0]} onError={fallbackProductImage} alt={p.name} className="aspect-square w-full object-cover" />
                {off > 0 && <div className="absolute left-2 top-2"><Badge variant="error">-{off}%</Badge></div>}
              </Link>
              <p className="mt-2 text-xs text-muted">{p.brand}</p>
              <Link to={`/product/${p.slug}`} className="line-clamp-2 text-sm font-semibold hover:text-stellar-600">{p.name}</Link>
              <Rating value={p.rating} count={p.reviewCount} />
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-bold">{formatINR(p.price)}</span>
                <span className="text-xs text-muted line-through">{formatINR(p.mrp)}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => { dispatch(addToCart({ productId: p.id })); dispatch(addToast({ message: 'Added to cart', type: 'success' })); }}>
                  <ShoppingCart className="h-4 w-4" /> Add
                </Button>
                <button onClick={() => dispatch(removeFromWishlist(p.id))} className="grid h-9 w-9 place-items-center rounded-lg border border-base text-muted hover:text-error-500 hover:border-error-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function fallbackProductImage(e: React.SyntheticEvent<HTMLImageElement>) { e.currentTarget.onerror = null; e.currentTarget.src = "/branding/product-placeholder.svg"; }
